import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MessageCircle, PackageCheck, Palette } from "lucide-react";
import { HOW_TO_ORDER_STEPS } from "../data/defaultStore";
import { EditableText, SectionHideButton, useStoreEdit } from "./EditableText";
const STEP_ICONS = [Palette, PackageCheck, MessageCircle];
function HowToOrderSection() {
  const { isAdminMode, hiddenSections } = useStoreEdit();
  const isHidden = Boolean(hiddenSections.howToOrder);
  if (isHidden && !isAdminMode) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "how-to-order-sec",
      className: "py-12 sm:py-16 border-b border-[#C6A355]/25 bg-[#FAF8F5]",
      children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6", children: isHidden && isAdminMode ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-dashed border-[#FECDD3] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#9F1239]", children: "\u0642\u0633\u0645 \xAB\u0643\u064A\u0641 \u062A\u0637\u0644\u0628\xBB \u0645\u062E\u0641\u064A \u062D\u0627\u0644\u064A\u0627\u064B \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646" }),
        /* @__PURE__ */ jsx(SectionHideButton, { sectionKey: "howToOrder", label: "\u0643\u064A\u0641 \u062A\u0637\u0644\u0628" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto mb-9 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "howToOrder.badge",
              defaultText: "\u062E\u0637\u0648\u0627\u062A \u0633\u0647\u0644\u0629 \u0648\u0633\u0631\u064A\u0639\u0629",
              as: "span",
              compact: true,
              className: "inline-block px-3.5 py-1 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#5E1734]"
            }
          ) }),
          /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "howToOrder.title",
              defaultText: "\u0643\u064A\u0641 \u062A\u0637\u0644\u0628 \u0637\u0642\u0645 \u062A\u062E\u0631\u062C\u0643\u061F",
              as: "h2",
              className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617]"
            }
          ),
          /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "howToOrder.subtitle",
              defaultText: "\u062B\u0644\u0627\u062B \u062E\u0637\u0648\u0627\u062A \u0648\u0627\u0636\u062D\u0629 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u062D\u062A\u0649 \u0648\u0635\u0648\u0644 \u0627\u0644\u0637\u0644\u0628 \u0644\u0628\u0627\u0628 \u0645\u0646\u0632\u0644\u0643 \u0641\u064A 58 \u0648\u0644\u0627\u064A\u0629.",
              as: "p",
              multiline: true,
              className: "text-sm text-[#65525A] leading-relaxed"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6", children: HOW_TO_ORDER_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx % STEP_ICONS.length];
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-white border border-[#C6A355]/35 rounded-2xl p-5 sm:p-6 shadow-2xs luxury-card-lift flex flex-col gap-3 text-right",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/45 text-[#5E1734] flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) }),
                  /* @__PURE__ */ jsx(
                    EditableText,
                    {
                      textKey: `howToOrder.${step.id}.num`,
                      defaultText: step.num,
                      as: "span",
                      compact: true,
                      className: "font-editorial text-xl font-extrabold text-[#C6A355] tabular-nums"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `howToOrder.${step.id}.title`,
                    defaultText: step.title,
                    as: "h3",
                    className: "font-editorial text-lg font-bold text-[#1A1617]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `howToOrder.${step.id}.desc`,
                    defaultText: step.desc,
                    as: "p",
                    multiline: true,
                    className: "text-xs sm:text-sm text-[#65525A] leading-relaxed"
                  }
                )
              ]
            },
            step.id
          );
        }) })
      ] }) })
    }
  );
}
export {
  HowToOrderSection
};
