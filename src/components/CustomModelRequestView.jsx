import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
  Zap
} from "lucide-react";
import { formatWhatsAppNumber, WHATSAPP_NUMBER } from "../data/defaultStore";
import { compressReceiptImage } from "../lib/supabase";
function CustomModelRequestCard({
  onOpen,
  isAdminMode = false,
  estimatePrice = 4e3,
  onUpdateEstimatePrice
}) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceDraft, setPriceDraft] = useState(String(estimatePrice));
  const [savingPrice, setSavingPrice] = useState(false);
  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onUpdateEstimatePrice) return;
    const parsed = Number(priceDraft);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setSavingPrice(true);
    try {
      await onUpdateEstimatePrice(Math.round(parsed));
      setEditingPrice(false);
    } finally {
      setSavingPrice(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "article",
    {
      role: "button",
      tabIndex: 0,
      onClick: onOpen,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      },
      className: "group bg-white rounded-2xl border border-[#C6A355]/20 p-0 overflow-hidden shadow-sm flex items-stretch justify-between gap-0 cursor-pointer touch-manipulation transition-all duration-150 ease-out active:scale-[0.985] hover:shadow-md hover:border-[#C6A355]/60",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 p-3.5 sm:p-4 flex flex-col justify-between gap-2 text-right", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/35 text-[10px] sm:text-[11px] font-bold text-[#5E1734]", children: "\u062A\u0641\u0635\u064A\u0644 \u062E\u0627\u0635 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-editorial text-base sm:text-xl font-bold text-[#1A1617] leading-snug", children: "\u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0623\u0648 \u0623\u064A \u062A\u0635\u0645\u064A\u0645 \u062A\u0631\u064A\u062F\u0647" }),
            /* @__PURE__ */ jsx("div", { className: "pt-0.5", children: editingPrice && isAdminMode && onUpdateEstimatePrice ? /* @__PURE__ */ jsxs(
              "form",
              {
                onClick: (e) => e.stopPropagation(),
                onSubmit: handleSubmitPrice,
                className: "inline-flex flex-wrap items-center gap-1 px-2 py-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/60",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: 50,
                      autoFocus: true,
                      value: priceDraft,
                      onChange: (e) => setPriceDraft(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Escape") setEditingPrice(false);
                      },
                      className: "w-20 px-1.5 py-0.5 rounded-lg border border-[#C6A355]/45 bg-white text-xs font-extrabold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#65525A]", children: "\u062F\u062C" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: savingPrice,
                      className: "px-2 py-0.5 rounded-lg bg-[#147A53] text-white text-[10px] font-bold cursor-pointer",
                      children: "\u062D\u0641\u0638"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        setEditingPrice(false);
                      },
                      "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                      className: "w-5 h-5 rounded-lg bg-white border border-[#C6A355]/35 text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                      children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 tabular-nums", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-block px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-xs sm:text-sm font-extrabold text-[#5E1734]", children: [
                "\u064A\u064F\u062D\u062F\u0651\u062F \u0627\u0644\u0633\u0639\u0631 \u0623\u0648 \u0645\u0646 ",
                estimatePrice.toLocaleString("en-US"),
                " \u062F\u062C"
              ] }),
              isAdminMode && onUpdateEstimatePrice && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setPriceDraft(String(estimatePrice));
                    setEditingPrice(true);
                  },
                  title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631",
                  "aria-label": "\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0627\u0644\u062E\u0627\u0635",
                  className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-xs cursor-pointer shadow-2xs",
                  children: "\u270F\uFE0F"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx("span", { className: "cta-luxury-shimmer inline-flex items-center justify-center bg-[#5E1734] group-hover:bg-[#4A1129] text-white rounded-xl py-2.5 px-4 text-xs font-bold w-full transition-all active:scale-95 shadow-xs", children: "\u0627\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 >" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-32 sm:w-40 self-stretch bg-[#FAF8F5] flex flex-col items-center justify-center shrink-0 text-center px-3 select-none overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-y-0 right-0 w-4 z-[5] bg-gradient-to-r from-transparent to-white"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-2xl sm:text-3xl leading-none", "aria-hidden": "true", children: "\u{1F4F7}\u2728" }),
          /* @__PURE__ */ jsx("span", { className: "mt-2 text-[10px] sm:text-[11px] font-bold text-[#5E1734]", children: "\u062A\u0635\u0645\u064A\u0645 \u0639\u0644\u0649 \u0630\u0648\u0642\u0643" })
        ] })
      ]
    }
  );
}
const CUSTOM_SIZE_OPTIONS = [
  "\u0645\u0642\u0627\u0633 \u0642\u064A\u0627\u0633\u064A \u0644\u0644\u0648\u0634\u0627\u062D",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "\u0645\u0642\u0627\u0633 \u062E\u0627\u0635 (\u064A\u064F\u0630\u0643\u0631 \u0628\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A)"
];
const BASE_CUSTOM_ESTIMATE_PRICE = 4e3;
function CustomModelRequestView({
  stoleColors,
  whatsappNumber = WHATSAPP_NUMBER,
  isAdminMode = false,
  estimatePrice = BASE_CUSTOM_ESTIMATE_PRICE,
  onUpdateEstimatePrice,
  onBack,
  onAddToCart,
  onExpressCheckout,
  onNotify
}) {
  const [modelImage, setModelImage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [desiredColor, setDesiredColor] = useState("\u0623\u0633\u0648\u062F \u0645\u0644\u0643\u064A");
  const [customColorNote, setCustomColorNote] = useState("");
  const [sizeSelection, setSizeSelection] = useState("\u0645\u0642\u0627\u0633 \u0642\u064A\u0627\u0633\u064A \u0644\u0644\u0648\u0634\u0627\u062D");
  const [rightText, setRightText] = useState("");
  const [leftText, setLeftText] = useState("");
  const [notes, setNotes] = useState("");
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceDraft, setPriceDraft] = useState(String(estimatePrice));
  const [savingPrice, setSavingPrice] = useState(false);
  const fileInputRef = useRef(null);
  const handleSaveEstimatePrice = async (e) => {
    e.preventDefault();
    if (!onUpdateEstimatePrice) return;
    const parsed = Number(priceDraft);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setSavingPrice(true);
    try {
      await onUpdateEstimatePrice(Math.round(parsed));
      setEditingPrice(false);
    } finally {
      setSavingPrice(false);
    }
  };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressReceiptImage(file, 700, 0.78);
      setModelImage(compressed);
      onNotify?.("success", "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0648\u0636\u063A\u0637 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0628\u0646\u062C\u0627\u062D.");
    } catch (err) {
      onNotify?.(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0645\u0639\u0627\u0644\u062C\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644\u060C \u062C\u0631\u0628\u064A \u0635\u0648\u0631\u0629 \u0623\u062E\u0631\u0649."
      );
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
  };
  const resolvedColor = customColorNote.trim() ? `${desiredColor} (${customColorNote.trim()})` : desiredColor;
  const buildSummaryDetails = () => {
    const parts = [
      modelImage ? "\u0635\u0648\u0631\u0629 \u0645\u0648\u062F\u064A\u0644 \u0645\u062E\u0635\u0635\u0629 \u0645\u0631\u0641\u0642\u0629" : "\u0628\u062F\u0648\u0646 \u0635\u0648\u0631\u0629 \u0645\u0631\u0641\u0642\u0629 (\u0648\u0635\u0641 \u0646\u0635\u064A)",
      resolvedColor ? `\u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u0637\u0644\u0648\u0628: ${resolvedColor}` : null,
      sizeSelection ? `\u0627\u0644\u0645\u0642\u0627\u0633: ${sizeSelection}` : null,
      notes.trim() ? `\u0645\u0644\u0627\u062D\u0638\u0627\u062A: ${notes.trim()}` : null
    ].filter(Boolean);
    return parts.join(" \xB7 ");
  };
  const validateBeforeSubmit = () => {
    if (!modelImage && !notes.trim() && !rightText.trim() && !leftText.trim()) {
      onNotify?.(
        "error",
        "\u064A\u0631\u062C\u0649 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0623\u0648 \u0643\u062A\u0627\u0628\u0629 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0641\u064A \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A."
      );
      return false;
    }
    return true;
  };
  const buildCartPayload = () => ({
    productId: "custom-model-request",
    title: "\u062A\u0641\u0635\u064A\u0644 \u062E\u0627\u0635 \u062D\u0633\u0628 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644",
    category: "custom-stole",
    shawlColor: resolvedColor || "\u062D\u0633\u0628 \u0627\u0644\u0635\u0648\u0631\u0629",
    size: sizeSelection || "\u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628",
    rightEmbroideredText: rightText.trim() || void 0,
    leftEmbroideredText: leftText.trim() || void 0,
    customModelImage: modelImage || void 0,
    customNotes: notes.trim() || void 0,
    details: buildSummaryDetails(),
    unitPrice: estimatePrice,
    costPrice: 0
  });
  const handleAdd = () => {
    if (!validateBeforeSubmit()) return;
    onAddToCart(buildCartPayload());
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };
  const handleExpressOrder = () => {
    if (!validateBeforeSubmit()) return;
    onAddToCart(buildCartPayload());
    onExpressCheckout?.();
  };
  const activeWhatsApp = formatWhatsAppNumber(whatsappNumber);
  const whatsappMessage = [
    "*\u0637\u0644\u0628 \u062A\u0641\u0635\u064A\u0644 \u062E\u0627\u0635 \u062D\u0633\u0628 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u2014 DG by Douaa \u2728\u{1F393}*",
    `\u{1F3A8} *\u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u0637\u0644\u0648\u0628:* ${resolvedColor || "\u0646\u0641\u0633 \u0644\u0648\u0646 \u0627\u0644\u0635\u0648\u0631\u0629"}`,
    `\u{1F4CF} *\u0627\u0644\u0645\u0642\u0627\u0633:* ${sizeSelection || "\u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628"}`,
    rightText.trim() ? `\u27A1\uFE0F *\u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649):* ${rightText.trim()}` : null,
    leftText.trim() ? `\u2B05\uFE0F *\u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649):* ${leftText.trim()}` : null,
    notes.trim() ? `\u{1F4DD} *\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629:* ${notes.trim()}` : null,
    modelImage ? "\u{1F4F7} *\u0645\u0644\u0627\u062D\u0638\u0629:* \u0633\u0623\u0631\u0641\u0642 \u0644\u0643\u0645 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0645\u0628\u0627\u0634\u0631\u0629." : null
  ].filter(Boolean).join("\n");
  const whatsappHref = `https://wa.me/${activeWhatsApp}?text=${encodeURIComponent(
    whatsappMessage
  )}`;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#C6A355]/35 text-xs font-bold text-[#1A1617] hover:bg-[#FAF8F5] transition-all active:scale-95 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[#5E1734]" }),
            /* @__PURE__ */ jsx("span", { children: "\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u062A\u062C\u0631" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-[11px] font-extrabold text-[#5E1734] tabular-nums", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "\u062A\u0641\u0635\u064A\u0644 \u062E\u0627\u0635 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628 \xB7 \u0645\u0646 ",
          estimatePrice.toLocaleString("en-US"),
          " \u062F\u062C"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-3xl border border-[#C6A355]/30 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/30 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold text-[#5E1734]", children: "1. \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0623\u0648 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u0631\u062C\u0639\u064A" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#65525A]", children: "\u0636\u063A\u0637 \u062A\u0644\u0642\u0627\u0626\u064A \u0633\u0631\u064A\u0639 (700px)" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            onChange: handlePhotoUpload,
            className: "hidden"
          }
        ),
        modelImage ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#C6A355]/20 p-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: modelImage,
              alt: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629",
              className: "w-full h-full object-cover object-center p-0"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                disabled: isCompressing,
                className: "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#C6A355]/45 text-xs font-bold text-[#1A1617] hover:bg-[#F3EDE2] cursor-pointer transition-colors",
                children: [
                  /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4 text-[#5E1734]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setModelImage(""),
                className: "inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-bold text-[#BE123C] hover:bg-[#FFE4E6] cursor-pointer transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641" })
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            disabled: isCompressing,
            className: "w-full aspect-[4/3] sm:aspect-[4/4] rounded-2xl border-2 border-dashed border-[#C6A355]/55 bg-white hover:bg-[#FAF8F5] flex flex-col items-center justify-center gap-3 p-6 text-center transition-colors cursor-pointer",
            children: isCompressing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-[#5E1734]" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734]", children: "\u062C\u0627\u0631\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u0636\u063A\u0637 \u0627\u0644\u0635\u0648\u0631\u0629..." })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-4xl leading-none", "aria-hidden": "true", children: "\u{1F4F7}\u2728" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-extrabold text-[#1A1617]", children: "\u0627\u0636\u063A\u0637 \u0644\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0645\u0646 \u062C\u0647\u0627\u0632\u0643" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] leading-relaxed", children: "\u0623\u0631\u0633\u0644 \u0623\u064A \u0635\u0648\u0631\u0629 \u0645\u0646 \u0647\u0627\u062A\u0641\u0643\u060C \u0628\u0646\u062A\u0631\u0633\u062A \u0623\u0648 \u062A\u0635\u0645\u064A\u0645 \u062E\u0627\u0635 \u0648\u0633\u0646\u0642\u0648\u0645 \u0628\u062A\u0641\u0635\u064A\u0644\u0647 \u0648\u062A\u0637\u0631\u064A\u0632\u0647 \u0628\u062F\u0642\u0629." })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5E1734] text-white text-xs font-bold shadow-xs", children: [
                /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "\u0627\u062E\u062A\u064A\u0627\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644" })
              ] })
            ] })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 flex flex-col justify-between space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/35 text-[11px] font-bold text-[#5E1734] mb-2", children: "\u062A\u0641\u0635\u064A\u0644 \u062E\u0627\u0635 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628" }),
            /* @__PURE__ */ jsx("h2", { className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617]", children: "\u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0623\u0648 \u0623\u064A \u062A\u0635\u0645\u064A\u0645 \u062A\u0631\u064A\u062F\u0647" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-[#65525A] mt-1.5 leading-relaxed", children: "\u062D\u062F\u0651\u062F \u0627\u0644\u0644\u0648\u0646 \u0648\u0627\u0644\u0645\u0642\u0627\u0633 \u0648\u0646\u0635\u0648\u0635 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0641\u064A \u0627\u0644\u062C\u0647\u062A\u064A\u0646\u060C \u062B\u0645 \u0623\u0636\u0641\u0647 \u0644\u0644\u062D\u0642\u064A\u0628\u0629 \u0623\u0648 \u0623\u0631\u0633\u0644\u0647 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0646\u0647\u0627\u0626\u064A." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-extrabold text-[#1A1617]", children: [
              "2. \u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u0637\u0644\u0648\u0628:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[#5E1734]", children: desiredColor })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: stoleColors.map((sw) => {
              const active = desiredColor === sw.name;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setDesiredColor(sw.name),
                  title: sw.name,
                  className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${active ? "bg-[#5E1734] text-white border-[#5E1734] shadow-xs" : "bg-[#FAF8F5] text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "w-3.5 h-3.5 rounded-full border border-white/70 shadow-2xs shrink-0",
                        style: { backgroundColor: sw.hex }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: sw.name })
                  ]
                },
                sw.name
              );
            }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: customColorNote,
                onChange: (e) => setCustomColorNote(e.target.value),
                placeholder: "\u0623\u0648 \u0627\u0643\u062A\u0628 \u062F\u0631\u062C\u0629 \u0644\u0648\u0646 \u0623\u062E\u0631\u0649 (\u0645\u062B\u0627\u0644: \u0646\u0641\u0633 \u0644\u0648\u0646 \u0627\u0644\u0635\u0648\u0631\u0629 / \u0628\u0648\u0631\u062F\u0648 \u0641\u0627\u062A\u062D \u0645\u0639 \u0630\u0647\u0628\u064A)...",
                className: "w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-extrabold text-[#1A1617]", children: "3. \u0627\u0644\u0645\u0642\u0627\u0633 \u0627\u0644\u0645\u0637\u0644\u0648\u0628" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: CUSTOM_SIZE_OPTIONS.map((sz) => {
              const active = sizeSelection === sz;
              return /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSizeSelection(sz),
                  className: `px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${active ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-[#FAF8F5] text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                  children: sz
                },
                sz
              );
            }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: sizeSelection,
                onChange: (e) => setSizeSelection(e.target.value),
                placeholder: "\u0627\u0643\u062A\u0628 \u0645\u0642\u0627\u0633\u0627\u064B \u0645\u062E\u0635\u0635\u0627\u064B \u0623\u0648 \u0627\u0644\u0637\u0648\u0644 \u0628\u0627\u0644\u0633\u0646\u062A\u064A\u0645\u062A\u0631 \u0625\u0630\u0627 \u0631\u063A\u0628\u062A...",
                className: "w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "custom-model-right-text",
                  className: "block text-xs font-extrabold text-[#1A1617]",
                  children: "4. \u0646\u0635 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649)"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "custom-model-right-text",
                  type: "text",
                  value: rightText,
                  onChange: (e) => setRightText(e.target.value),
                  placeholder: "\u0645\u062B\u0627\u0644: \u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u062A\u062E\u0635\u0635...",
                  className: "w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "custom-model-left-text",
                  className: "block text-xs font-extrabold text-[#1A1617]",
                  children: "\u0646\u0635 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649)"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "custom-model-left-text",
                  type: "text",
                  value: leftText,
                  onChange: (e) => setLeftText(e.target.value),
                  placeholder: "\u0645\u062B\u0627\u0644: Promotion 2026 / \u0627\u0633\u0645 \u0627\u0644\u062C\u0627\u0645\u0639\u0629...",
                  className: "w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "custom-model-notes",
                className: "block text-xs font-extrabold text-[#1A1617]",
                children: "5. \u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0644\u062A\u0641\u0635\u064A\u0644"
              }
            ),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "custom-model-notes",
                rows: 3,
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "\u0645\u062B\u0627\u0644: \u0646\u0648\u0639 \u0627\u0644\u0642\u0645\u0627\u0634 \u0627\u0644\u0645\u0641\u0636\u0644 (\u0643\u0631\u064A\u0628 \u0623\u0648 \u062F\u0627\u0646)\u060C \u0625\u0636\u0627\u0641\u0629 \u062F\u0627\u0646\u062A\u064A\u0644 \u0623\u0648 \u062E\u064A\u0648\u0637 \u0645\u0639\u064A\u0646\u0629\u060C \u0637\u0644\u0628 \u0642\u0628\u0639\u0629 \u0645\u0637\u0627\u0628\u0642\u0629\u060C \u0623\u0648 \u0623\u064A \u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0635\u0648\u0631\u0629...",
                className: "w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734] resize-y"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[#C6A355]/25 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/30 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-bold text-[#65525A]", children: "\u0627\u0644\u062A\u0642\u062F\u064A\u0631 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A \u0644\u0644\u062A\u0641\u0635\u064A\u0644 \u0627\u0644\u062E\u0627\u0635" }),
              editingPrice && isAdminMode && onUpdateEstimatePrice ? /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSaveEstimatePrice,
                  className: "mt-1 inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#C6A355]/60",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        step: 50,
                        autoFocus: true,
                        value: priceDraft,
                        onChange: (e) => setPriceDraft(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Escape") setEditingPrice(false);
                        },
                        className: "w-24 px-2 py-0.5 rounded-lg border border-[#C6A355]/45 bg-[#FAF8F5] text-sm font-extrabold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#65525A]", children: "\u062F\u062C" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: savingPrice,
                        className: "px-2.5 py-0.5 rounded-lg bg-[#147A53] text-white text-xs font-bold cursor-pointer",
                        children: "\u062D\u0641\u0638"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditingPrice(false),
                        "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                        className: "w-6 h-6 rounded-lg bg-[#FAF8F5] border border-[#C6A355]/35 text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-base sm:text-lg font-extrabold text-[#5E1734] tabular-nums", children: [
                  "\u064A\u064F\u062D\u062F\u0651\u062F \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0646\u0647\u0627\u0626\u064A \u0623\u0648 \u064A\u0628\u062F\u0623 \u0645\u0646 ",
                  estimatePrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                isAdminMode && onUpdateEstimatePrice && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setPriceDraft(String(estimatePrice));
                      setEditingPrice(true);
                    },
                    title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631",
                    "aria-label": "\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0627\u0644\u062E\u0627\u0635",
                    className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-white hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-xs cursor-pointer shadow-2xs",
                    children: "\u270F\uFE0F"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u064A\u064F\u0631\u0627\u062C\u0639 \u0645\u0639\u0643 \u0642\u0628\u0644 \u0627\u0644\u0628\u062F\u0621 \u0628\u0627\u0644\u062A\u0646\u0641\u064A\u0630" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleAdd,
                className: "cta-luxury-shimmer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer",
                children: addedFeedback ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u0645\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u062D\u0642\u064A\u0628\u0629" })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u062D\u0642\u064A\u0628\u0629" })
                ] })
              }
            ),
            onExpressCheckout && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleExpressOrder,
                className: "inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[#5E1734] text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-[#C6A355]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646 \u0645\u0628\u0627\u0634\u0631\u0629" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: whatsappHref,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#147A53] hover:bg-[#0F6142] text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95",
              children: [
                /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "\u0623\u0631\u0633\u0644 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0623\u0648 \u0627\u0633\u062A\u0641\u0633\u0631 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628" })
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CustomModelRequestCard,
  CustomModelRequestView
};
