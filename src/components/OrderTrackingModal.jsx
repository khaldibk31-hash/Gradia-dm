import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Loader2,
  MapPin,
  PackageCheck,
  PackageSearch,
  Phone,
  Scissors,
  Search,
  Sparkles,
  Truck,
  Wallet,
  X,
  XCircle
} from "lucide-react";
import { WHATSAPP_NUMBER, formatWhatsAppNumber } from "../data/defaultStore";
import {
  lookupCustomerOrdersByPhone
} from "../lib/supabase";
const TRACKING_STEPS = [
  {
    step: 1,
    title: "\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0644\u0628",
    subtitle: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0637\u0644\u0628\u0643 \u0648\u0645\u0631\u0627\u062C\u0639\u062A\u0647 \u0645\u0646 \u0641\u0631\u064A\u0642 \u0627\u0644\u062F\u0627\u0631",
    Icon: ClipboardCheck
  },
  {
    step: 2,
    title: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632",
    subtitle: "\u064A\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0642\u0645\u0627\u0634 \u0648\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0634\u0639\u0627\u0631 \u0628\u062F\u0642\u0629",
    Icon: Scissors
  },
  {
    step: 3,
    title: "\u062A\u0645 \u0627\u0644\u0634\u062D\u0646 \u0645\u0639 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644",
    subtitle: "\u0637\u0644\u0628\u0643 \u0641\u064A \u0637\u0631\u064A\u0642\u0647 \u0625\u0644\u0649 \u0648\u0644\u0627\u064A\u062A\u0643 \u0645\u0639 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644",
    Icon: Truck
  },
  {
    step: 4,
    title: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
    subtitle: "\u0646\u062A\u0645\u0646\u0649 \u0644\u0643 \u062D\u0641\u0644 \u062A\u062E\u0631\u062C \u0645\u0644\u064A\u0626\u0627\u064B \u0628\u0627\u0644\u0641\u062E\u0631 \u0648\u0627\u0644\u0623\u0646\u0627\u0642\u0629",
    Icon: PackageCheck
  }
];
function resolveOrderStage(status) {
  const normalized = (status || "").trim().toLowerCase();
  if (normalized === "\u0645\u0644\u063A\u0649" || normalized === "cancelled" || normalized === "canceled") {
    return { step: 1, isCancelled: true, label: "\u0645\u0644\u063A\u0649" };
  }
  if (normalized === "\u0645\u0643\u062A\u0645\u0644" || normalized === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645" || normalized === "delivered" || normalized === "completed") {
    return {
      step: 4,
      isCancelled: false,
      label: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D"
    };
  }
  if (normalized === "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644" || normalized === "\u062A\u0645 \u0627\u0644\u0634\u062D\u0646" || normalized === "shipped") {
    return {
      step: 3,
      isCancelled: false,
      label: "\u062A\u0645 \u0627\u0644\u0634\u062D\u0646 \u0645\u0639 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644"
    };
  }
  if (normalized === "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631" || normalized === "\u0645\u0624\u0643\u062F" || normalized === "confirmed" || normalized === "in_progress") {
    return {
      step: 2,
      isCancelled: false,
      label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632"
    };
  }
  return {
    step: 1,
    isCancelled: false,
    label: "\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0644\u0628"
  };
}
function getTrackedOrderItems(order) {
  if (Array.isArray(order.product_details?.items) && order.product_details.items.length > 0) {
    return order.product_details.items;
  }
  if (Array.isArray(order.order_items) && order.order_items.length > 0) {
    return order.order_items;
  }
  return [];
}
function getTrackedOrderPaid(order) {
  const raw = order.paid_amount ?? order.product_details?.paid_amount ?? 0;
  const num = Number(raw);
  return Number.isFinite(num) ? Math.max(0, num) : 0;
}
function isSafeLogoUrl(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(trimmed) || /^https?:\/\/\S+$/i.test(trimmed);
}
function OrderTrackingModal({
  isOpen,
  whatsappNumber = WHATSAPP_NUMBER,
  onClose
}) {
  const [phoneInput, setPhoneInput] = useState("");
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedOrders, setMatchedOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  if (!isOpen) return null;
  const activeOrder = matchedOrders.find((o) => o.id === selectedOrderId) || matchedOrders[0] || null;
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const results = await lookupCustomerOrdersByPhone(
        phoneInput,
        orderNumberInput
      );
      setMatchedOrders(results);
      setSelectedOrderId(results[0]?.id || null);
      setHasSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0637\u0644\u0628. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641."
      );
      setMatchedOrders([]);
      setSelectedOrderId(null);
    } finally {
      setLoading(false);
    }
  };
  const stage = activeOrder ? resolveOrderStage(activeOrder.status) : null;
  const totalSell = activeOrder ? Number(activeOrder.total_sell_price || 0) : 0;
  const paidAmount = activeOrder ? getTrackedOrderPaid(activeOrder) : 0;
  const remainingAmount = Math.max(0, totalSell - paidAmount);
  const items = activeOrder ? getTrackedOrderItems(activeOrder) : [];
  const deliveryDate = activeOrder?.product_details?.deliveryDate || "";
  const notes = activeOrder?.product_details?.notes || "";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1A1617]/50 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\u062A\u062A\u0628\u0639 \u062D\u0627\u0644\u0629 \u0637\u0644\u0628\u0643",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-[#FAF8F5] border border-[#C6A355]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#1A1617]",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-white border-b border-[#C6A355]/30 flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 flex items-center justify-center text-[#5E1734] shrink-0", children: /* @__PURE__ */ jsx(PackageSearch, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-editorial text-lg sm:text-xl font-bold text-[#1A1617] leading-tight", children: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u0643 \u0645\u0628\u0627\u0634\u0631\u0629" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A]", children: "\u062A\u0627\u0628\u0639\u064A \u0645\u0631\u0627\u062D\u0644 \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0648\u0627\u0644\u0634\u062D\u0646 \u062E\u0637\u0648\u0629 \u0628\u062E\u0637\u0648\u0629" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0646\u0627\u0641\u0630\u0629 \u062A\u062A\u0628\u0639 \u0627\u0644\u0637\u0644\u0628",
                  className: "p-1.5 rounded-xl text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5] transition-colors cursor-pointer",
                  children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-5", children: [
              /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSearch,
                  className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 shadow-2xs space-y-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-12 gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-6", children: [
                        /* @__PURE__ */ jsx(
                          "label",
                          {
                            htmlFor: "track-phone-input",
                            className: "block text-xs font-bold text-[#65525A] mb-1",
                            children: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u0633\u062C\u0651\u0644 \u0641\u064A \u0627\u0644\u0637\u0644\u0628 *"
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-[#5E1734] absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              id: "track-phone-input",
                              type: "tel",
                              dir: "ltr",
                              value: phoneInput,
                              onChange: (e) => {
                                setPhoneInput(e.target.value);
                                if (error) setError("");
                              },
                              placeholder: "0555 12 34 56",
                              className: "w-full py-2.5 pr-9 pl-3 text-right rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-sm font-bold text-[#1A1617] placeholder:text-[#8C7780] placeholder:font-normal"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-3", children: [
                        /* @__PURE__ */ jsx(
                          "label",
                          {
                            htmlFor: "track-order-num-input",
                            className: "block text-xs font-bold text-[#65525A] mb-1",
                            children: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 # (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            id: "track-order-num-input",
                            type: "text",
                            inputMode: "numeric",
                            dir: "ltr",
                            value: orderNumberInput,
                            onChange: (e) => setOrderNumberInput(e.target.value),
                            placeholder: "#1024",
                            className: "w-full px-3 py-2.5 text-right rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-sm font-bold text-[#1A1617] tabular-nums placeholder:text-[#8C7780] placeholder:font-normal"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "sm:col-span-3 flex items-end", children: /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: loading,
                          className: "w-full py-2.5 px-4 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 disabled:opacity-60 cursor-pointer",
                          children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0628\u062D\u062B..." })
                          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062A\u062A\u0628\u0639 \u0627\u0644\u0637\u0644\u0628" })
                          ] })
                        }
                      ) })
                    ] }),
                    error && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#BE123C] bg-[#FFF1F2] border border-[#FECDD3] rounded-xl px-3 py-2", children: error })
                  ]
                }
              ),
              hasSearched && !loading && !error && matchedOrders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-8 text-center space-y-2", children: [
                /* @__PURE__ */ jsx(PackageSearch, { className: "w-9 h-9 text-[#5E1734]/70 mx-auto" }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#1A1617]", children: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0637\u0627\u0628\u0642" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A] max-w-md mx-auto leading-relaxed", children: "\u062A\u0623\u0643\u062F\u064A \u0645\u0646 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0646\u0641\u0633\u0647 \u0627\u0644\u0630\u064A \u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0647 \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628\u060C \u0623\u0648 \u0631\u0627\u0633\u0644\u064A\u0646\u0627 \u0639\u0628\u0631 WhatsApp \u0644\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629." })
              ] }),
              matchedOrders.length > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-[#65525A]", children: [
                  "\u0637\u0644\u0628\u0627\u062A\u0643 \u0627\u0644\u0645\u0633\u062C\u0651\u0644\u0629 (",
                  matchedOrders.length,
                  "):"
                ] }),
                matchedOrders.map((ord) => {
                  const isSelected = ord.id === activeOrder?.id;
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedOrderId(ord.id),
                      className: `px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer tabular-nums ${isSelected ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-[#1A1617] border-[#C6A355]/35 hover:bg-[#FAF8F5]"}`,
                      children: [
                        "\u0637\u0644\u0628 #",
                        ord.order_number
                      ]
                    },
                    ord.id
                  );
                })
              ] }),
              activeOrder && stage && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#C6A355]/25", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                        /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-xs font-extrabold text-[#5E1734] tabular-nums", children: [
                          "\u0637\u0644\u0628 #",
                          activeOrder.order_number
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[#1A1617]", children: activeOrder.customer_name })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#65525A]", children: [
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                          activeOrder.wilaya,
                          activeOrder.commune && activeOrder.commune !== "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629" ? ` - ${activeOrder.commune}` : "",
                          " \xB7 ",
                          activeOrder.delivery_type === "office" ? "\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646 \u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" : "\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0646\u0632\u0644"
                        ] }),
                        deliveryDate && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[#5E1734] font-semibold", children: [
                          /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "\u0645\u0648\u0639\u062F \u0627\u0644\u062A\u062E\u0631\u062C / \u0627\u0644\u062A\u0633\u0644\u064A\u0645: ",
                            deliveryDate
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${stage.isCancelled ? "bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]" : stage.step === 4 ? "bg-[#EBF9F2] border-[#BEEBD4] text-[#147A53]" : "bg-[#FAF8F5] border-[#C6A355]/45 text-[#5E1734]"}`,
                        children: [
                          stage.isCancelled ? /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5" }) : stage.step === 4 ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx("span", { children: stage.label })
                        ]
                      }
                    )
                  ] }),
                  stage.isCancelled ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#FFF1F2] border border-[#FECDD3] p-4 flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx(XCircle, { className: "w-5 h-5 text-[#BE123C] shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-extrabold text-[#BE123C]", children: "\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0644\u063A\u0649 \u062D\u0627\u0644\u064A\u0627\u064B" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A] mt-0.5 leading-relaxed", children: "\u0625\u0630\u0627 \u0643\u0627\u0646 \u0644\u062F\u064A\u0643 \u0623\u064A \u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0623\u0648 \u0631\u063A\u0628\u0629 \u0641\u064A \u0625\u0639\u0627\u062F\u0629 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0637\u0644\u0628\u060C \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u0633\u0644\u062A\u0646\u0627 \u0639\u0628\u0631 WhatsApp." })
                    ] })
                  ] }) : /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2 relative", children: TRACKING_STEPS.map((item, idx) => {
                    const isCompleted = stage.step > item.step || stage.step === 4 && item.step === 4;
                    const isCurrent = stage.step === item.step && stage.step < 4;
                    const isActiveOrDone = stage.step >= item.step;
                    const StepIcon = item.Icon;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `relative flex sm:flex-col items-start sm:items-center sm:text-center gap-3 sm:gap-2 p-2.5 sm:p-2 rounded-2xl transition-colors ${isCurrent ? "bg-[#FAF8F5] border border-[#C6A355]/45" : "border border-transparent"}`,
                        children: [
                          idx < TRACKING_STEPS.length - 1 && /* @__PURE__ */ jsx(
                            "div",
                            {
                              "aria-hidden": "true",
                              className: `hidden sm:block absolute top-7 -left-1/2 w-full h-0.5 -z-0 ${stage.step > item.step ? "bg-[#5E1734]" : "bg-[#C6A355]/35"}`
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${isCompleted ? "bg-[#5E1734] border-[#5E1734] text-white shadow-sm" : isCurrent ? "bg-white border-[#5E1734] text-[#5E1734] ring-4 ring-[#C6A355]/20" : "bg-[#FAF8F5] border-[#C6A355]/35 text-[#8C7780]"}`,
                              children: isCompleted ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(StepIcon, { className: "w-4 h-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsx(
                              "p",
                              {
                                className: `text-xs font-extrabold leading-snug ${isActiveOrDone ? "text-[#1A1617]" : "text-[#8C7780]"}`,
                                children: item.title
                              }
                            ),
                            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] mt-0.5 leading-relaxed", children: item.subtitle })
                          ] })
                        ]
                      },
                      item.step
                    );
                  }) }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-extrabold text-[#5E1734]", children: [
                    /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0645\u0644\u062E\u0635 \u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0639\u0631\u0628\u0648\u0646" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/30 p-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A]", children: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064A" }),
                      /* @__PURE__ */ jsxs("p", { className: "text-base font-extrabold text-[#1A1617] mt-0.5 tabular-nums", children: [
                        totalSell.toLocaleString("en-US"),
                        " \u062F\u062C"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/45 p-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A]", children: "\u0627\u0644\u0639\u0631\u0628\u0648\u0646 / \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639" }),
                      /* @__PURE__ */ jsxs("p", { className: "text-base font-extrabold text-[#5E1734] mt-0.5 tabular-nums", children: [
                        paidAmount.toLocaleString("en-US"),
                        " \u062F\u062C"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `rounded-2xl border p-3 ${remainingAmount === 0 ? "bg-[#EBF9F2] border-[#BEEBD4]" : "bg-[#FAF8F5] border-[#C6A355]/30"}`,
                        children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A]", children: "\u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0639\u0646\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645" }),
                          /* @__PURE__ */ jsx(
                            "p",
                            {
                              className: `text-base font-extrabold mt-0.5 tabular-nums ${remainingAmount === 0 ? "text-[#147A53]" : "text-[#1A1617]"}`,
                              children: remainingAmount > 0 ? `${remainingAmount.toLocaleString("en-US")} \u062F\u062C` : "\u062E\u0627\u0644\u0635 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u2713"
                            }
                          )
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-extrabold text-[#5E1734]", children: [
                    "\u0645\u0644\u062E\u0635 \u0627\u0644\u0642\u0637\u0639 \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629 (",
                    items.length,
                    ")"
                  ] }),
                  items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#C6A355]/25", children: items.map((item, idx) => {
                    const unitPrice = Number(
                      item.unit_price ?? item.unitPrice ?? 0
                    );
                    const qty = item.quantity || 1;
                    const specs = [
                      item.fabric_type ? `\u0627\u0644\u0642\u0645\u0627\u0634: ${item.fabric_type}` : null,
                      item.shawl_color ? `\u0627\u0644\u0644\u0648\u0646: ${item.shawl_color}` : null,
                      item.thread_color ? `\u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${item.thread_color}` : null,
                      item.right_embroidered_text || item.left_embroidered_text ? [
                        item.right_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${item.right_embroidered_text}` : null,
                        item.left_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${item.left_embroidered_text}` : null
                      ].filter(Boolean).join(" | ") : item.embroidered_text ? `\u0627\u0644\u0646\u0635: ${item.embroidered_text}` : null,
                      item.size ? `\u0627\u0644\u0645\u0642\u0627\u0633: ${item.size}` : null,
                      item.cap_style ? `\u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_style}` : null,
                      item.cap_color ? `\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_color}` : null,
                      item.cap_embroidery ? `\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_embroidery}` : null,
                      item.gown_option ? `\u0627\u0644\u0631\u0648\u0628: ${item.gown_option}` : null,
                      item.university_logo ? "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629: \u0645\u0631\u0641\u0642" : null
                    ].filter(Boolean);
                    return /* @__PURE__ */ jsxs("div", { className: "py-2.5 first:pt-0 last:pb-0 space-y-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
                        /* @__PURE__ */ jsxs("span", { className: "font-bold text-[#1A1617]", children: [
                          item.title || item.name || "\u0642\u0637\u0639\u0629 \u0645\u062E\u0635\u0635\u0629",
                          " \xD7",
                          " ",
                          /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: qty })
                        ] }),
                        unitPrice > 0 && /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-[#5E1734] tabular-nums", children: [
                          (unitPrice * qty).toLocaleString("en-US"),
                          " \u062F\u062C"
                        ] })
                      ] }),
                      item.details ? /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] leading-relaxed", children: item.details }) : specs.length > 0 ? /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] leading-relaxed", children: specs.join(" \xB7 ") }) : null,
                      isSafeLogoUrl(item.university_logo) && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 pt-1", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: item.university_logo,
                            alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                            referrerPolicy: "no-referrer",
                            loading: "lazy",
                            decoding: "async",
                            className: "w-6 h-6 rounded-full object-cover border border-[#C6A355]/45 bg-white"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#5E1734]", children: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0645\u0631\u0641\u0642" })
                      ] }),
                      isSafeLogoUrl(item.custom_model_image) && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 pt-1 mr-2", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: item.custom_model_image,
                            alt: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629",
                            referrerPolicy: "no-referrer",
                            loading: "lazy",
                            decoding: "async",
                            className: "w-8 h-8 rounded-lg object-cover border border-[#C6A355]/50 bg-white"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#5E1734]", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u0631\u0641\u0642\u0629" })
                      ] }),
                      Array.isArray(item.excluded_options) && item.excluded_options.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 pt-0.5", children: item.excluded_options.map((excl) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "px-2 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[10px] font-bold text-[#BE123C]",
                          children: excl
                        },
                        excl
                      )) })
                    ] }, idx);
                  }) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A]", children: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645 \u0648\u0633\u064A\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0639\u0628\u0631 WhatsApp." }),
                  notes && /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#7C4A15] bg-[#FFF8EB] border border-[#F5D69E] rounded-lg p-2.5", children: [
                    /* @__PURE__ */ jsx("strong", { children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0637\u0644\u0628:" }),
                    " ",
                    notes
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `https://wa.me/${formatWhatsAppNumber(whatsappNumber)}?text=${encodeURIComponent(
                      `\u0645\u0631\u062D\u0628\u0627\u064B DG by Douaa\u060C \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646 \u062D\u0627\u0644\u0629 \u0637\u0644\u0628\u064A \u0631\u0642\u0645 #${activeOrder.order_number}`
                    )}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] text-white text-xs font-bold transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0628\u0631 WhatsApp \u0639\u0646 \u0627\u0644\u0637\u0644\u0628 #",
                        activeOrder.order_number
                      ] })
                    ]
                  }
                ) })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
export {
  OrderTrackingModal
};
