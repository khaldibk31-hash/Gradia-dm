import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS, PRICING_TABLE_ROWS } from "../data/defaultStore";
import { EditableText } from "./EditableText";
function PricingAndFaq({ pricesTitle, pricesSubtitle }) {
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  return /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10", children: [
    /* @__PURE__ */ jsxs("div", { id: "prices-sec", className: "lg:col-span-7", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "pricing.badge",
          defaultText: "\u0634\u0641\u0627\u0641\u064A\u0629 \u0627\u0644\u0623\u0633\u0639\u0627\u0631",
          as: "span",
          compact: true,
          className: "inline-block px-3 py-0.5 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#5E1734]"
        }
      ) }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "pricing.title",
          defaultText: "\u062C\u062F\u0648\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0631\u0633\u0645\u064A\u0629",
          valueOverride: pricesTitle,
          as: "h2",
          className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617] mb-2"
        }
      ),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "pricing.subtitle",
          defaultText: "\u062A\u062A\u0648\u0641\u0631 \u062C\u0645\u064A\u0639 \u0627\u0644\u0634\u0627\u0644\u0627\u062A \u0628\u0642\u0645\u0627\u0634 \u0627\u0644\u0643\u0631\u064A\u0628 \u0627\u0644\u0641\u0627\u062E\u0631 \u0623\u0648 \u0627\u0644\u062F\u0627\u0646 \u0627\u0644\u0645\u062E\u0645\u0644\u064A\u060C \u0648\u064A\u0634\u0645\u0644 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632.",
          valueOverride: pricesSubtitle,
          as: "p",
          multiline: true,
          className: "text-sm text-[#65525A] mb-6"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-right border-collapse text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[#FAF8F5] border-b border-[#C6A355]/30 text-[#5E1734]", children: [
            /* @__PURE__ */ jsx("th", { className: "py-3.5 px-4 font-bold", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "pricing.col.item",
                defaultText: "\u0627\u0644\u0642\u0637\u0639\u0629 / \u0627\u0644\u0645\u0648\u062F\u064A\u0644",
                compact: true
              }
            ) }),
            /* @__PURE__ */ jsx("th", { className: "py-3.5 px-4 font-bold", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "pricing.col.crepe",
                defaultText: "\u0643\u0631\u064A\u0628 / \u0639\u0627\u062F\u064A",
                compact: true
              }
            ) }),
            /* @__PURE__ */ jsx("th", { className: "py-3.5 px-4 font-bold", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "pricing.col.dan",
                defaultText: "\u062F\u0627\u0646 / \u062E\u0644\u064A\u062C\u064A",
                compact: true
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#C6A355]/20", children: PRICING_TABLE_ROWS.map((row, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[#FAF8F5] transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-semibold text-[#1A1617]", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `pricing.row.${idx}.name`,
                defaultText: row.name,
                compact: true
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-bold text-[#5E1734] tabular-nums whitespace-nowrap", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `pricing.row.${idx}.crepe`,
                defaultText: `${row.crepe.toLocaleString("en-US")} \u062F\u062C`,
                compact: true
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-bold text-[#5E1734] tabular-nums whitespace-nowrap", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `pricing.row.${idx}.dan`,
                defaultText: `${row.dan.toLocaleString("en-US")} \u062F\u062C`,
                compact: true
              }
            ) })
          ] }, row.name)) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "px-4 py-3 bg-[#FAF8F5] border-t border-[#C6A355]/25 text-xs text-[#65525A]", children: /* @__PURE__ */ jsx(
          EditableText,
          {
            textKey: "pricing.note",
            defaultText: "\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u062F\u0641\u0639\u0629 \u0645\u0634\u0645\u0648\u0644 \u0645\u062C\u0627\u0646\u0627\u064B \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u0634\u0627\u0644\u0627\u062A \xB7 \u0642\u0628\u0639\u0629 \u0627\u0644\u062A\u0648\u0643\u0633\u064A\u062F\u0648 +100 \u062F\u062C.",
            compact: true
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { id: "faq-sec", className: "lg:col-span-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "faq.badge",
          defaultText: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644",
          as: "span",
          compact: true,
          className: "inline-block px-3 py-0.5 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#5E1734]"
        }
      ) }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "faq.title",
          defaultText: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
          as: "h2",
          className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617] mb-2"
        }
      ),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "faq.subtitle",
          defaultText: "\u0643\u0644 \u0645\u0627 \u062A\u062D\u062A\u0627\u062C \u0645\u0639\u0631\u0641\u062A\u0647 \u0639\u0646 \u0627\u0644\u062A\u062C\u0647\u064A\u0632\u060C \u0627\u0644\u0639\u0631\u0628\u0648\u0646\u060C \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0641\u064A \u0627\u0644\u062C\u0632\u0627\u0626\u0631.",
          as: "p",
          multiline: true,
          className: "text-sm text-[#65525A] mb-6"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl divide-y divide-[#C6A355]/25 shadow-sm", children: FAQ_ITEMS.map((item, idx) => {
        const isOpen = openFaqIdx === idx;
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "aria-expanded": isOpen,
              onClick: () => setOpenFaqIdx(isOpen ? null : idx),
              className: "w-full flex items-center justify-between gap-4 px-5 py-4 text-right text-sm font-bold text-[#1A1617] hover:bg-[#FAF8F5] transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `faq.item.${idx}.q`,
                    defaultText: item.q,
                    compact: true,
                    className: "flex-1 text-right"
                  }
                ),
                /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    className: `w-4 h-4 text-[#5E1734] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 text-xs sm:text-sm text-[#65525A] leading-relaxed", children: /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: `faq.item.${idx}.a`,
              defaultText: item.a,
              as: "p",
              multiline: true
            }
          ) })
        ] }, item.q);
      }) })
    ] })
  ] }) });
}
export {
  PricingAndFaq
};
