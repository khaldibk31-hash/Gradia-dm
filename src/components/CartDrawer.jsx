import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { trackMeta } from "@/lib/metaPixel";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  Minus,
  PackageSearch,
  PauseCircle,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  X
} from "lucide-react";
import {
  ALGERIA_WILAYAS,
  DEFAULT_DELIVERY_PRICING,
  DEFAULT_PAUSE_MESSAGE,
  DEFAULT_PAYMENT_INFO,
  DEFAULT_PROMO_SETTINGS,
  WHATSAPP_NUMBER,
  formatWhatsAppNumber,
  getWilayaDeliveryFee
} from "../data/defaultStore";
import {
  compressReceiptImage,
  sendTelegramOrderNotification,
  supabase
} from "../lib/supabase";
function CartDrawer({
  isOpen,
  items,
  ordersPaused = false,
  pauseMessage = DEFAULT_PAUSE_MESSAGE,
  paymentInfo = DEFAULT_PAYMENT_INFO,
  whatsappNumber = WHATSAPP_NUMBER,
  promoSettings = DEFAULT_PROMO_SETTINGS,
  deliveryPricing = DEFAULT_DELIVERY_PRICING,
  telegramEnabled = false,
  telegramBotToken = "",
  telegramChatId = "",
  onOrderSubmitted,
  onOpenOrderTracking,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNotify
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("16 - \u0627\u0644\u062C\u0632\u0627\u0626\u0631");
  const [commune, setCommune] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paidAmountInput, setPaidAmountInput] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [isCompressingReceipt, setIsCompressingReceipt] = useState(false);
  const receiptInputRef = useRef(null);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [generatedOrderText, setGeneratedOrderText] = useState("");
  const [orderNumber, setOrderNumber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);
  const [copiedCcp, setCopiedCcp] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [promoError, setPromoError] = useState("");
  useEffect(() => {
    if (!promoSettings.promoCodeInputEnabled) {
      if (appliedPromoCode) setAppliedPromoCode(null);
      if (promoError) setPromoError("");
      return;
    }
    if (appliedPromoCode) {
      const stillValid = promoSettings.promoCodes.find(
        (c) => c.code.toUpperCase() === appliedPromoCode.code.toUpperCase() && c.active
      );
      if (!stillValid) {
        setAppliedPromoCode(null);
      } else if (stillValid.value !== appliedPromoCode.value || stillValid.type !== appliedPromoCode.type) {
        setAppliedPromoCode(stillValid);
      }
    }
  }, [promoSettings, appliedPromoCode, promoError]);
  const minDateString = useMemo(() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  }, []);
  if (!isOpen) return null;
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const storewidePercent = promoSettings.storewideDiscountPercent === 10 || promoSettings.storewideDiscountPercent === 20 ? promoSettings.storewideDiscountPercent : 0;
  const storewideDiscountAmount = storewidePercent > 0 ? Math.round(subtotal * storewidePercent / 100) : 0;
  const afterStorewide = Math.max(0, subtotal - storewideDiscountAmount);
  const activePromo = promoSettings.promoCodeInputEnabled && appliedPromoCode ? appliedPromoCode : null;
  const promoDiscountAmount = activePromo ? activePromo.type === "percent" ? Math.round(afterStorewide * activePromo.value / 100) : Math.min(afterStorewide, activePromo.value) : 0;
  const totalDiscountAmount = storewideDiscountAmount + promoDiscountAmount;
  const productsTotal = Math.max(0, subtotal - totalDiscountAmount);
  const isDeliveryLocked = Boolean(deliveryPricing?.deliveryLocked);
  const homeDeliveryFee = isDeliveryLocked ? 0 : getWilayaDeliveryFee(deliveryPricing, wilaya, "home");
  const officeDeliveryFee = isDeliveryLocked ? 0 : getWilayaDeliveryFee(deliveryPricing, wilaya, "office");
  const deliveryFee = isDeliveryLocked ? 0 : deliveryMethod === "office" ? officeDeliveryFee : homeDeliveryFee;
  const finalTotal = productsTotal + deliveryFee;
  const deposit50 = Math.round(finalTotal * 0.5);
  const parsedPaidAmount = Math.max(
    0,
    Math.round(Number(paidAmountInput) || 0)
  );
  const remainingBalance = Math.max(0, finalTotal - parsedPaidAmount);
  const handleApplyPromoCode = () => {
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      setPromoError("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636.");
      return;
    }
    const matched = promoSettings.promoCodes.find(
      (c) => c.code.toUpperCase() === cleaned && c.active
    );
    if (!matched) {
      setPromoError("\u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629.");
      return;
    }
    setPromoError("");
    setAppliedPromoCode(matched);
    setGeneratedOrderText("");
    onNotify("success", `\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 ${matched.code} \u0628\u0646\u062C\u0627\u062D!`);
  };
  const buildOrderMessage = (savedOrderNum) => {
    const lines = items.map((it, idx) => {
      const embroiderySidesText = it.rightEmbroideredText || it.leftEmbroideredText ? [
        it.rightEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${it.rightEmbroideredText}` : null,
        it.leftEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${it.leftEmbroideredText}` : null
      ].filter(Boolean).join(" | ") : it.embroideredText ? `\u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${it.embroideredText}` : null;
      const extraParts = [
        it.fabricType ? `\u0627\u0644\u0642\u0645\u0627\u0634: ${it.fabricType}` : null,
        it.shawlColor ? `\u0644\u0648\u0646 \u0627\u0644\u0634\u0627\u0644: ${it.shawlColor}` : null,
        it.threadColor ? `\u0644\u0648\u0646 \u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${it.threadColor}` : null,
        embroiderySidesText,
        it.size ? `\u0627\u0644\u0645\u0642\u0627\u0633: ${it.size}` : null,
        it.capStyle ? `\u0627\u0644\u0642\u0628\u0639\u0629: ${it.capStyle}` : null,
        it.capColor ? `\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629: ${it.capColor}` : null,
        it.capEmbroidery ? `\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ${it.capEmbroidery}` : null,
        it.gownOption ? `\u0627\u0644\u0631\u0648\u0628: ${it.gownOption}` : null,
        it.universityLogo ? `\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629: \u0645\u0631\u0641\u0642 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 (\u0645\u062C\u0627\u0646\u0627\u064B)` : null,
        it.customModelImage ? `\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629: \u0645\u0631\u0641\u0642\u0629 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 \u0641\u064A \u0627\u0644\u0645\u0648\u0642\u0639` : null,
        it.customNotes ? `\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062A\u0641\u0635\u064A\u0644: ${it.customNotes}` : null,
        it.excludedOptions && it.excludedOptions.length > 0 ? `\u0645\u0633\u062A\u0628\u0639\u062F: ${it.excludedOptions.join("\u060C ")}` : null
      ].filter(Boolean);
      const desc = it.details || extraParts.join(" \xB7 ");
      return `${idx + 1}. ${it.title}${desc ? ` [${desc}]` : ""} \xD7 ${it.quantity} \u2014 ${(it.unitPrice * it.quantity).toLocaleString("en-US")} \u062F\u062C`;
    }).join("\n");
    const methodText = deliveryMethod === "home" ? "\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644" : "\u062A\u0648\u0635\u064A\u0644 \u0644\u0645\u0643\u062A\u0628 \u0627\u0644\u0634\u0631\u0643\u0629 / Stop Desk";
    return [
      `*\u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0639\u0628\u0631 \u0645\u062A\u062C\u0631 DG by Douaa \u{1F393}*${savedOrderNum ? ` (#${savedOrderNum})` : ""}`,
      `\u{1F464} *\u0627\u0644\u0627\u0633\u0645:* ${fullName.trim()}`,
      `\u{1F4F1} *\u0627\u0644\u0647\u0627\u062A\u0641:* ${phone.trim()}`,
      `\u{1F4CD} *\u0627\u0644\u0648\u0644\u0627\u064A\u0629:* ${wilaya}${commune.trim() ? ` - ${commune.trim()}` : ""}`,
      `\u{1F69A} *\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:* ${methodText}`,
      `\u{1F4E6} *\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644:* ${isDeliveryLocked ? "\u064A\u064F\u062D\u062F\u0651\u062F \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629 \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628" : deliveryFee > 0 ? `${deliveryFee.toLocaleString("en-US")} \u062F\u062C` : "\u0645\u062C\u0627\u0646\u064A (0 \u062F\u062C)"}`,
      `\u{1F4C5} *\u0645\u0648\u0639\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628:* ${deliveryDate || "\u0623\u0642\u0631\u0628 \u0645\u0648\u0639\u062F \u0645\u062A\u0627\u062D"}`,
      `\u{1F6D2} *\u0627\u0644\u0637\u0644\u0628\u0627\u062A:*
${lines}`,
      totalDiscountAmount > 0 ? `\u{1F3F7}\uFE0F *\u0627\u0644\u062A\u062E\u0641\u064A\u0636${activePromo ? ` (${activePromo.code})` : ""}:* -${totalDiscountAmount.toLocaleString("en-US")} \u062F\u062C` : null,
      `\u{1F9FE} *\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0642\u0637\u0639:* ${productsTotal.toLocaleString("en-US")} \u062F\u062C`,
      isDeliveryLocked ? `\u{1F4B0} *\u0627\u0644\u0645\u062C\u0645\u0648\u0639 (\u0628\u062F\u0648\u0646 \u062A\u0648\u0635\u064A\u0644):* ${finalTotal.toLocaleString("en-US")} \u062F\u062C` : `\u{1F4B0} *\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064A (\u0645\u0639 \u0627\u0644\u062A\u0648\u0635\u064A\u0644):* ${finalTotal.toLocaleString("en-US")} \u062F\u062C`,
      parsedPaidAmount > 0 ? `\u{1F4B3} *\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0648\u0651\u0644 / \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u0645\u062F\u0641\u0648\u0639:* ${parsedPaidAmount.toLocaleString("en-US")} \u062F\u062C` : `\u{1F4B3} *\u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A (50% \u0639\u0646\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F):* ${deposit50.toLocaleString("en-US")} \u062F\u062C`,
      parsedPaidAmount > 0 ? `\u{1F4B5} *\u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0644\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:* ${remainingBalance > 0 ? `${remainingBalance.toLocaleString("en-US")} \u062F\u062C` : "\u062E\u0627\u0644\u0635 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u2713"}` : null,
      receiptImage ? `\u{1F4C4} *\u0648\u0635\u0644 \u062F\u0641\u0639 \u0627\u0644\u0639\u0631\u0628\u0648\u0646:* \u0645\u0631\u0641\u0642 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 \u0641\u064A \u0627\u0644\u0645\u0648\u0642\u0639` : null,
      notes.trim() ? `\u{1F4DD} *\u0645\u0644\u0627\u062D\u0638\u0627\u062A:* ${notes.trim()}` : null
    ].filter(Boolean).join("\n");
  };
  const activeWhatsappNumber = formatWhatsAppNumber(whatsappNumber);
  const whatsappUrl = generatedOrderText ? `https://wa.me/${activeWhatsappNumber}?text=${encodeURIComponent(generatedOrderText)}` : "";
  const handleReceiptSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingReceipt(true);
    try {
      const compressed = await compressReceiptImage(file, 800, 0.75);
      setReceiptImage(compressed);
      setGeneratedOrderText("");
      onNotify("success", "\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D.");
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0645\u0639\u0627\u0644\u062C\u0629 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639."
      );
    } finally {
      setIsCompressingReceipt(false);
      if (receiptInputRef.current) {
        receiptInputRef.current.value = "";
      }
    }
  };
  const handlePrepareOrder = async (e) => {
    e.preventDefault();
    if (ordersPaused) {
      onNotify("info", pauseMessage || DEFAULT_PAUSE_MESSAGE);
      return;
    }
    if (items.length === 0) {
      onNotify("error", "\u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0641\u0627\u0631\u063A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B.");
      return;
    }
    if (!fullName.trim()) {
      setNameError("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setPhoneError("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0635\u062D\u064A\u062D \u0644\u0644\u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644.");
      return;
    }
    setNameError("");
    setPhoneError("");
    setIsSubmitting(true);
    try {
      let savedNumber = null;
      const richItems = items.map((i) => ({
        product_id: i.productId || null,
        title: i.title,
        category: i.category,
        fabric_type: i.fabricType || null,
        shawl_color: i.shawlColor || null,
        thread_color: i.threadColor || null,
        embroidered_text: i.embroideredText || null,
        right_embroidered_text: i.rightEmbroideredText || null,
        left_embroidered_text: i.leftEmbroideredText || null,
        size: i.size || null,
        cap_style: i.capStyle || null,
        cap_color: i.capColor || null,
        cap_embroidery: i.capEmbroidery || null,
        gown_option: i.gownOption || null,
        university_logo: i.universityLogo || null,
        custom_model_image: i.customModelImage || null,
        custom_notes: i.customNotes || null,
        excluded_options: i.excludedOptions && i.excludedOptions.length > 0 ? i.excludedOptions : null,
        details: i.details || "",
        quantity: i.quantity,
        unit_price: i.unitPrice,
        unitPrice: i.unitPrice,
        unit_cost: i.costPrice || 0
      }));
      const totalCostPrice = items.reduce(
        (sum, item) => sum + (item.costPrice || 0) * item.quantity,
        0
      );
      if (supabase) {
        const baseOrderPayload = {
          customer_name: fullName.trim(),
          phone: phone.trim(),
          wilaya,
          commune: commune.trim() || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629",
          delivery_type: deliveryMethod,
          order_items: richItems,
          product_details: {
            items: richItems,
            deliveryDate: deliveryDate || null,
            notes: notes.trim() || null,
            paid_amount: parsedPaidAmount,
            receipt_image: receiptImage || null,
            subtotal_before_discount: subtotal,
            products_total: productsTotal,
            delivery_fee: deliveryFee,
            delivery_locked: isDeliveryLocked,
            storewide_discount_percent: storewidePercent || null,
            promo_code: activePromo ? activePromo.code : null,
            discount_amount: totalDiscountAmount > 0 ? totalDiscountAmount : null
          },
          total_sell_price: finalTotal,
          total_cost_price: totalCostPrice,
          status: "\u062C\u062F\u064A\u062F"
        };
        let { data, error } = await supabase.from("orders").insert([{ ...baseOrderPayload, paid_amount: parsedPaidAmount }]).select("order_number").single();
        if (error && error.message?.includes("paid_amount")) {
          const fallbackRes = await supabase.from("orders").insert([baseOrderPayload]).select("order_number").single();
          data = fallbackRes.data;
          error = fallbackRes.error;
        }
        if (error) {
          console.error("Supabase order insert error:", error);
          onNotify("error", `\u0641\u0634\u0644 \u0641\u064A \u062D\u0641\u0638 \u0627\u0644\u0637\u0644\u0628: ${error.message}`);
          setIsSubmitting(false);
          return;
        } else if (data?.order_number) {
          trackMeta("Purchase", { value: finalTotal, currency: "DZD" });
          savedNumber = data.order_number;
          setOrderNumber(savedNumber);
        }
      }
      if (telegramEnabled && telegramBotToken.trim() && telegramChatId.trim()) {
        void sendTelegramOrderNotification({
          botToken: telegramBotToken,
          chatId: telegramChatId,
          orderNumber: savedNumber,
          customerName: fullName.trim(),
          phone: phone.trim(),
          wilaya,
          commune: commune.trim() || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629",
          deliveryType: deliveryMethod,
          deliveryFee,
          deliveryDate: deliveryDate || void 0,
          notes: notes.trim() || void 0,
          subtotal: finalTotal,
          discountAmount: totalDiscountAmount > 0 ? totalDiscountAmount : void 0,
          promoCode: activePromo ? activePromo.code : void 0,
          paidAmount: parsedPaidAmount,
          hasReceipt: Boolean(receiptImage),
          items: items.map((i) => ({
            title: i.title,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            details: i.details,
            fabricType: i.fabricType || null,
            shawlColor: i.shawlColor || null,
            threadColor: i.threadColor || null,
            embroideredText: i.embroideredText || null,
            rightEmbroideredText: i.rightEmbroideredText || null,
            leftEmbroideredText: i.leftEmbroideredText || null,
            size: i.size || null,
            capStyle: i.capStyle || null,
            capEmbroidery: i.capEmbroidery || null,
            gownOption: i.gownOption || null,
            hasUniversityLogo: Boolean(i.universityLogo),
            hasCustomModelImage: Boolean(i.customModelImage),
            excludedOptions: i.excludedOptions || null
          }))
        });
      }
      onOrderSubmitted?.(savedNumber);
      const message = buildOrderMessage(savedNumber);
      setGeneratedOrderText(message);
      onNotify(
        "success",
        savedNumber ? `\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0637\u0644\u0628\u0643 \u0631\u0642\u0645 #${savedNumber} \u0628\u0646\u062C\u0627\u062D! \u064A\u0645\u0643\u0646\u0643 \u0645\u062A\u0627\u0628\u0639\u062A\u0647 \u0639\u0628\u0631 WhatsApp.` : "\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D. \u0627\u0636\u063A\u0637\u064A \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0639\u0628\u0631 WhatsApp."
      );
    } catch (err) {
      console.error(err);
      const message = buildOrderMessage(null);
      setGeneratedOrderText(message);
      onNotify(
        "success",
        "\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0637\u0644\u0628\u0643. \u0627\u0636\u063A\u0637\u064A \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0639\u0628\u0631 WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCopyOrder = async () => {
    if (!generatedOrderText) return;
    try {
      await navigator.clipboard.writeText(generatedOrderText);
      setCopied(true);
      onNotify("success", "\u062A\u0645 \u0646\u0633\u062E \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D.");
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      onNotify(
        "error",
        "\u062A\u0639\u0630\u0631 \u0627\u0644\u0646\u0633\u062E \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A. \u064A\u0645\u0643\u0646\u0643 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0646\u0635 \u0648\u0646\u0633\u062E\u0647 \u064A\u062F\u0648\u064A\u0627\u064B."
      );
    }
  };
  const handleCopyOrderNumber = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(String(orderNumber));
      setCopiedOrderNum(true);
      onNotify("success", `\u062A\u0645 \u0646\u0633\u062E \u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 #${orderNumber} \u0644\u0644\u062A\u062A\u0628\u0651\u0639.`);
      setTimeout(() => setCopiedOrderNum(false), 2200);
    } catch {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u0627\u0644\u0646\u0633\u062E \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628.");
    }
  };
  const savedCcpNumber = (() => {
    const trimmed = (paymentInfo || "").trim();
    if (!trimmed || trimmed === DEFAULT_PAYMENT_INFO || trimmed.startsWith("\u064A\u0645\u0643\u0646\u0643 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 (50%)")) {
      return "";
    }
    return trimmed;
  })();
  const handleCopyCcp = async () => {
    if (!savedCcpNumber) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(savedCcpNumber);
      } else {
        const ta = document.createElement("textarea");
        ta.value = savedCcpNumber;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedCcp(true);
      onNotify("success", "\u062A\u0645 \u0646\u0633\u062E \u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP \u0628\u0646\u062C\u0627\u062D.");
      setTimeout(() => setCopiedCcp(false), 2200);
    } catch {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u0627\u0644\u0646\u0633\u062E \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0631\u0642\u0645 CCP.");
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex justify-end bg-[#1A1617]/45 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0648\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0",
            onClick: onClose,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("aside", { className: "relative z-10 w-full max-w-md bg-[#FAF8F5] h-full border-r border-[#C6A355]/35 flex flex-col shadow-2xl text-[#1A1617]", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-white border-b border-[#C6A355]/30 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5 text-[#5E1734]" }),
              /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-[#1A1617]", children: [
                "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0637\u0644\u0628 (",
                items.reduce((acc, i) => acc + i.quantity, 0),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "p-1.5 rounded-xl text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5] transition-colors cursor-pointer",
                "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u062D\u0642\u064A\u0628\u0629",
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [
            ordersPaused && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FFF5F7] border border-[#FECDD3] p-4 flex items-start gap-3 shadow-xs", children: [
              /* @__PURE__ */ jsx(PauseCircle, { className: "w-5 h-5 text-[#BE123C] shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-extrabold text-[#BE123C]", children: "\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#1A1617] leading-relaxed", children: pauseMessage || DEFAULT_PAUSE_MESSAGE })
              ] })
            ] }),
            items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-8 text-center", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8 text-[#5E1734] mx-auto mb-3 opacity-80" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#1A1617] mb-1", children: "\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0637\u0644\u0628 \u0641\u0627\u0631\u063A\u0629" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A]", children: "\u0635\u0645\u0651\u0645\u064A \u0648\u0634\u0627\u062D\u0643 \u0623\u0648 \u0627\u062E\u062A\u0627\u0631\u064A \u0642\u0637\u0639\u0643 \u0645\u0646 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0644\u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0647\u0646\u0627." })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl divide-y divide-[#C6A355]/25", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#1A1617] leading-snug", children: item.title }),
                    item.details && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#65525A] mt-1 leading-relaxed", children: item.details }),
                    (item.rightEmbroideredText || item.leftEmbroideredText) && /* @__PURE__ */ jsx("div", { className: "mt-1.5 inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/30 text-[11px] font-bold text-[#5E1734]", children: [
                      item.rightEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${item.rightEmbroideredText}` : null,
                      item.leftEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${item.leftEmbroideredText}` : null
                    ].filter(Boolean).join(" | ") }),
                    item.universityLogo && (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(
                      item.universityLogo
                    ) || /^https?:\/\//i.test(item.universityLogo)) && /* @__PURE__ */ jsxs("div", { className: "mt-2 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.universityLogo,
                          alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642",
                          className: "w-7 h-7 rounded-full object-cover border border-[#5E1734] bg-white shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#5E1734]", children: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0645\u0631\u0641\u0642 (\u0645\u062C\u0627\u0646\u0627\u064B)" })
                    ] }),
                    item.customModelImage && (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(
                      item.customModelImage
                    ) || /^https?:\/\//i.test(item.customModelImage)) && /* @__PURE__ */ jsxs("div", { className: "mt-2 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/40", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.customModelImage,
                          alt: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u0631\u0641\u0642\u0629",
                          className: "w-10 h-10 rounded-lg object-cover border border-[#5E1734]/40 bg-white shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#5E1734]", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629 \u0645\u0631\u0641\u0642\u0629" })
                    ] }),
                    item.customNotes && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#7C4A15] bg-[#FFF8EB] border border-[#F5D69E] rounded-lg px-2 py-1 mt-1.5", children: [
                      /* @__PURE__ */ jsx("strong", { children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062A\u0641\u0635\u064A\u0644:" }),
                      " ",
                      item.customNotes
                    ] }),
                    item.excludedOptions && item.excludedOptions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: item.excludedOptions.map((excl) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-block px-2 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[10px] font-bold text-[#BE123C]",
                        children: excl
                      },
                      excl
                    )) })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setGeneratedOrderText("");
                        onRemoveItem(item.id);
                      },
                      className: "p-1 text-[#65525A] hover:text-[#BE123C] transition-colors shrink-0 cursor-pointer",
                      "aria-label": "\u062D\u0630\u0641 \u0627\u0644\u0642\u0637\u0639\u0629",
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center border border-[#C6A355]/35 rounded-xl bg-[#FAF8F5]", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setGeneratedOrderText("");
                          onUpdateQuantity(item.id, -1);
                        },
                        className: "p-1.5 rounded-r-xl text-[#1A1617] hover:bg-white cursor-pointer",
                        "aria-label": "\u0625\u0646\u0642\u0627\u0635 \u0627\u0644\u0643\u0645\u064A\u0629",
                        children: /* @__PURE__ */ jsx(Minus, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "px-3 text-xs font-bold tabular-nums text-[#1A1617]", children: item.quantity }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setGeneratedOrderText("");
                          onUpdateQuantity(item.id, 1);
                        },
                        className: "p-1.5 rounded-l-xl text-[#1A1617] hover:bg-white cursor-pointer",
                        "aria-label": "\u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0643\u0645\u064A\u0629",
                        children: /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-extrabold text-[#5E1734] tabular-nums", children: [
                    (item.unitPrice * item.quantity).toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] })
                ] })
              ] }, item.id)) }),
              promoSettings.promoCodeInputEnabled && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 space-y-2.5", children: [
                /* @__PURE__ */ jsxs(
                  "label",
                  {
                    htmlFor: "cart-promo-code-input",
                    className: "flex items-center gap-1.5 text-xs font-bold text-[#5E1734]",
                    children: [
                      /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0647\u0644 \u0644\u062F\u064A\u0643 \u0643\u0648\u062F \u062A\u062E\u0641\u064A\u0636\u061F" })
                    ]
                  }
                ),
                activePromo ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#EBF9F2] border border-[#BEEBD4]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-[#147A53] shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          dir: "ltr",
                          className: "text-xs font-extrabold text-[#147A53] tracking-wide",
                          children: activePromo.code
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#147A53] mx-1.5 tabular-nums", children: [
                        "(",
                        activePromo.type === "percent" ? `-${activePromo.value}%` : `-${activePromo.value.toLocaleString("en-US")} \u062F\u062C`,
                        ")"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAppliedPromoCode(null);
                        setPromoInput("");
                        setGeneratedOrderText("");
                      },
                      "aria-label": "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0643\u0648\u0628\u0648\u0646",
                      className: "p-1 rounded-lg text-[#147A53] hover:bg-[#D5F5E5] cursor-pointer",
                      children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "cart-promo-code-input",
                      type: "text",
                      dir: "ltr",
                      value: promoInput,
                      onChange: (e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoError) setPromoError("");
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyPromoCode();
                        }
                      },
                      placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0644\u0643\u0648\u062F (\u0645\u062B\u0627\u0644: GRAD10)",
                      className: "flex-1 px-3 py-2 rounded-xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs font-bold text-[#1A1617] uppercase placeholder:normal-case placeholder:font-normal placeholder:text-[#8C7780]"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleApplyPromoCode,
                      className: "px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#5E1734] text-[#5E1734] hover:text-white border border-[#C6A355]/45 text-xs font-bold transition-colors cursor-pointer shrink-0",
                      children: "\u062A\u0637\u0628\u064A\u0642"
                    }
                  )
                ] }),
                promoError && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[#BE123C]", children: promoError })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-4 space-y-2 text-sm", children: [
                totalDiscountAmount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[#65525A]", children: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0642\u0628\u0644 \u0627\u0644\u062A\u062E\u0641\u064A\u0636" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-[#65525A] line-through tabular-nums", children: [
                      subtotal.toLocaleString("en-US"),
                      " \u062F\u062C"
                    ] })
                  ] }),
                  storewideDiscountAmount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-[#147A53]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "\u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631 (-",
                        storewidePercent,
                        "%)"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
                      "-",
                      storewideDiscountAmount.toLocaleString("en-US"),
                      " \u062F\u062C"
                    ] })
                  ] }),
                  promoDiscountAmount > 0 && activePromo && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-[#147A53]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "\u062E\u0635\u0645 \u0627\u0644\u0643\u0648\u0628\u0648\u0646 (",
                        activePromo.code,
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
                      "-",
                      promoDiscountAmount.toLocaleString("en-US"),
                      " \u062F\u062C"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#65525A]", children: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0642\u0637\u0639" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-[#1A1617] tabular-nums", children: [
                    productsTotal.toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[#65525A]", children: [
                    "\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (",
                    wilaya,
                    " \xB7",
                    " ",
                    deliveryMethod === "home" ? "\u0644\u0644\u0645\u0646\u0632\u0644" : "\u0645\u0643\u062A\u0628 \u0627\u0644\u0634\u0631\u0643\u0629",
                    ")"
                  ] }),
                  isDeliveryLocked ? /* @__PURE__ */ jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-[#F3F1EE] border border-[#C6A355]/30 text-[11px] font-bold text-[#65525A]", children: "\u064A\u064F\u062D\u062F\u0651\u062F \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629" }) : /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `font-bold tabular-nums ${deliveryFee === 0 ? "text-[#147A53]" : "text-[#1A1617]"}`,
                      children: deliveryFee > 0 ? `${deliveryFee.toLocaleString("en-US")} \u062F\u062C` : "\u0645\u062C\u0627\u0646\u064A (0 \u062F\u062C)"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1.5 border-t border-[#C6A355]/20", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1A1617]", children: isDeliveryLocked ? "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 (\u0628\u062F\u0648\u0646 \u062A\u0648\u0635\u064A\u0644)" : "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064A" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-lg font-extrabold text-[#1A1617] tabular-nums", children: [
                    finalTotal.toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs pt-2 border-t border-[#C6A355]/25", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#65525A]", children: "\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u062A\u0623\u0643\u064A\u062F (50% \u0628\u0639\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629)" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-[#5E1734] tabular-nums", children: [
                    deposit50.toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handlePrepareOrder, className: "space-y-3", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#5E1734]", children: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0623\u0643\u064A\u062F" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: fullName,
                      onChange: (e) => {
                        setFullName(e.target.value);
                        if (nameError) setNameError("");
                        setGeneratedOrderText("");
                      },
                      placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0644\u0642\u0628",
                      className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-sm text-[#1A1617] placeholder:text-[#8C7780]"
                    }
                  ),
                  nameError && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#BE123C] font-semibold mt-1", children: nameError })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 *" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "tel",
                        value: phone,
                        onChange: (e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError("");
                          setGeneratedOrderText("");
                        },
                        placeholder: "05 / 06 / 07...",
                        className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-sm text-[#1A1617] placeholder:text-[#8C7780]"
                      }
                    ),
                    phoneError && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#BE123C] font-semibold mt-1", children: phoneError })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0645\u0648\u0639\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        min: minDateString,
                        value: deliveryDate,
                        onChange: (e) => {
                          setDeliveryDate(e.target.value);
                          setGeneratedOrderText("");
                        },
                        className: "w-full px-3 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617]"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0627\u0644\u0648\u0644\u0627\u064A\u0629" }),
                    /* @__PURE__ */ jsx(
                      "select",
                      {
                        value: wilaya,
                        onChange: (e) => {
                          setWilaya(e.target.value);
                          setGeneratedOrderText("");
                        },
                        className: "w-full px-3 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-xs font-semibold text-[#1A1617]",
                        children: ALGERIA_WILAYAS.map((w) => /* @__PURE__ */ jsx("option", { value: w, children: w }, w))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0627\u0644\u0628\u0644\u062F\u064A\u0629" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: commune,
                        onChange: (e) => {
                          setCommune(e.target.value);
                          setGeneratedOrderText("");
                        },
                        placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0628\u0644\u062F\u064A\u0629",
                        className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-sm text-[#1A1617] placeholder:text-[#8C7780]"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-[#65525A] mb-1.5", children: "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" }),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      role: "radiogroup",
                      "aria-label": "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644",
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                      children: [
                        /* @__PURE__ */ jsxs(
                          "label",
                          {
                            className: `flex items-center justify-between gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold border transition-colors cursor-pointer ${deliveryMethod === "home" ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                            children: [
                              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                                /* @__PURE__ */ jsx(
                                  "input",
                                  {
                                    type: "radio",
                                    name: "deliveryMethod",
                                    value: "home",
                                    checked: deliveryMethod === "home",
                                    onChange: () => {
                                      setDeliveryMethod("home");
                                      setGeneratedOrderText("");
                                    },
                                    className: "w-3.5 h-3.5 accent-[#C6A355] cursor-pointer"
                                  }
                                ),
                                /* @__PURE__ */ jsx("span", { children: "\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644" })
                              ] }),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${isDeliveryLocked ? deliveryMethod === "home" ? "bg-white/15 text-white" : "bg-[#F3F1EE] text-[#65525A]" : deliveryMethod === "home" ? "bg-white/15 text-white font-extrabold" : homeDeliveryFee === 0 ? "bg-[#EBF9F2] text-[#147A53] font-extrabold" : "bg-[#FAF8F5] text-[#5E1734] font-extrabold"}`,
                                  children: isDeliveryLocked ? "\u064A\u064F\u062D\u062F\u0651\u062F \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629" : homeDeliveryFee > 0 ? `${homeDeliveryFee.toLocaleString("en-US")} \u062F\u062C` : "\u0645\u062C\u0627\u0646\u064A"
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "label",
                          {
                            className: `flex items-center justify-between gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold border transition-colors cursor-pointer ${deliveryMethod === "office" ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                            children: [
                              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                                /* @__PURE__ */ jsx(
                                  "input",
                                  {
                                    type: "radio",
                                    name: "deliveryMethod",
                                    value: "office",
                                    checked: deliveryMethod === "office",
                                    onChange: () => {
                                      setDeliveryMethod("office");
                                      setGeneratedOrderText("");
                                    },
                                    className: "w-3.5 h-3.5 accent-[#C6A355] cursor-pointer"
                                  }
                                ),
                                /* @__PURE__ */ jsx("span", { children: "\u062A\u0648\u0635\u064A\u0644 \u0644\u0645\u0643\u062A\u0628 \u0627\u0644\u0634\u0631\u0643\u0629 / Stop Desk" })
                              ] }),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${isDeliveryLocked ? deliveryMethod === "office" ? "bg-white/15 text-white" : "bg-[#F3F1EE] text-[#65525A]" : deliveryMethod === "office" ? "bg-white/15 text-white font-extrabold" : officeDeliveryFee === 0 ? "bg-[#EBF9F2] text-[#147A53] font-extrabold" : "bg-[#FAF8F5] text-[#5E1734] font-extrabold"}`,
                                  children: isDeliveryLocked ? "\u064A\u064F\u062D\u062F\u0651\u062F \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629" : officeDeliveryFee > 0 ? `${officeDeliveryFee.toLocaleString("en-US")} \u062F\u062C` : "\u0645\u062C\u0627\u0646\u064A"
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#65525A] mb-1", children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0645\u0642\u0627\u0633 \u0623\u0648 \u0627\u0644\u062A\u0637\u0631\u064A\u0632" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      rows: 2,
                      value: notes,
                      onChange: (e) => {
                        setNotes(e.target.value);
                        setGeneratedOrderText("");
                      },
                      placeholder: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0642\u0627\u0633 (XS-XXL)\u060C \u0627\u0644\u0644\u0648\u0646\u060C \u0623\u0648 \u0637\u0644\u0628\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629...",
                      className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-white text-sm text-[#1A1617] placeholder:text-[#8C7780]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#C6A355]/35 p-3.5 space-y-2.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold text-[#5E1734]", children: "\u062F\u0641\u0639 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0648\u0625\u0631\u0641\u0627\u0642 \u0627\u0644\u0648\u0635\u0644 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                    /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] border border-[#C6A355]/40 text-[11px] font-extrabold text-[#5E1734] tabular-nums", children: [
                      "\u0642\u064A\u0645\u0629 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 50%: ",
                      deposit50.toLocaleString("en-US"),
                      " \u062F\u062C"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-[#65525A] leading-relaxed bg-[#FAF8F5] border border-[#C6A355]/30 rounded-xl p-2.5 space-y-2", children: [
                    savedCcpNumber ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold text-[#65525A]", children: "\u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP (\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631):" }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            dir: "ltr",
                            className: "inline-block text-xs sm:text-sm font-extrabold text-[#1A1617] tabular-nums select-all break-all mt-0.5",
                            children: savedCcpNumber
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleCopyCcp,
                          className: "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF8] border border-[#C6A355]/55 hover:border-[#5E1734]/50 text-[#5E1734] text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0",
                          children: /* @__PURE__ */ jsx("span", { children: copiedCcp ? "\u2705 \u062A\u0645 \u0627\u0644\u0646\u0633\u062E!" : "\u{1F4CB} \u0646\u0633\u062E \u0631\u0642\u0645 CCP" })
                        }
                      )
                    ] }) : /* @__PURE__ */ jsx("p", { children: "\u0633\u064A\u062A\u0645 \u062A\u0632\u0648\u064A\u062F\u0643 \u0628\u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP (\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631) \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0639\u0646\u062F \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0637\u0644\u0628 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628." }),
                    /* @__PURE__ */ jsxs("p", { className: "pt-1.5 border-t border-[#C6A355]/25 flex flex-wrap items-center gap-1.5 font-semibold text-[#5E1734]", children: [
                      /* @__PURE__ */ jsx("span", { children: "\u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0623\u0648 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0648\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628:" }),
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: `https://wa.me/${activeWhatsappNumber}`,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          dir: "ltr",
                          className: "font-extrabold text-[#147A53] hover:underline tabular-nums",
                          children: [
                            "+",
                            activeWhatsappNumber
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        htmlFor: "deposit-paid-amount",
                        className: "block text-xs font-semibold text-[#65525A] mb-1",
                        children: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0648\u0651\u0644 / \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u0645\u062F\u0641\u0648\u0639 (\u062F\u062C) \u2014 \u0627\u062E\u062A\u064A\u0627\u0631\u064A"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        id: "deposit-paid-amount",
                        type: "number",
                        min: 0,
                        value: paidAmountInput,
                        onChange: (e) => {
                          setPaidAmountInput(e.target.value);
                          setGeneratedOrderText("");
                        },
                        placeholder: String(deposit50),
                        className: "w-full px-3.5 py-2 rounded-xl border border-[#C6A355]/35 bg-[#FAF8F5] text-sm font-bold text-[#1A1617] tabular-nums placeholder:text-[#8C7780] placeholder:font-normal"
                      }
                    ),
                    parsedPaidAmount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold text-[#5E1734] mt-1 tabular-nums", children: [
                      "\u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:",
                      " ",
                      remainingBalance > 0 ? `${remainingBalance.toLocaleString("en-US")} \u062F\u062C` : "\u062E\u0627\u0644\u0635 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u2713"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: receiptInputRef,
                      type: "file",
                      accept: "image/*",
                      onChange: handleReceiptSelect,
                      className: "hidden",
                      id: "deposit-receipt-upload"
                    }
                  ),
                  receiptImage ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: receiptImage,
                        alt: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639",
                        className: "w-16 h-16 rounded-xl object-cover border border-[#C6A355]/35 shrink-0 bg-white"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[#147A53]", children: "\u2713 \u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0627\u0644\u0648\u0635\u0644 \u0628\u0646\u062C\u0627\u062D" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#65525A] mt-0.5", children: "\u0633\u064A\u0638\u0647\u0631 \u0627\u0644\u0648\u0635\u0644 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0644." })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setReceiptImage(null);
                          setGeneratedOrderText("");
                        },
                        "aria-label": "\u0625\u0632\u0627\u0644\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0648\u0635\u0644",
                        title: "\u0625\u0632\u0627\u0644\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0648\u0635\u0644",
                        className: "w-7 h-7 rounded-full bg-[#FFE4E6] hover:bg-[#FECDD3] text-[#BE123C] inline-flex items-center justify-center text-sm font-extrabold cursor-pointer shrink-0",
                        children: "\xD7"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx(
                    "label",
                    {
                      htmlFor: "deposit-receipt-upload",
                      className: `flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#C6A355]/55 bg-[#FAF8F5] hover:border-[#5E1734]/60 text-xs font-bold text-[#5E1734] transition-colors cursor-pointer ${isCompressingReceipt ? "opacity-60 pointer-events-none" : ""}`,
                      children: isCompressingReceipt ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                        /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0635\u0648\u0631\u0629..." })
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A - \u0648\u0635\u0644 CCP \u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631)" })
                      ] })
                    }
                  )
                ] }),
                !generatedOrderText ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting || isCompressingReceipt || ordersPaused,
                    className: `w-full py-3.5 px-4 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${ordersPaused ? "bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] cursor-not-allowed" : "cta-luxury-shimmer bg-[#5E1734] hover:bg-[#4A1129] disabled:opacity-60 text-white cursor-pointer"}`,
                    children: ordersPaused ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(PauseCircle, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B" })
                    ] }) : isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u062D\u0641\u0638 \u0627\u0644\u0637\u0644\u0628..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0648\u0625\u0631\u0633\u0627\u0644\u0647" })
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-[#C6A355]/75 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 pb-3 border-b border-[#C6A355]/30", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-[#EBF9F2] border border-[#BEEBD4] flex items-center justify-center text-[#147A53] shrink-0", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-sm font-extrabold text-[#1A1617]", children: orderNumber ? "\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0648\u062A\u0633\u062C\u064A\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D!" : "\u0645\u0644\u062E\u0635 \u0637\u0644\u0628\u0643 \u062C\u0627\u0647\u0632 \u0644\u0644\u0625\u0631\u0633\u0627\u0644 \u0639\u0628\u0631 WhatsApp" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] mt-0.5", children: "\u0627\u062D\u062A\u0641\u0638\u064A \u0628\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 \u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u0631\u0627\u062D\u0644 \u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0641\u064A \u0623\u064A \u0648\u0642\u062A." })
                    ] })
                  ] }),
                  orderNumber && /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gradient-to-l from-[#FFFDF8] via-[#FAF8F5] to-[#FFFDF8] border border-[#C6A355]/60 p-3 flex flex-col gap-2.5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#65525A]", children: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643:" }),
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          dir: "ltr",
                          className: "px-3 py-1 rounded-full bg-[#5E1734] text-white text-sm font-extrabold tracking-wide tabular-nums shadow-2xs border border-[#C6A355]/50",
                          children: [
                            "#",
                            orderNumber
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleCopyOrderNumber,
                          className: "inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#C6A355]/65 text-[#5E1734] text-xs font-bold transition-all active:scale-95 cursor-pointer",
                          children: copiedOrderNum ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-[#147A53]" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[#147A53]", children: "\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0642\u0645 \u2713" })
                          ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4CB} \u0646\u0633\u062E \u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 \u0644\u0644\u062A\u062A\u0628\u0651\u0639" })
                        }
                      ),
                      onOpenOrderTracking && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: onOpenOrderTracking,
                          className: "inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/50 text-[#1A1617] text-xs font-bold transition-all active:scale-95 cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(PackageSearch, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u064A \u0627\u0644\u0622\u0646" })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("pre", { className: "text-[11px] text-[#1A1617] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#C6A355]/30 whitespace-pre-wrap font-sans leading-relaxed max-h-36 overflow-y-auto", children: generatedOrderText }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: whatsappUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-colors",
                        children: [
                          /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx("span", { children: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0639\u0628\u0631 WhatsApp" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleCopyOrder,
                        className: "inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-2xl bg-white border border-[#C6A355]/45 text-[#1A1617] text-xs font-bold hover:bg-[#FAF8F5] transition-colors cursor-pointer",
                        children: [
                          copied ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-[#5E1734]" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                          /* @__PURE__ */ jsx("span", { children: copied ? "\u062A\u0645 \u0627\u0644\u0646\u0633\u062E" : "\u0646\u0633\u062E \u0627\u0644\u0646\u0635" })
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setGeneratedOrderText("");
                    setOrderNumber(null);
                    setPaidAmountInput("");
                    setReceiptImage(null);
                    setAppliedPromoCode(null);
                    setPromoInput("");
                    setPromoError("");
                    onClearCart();
                  },
                  className: "text-xs font-semibold text-[#65525A] hover:text-[#BE123C] transition-colors cursor-pointer",
                  children: "\u062A\u0641\u0631\u064A\u063A \u0627\u0644\u062D\u0642\u064A\u0628\u0629"
                }
              ) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  CartDrawer
};
