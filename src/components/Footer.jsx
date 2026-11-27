import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Lock, PackageSearch, ShieldCheck, Truck, X } from "lucide-react";
import { sanitizeSocialUrl } from "../data/defaultStore";
import { EditableText } from "./EditableText";
function Footer({
  brandName,
  whatsappNumber,
  isAdminAuthenticated,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  onOpenTracking,
  onUnlockAdmin
}) {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  useEffect(() => {
    if (!isPolicyOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsPolicyOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPolicyOpen]);
  const safeInstagramUrl = sanitizeSocialUrl(instagramUrl);
  const safeFacebookUrl = sanitizeSocialUrl(facebookUrl);
  const safeTiktokUrl = sanitizeSocialUrl(tiktokUrl);
  const hasSocialLinks = Boolean(
    safeInstagramUrl || safeFacebookUrl || safeTiktokUrl
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("footer", { className: "relative z-10 bg-white border-t border-[#C6A355]/30 pt-10 pb-28 md:pt-10 md:pb-12 px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "footer.brandName",
              defaultText: "DG by Douaa",
              valueOverride: brandName,
              as: "p",
              className: "font-editorial text-xl font-bold text-[#1A1617]"
            }
          ),
          /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "footer.description",
              defaultText: "\u062F\u0627\u0631 \u0623\u0632\u064A\u0627\u0621 \u0627\u0644\u062A\u062E\u0631\u062C \u0641\u064A \u0627\u0644\u062C\u0632\u0627\u0626\u0631: \u0634\u0627\u0644\u0627\u062A \u0645\u0637\u0631\u0632\u0629 \u0628\u0627\u0633\u0645\u0643 \u0648\u0634\u0639\u0627\u0631\u0643\u060C \u0631\u0648\u0628\u0627\u062A \u0628\u0645\u0642\u0627\u0633\u0643\u060C \u0648\u0642\u0628\u0639\u0627\u062A \u0645\u062E\u0635\u0635\u0629 \u0645\u0639 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A.",
              as: "p",
              multiline: true,
              className: "text-xs sm:text-sm text-[#65525A] mt-1 max-w-md"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start sm:items-end gap-3.5", children: [
          hasSocialLinks && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex flex-wrap items-center gap-2.5",
              "aria-label": "\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A",
              children: [
                safeInstagramUrl && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: safeInstagramUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",
                    title: "\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",
                    className: "px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all font-medium text-sm text-white flex items-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
                    children: [
                      /* @__PURE__ */ jsxs(
                        "svg",
                        {
                          "aria-hidden": "true",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          className: "w-4 h-4 shrink-0",
                          children: [
                            /* @__PURE__ */ jsx("rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }),
                            /* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
                            /* @__PURE__ */ jsx("line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: "\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645" })
                    ]
                  }
                ),
                safeFacebookUrl && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: safeFacebookUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "\u0641\u064A\u0633\u0628\u0648\u0643",
                    title: "\u0641\u064A\u0633\u0628\u0648\u0643",
                    className: "px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all font-medium text-sm text-white flex items-center gap-2 bg-[#1877F2]",
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          "aria-hidden": "true",
                          viewBox: "0 0 24 24",
                          fill: "currentColor",
                          className: "w-4 h-4 shrink-0",
                          children: /* @__PURE__ */ jsx("path", { d: "M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: "\u0641\u064A\u0633\u0628\u0648\u0643" })
                    ]
                  }
                ),
                safeTiktokUrl && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: safeTiktokUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": "\u062A\u064A\u0643 \u062A\u0648\u0643",
                    title: "\u062A\u064A\u0643 \u062A\u0648\u0643",
                    className: "px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all font-medium text-sm text-white flex items-center gap-2 bg-[#000000] border border-white/20",
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          "aria-hidden": "true",
                          viewBox: "0 0 24 24",
                          fill: "currentColor",
                          className: "w-4 h-4 shrink-0",
                          children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: "\u062A\u064A\u0643 \u062A\u0648\u0643" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs text-[#65525A]", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onOpenTracking,
                className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/45 font-bold text-[#5E1734] transition-colors cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(PackageSearch, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                  /* @__PURE__ */ jsx(
                    EditableText,
                    {
                      textKey: "footer.trackBtn",
                      defaultText: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u0643",
                      compact: true
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-[#C6A355]/50", children: "\xB7" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${whatsappNumber}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-bold text-[#147A53] hover:underline",
                children: /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "footer.whatsappBtn",
                    defaultText: "\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 WhatsApp",
                    compact: true
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-[#C6A355]/50", children: "\xB7" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsPolicyOpen(true),
                className: "text-[#65525A] hover:text-[#5E1734] hover:underline transition-colors cursor-pointer",
                children: "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u062A\u0641\u0635\u064A\u0644"
              }
            ),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-[#C6A355]/50", children: "\xB7" }),
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "footer.copyright",
                defaultText: "\xA9 2026 DG by Douaa \u0627\u0644\u062C\u0632\u0627\u0626\u0631",
                compact: true
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto mt-6 pt-5 border-t border-[#C6A355]/20 flex justify-center items-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onUnlockAdmin,
          className: "mx-auto flex justify-center items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/40 text-xs font-bold text-[#65525A] hover:text-[#5E1734] transition-colors cursor-pointer touch-manipulation",
          title: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
          children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
            /* @__PURE__ */ jsx("span", { children: isAdminAuthenticated ? "\u0648\u0636\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629" : "\u0627\u0644\u0625\u062F\u0627\u0631\u0629" })
          ]
        }
      ) })
    ] }),
    isPolicyOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1617]/45 backdrop-blur-xs",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u0637\u0644\u0628",
        onClick: () => setIsPolicyOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full max-w-lg rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/45 shadow-2xl overflow-hidden text-[#1A1617]",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-white border-b border-[#C6A355]/30 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-[#1A1617]", children: "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u0637\u0644\u0628" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsPolicyOpen(false),
                    "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0646\u0627\u0641\u0630\u0629",
                    className: "p-1.5 rounded-xl text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5] transition-colors cursor-pointer",
                    children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 text-xs sm:text-sm leading-relaxed text-[#1A1617]", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#C6A355]/30 p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "font-bold text-[#5E1734] flex items-center gap-1.5 text-sm", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-[#C6A355] shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628 \u0648\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644" })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[#65525A]", children: [
                    "\u062A\u064F\u0641\u0635\u0651\u0644 \u0627\u0644\u0634\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u0637\u0631\u0632\u0629 \u0628\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u062E\u0631\u064A\u062C\u064A\u0646 \u0648\u062A\u062E\u0635\u0635\u0627\u062A\u0647\u0645 \u062E\u0635\u064A\u0635\u0627\u064B \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628\u060C \u0644\u0630\u0644\u0643 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0631\u062C\u0627\u0639\u0647\u0627 \u0628\u0639\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630 \u0644\u0645\u062C\u0631\u062F \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0631\u0623\u064A\u060C",
                    " ",
                    /* @__PURE__ */ jsx("strong", { className: "text-[#1A1617]", children: "\u0628\u0627\u0633\u062A\u062B\u0646\u0627\u0621 \u0648\u062C\u0648\u062F \u0623\u064A \u062E\u0637\u0623 \u0645\u0646 \u0627\u0644\u0648\u0631\u0634\u0629 \u0641\u064A \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0623\u0648 \u0627\u0644\u0625\u0645\u0644\u0627\u0621 \u0623\u0648 \u0627\u0644\u0644\u0648\u0646 \u0623\u0648 \u0627\u0644\u0645\u0642\u0627\u0633" }),
                    " ",
                    "\u2014 \u062D\u064A\u062B \u0646\u0636\u0645\u0646 \u0644\u0643\u0645",
                    " ",
                    /* @__PURE__ */ jsx("strong", { className: "text-[#147A53]", children: "\u0627\u0633\u062A\u0628\u062F\u0627\u0644\u0627\u064B \u0645\u062C\u0627\u0646\u064A\u0627\u064B 100%" }),
                    " ",
                    "\u062F\u0648\u0646 \u0623\u064A \u062A\u0643\u0627\u0644\u064A\u0641 \u0625\u0636\u0627\u0641\u064A\u0629."
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#C6A355]/30 p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "font-bold text-[#5E1734] flex items-center gap-1.5 text-sm", children: [
                    /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4 text-[#C6A355] shrink-0" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0645\u062F\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A (58 \u0648\u0644\u0627\u064A\u0629)" })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[#65525A]", children: [
                    "\u064A\u0633\u062A\u063A\u0631\u0642 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0645\u0646",
                    " ",
                    /* @__PURE__ */ jsx("strong", { className: "text-[#1A1617]", children: "2 \u0625\u0644\u0649 5 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644" }),
                    " ",
                    "\u0625\u0644\u0649 \u062C\u0645\u064A\u0639 \u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u062C\u0632\u0627\u0626\u0631 \u0627\u0644\u0640 58 \u0639\u0628\u0631 \u0645\u0643\u0627\u062A\u0628 \u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0634\u0631\u064A\u0643\u0629 \u0623\u0648 \u0625\u0644\u0649 \u0628\u0627\u0628 \u0627\u0644\u0645\u0646\u0632\u0644."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-5 py-3.5 bg-white border-t border-[#C6A355]/25 flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsPolicyOpen(false),
                  className: "px-5 py-2 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-colors cursor-pointer",
                  children: "\u062D\u0633\u0646\u0627\u064B\u060C \u0641\u0647\u0645\u062A"
                }
              ) })
            ]
          }
        )
      }
    )
  ] });
}
export {
  Footer
};
