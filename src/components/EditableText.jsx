import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Check, Eye, EyeOff, Pencil, RotateCcw, Trash2, X } from "lucide-react";
const noop = () => {
};
const StoreEditContext = createContext({
  isAdminMode: false,
  customTexts: {},
  hiddenSections: {},
  updateText: noop,
  clearText: noop,
  restoreText: noop,
  toggleSectionHidden: noop
});
function StoreEditProvider({
  isAdminMode,
  customTexts,
  hiddenSections,
  onUpdateText,
  onClearText,
  onRestoreText,
  onToggleSectionHidden,
  children
}) {
  return /* @__PURE__ */ jsx(
    StoreEditContext.Provider,
    {
      value: {
        isAdminMode,
        customTexts,
        hiddenSections,
        updateText: onUpdateText,
        clearText: onClearText,
        restoreText: onRestoreText,
        toggleSectionHidden: onToggleSectionHidden
      },
      children
    }
  );
}
function useStoreEdit() {
  return useContext(StoreEditContext);
}
function EditableText({
  textKey,
  defaultText,
  as = "span",
  multiline = false,
  className = "",
  placeholder = "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u062C\u062F\u064A\u062F \u0647\u0646\u0627...",
  valueOverride,
  onSaveOverride,
  onClearOverride,
  compact = false,
  darkSurface = false
}) {
  const { isAdminMode, customTexts, updateText, clearText, restoreText } = useStoreEdit();
  const hasSavedEntry = Object.prototype.hasOwnProperty.call(
    customTexts,
    textKey
  );
  const isDeleted = hasSavedEntry && customTexts[textKey] === "";
  const resolvedText = hasSavedEntry ? customTexts[textKey] : valueOverride !== void 0 ? valueOverride : defaultText;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(resolvedText || defaultText);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isEditing) {
      setDraft(isDeleted ? "" : resolvedText || defaultText);
    }
  }, [resolvedText, defaultText, isDeleted, isEditing]);
  useEffect(() => {
    if (!isAdminMode && isEditing) {
      setIsEditing(false);
    }
  }, [isAdminMode, isEditing]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [isEditing]);
  if (!isAdminMode) {
    if (isDeleted || !resolvedText.trim()) {
      return null;
    }
    const Tag2 = as;
    return /* @__PURE__ */ jsx(Tag2, { className, children: resolvedText });
  }
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleOpenEdit = (e) => {
    stop(e);
    setDraft(isDeleted ? defaultText : resolvedText);
    setIsEditing(true);
  };
  const handleCommit = (e) => {
    if (e) stop(e);
    const cleaned = draft.trim();
    if (!cleaned) {
      handleDelete();
      return;
    }
    updateText(textKey, cleaned);
    onSaveOverride?.(cleaned);
    setIsEditing(false);
  };
  const handleDelete = (e) => {
    if (e) stop(e);
    clearText(textKey);
    onClearOverride?.();
    setIsEditing(false);
  };
  const handleRestore = (e) => {
    stop(e);
    restoreText(textKey);
    setIsEditing(false);
  };
  const handleCancel = (e) => {
    stop(e);
    setDraft(isDeleted ? "" : resolvedText);
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel(e);
      return;
    }
    if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommit(e);
    }
  };
  if (isEditing) {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        onClick: stop,
        onMouseDown: (e) => e.stopPropagation(),
        className: "inline-flex flex-wrap items-center gap-1.5 bg-white border-2 border-[#C6A355] rounded-xl p-1.5 shadow-xl text-[#1A1617] z-30 relative max-w-full align-middle",
        children: [
          multiline ? /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: (el) => {
                inputRef.current = el;
              },
              rows: 3,
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: handleKeyDown,
              onClick: (e) => e.stopPropagation(),
              placeholder,
              className: "min-w-[210px] sm:min-w-[300px] max-w-full px-2.5 py-1.5 rounded-lg border border-[#C6A355]/45 bg-[#FAF8F5] text-xs sm:text-sm font-semibold text-[#1A1617] leading-relaxed focus:outline-none focus:border-[#5E1734]"
            }
          ) : /* @__PURE__ */ jsx(
            "input",
            {
              ref: (el) => {
                inputRef.current = el;
              },
              type: "text",
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: handleKeyDown,
              onClick: (e) => e.stopPropagation(),
              placeholder,
              className: "min-w-[150px] sm:min-w-[220px] max-w-full px-2.5 py-1 rounded-lg border border-[#C6A355]/45 bg-[#FAF8F5] text-xs sm:text-sm font-bold text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxs(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: handleCommit,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") handleCommit(e);
                },
                title: "\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062A\u0639\u062F\u064A\u0644",
                "aria-label": "\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062A\u0639\u062F\u064A\u0644",
                className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#147A53] hover:bg-[#0F5E40] text-white text-[11px] font-bold cursor-pointer select-none",
                children: [
                  /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062D\u0641\u0638" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: handleDelete,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") handleDelete(e);
                },
                title: "\u0645\u0633\u062D \u0648\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0646\u0635",
                "aria-label": "\u0645\u0633\u062D \u0648\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0646\u0635",
                className: "inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] cursor-pointer select-none",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: handleCancel,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") handleCancel(e);
                },
                title: "\u0625\u0644\u063A\u0627\u0621",
                "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                className: "inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#65525A] border border-[#C6A355]/40 cursor-pointer select-none",
                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
              }
            )
          ] })
        ]
      }
    );
  }
  if (isDeleted) {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        onClick: stop,
        className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF1F2]/95 border border-dashed border-[#FECDD3] text-[10px] sm:text-[11px] font-bold text-[#9F1239] align-middle select-none",
        children: [
          /* @__PURE__ */ jsx("span", { children: "\u0646\u0635 \u0645\u062D\u0630\u0648\u0641" }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              role: "button",
              tabIndex: 0,
              onClick: handleRestore,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") handleRestore(e);
              },
              title: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0646\u0635 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A",
              className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white text-[#147A53] border border-[#BEEBD4] hover:bg-[#EBF9F2] cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(RotateCcw, { className: "w-2.5 h-2.5" }),
                /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              role: "button",
              tabIndex: 0,
              onClick: handleOpenEdit,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") handleOpenEdit(e);
              },
              title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635",
              className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#5E1734] border border-[#C6A355] hover:bg-[#FAF8F5] cursor-pointer",
              children: /* @__PURE__ */ jsx(Pencil, { className: "w-2.5 h-2.5" })
            }
          )
        ]
      }
    );
  }
  const Tag = as;
  const iconSize = compact ? "w-4 h-4" : "w-5 h-5";
  const svgSize = compact ? "w-2.5 h-2.5" : "w-3 h-3";
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      className: `${className} group/editable relative rounded-md outline-1 outline-dashed ${darkSurface ? "outline-[#C6A355]/70 hover:outline-white" : "outline-[#C6A355]/55 hover:outline-[#5E1734]"} transition-colors`,
      children: [
        resolvedText,
        /* @__PURE__ */ jsxs(
          "span",
          {
            onClick: (e) => e.stopPropagation(),
            className: "inline-flex items-center gap-1 mr-1.5 align-middle opacity-90 sm:opacity-65 sm:group-hover/editable:opacity-100 transition-opacity select-none",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: handleOpenEdit,
                  onMouseDown: (e) => e.stopPropagation(),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenEdit(e);
                  },
                  title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635",
                  "aria-label": `\u062A\u0639\u062F\u064A\u0644: ${resolvedText}`,
                  className: `${iconSize} rounded-full bg-white text-[#5E1734] border border-[#C6A355] hover:bg-[#FAF8F5] inline-flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-90`,
                  children: /* @__PURE__ */ jsx(Pencil, { className: svgSize })
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: handleDelete,
                  onMouseDown: (e) => e.stopPropagation(),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") handleDelete(e);
                  },
                  title: "\u0645\u0633\u062D / \u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0646\u0635",
                  "aria-label": `\u0645\u0633\u062D: ${resolvedText}`,
                  className: `${iconSize} rounded-full bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] hover:bg-[#FFE4E6] inline-flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-90`,
                  children: /* @__PURE__ */ jsx(Trash2, { className: svgSize })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function SectionHideButton({
  sectionKey,
  label
}) {
  const { isAdminMode, hiddenSections, toggleSectionHidden } = useStoreEdit();
  if (!isAdminMode) return null;
  const isHidden = Boolean(hiddenSections[sectionKey]);
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => toggleSectionHidden(sectionKey, !isHidden),
      className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs transition-all cursor-pointer active:scale-95 ${isHidden ? "bg-[#EBF9F2] hover:bg-[#D1F2E2] text-[#147A53] border-[#BEEBD4]" : "bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]"}`,
      children: isHidden ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "\u0625\u0638\u0647\u0627\u0631 \u0642\u0633\u0645 \xAB",
          label,
          "\xBB"
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsx("span", { children: "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0642\u0633\u0645 / \u062D\u0630\u0641" })
      ] })
    }
  );
}
export {
  EditableText,
  SectionHideButton,
  StoreEditProvider,
  useStoreEdit
};
