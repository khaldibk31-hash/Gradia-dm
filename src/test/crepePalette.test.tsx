import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminDashboardModal } from "@/components/AdminModals";
import { StoreEditProvider } from "@/components/EditableText";
import { ProductCatalog } from "@/components/ProductCatalog";
import {
  CREPE_STOLE_COLORS,
  DEFAULT_DYNAMIC_SETTINGS,
  DEFAULT_PRODUCTS,
  DEFAULT_STOLE_COLORS,
  ROYAL_SIX_STOLE_COLORS,
} from "@/data/defaultStore";

function renderCatalog(products = DEFAULT_PRODUCTS, extraProps: Record<string, unknown> = {}) {
  const isAdminMode = Boolean(extraProps["isAdminMode"]);
  const Catalog = ProductCatalog as unknown as React.ComponentType<Record<string, unknown>>;
  return render(
    <StoreEditProvider
      isAdminMode={isAdminMode}
      customTexts={{}}
      hiddenSections={{}}
      onUpdateText={() => {}}
      onClearText={() => {}}
      onRestoreText={() => {}}
      onToggleSectionHidden={() => {}}
    >
      <Catalog
        products={products}
        isAdminMode={isAdminMode}
        requestedSection={{ category: "shawl", nonce: 1 }}
        stoleColors={DEFAULT_STOLE_COLORS}
        crepeStoleColors={CREPE_STOLE_COLORS}
        crystalRoyalColors={ROYAL_SIX_STOLE_COLORS}
        onAddToCart={() => {}}
        onNotify={() => {}}
        onOpenAddProduct={() => {}}
        onEditProduct={() => {}}
        onDeleteProduct={() => {}}
        onReplaceProductImage={async () => {}}
        {...extraProps}
      />
    </StoreEditProvider>,
  );
}

describe("Curated 18-color Crepe Shawl Palette (Miss Shawl Only)", () => {
  it("defines the exact 18 luxury colors in exact RTL order (3 rows × 6 swatches)", () => {
    expect(CREPE_STOLE_COLORS).toHaveLength(18);
    expect(CREPE_STOLE_COLORS.map((c) => [c.name, c.hex])).toEqual([
      ["بورغندي", "#5E1734"],
      ["عنابي داكن", "#8B1538"],
      ["أحمر ملكي", "#A61C2B"],
      ["قرمزي", "#B2182B"],
      ["بنفسجي ملكي", "#3B1254"],
      ["أسود", "#141414"],
      ["أزرق ملكي", "#1D39A8"],
      ["أزرق سماوي", "#74B9E7"],
      ["أخضر زمردي", "#115737"],
      ["أخضر زيتوني", "#5D6B2A"],
      ["أخضر فستقي", "#9AB36B"],
      ["أزرق بترولي", "#1E4D6B"],
      ["بني شوكولاتة", "#361D14"],
      ["بني دافئ", "#5C3626"],
      ["وردي ترابي", "#B56B76"],
      ["وردي ناعم", "#DF7E9B"],
      ["بيج كريمي", "#EFE6D5"],
      ["أبيض ناصع", "#F9F9F7"],
    ]);
  });

  it("displays the 18-color RTL 6-column grid ONLY when كريب is selected on شال ميس and switches back on دان", async () => {
    localStorage.clear();
    renderCatalog();

    const heading = await screen.findByRole("heading", {
      name: "شال ميس مع قبعة وتطريز مجاني",
    });
    fireEvent.click(heading);

    const grid = await screen.findByText((_content, el) => {
      return el?.getAttribute("data-palette") === "crepe-18";
    });
    expect(grid).toHaveAttribute("dir", "rtl");
    expect(grid.className).toContain("grid-cols-6");
    expect(grid.className).toContain("gap-2.5");

    const swatches = within(grid).getAllByRole("button");
    expect(swatches).toHaveLength(18);
    expect(swatches.map((btn) => btn.getAttribute("aria-label"))).toEqual(
      CREPE_STOLE_COLORS.map((c) => c.name),
    );

    expect(screen.getByText(/^اللون:/)).toBeInTheDocument();
    expect(swatches[0]?.className).toContain("border-[#C6A355]");
    expect(swatches[0]?.className).toContain("ring-[#5E1734]");

    fireEvent.click(within(grid).getByRole("button", { name: "أبيض ناصع" }));
    const whiteBtn = within(grid).getByRole("button", { name: "أبيض ناصع" });
    expect(whiteBtn).toHaveAttribute("aria-pressed", "true");
    const pickerSection = grid.closest("div")!.parentElement!;
    expect(within(pickerSection).getByText("أبيض ناصع")).toBeInTheDocument();

    // Switch fabric to دان (Satin) -> restores untouched DEFAULT_STOLE_COLORS
    const danBtn = screen.getByRole("button", { name: /^دان/ });
    fireEvent.click(danBtn);

    await waitFor(() => {
      expect(document.querySelector('[data-palette="crepe-18"]')).toBeNull();
    });
    expect(screen.getByText(/اختر اللون:/)).toBeInTheDocument();

    // Switch back to كريب -> 18-color grid returns
    const crepeBtn = screen.getByRole("button", { name: /^كريب/ });
    fireEvent.click(crepeBtn);
    expect(
      await screen.findByText((_content, el) => {
        return el?.getAttribute("data-palette") === "crepe-18";
      }),
    ).toBeInTheDocument();
  });

  it.each([
    { label: "شال بلا ظهر", productName: "شال عادي بدون ظهر مع القبعة" },
    { label: "شال بالظهر", productName: "شال بالظهر الفاخر مع القبعة" },
  ])(
    "leaves $label untouched with standard stole colors even when كريب is selected",
    async ({ productName }) => {
      localStorage.clear();
      renderCatalog();

      const heading = await screen.findByRole("heading", { name: productName });
      fireEvent.click(heading);

      expect(document.querySelector('[data-palette="crepe-18"]')).toBeNull();
      expect(screen.getByText(/اختر اللون:/)).toBeInTheDocument();
      expect(screen.queryByTitle("أخضر فستقي")).toBeNull();
      expect(screen.getByTitle("أزرق ملكي")).toBeInTheDocument();
    },
  );

  it("preserves existing saved Supabase swatch photos and keeps inline Admin upload/delete controls working on every swatch", async () => {
    localStorage.clear();
    const onSetProductColorImage = vi.fn();
    const missWithSavedPhotos = DEFAULT_PRODUCTS.map((p) =>
      p.id === "shawl-miss-1"
        ? {
            ...p,
            colorImages: {
              "أخضر زمردي": "/images/saved-miss-emerald.webp",
            },
          }
        : p,
    );
    renderCatalog(missWithSavedPhotos, {
      isAdminMode: true,
      onSetProductColorImage,
    });

    fireEvent.click(
      await screen.findByRole("heading", {
        name: "شال ميس مع قبعة وتطريز مجاني",
      }),
    );

    // Switch to photo view and verify saved swatch photo is preserved
    fireEvent.click(screen.getByRole("button", { name: "صورة الموديل" }));
    const grid = document.querySelector('[data-palette="crepe-18"]') as HTMLElement;
    expect(grid).not.toBeNull();
    const emeraldBtn = within(grid).getByRole("button", { name: "أخضر زمردي" });
    fireEvent.click(emeraldBtn);

    const previewImg = screen.getByAltText("شال ميس مع قبعة وتطريز مجاني");
    expect(previewImg.getAttribute("src")).toContain("saved-miss-emerald.webp");

    // Inline Admin Mode controls allow changing or deleting the swatch photo
    expect(screen.getByRole("button", { name: /تغيير صورة اللون/ })).toBeInTheDocument();
    const deleteSwatchPhotoBtn = screen.getByRole("button", { name: "حذف" });
    fireEvent.click(deleteSwatchPhotoBtn);
    expect(onSetProductColorImage).toHaveBeenCalledWith("shawl-miss-1", "أخضر زمردي", null);

    // Selecting a swatch without a saved photo offers inline upload control
    fireEvent.click(within(grid).getByRole("button", { name: "أبيض ناصع" }));
    expect(screen.getByRole("button", { name: /صورة لهذا اللون/ })).toBeInTheDocument();
  });

  it("keeps شال ملكي مرصع بالكريستال strictly limited to its 6 luxury colors", async () => {
    localStorage.clear();
    renderCatalog();

    fireEvent.click(await screen.findByRole("heading", { name: "شال ملكي مرصع بالكريستال" }));
    expect(document.querySelector('[data-palette="crepe-18"]')).toBeNull();
    expect(screen.getByText(/اختر اللون:/)).toBeInTheDocument();
    expect(screen.queryByTitle("أخضر فستقي")).toBeNull();
  });

  it("manages ألوان شال الكريب inside AdminDashboardModal and persists customTexts", async () => {
    const onUpdateDynamicSettings = vi.fn().mockResolvedValue(undefined);
    const Modal = AdminDashboardModal as unknown as React.ComponentType<Record<string, unknown>>;

    render(
      <Modal
        isOpen={true}
        storeName="DG by Douaa"
        dynamicSettings={{
          ...DEFAULT_DYNAMIC_SETTINGS,
          crepeStoleColors: CREPE_STOLE_COLORS,
        }}
        onUpdateDynamicSettings={onUpdateDynamicSettings}
        onClose={() => {}}
        onNotify={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /دوائر الألوان/ }));
    const crepeCardHeading = await screen.findByText(/ألوان شال الكريب/);
    const crepeCard = crepeCardHeading.closest("div.space-y-3\\.5")!;

    const deleteEmeraldBtn = within(crepeCard as HTMLElement).getByLabelText("حذف أخضر زمردي");
    fireEvent.click(deleteEmeraldBtn);

    await waitFor(() => {
      expect(onUpdateDynamicSettings).toHaveBeenCalledTimes(1);
    });
    const saved = onUpdateDynamicSettings.mock.calls[0]?.[0] as {
      crepeStoleColors: Array<{ name: string }>;
      customTexts?: Record<string, string>;
    };
    expect(saved.crepeStoleColors).toHaveLength(17);
    expect(saved.customTexts?.["catalog.crepeStoleColors"]).toBeDefined();
    expect(JSON.parse(saved.customTexts!["catalog.crepeStoleColors"]!)).toHaveLength(17);
  });
});
