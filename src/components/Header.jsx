import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  ImagePlus,
  Loader2,
  LogOut,
  Menu,
  PackageSearch,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  Type,
  X
} from "lucide-react";
import { BRAND_LOGO_PATH, DEFAULT_SEASON_BANNER_TEXT } from "../data/defaultStore";
import { EditableText } from "./EditableText";
function Header({
  brandName,
  logoUrl,
  cartCount,
  cartPulseActive = false,
  isAdminMode,
  isSaving,
  storewideDiscountPercent = 0,
  seasonBannerEnabled = true,
  seasonBannerText = DEFAULT_SEASON_BANNER_TEXT,
  showTestimonialsLink = true,
  onOpenCart,
  onOpenOrderTracking,
  onPublish,
  onLogout,
  onOpenCopyEditor,
  onOpenAddProduct,
  onUploadLogo,
  onUploadHeroImage,
  isUploadingHeroImage = false,
  onSelectCategory
}) {
  const logoInputRef = useRef(null);
  const heroInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [seasonBannerDismissed, setSeasonBannerDismissed] = useState(false);
  const activeLogo = logoUrl || BRAND_LOGO_PATH;
  const isDefaultEmblem = !logoUrl;
  useEffect(() => {
    setSeasonBannerDismissed(false);
  }, [seasonBannerEnabled, seasonBannerText]);
  const resolvedSeasonBannerText = (seasonBannerText || "").trim() || DEFAULT_SEASON_BANNER_TEXT;
  const showSeasonBanner = Boolean(seasonBannerEnabled) && !seasonBannerDismissed;
  const displayBrand = brandName && brandName.toUpperCase() !== "DG BY DOUAA" ? brandName : "DG by Douaa";
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadLogo(file);
      e.target.value = "";
    }
  };
  const handleHeroChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadHeroImage) {
      onUploadHeroImage(file);
      e.target.value = "";
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showSeasonBanner && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "region",
        "aria-label": "\u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C",
        className: "relative bg-gradient-to-l from-[#FFF9EE] via-[#FAF8F5] to-[#FFF9EE] border-b border-[#C6A355]/45 text-[#1A1617] px-8 sm:px-10 py-2 text-center",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold leading-relaxed", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 shrink-0 text-[#C6A355]" }),
            /* @__PURE__ */ jsx("span", { className: "text-[#5E1734]", children: resolvedSeasonBannerText })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSeasonBannerDismissed(true),
              "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0628\u064A\u0647",
              title: "\u0625\u063A\u0644\u0627\u0642",
              className: "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#65525A] hover:text-[#5E1734] hover:bg-[#5E1734]/10 transition-colors cursor-pointer",
              children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-[#5E1734] text-white px-3 py-1.5 text-center border-b border-[#4A1129]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wide", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Truck, { className: "w-3.5 h-3.5 shrink-0 text-[#C6A355]" }),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            textKey: "header.announcement",
            defaultText: "\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 58 \u0648\u0644\u0627\u064A\u0629 \u2022 \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u2022 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628",
            compact: true,
            darkSurface: true
          }
        )
      ] }),
      storewideDiscountPercent > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#C6A355]/45 text-[10px] sm:text-[11px] font-extrabold text-[#FAF8F5]", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 shrink-0 text-[#C6A355]" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "\u0639\u0631\u0636 \u062E\u0627\u0635: \u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A -",
          storewideDiscountPercent,
          "%"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C6A355]/30 shadow-2xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsMenuOpen((prev) => !prev),
            "aria-expanded": isMenuOpen,
            "aria-label": isMenuOpen ? "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "\u0641\u062A\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629",
            className: "w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-[#1A1617] flex items-center justify-center transition-all touch-manipulation active:scale-95 shrink-0 cursor-pointer",
            children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-[#5E1734]" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5 text-[#1A1617]" })
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#top",
            onClick: () => setIsMenuOpen(false),
            className: "flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap group",
            children: [
              isDefaultEmblem ? /* @__PURE__ */ jsxs("div", { className: "relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 isolate bg-white rounded-full overflow-hidden border border-[#C6A355]/45 shadow-2xs mix-blend-multiply", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: activeLogo,
                    alt: displayBrand,
                    referrerPolicy: "no-referrer",
                    className: "h-full w-full object-contain"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 bg-[#5E1734] mix-blend-screen"
                  }
                )
              ] }) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: activeLogo,
                  alt: displayBrand,
                  referrerPolicy: "no-referrer",
                  className: "h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover border border-[#C6A355]/45 shadow-2xs"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none text-right", children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "header.brandName",
                    defaultText: "DG by Douaa",
                    valueOverride: displayBrand,
                    compact: true,
                    className: "font-editorial text-base sm:text-xl font-bold tracking-wide text-[#1A1617] group-hover:text-[#5E1734] transition-colors whitespace-nowrap"
                  }
                ),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "header.brandSub",
                    defaultText: "ALGERIA",
                    compact: true,
                    className: "text-[9px] sm:text-[10px] font-bold tracking-[0.24em] text-[#5E1734] uppercase mt-0.5"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsMenuOpen(false);
                onOpenOrderTracking();
              },
              "aria-label": "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u0643",
              className: "inline-flex items-center gap-1.5 h-10 px-2.5 sm:px-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-[#5E1734] text-xs font-bold transition-all touch-manipulation active:scale-95 cursor-pointer shadow-2xs whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsx(PackageSearch, { className: "w-4 h-4 shrink-0 text-[#5E1734]" }),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "header.trackBtn",
                    defaultText: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u0643",
                    compact: true,
                    className: "hidden sm:inline"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsMenuOpen(false);
                onOpenCart();
              },
              "aria-label": `\u0627\u0644\u062D\u0642\u064A\u0628\u0629 (${cartCount})`,
              className: `relative w-10 h-10 rounded-full border flex items-center justify-center transition-all touch-manipulation active:scale-95 cursor-pointer shadow-2xs ${cartPulseActive ? "bg-[#FFF9EE] border-[#C6A355] ring-2 ring-[#C6A355]/75 shadow-[0_0_14px_rgba(198,163,85,0.55)] animate-bounce" : "bg-[#FAF8F5] hover:bg-[#F4EFE6] border-[#C6A355]/40 text-[#1A1617]"}`,
              children: [
                cartPulseActive && /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#C6A355] animate-ping opacity-75"
                  }
                ),
                /* @__PURE__ */ jsx(
                  ShoppingBag,
                  {
                    className: `w-5 h-5 text-[#5E1734] ${cartPulseActive ? "cart-attention-shake" : ""}`
                  }
                ),
                cartCount > 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#5E1734] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-xs ${cartPulseActive ? "ring-2 ring-[#C6A355] scale-110" : ""}`,
                    children: cartCount
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      isMenuOpen && /* @__PURE__ */ jsx(
        "nav",
        {
          "aria-label": "\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0633\u0631\u064A\u0639",
          className: "bg-white border-t border-[#C6A355]/30 px-4 sm:px-6 py-4 shadow-lg",
          children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-col gap-3", children: [
            onSelectCategory && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 pb-3 border-b border-[#C6A355]/25", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#65525A] ml-1", children: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645:" }),
              [
                { id: "shawl", label: "\u0627\u0644\u0648\u0634\u0627\u062D" },
                { id: "robe", label: "\u0627\u0644\u0631\u0648\u0628" },
                { id: "accessories", label: "\u0627\u0644\u0648\u0631\u062F" }
              ].map((cat) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "data-category-id": cat.id,
                  onClick: () => {
                    setIsMenuOpen(false);
                    onSelectCategory(cat.id);
                  },
                  className: "px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/40 hover:bg-[#5E1734] text-[#5E1734] hover:text-white text-xs font-bold transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                  children: cat.label
                },
                cat.id
              ))
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-6 text-sm font-bold text-[#1A1617]", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#catalog-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.catalog", defaultText: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629", compact: true })
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#studio-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.studio", defaultText: "\u0635\u0645\u0651\u0645 \u0648\u0634\u0627\u062D\u0643", compact: true })
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#how-to-order-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.howToOrder", defaultText: "\u0643\u064A\u0641 \u062A\u0637\u0644\u0628", compact: true })
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#prices-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.prices", defaultText: "\u062C\u062F\u0648\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631", compact: true })
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#faq-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.faq", defaultText: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629", compact: true })
                }
              ),
              showTestimonialsLink && /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#testimonials-sec",
                  onClick: () => setIsMenuOpen(false),
                  className: "px-3 py-2 rounded-xl hover:bg-[#FAF8F5] hover:text-[#5E1734] transition-colors",
                  children: /* @__PURE__ */ jsx(EditableText, { textKey: "nav.testimonials", defaultText: "\u0622\u0631\u0627\u0621 \u062E\u0631\u064A\u062C\u064A\u0646\u0627", compact: true })
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setIsMenuOpen(false);
                    onOpenOrderTracking();
                  },
                  className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 hover:bg-[#F4EFE6] text-[#5E1734] transition-colors cursor-pointer text-right",
                  children: [
                    /* @__PURE__ */ jsx(PackageSearch, { className: "w-4 h-4 shrink-0 text-[#C6A355]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u0643" })
                  ]
                }
              )
            ] })
          ] })
        }
      )
    ] }),
    isAdminMode && /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white text-[#1A1617] border-b border-[#C6A355]/35",
        role: "region",
        "aria-label": "\u0644\u0648\u062D\u0629 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062A\u062C\u0631",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs sm:text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 font-bold text-[#5E1734]", children: "\u0648\u0636\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0645\u0641\u0639\u0651\u0644" }),
            /* @__PURE__ */ jsx("span", { className: "mx-2 text-[#C6A355]/50", children: "\xB7" }),
            /* @__PURE__ */ jsx("span", { className: "text-[#65525A]", children: "\u0627\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0644\u064A\u0638\u0647\u0631 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0632\u0648\u0627\u0631" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: logoInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleLogoChange
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => logoInputRef.current?.click(),
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-xs font-semibold text-[#1A1617] transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0634\u0639\u0627\u0631" })
                ]
              }
            ),
            onUploadHeroImage && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: heroInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleHeroChange
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  disabled: isUploadingHeroImage,
                  onClick: () => heroInputRef.current?.click(),
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-xs font-semibold text-[#1A1617] transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 disabled:opacity-70 cursor-pointer",
                  children: [
                    isUploadingHeroImage ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 text-[#5E1734] animate-spin" }) : null,
                    /* @__PURE__ */ jsx("span", { children: isUploadingHeroImage ? "\u062C\u0627\u0631\u064A \u0631\u0641\u0639 \u0627\u0644\u063A\u0644\u0627\u0641..." : "\u{1F4F7} \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onOpenCopyEditor,
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-xs font-semibold text-[#1A1617] transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Type, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635\u0648\u0635" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onOpenAddProduct,
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-xs font-semibold text-[#1A1617] transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u062F\u064A\u0644" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                disabled: isSaving,
                onClick: onPublish,
                className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 disabled:opacity-70 cursor-pointer",
                children: [
                  isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 text-[#C6A355] animate-spin" }) : /* @__PURE__ */ jsx(CloudUpload, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                  /* @__PURE__ */ jsx("span", { children: isSaving ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0633\u0631\u064A\u0639..." : "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onLogout,
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#1A1617] border border-[#C6A355]/40 text-xs font-bold transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062E\u0631\u0648\u062C" })
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  Header
};
