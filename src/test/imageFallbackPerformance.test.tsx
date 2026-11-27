import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoreEditProvider } from "@/components/EditableText";
import { HeroSection } from "@/components/HeroSection";
import { ProductCatalog } from "@/components/ProductCatalog";
import {
  BOUQUET_IMAGE_PATH,
  CAP_IMAGE_PATH,
  DEFAULT_COPY,
  DEFAULT_PRODUCTS,
  HERO_ATELIER_IMAGE_PATH,
  HERO_BANNER_IMAGE_PATH,
  HERO_BLACK_GOLD_IMAGE_PATH,
  HERO_FALLBACK_SLIDES,
  HERO_IMAGE_PATH,
  ROBE_IMAGE_PATH,
  ROYAL_SIX_STOLE_COLORS,
  SHAWL_AMERICAN_IMAGE_PATH,
  SHAWL_BACK_IMAGE_PATH,
  SHAWL_CRYSTAL_ROYAL_IMAGE_PATH,
  SHAWL_MISS_IMAGE_PATH,
  SHAWL_REGULAR_IMAGE_PATH,
  getProductFallbackImage,
} from "@/data/defaultStore";

const EXPECTED_BUNDLED_IMAGES = [
  HERO_BANNER_IMAGE_PATH,
  HERO_IMAGE_PATH,
  HERO_BLACK_GOLD_IMAGE_PATH,
  HERO_ATELIER_IMAGE_PATH,
  ROBE_IMAGE_PATH,
  SHAWL_BACK_IMAGE_PATH,
  SHAWL_CRYSTAL_ROYAL_IMAGE_PATH,
  CAP_IMAGE_PATH,
  BOUQUET_IMAGE_PATH,
  SHAWL_MISS_IMAGE_PATH,
  SHAWL_REGULAR_IMAGE_PATH,
  SHAWL_AMERICAN_IMAGE_PATH,
];

function wrapWithEditProvider(ui: React.ReactNode) {
  return (
    <StoreEditProvider
      isAdminMode={false}
      customTexts={{}}
      hiddenSections={{}}
      onUpdateText={() => {}}
      onClearText={() => {}}
      onRestoreText={() => {}}
      onToggleSectionHidden={() => {}}
    >
      {ui}
    </StoreEditProvider>
  );
}

describe("Built-in Fallback Images & Instant Mobile Image Loading", () => {
  it("bundles every luxury graduation image locally in /public/images/ under 180KB", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    for (const relUrl of EXPECTED_BUNDLED_IMAGES) {
      expect(relUrl.startsWith("/images/")).toBe(true);
      expect(relUrl.endsWith(".webp")).toBe(true);
      const absPath = path.join(publicDir, relUrl.replace(/^\/+/, ""));
      expect(fs.existsSync(absPath)).toBe(true);
      const stat = fs.statSync(absPath);
      expect(stat.size).toBeGreaterThan(0);
      expect(stat.size).toBeLessThan(180 * 1024);
    }
  });

  it("maps all default hero slides and main product categories to local /images/ fallbacks", () => {
    expect(HERO_FALLBACK_SLIDES).toEqual([
      "/images/hero-burgundy.webp",
      "/images/hero-ivory.webp",
      "/images/hero-gold.webp",
    ]);

    expect(getProductFallbackImage({ category: "robe", name: "الروب" })).toBe("/images/robe.webp");
    expect(
      getProductFallbackImage({ id: "shawl-back-1", category: "shawl", name: "شال بالظهر" }),
    ).toBe("/images/stole-back.webp");
    expect(
      getProductFallbackImage({
        id: "shawl-crystal-royal-1",
        category: "shawl",
        name: "شال ملكي مرصع بالكريستال",
      }),
    ).toBe("/images/stole-crystal-royal.webp");
    expect(getProductFallbackImage({ category: "cap", name: "القبعة" })).toBe("/images/cap.webp");
    expect(getProductFallbackImage({ category: "accessories", name: "الورد" })).toBe(
      "/images/bouquet.webp",
    );

    const crystal = DEFAULT_PRODUCTS.find((p) => p.id === "shawl-crystal-royal-1");
    expect(crystal?.imageUrl).toBe("/images/stole-crystal-royal.webp");
  });

  it("loads the first Hero slide eagerly with high priority, lazy-loads others, and swaps broken remote slides to local fallbacks", () => {
    const Hero = HeroSection as unknown as React.ComponentType<Record<string, unknown>>;
    const remotePrimary = "https://broken-cdn.example.invalid/hero-1.jpg";
    const remoteSecond = "https://broken-cdn.example.invalid/hero-2.jpg";

    const { container } = render(
      wrapWithEditProvider(
        <Hero
          copy={DEFAULT_COPY}
          heroImageUrl={remotePrimary}
          galleryImages={[{ id: "g-1", imageUrl: remoteSecond, caption: "شريحة ثانية" }]}
          isAdminMode={false}
        />,
      ),
    );

    const heroImgs = Array.from(container.querySelectorAll("img"));
    expect(heroImgs.length).toBeGreaterThanOrEqual(2);

    const firstSlideImg = heroImgs[0]!;
    const secondSlideImg = heroImgs[1]!;

    expect(firstSlideImg).toHaveAttribute("loading", "eager");
    expect(firstSlideImg).toHaveAttribute("decoding", "sync");
    expect(firstSlideImg).toHaveAttribute("fetchpriority", "high");
    expect(firstSlideImg).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(firstSlideImg).toHaveAttribute("src", remotePrimary);

    expect(secondSlideImg).toHaveAttribute("loading", "lazy");
    expect(secondSlideImg).toHaveAttribute("decoding", "async");
    expect(secondSlideImg).toHaveAttribute("referrerpolicy", "no-referrer");

    fireEvent.error(firstSlideImg);
    expect(firstSlideImg).toHaveAttribute("src", HERO_FALLBACK_SLIDES[0]);

    fireEvent.error(secondSlideImg);
    expect(secondSlideImg).toHaveAttribute("src", HERO_FALLBACK_SLIDES[1]);
  });

  it("lazy-loads catalog images and automatically falls back to local bundled assets when remote URLs fail", async () => {
    const Catalog = ProductCatalog as unknown as React.ComponentType<Record<string, unknown>>;
    const brokenCoverUrl = "https://broken-cdn.example.invalid/category-shawl.jpg";
    const brokenProductUrl = "https://broken-cdn.example.invalid/broken-robe.jpg";

    const productsWithBrokenRemote = DEFAULT_PRODUCTS.map((prod) =>
      prod.category === "robe" ? { ...prod, imageUrl: brokenProductUrl } : prod,
    );

    const { rerender } = render(
      wrapWithEditProvider(
        <Catalog
          products={productsWithBrokenRemote}
          isAdminMode={false}
          categoryCoverImages={{ shawl: brokenCoverUrl }}
          crystalRoyalColors={ROYAL_SIX_STOLE_COLORS}
          onAddToCart={() => {}}
          onNotify={() => {}}
          onOpenAddProduct={() => {}}
          onEditProduct={() => {}}
          onDeleteProduct={() => {}}
          onReplaceProductImage={async () => {}}
        />,
      ),
    );

    const shawlCatImg = screen.getByAltText("الوشاح") as HTMLImageElement;
    expect(shawlCatImg).toHaveAttribute("loading", "lazy");
    expect(shawlCatImg).toHaveAttribute("decoding", "async");
    expect(shawlCatImg).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(shawlCatImg).toHaveAttribute("src", brokenCoverUrl);

    fireEvent.error(shawlCatImg);
    expect(shawlCatImg).toHaveAttribute("src", SHAWL_MISS_IMAGE_PATH);

    rerender(
      wrapWithEditProvider(
        <Catalog
          products={productsWithBrokenRemote}
          isAdminMode={false}
          requestedSection={{ category: "robe", nonce: 99 }}
          crystalRoyalColors={ROYAL_SIX_STOLE_COLORS}
          onAddToCart={() => {}}
          onNotify={() => {}}
          onOpenAddProduct={() => {}}
          onEditProduct={() => {}}
          onDeleteProduct={() => {}}
          onReplaceProductImage={async () => {}}
        />,
      ),
    );

    const robeProduct = productsWithBrokenRemote.find((p) => p.category === "robe")!;
    const robeCardImg = (await screen.findByAltText(robeProduct.name)) as HTMLImageElement;
    expect(robeCardImg).toHaveAttribute("loading", "lazy");
    expect(robeCardImg).toHaveAttribute("decoding", "async");
    expect(robeCardImg).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(robeCardImg).toHaveAttribute("src", brokenProductUrl);

    fireEvent.error(robeCardImg);
    expect(robeCardImg).toHaveAttribute("src", ROBE_IMAGE_PATH);
  });
});
