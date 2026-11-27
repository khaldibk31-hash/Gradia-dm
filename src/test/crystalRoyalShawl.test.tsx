import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StoreEditProvider } from "@/components/EditableText";
import { ProductCatalog } from "@/components/ProductCatalog";
import {
  DEFAULT_PRODUCTS,
  ROYAL_SIX_STOLE_COLORS,
  SHAWL_CRYSTAL_ROYAL_IMAGE_PATH,
} from "@/data/defaultStore";

describe("Royal Crystal-Studded Shawl (شال ملكي مرصع بالكريستال)", () => {
  it("is configured in DEFAULT_PRODUCTS directly below شال بالظهر with the exact photo and 6 luxury colors", () => {
    const backIdx = DEFAULT_PRODUCTS.findIndex((p) => p.id === "shawl-back-1");
    const crystalIdx = DEFAULT_PRODUCTS.findIndex((p) => p.id === "shawl-crystal-royal-1");
    const americanIdx = DEFAULT_PRODUCTS.findIndex((p) => p.id === "shawl-american-1");

    expect(backIdx).toBeGreaterThanOrEqual(0);
    expect(crystalIdx).toBe(backIdx + 1);
    expect(americanIdx).toBe(crystalIdx + 1);

    const crystal = DEFAULT_PRODUCTS[crystalIdx]!;
    expect(crystal).toBeDefined();
    expect(crystal.name).toBe("شال ملكي مرصع بالكريستال");
    expect(crystal.branch).toBe("شال ملكي مرصع بالكريستال");
    expect(crystal.imageUrl).toBe(SHAWL_CRYSTAL_ROYAL_IMAGE_PATH);
    expect(crystal.basePrice).toBe(5500);
    expect(crystal.options).toEqual([
      { label: "كريب", price: 5500 },
      { label: "دان", price: 6000 },
    ]);

    expect(ROYAL_SIX_STOLE_COLORS).toHaveLength(6);
    expect(ROYAL_SIX_STOLE_COLORS.map((c) => c.name)).toEqual([
      "أسود ملكي",
      "أبيض عاجي",
      "بورغندي",
      "أخضر ملكي",
      "كحلي داكن",
      "بيج كريمي",
    ]);
  });

  it("renders directly below شال بالظهر, supports Admin تعديل and حذف النوع, and limits palette to 6 editable luxury colors", async () => {
    const onDeleteProduct = vi.fn();
    const onEditProduct = vi.fn();
    const onUpdateCrystalRoyalColors = vi.fn().mockResolvedValue(undefined);
    const Catalog = ProductCatalog as unknown as React.ComponentType<Record<string, unknown>>;

    render(
      <StoreEditProvider
        isAdminMode={true}
        customTexts={{}}
        hiddenSections={{}}
        onUpdateText={() => {}}
        onClearText={() => {}}
        onRestoreText={() => {}}
        onToggleSectionHidden={() => {}}
      >
        <Catalog
          products={DEFAULT_PRODUCTS}
          isAdminMode={true}
          requestedSection={{ category: "shawl", nonce: 1 }}
          crystalRoyalColors={ROYAL_SIX_STOLE_COLORS}
          onUpdateCrystalRoyalColors={onUpdateCrystalRoyalColors}
          onAddToCart={() => {}}
          onNotify={() => {}}
          onOpenAddProduct={() => {}}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onReplaceProductImage={async () => {}}
        />
      </StoreEditProvider>,
    );

    const backCardHeading = await screen.findByText("شال بالظهر الفاخر مع القبعة");
    const crystalCardHeading = screen.getByRole("heading", {
      name: "شال ملكي مرصع بالكريستال",
    });
    const americanCardHeading = screen.getByRole("heading", {
      name: "الشال الامريكي",
    });

    expect(
      backCardHeading.compareDocumentPosition(crystalCardHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      crystalCardHeading.compareDocumentPosition(americanCardHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const deleteTypeBtn = screen.getByRole("button", {
      name: "حذف النوع شال ملكي مرصع بالكريستال",
    });
    fireEvent.click(deleteTypeBtn);
    const confirmDeleteBtn = screen.getByRole("button", { name: "تأكيد الحذف" });
    fireEvent.click(confirmDeleteBtn);
    expect(onDeleteProduct).toHaveBeenCalledWith("shawl-crystal-royal-1");

    // Open product detail view
    fireEvent.click(crystalCardHeading);

    // All 6 curated royal colors appear as swatches (and strictly 6 colors)
    const colorPickerLabel = screen.getByText(/اختر اللون:/).closest("div")!;
    for (const color of ROYAL_SIX_STOLE_COLORS) {
      expect(within(colorPickerLabel).getByTitle(color.name)).toBeInTheDocument();
    }
    expect(within(colorPickerLabel).queryByTitle("فوشيا")).toBeNull();

    // Admin can customize the 6 luxury colors and save
    fireEvent.click(screen.getByRole("button", { name: /تخصيص الألوان الستة/ }));
    const colorNameInput = screen.getByLabelText("اسم اللون 1") as HTMLInputElement;
    fireEvent.change(colorNameInput, { target: { value: "أسود ماسي" } });
    fireEvent.click(screen.getByRole("button", { name: "حفظ الألوان الستة" }));

    await waitFor(() => {
      expect(onUpdateCrystalRoyalColors).toHaveBeenCalledTimes(1);
    });
    const savedPalette = onUpdateCrystalRoyalColors.mock.calls[0]?.[0];
    expect(savedPalette).toHaveLength(6);
    expect(savedPalette[0].name).toBe("أسود ماسي");
  });
});
