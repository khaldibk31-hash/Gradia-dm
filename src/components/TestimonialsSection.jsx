import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquarePlus,
  Quote,
  Star,
  Trash2,
  X
} from "lucide-react";
import { ALGERIA_WILAYAS } from "../data/defaultStore";
import { EditableText, SectionHideButton, useStoreEdit } from "./EditableText";
const RATING_LABELS = {
  1: "1 / 5 \xB7 \u0636\u0639\u064A\u0641",
  2: "2 / 5 \xB7 \u0645\u0642\u0628\u0648\u0644",
  3: "3 / 5 \xB7 \u062C\u064A\u062F",
  4: "4 / 5 \xB7 \u062C\u064A\u062F \u062C\u062F\u0627\u064B",
  5: "5 / 5 \xB7 \u0645\u0645\u062A\u0627\u0632"
};
function TestimonialsSection({
  testimonials,
  isAdminMode,
  onSubmitReview,
  onDeleteReview,
  onNotify
}) {
  const items = testimonials;
  const [pageIndex, setPageIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState("");
  const [customerRating, setCustomerRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [items.length, pageIndex, totalPages]);
  const visibleItems = showAll ? items : items.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  const avgRating = items.length > 0 ? (items.reduce((sum, item) => sum + (item.rating || 5), 0) / items.length).toFixed(1) : "5.0";
  const activeStarValue = hoverRating ?? customerRating;
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644.");
      return;
    }
    if (!customerWilaya.trim()) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0648\u0644\u0627\u064A\u062A\u0643.");
      return;
    }
    if (!customerComment.trim() || customerComment.trim().length < 5) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0631\u0623\u064A\u0643 \u0648\u062A\u062C\u0631\u0628\u062A\u0643 \u0628\u0634\u0643\u0644 \u0648\u0627\u0636\u062D.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitReview({
        name: customerName.trim(),
        wilaya: customerWilaya.trim(),
        rating: customerRating,
        comment: customerComment.trim()
      });
      setCustomerName("");
      setCustomerWilaya("");
      setCustomerRating(5);
      setHoverRating(null);
      setCustomerComment("");
      setFormOpen(false);
      setPageIndex(0);
      onNotify("success", "\u0634\u0643\u0631\u0627\u064B \u0644\u0645\u0634\u0627\u0631\u0643\u062A\u0643! \u062A\u0645 \u0646\u0634\u0631 \u062A\u0642\u064A\u064A\u0645\u0643 \u0628\u0646\u062C\u0627\u062D.");
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u062D\u0627\u0644\u064A\u0627\u064B. \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649."
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!onDeleteReview) return;
    setDeletingId(id);
    try {
      await onDeleteReview(id);
      onNotify("info", "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062A\u0642\u064A\u064A\u0645.");
    } finally {
      setDeletingId(null);
    }
  };
  const { hiddenSections } = useStoreEdit();
  const isSectionHidden = Boolean(hiddenSections.testimonials);
  if (isSectionHidden && !isAdminMode) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "testimonials-sec",
      className: "py-14 sm:py-16 border-t border-[#C6A355]/25 bg-gradient-to-b from-[#FAF8F5] to-white",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6", children: [
        isAdminMode && /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C6A355]/20", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734]", children: isSectionHidden ? "\u0642\u0633\u0645 \xAB\u0622\u0631\u0627\u0621 \u0648\u062A\u062C\u0627\u0631\u0628 \u062E\u0631\u064A\u062C\u064A\u0646\u0627\xBB \u0645\u062E\u0641\u064A \u062D\u0627\u0644\u064A\u0627\u064B \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646" : "\u0642\u0633\u0645: \u0622\u0631\u0627\u0621 \u0648\u062A\u062C\u0627\u0631\u0628 \u062E\u0631\u064A\u062C\u064A\u0646\u0627" }),
          /* @__PURE__ */ jsx(
            SectionHideButton,
            {
              sectionKey: "testimonials",
              label: "\u0622\u0631\u0627\u0621 \u0648\u062A\u062C\u0627\u0631\u0628 \u062E\u0631\u064A\u062C\u064A\u0646\u0627"
            }
          )
        ] }),
        !isSectionHidden && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#5E1734] mb-3", children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "testimonials.badge",
                    defaultText: "\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u062D\u0642\u064A\u0642\u064A\u0629 \u0645\u0646 \u0632\u0628\u0627\u0626\u0646\u0646\u0627",
                    compact: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                EditableText,
                {
                  textKey: "testimonials.title",
                  defaultText: "\u0622\u0631\u0627\u0621 \u0648\u062A\u062C\u0627\u0631\u0628 \u062E\u0631\u064A\u062C\u064A\u0646\u0627",
                  as: "h2",
                  className: "font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1617] leading-tight"
                }
              ),
              /* @__PURE__ */ jsx(
                EditableText,
                {
                  textKey: "testimonials.subtitle",
                  defaultText: "\u0634\u0627\u0631\u0643\u0646\u0627 \u062A\u062C\u0631\u0628\u062A\u0643 \u0645\u0639 \u0637\u0642\u0645 \u0627\u0644\u062A\u062E\u0631\u062C \u0648\u062C\u0648\u062F\u0629 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u2014 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u0647\u0646\u0627 \u0645\u0643\u062A\u0648\u0628\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0637\u0631\u0641 \u0632\u0628\u0627\u0626\u0646\u0646\u0627.",
                  as: "p",
                  multiline: true,
                  className: "text-sm text-[#65525A] mt-2 leading-relaxed"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 shrink-0", children: [
              items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#C6A355]/40 shadow-2xs", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5 text-[#C6A355]", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current" }, star)) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-extrabold text-[#1A1617] tabular-nums", children: [
                  avgRating,
                  " / 5"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-[#65525A] tabular-nums", children: [
                  "(",
                  items.length,
                  " \u062A\u0642\u064A\u064A\u0645)"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFormOpen((prev) => !prev),
                  className: "cta-luxury-shimmer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold shadow-xs transition-all cursor-pointer touch-manipulation active:scale-95",
                  children: formOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0646\u0645\u0648\u0630\u062C" })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(MessageSquarePlus, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                    /* @__PURE__ */ jsx(
                      EditableText,
                      {
                        textKey: "testimonials.ctaBtn",
                        defaultText: "\u0623\u0636\u0641 \u062A\u0642\u064A\u064A\u0645\u0643 \u0627\u0644\u0622\u0646",
                        compact: true,
                        darkSurface: true
                      }
                    )
                  ] })
                }
              )
            ] })
          ] }),
          formOpen && /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white border border-[#C6A355]/45 rounded-2xl p-5 sm:p-6 shadow-md", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#C6A355]/25", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#5E1734]", children: "\u0634\u0627\u0631\u0643\u0646\u0627 \u0631\u0623\u064A\u0643 \u0648\u062A\u062C\u0631\u0628\u062A\u0643" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A] mt-0.5", children: "\u0631\u0623\u064A\u0643 \u064A\u0633\u0627\u0639\u062F \u062E\u0631\u064A\u062C\u064A\u0646 \u0622\u062E\u0631\u064A\u0646 \u0641\u064A \u0627\u062E\u062A\u064A\u0627\u0631 \u0637\u0642\u0645 \u062A\u062E\u0631\u062C\u0647\u0645 \u0628\u062B\u0642\u0629." })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFormOpen(false),
                  "aria-label": "\u0625\u063A\u0644\u0627\u0642",
                  className: "p-1.5 rounded-lg text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5] cursor-pointer",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleCustomerSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      maxLength: 80,
                      value: customerName,
                      onChange: (e) => setCustomerName(e.target.value),
                      placeholder: "\u0645\u062B\u0627\u0644: \u0633\u0627\u0631\u0629 \u0628\u0646 \u0639\u0644\u064A",
                      className: "w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5] text-sm text-[#1A1617] placeholder:text-[#96838A] focus:outline-none focus:border-[#5E1734]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0648\u0644\u0627\u064A\u0629 *" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: customerWilaya,
                      onChange: (e) => setCustomerWilaya(e.target.value),
                      className: "w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5] text-sm text-[#1A1617] focus:outline-none focus:border-[#5E1734]",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "-- \u0627\u062E\u062A\u0631 \u0648\u0644\u0627\u064A\u062A\u0643 --" }),
                        ALGERIA_WILAYAS.map((w) => /* @__PURE__ */ jsx("option", { value: w, children: w }, w))
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u062A\u0642\u064A\u064A\u0645\u0643 \u0627\u0644\u0639\u0627\u0645 *" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/40",
                      onMouseLeave: () => setHoverRating(null),
                      children: [1, 2, 3, 4, 5].map((star) => {
                        const filled = star <= activeStarValue;
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onMouseEnter: () => setHoverRating(star),
                            onClick: () => setCustomerRating(star),
                            "aria-label": `${star} \u0646\u062C\u0648\u0645`,
                            className: "p-0.5 transition-transform hover:scale-110 cursor-pointer",
                            children: /* @__PURE__ */ jsx(
                              Star,
                              {
                                className: `w-5 h-5 ${filled ? "fill-[#C6A355] text-[#C6A355]" : "text-[#D6C7CE]"}`
                              }
                            )
                          },
                          star
                        );
                      })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734]", children: RATING_LABELS[activeStarValue] || "5 / 5 \xB7 \u0645\u0645\u062A\u0627\u0632" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0631\u0623\u064A\u0643 \u0648\u062A\u062C\u0631\u0628\u062A\u0643 *" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    rows: 3,
                    maxLength: 600,
                    value: customerComment,
                    onChange: (e) => setCustomerComment(e.target.value),
                    placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0646\u0637\u0628\u0627\u0639\u0643 \u062D\u0648\u0644 \u062C\u0648\u062F\u0629 \u0627\u0644\u0642\u0645\u0627\u0634\u060C \u0627\u0644\u062A\u0637\u0631\u064A\u0632\u060C \u0648\u0633\u0631\u0639\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644...",
                    className: "w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5] text-sm text-[#1A1617] placeholder:text-[#96838A] focus:outline-none focus:border-[#5E1734]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2.5 pt-1", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "submit",
                    disabled: submitting,
                    className: "cta-luxury-shimmer inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer",
                    children: [
                      submitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#C6A355]" }),
                      /* @__PURE__ */ jsx("span", { children: submitting ? "\u062C\u0627\u0631\u064A \u0627\u0644\u0646\u0634\u0631..." : "\u0646\u0634\u0631 \u0627\u0644\u062A\u0642\u064A\u064A\u0645" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFormOpen(false),
                    className: "py-2.5 px-5 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/40 hover:bg-[#F4EFE6] text-[#1A1617] text-sm font-semibold cursor-pointer",
                    children: "\u0625\u0644\u063A\u0627\u0621"
                  }
                )
              ] })
            ] })
          ] }),
          items.length === 0 ? !formOpen && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-dashed border-[#C6A355]/45 rounded-2xl p-8 text-center space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-[#5E1734] flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-[#C6A355]" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#1A1617]", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0645\u0646\u0634\u0648\u0631\u0629 \u0628\u0639\u062F" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A] max-w-md mx-auto", children: "\u0647\u0644 \u0627\u0633\u062A\u0644\u0645\u062A \u0637\u0644\u0628\u0643 \u0645\u0646 DG by Douaa\u061F \u0634\u0627\u0631\u0643\u0646\u0627 \u0631\u0623\u064A\u0643 \u0627\u0644\u062D\u0642\u064A\u0642\u064A \u062D\u0648\u0644 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644." }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setFormOpen(true),
                className: "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95",
                children: [
                  /* @__PURE__ */ jsx(MessageSquarePlus, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0627\u0643\u062A\u0628 \u0623\u0648\u0644 \u062A\u0642\u064A\u064A\u0645" })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: visibleItems.map((review) => {
              const initial = review.name.trim().charAt(0) || "\u062E";
              return /* @__PURE__ */ jsxs(
                "article",
                {
                  className: "relative bg-white border border-[#C6A355]/35 rounded-2xl p-6 shadow-2xs luxury-card-lift hover:border-[#C6A355]/75 flex flex-col justify-between gap-5",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "flex items-center gap-1 text-[#C6A355]",
                            "aria-label": `\u062A\u0642\u064A\u064A\u0645 ${review.rating} \u0645\u0646 5`,
                            children: Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ jsx(
                              Star,
                              {
                                className: `w-4 h-4 ${idx < (review.rating || 5) ? "fill-current text-[#C6A355]" : "text-[#E8DFD1]"}`
                              },
                              idx
                            ))
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#C6A355]/35 flex items-center justify-center text-[#5E1734]/80 shrink-0", children: /* @__PURE__ */ jsx(Quote, { className: "w-4 h-4" }) })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#1A1617] leading-relaxed", children: [
                        "\xAB",
                        review.comment,
                        "\xBB"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-[#C6A355]/25", children: [
                      (review.productTag || review.dateLabel) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                        review.productTag && /* @__PURE__ */ jsx("span", { className: "inline-block px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-[11px] font-bold text-[#5E1734]", children: review.productTag }),
                        review.dateLabel && /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[10px] font-bold text-[#65525A]", children: review.dateLabel })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-[#5E1734] font-editorial font-bold text-base flex items-center justify-center shrink-0", children: initial }),
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#1A1617] truncate", children: review.name }),
                            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[#65525A]", children: [
                              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-[#5E1734]", children: [
                                /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 shrink-0 text-[#C6A355]" }),
                                /* @__PURE__ */ jsx("span", { children: review.wilaya })
                              ] }),
                              review.university && /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                                "\xB7 ",
                                review.university
                              ] })
                            ] })
                          ] })
                        ] }),
                        isAdminMode && onDeleteReview && /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => void handleDelete(review.id),
                            disabled: deletingId === review.id,
                            title: "\u062D\u0630\u0641 \u0627\u0644\u062A\u0642\u064A\u064A\u0645",
                            "aria-label": `\u062D\u0630\u0641 \u062A\u0642\u064A\u064A\u0645 ${review.name}`,
                            className: "p-1.5 rounded-lg bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] cursor-pointer disabled:opacity-50 shrink-0",
                            children: deletingId === review.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                          }
                        )
                      ] })
                    ] })
                  ]
                },
                review.id
              );
            }) }),
            items.length > pageSize && /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap items-center justify-between gap-4", children: [
              !showAll ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPageIndex((prev) => (prev - 1 + totalPages) % totalPages),
                    "aria-label": "\u0627\u0644\u0622\u0631\u0627\u0621 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
                    className: "w-9 h-9 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#C6A355]/40 text-[#5E1734] flex items-center justify-center transition-colors cursor-pointer",
                    children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 px-2", children: Array.from({ length: totalPages }).map((_, idx) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPageIndex(idx),
                    "aria-label": `\u0635\u0641\u062D\u0629 \u0627\u0644\u0622\u0631\u0627\u0621 ${idx + 1}`,
                    className: `h-2 rounded-full transition-all cursor-pointer ${pageIndex === idx ? "w-6 bg-[#5E1734]" : "w-2 bg-[#C6A355]/35 hover:bg-[#5E1734]/50"}`
                  },
                  idx
                )) }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPageIndex((prev) => (prev + 1) % totalPages),
                    "aria-label": "\u0627\u0644\u0622\u0631\u0627\u0621 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
                    className: "w-9 h-9 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#C6A355]/40 text-[#5E1734] flex items-center justify-center transition-colors cursor-pointer",
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsx("div", {}),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAll((prev) => !prev),
                  className: "text-xs font-bold text-[#5E1734] hover:underline cursor-pointer",
                  children: showAll ? "\u0639\u0631\u0636 \u0639\u0644\u0649 \u0634\u0643\u0644 \u0634\u0631\u0627\u0626\u062D" : `\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u0622\u0631\u0627\u0621 (${items.length})`
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  TestimonialsSection
};
