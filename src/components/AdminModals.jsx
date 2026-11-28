import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Palette,
  PauseCircle,
  Pencil,
  Percent,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Wallet,
  X
} from "lucide-react";
import {
  ALGERIA_WILAYAS,
  CAP_SWATCHES,
  CATEGORY_LABELS,
  DEFAULT_CATEGORY_PAUSE_BADGE,
  DEFAULT_DELIVERY_PRICING,
  DEFAULT_GOWN_COLORS,
  DEFAULT_PAUSE_MESSAGE,
  DEFAULT_PAYMENT_INFO,
  DEFAULT_PROMO_SETTINGS,
  DEFAULT_SEASON_BANNER_TEXT,
  DEFAULT_STOLE_COLORS,
  SHIPPING_COMPANY_PRESETS,
  THREAD_COLORS,
  WHATSAPP_NUMBER,
  createDefaultDeliveryPricing,
  formatWhatsAppNumber,
  normalizeWhatsAppInput,
  sanitizeSocialUrl
} from "../data/defaultStore";
import { usePWAInstall } from "../hooks/usePWAInstall";
import {
  sanitizeDeliveryPricing,
  sanitizeShippingCompanies,
  sendTelegramTestMessage,
  supabase,
  updateAdminEmail,
  updateAdminPassword
} from "../lib/supabase";
import { PasswordRecoveryPanel } from "./PasswordRecoveryPanel";
function AdminLoginModal({
  isOpen,
  onClose,
  onLogin,
  whatsappNumber = WHATSAPP_NUMBER,
  brandName = "DG by Douaa",
  forcePasswordRecovery = false,
  onPasswordRecoveryComplete,
  onNotify
}) {
  const [email, setEmail] = useState("khaldibk31@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(forcePasswordRecovery ? "recovery" : "login");
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setPassword("");
      setViewMode(forcePasswordRecovery ? "recovery" : "login");
      return;
    }
    if (forcePasswordRecovery) {
      setViewMode("recovery");
    }
  }, [isOpen, forcePasswordRecovery]);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("\u0623\u062F\u062E\u0644\u064A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
      setPassword("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A151D]/45 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\u062F\u062E\u0648\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#F2D7DF] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-[#2A151D]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#8E244D]", children: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u0629" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 text-[#6E4E5A] hover:text-[#2A151D] cursor-pointer",
              "aria-label": "\u0625\u063A\u0644\u0627\u0642",
              children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#6E4E5A] mb-4", children: viewMode === "recovery" ? "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u062D\u0633\u0627\u0628 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0628\u0623\u0645\u0627\u0646." : "\u062F\u062E\u0648\u0644 \u062E\u0627\u0635 \u0628\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u0623\u0631\u0628\u0627\u062D \u0648\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A." }),
        viewMode === "recovery" ? /* @__PURE__ */ jsx(
          PasswordRecoveryPanel,
          {
            initialEmail: email.trim(),
            whatsappNumber,
            brandName,
            initialStep: forcePasswordRecovery ? "new-password" : "choose",
            accountLabel: "\u062D\u0633\u0627\u0628 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
            onBackToLogin: () => {
              setViewMode("login");
              if (forcePasswordRecovery && onPasswordRecoveryComplete) {
                onPasswordRecoveryComplete();
              }
            },
            onPasswordUpdated: () => {
              onPasswordRecoveryComplete?.();
            },
            onNotify
          }
        ) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              autoComplete: "username",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0625\u062F\u0627\u0631\u0629",
              className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                autoComplete: "current-password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
                className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setError("");
                  setViewMode("recovery");
                },
                className: "text-xs font-bold text-[#5E1734] hover:text-[#8E244D] hover:underline transition-colors cursor-pointer",
                children: "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061F"
              }
            ) })
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#BE123C]", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "flex-1 py-2.5 px-4 rounded-lg bg-[#8E244D] hover:bg-[#6D1839] text-white text-sm font-bold disabled:opacity-60 cursor-pointer",
                children: loading ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0642\u0642..." : "\u062F\u062E\u0648\u0644"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "py-2.5 px-4 rounded-lg bg-[#FCE8EF] hover:bg-[#F5D6E1] text-[#2A151D] text-sm font-semibold cursor-pointer",
                children: "\u0625\u0644\u063A\u0627\u0621"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function ProductEditorModal({
  isOpen,
  initialCategory,
  editingProduct,
  onClose,
  onSave
}) {
  const [category, setCategory] = useState(initialCategory);
  const [branch, setBranch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [noCapDeduction, setNoCapDeduction] = useState("500");
  const [optionsText, setOptionsText] = useState("");
  const [secondaryLabel, setSecondaryLabel] = useState("");
  const [secondaryOptionsText, setSecondaryOptionsText] = useState("");
  const [imageFile, setImageFile] = useState(void 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setImageFile(void 0);
    if (editingProduct) {
      setCategory(editingProduct.category);
      setBranch(editingProduct.branch);
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setBasePrice(String(editingProduct.basePrice));
      setNoCapDeduction(String(editingProduct.noCapDeduction ?? 500));
      setOptionsText(
        editingProduct.options.map((o) => `${o.label}|${o.price}`).join("\n")
      );
      setSecondaryLabel(editingProduct.secondaryLabel || "");
      setSecondaryOptionsText((editingProduct.secondaryOptions || []).join("\n"));
    } else {
      setCategory(initialCategory);
      setBranch("");
      setName("");
      setDescription("");
      setBasePrice("3800");
      setNoCapDeduction("500");
      setOptionsText("\u0643\u0631\u064A\u0628|3800\n\u062F\u0627\u0646|4300");
      setSecondaryLabel(initialCategory === "accessories" ? "\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u062F" : "");
      setSecondaryOptionsText(
        initialCategory === "accessories" ? "\u0648\u0631\u062F \u062F\u0627\u0626\u0645 \u0641\u0627\u062E\u0631\n\u0648\u0631\u062F \u0637\u0628\u064A\u0639\u064A \u0645\u0648\u0633\u0645\u064A" : ""
      );
    }
  }, [isOpen, editingProduct, initialCategory]);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C.");
      return;
    }
    const parsedOptions = optionsText.split("\n").map((line) => line.split("|")).filter(
      (parts) => parts.length >= 2 && parts[0].trim() && Number.isFinite(Number(parts[1].trim()))
    ).map((parts) => ({
      label: parts[0].trim(),
      price: Math.max(0, Number(parts[1].trim()))
    }));
    const parsedSecondaryOptions = secondaryOptionsText.split("\n").map((line) => line.trim()).filter(Boolean);
    const numericBase = Math.max(
      0,
      Number(basePrice) || (parsedOptions[0]?.price ?? 0)
    );
    const parsedNoCapDeduction = Math.max(0, Number(noCapDeduction) || 0);
    setSaving(true);
    setError("");
    try {
      await onSave({
        id: editingProduct?.id,
        category,
        branch: branch.trim() || "\u0639\u0627\u0645",
        name: name.trim(),
        description: description.trim() || "\u062A\u0641\u0635\u064A\u0644 \u0648\u062A\u0637\u0631\u064A\u0632 \u0645\u062A\u0642\u0646 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628.",
        basePrice: parsedOptions.length > 0 ? parsedOptions[0].price : numericBase,
        noCapDeduction: category === "shawl" || category === "robe" ? parsedNoCapDeduction : void 0,
        options: parsedOptions,
        secondaryLabel: secondaryLabel.trim() || void 0,
        secondaryOptions: parsedSecondaryOptions.length > 0 || editingProduct?.secondaryOptions ? parsedSecondaryOptions : void 0,
        imageFile,
        existingImageUrl: editingProduct?.imageUrl
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u0645\u0646\u062A\u062C.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A151D]/45 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": editingProduct ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C" : "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u062F\u064A\u0644 \u062C\u062F\u064A\u062F",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#F2D7DF] rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-[#2A151D]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#8E244D]", children: editingProduct ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0648\u062F\u064A\u0644" : "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u062F\u064A\u0644 \u062C\u062F\u064A\u062F" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 text-[#6E4E5A] hover:text-[#2A151D] cursor-pointer",
              "aria-label": "\u0625\u063A\u0644\u0627\u0642",
              children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0627\u0644\u0642\u0633\u0645" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: category,
                onChange: (e) => setCategory(e.target.value),
                className: "w-full px-3 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]",
                children: ["shawl", "robe", "cap", "accessories"].map(
                  (cat) => /* @__PURE__ */ jsx("option", { value: cat, children: CATEGORY_LABELS[cat] }, cat)
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                onChange: (e) => setImageFile(e.target.files?.[0]),
                className: "w-full text-xs text-[#6E4E5A] file:mr-0 file:ml-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-[#F2D7DF] file:bg-[#FCE8EF] file:text-[#8E244D] file:font-bold"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: branch,
              onChange: (e) => setBranch(e.target.value),
              placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0641\u0631\u0639 (\u0645\u062B\u0627\u0644: \u0634\u0627\u0644 \u0645\u064A\u0633)",
              className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C",
              className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: "\u0648\u0635\u0641 \u0642\u0635\u064A\u0631",
              className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: basePrice,
              onChange: (e) => setBasePrice(e.target.value),
              placeholder: "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u062C\u0632\u0627\u0626\u0631\u064A",
              className: "w-full px-3.5 py-2.5 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
            }
          ),
          (category === "shawl" || category === "robe") && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: '\u062E\u0635\u0645 \u062E\u064A\u0627\u0631 "\u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629" (\u062F\u062C)' }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 0,
                value: noCapDeduction,
                onChange: (e) => setNoCapDeduction(e.target.value),
                placeholder: "500",
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0646\u0633\u064A\u0642 / \u0627\u0644\u0642\u0645\u0627\u0634 (\u0643\u0644 \u062E\u064A\u0627\u0631 \u0641\u064A \u0633\u0637\u0631: \u0627\u0644\u0627\u0633\u0645|\u0627\u0644\u0633\u0639\u0631)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 3,
                value: optionsText,
                onChange: (e) => setOptionsText(e.target.value),
                placeholder: "\u0643\u0631\u064A\u0628|3800\n\u062F\u0627\u0646|4300",
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-xs text-[#2A151D]"
              }
            )
          ] }),
          (category === "accessories" || Boolean(editingProduct?.secondaryOptions?.length)) && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-1 border-t border-[#F2D7DF]/70", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 (\u0645\u062B\u0644: \u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u062F)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: secondaryLabel,
                  onChange: (e) => setSecondaryLabel(e.target.value),
                  placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u062F",
                  className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-xs text-[#2A151D]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A (\u0633\u0637\u0631 \u0644\u0643\u0644 \u062E\u064A\u0627\u0631\u060C \u0645\u062B\u0644 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0648\u0631\u062F)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 3,
                  value: secondaryOptionsText,
                  onChange: (e) => setSecondaryOptionsText(e.target.value),
                  placeholder: "\u0648\u0631\u062F \u062F\u0627\u0626\u0645 \u0641\u0627\u062E\u0631\n\u0648\u0631\u062F \u0637\u0628\u064A\u0639\u064A \u0645\u0648\u0633\u0645\u064A",
                  className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-xs text-[#2A151D]"
                }
              )
            ] })
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#BE123C]", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: saving,
                className: "flex-1 py-2.5 px-4 rounded-lg bg-[#8E244D] hover:bg-[#6D1839] text-white text-sm font-bold disabled:opacity-60 cursor-pointer",
                children: saving ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : editingProduct ? "\u062A\u062D\u062F\u064A\u062B" : "\u0625\u0636\u0627\u0641\u0629"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "py-2.5 px-4 rounded-lg bg-[#FCE8EF] hover:bg-[#F5D6E1] text-[#2A151D] text-sm font-semibold cursor-pointer",
                children: "\u0625\u0644\u063A\u0627\u0621"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function CopyEditorModal({
  isOpen,
  copy,
  onClose,
  onSaveCopy
}) {
  const [draft, setDraft] = useState(copy);
  useEffect(() => {
    if (isOpen) setDraft(copy);
  }, [isOpen, copy]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveCopy(draft);
    onClose();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A151D]/45 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\u062A\u0639\u062F\u064A\u0644 \u0646\u0635\u0648\u0635 \u0627\u0644\u0645\u062A\u062C\u0631",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#F2D7DF] rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-[#2A151D]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#8E244D]", children: "\u062A\u0639\u062F\u064A\u0644 \u0646\u0635\u0648\u0635 \u0627\u0644\u0648\u0627\u062C\u0647\u0629" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 text-[#6E4E5A] hover:text-[#2A151D] cursor-pointer",
              "aria-label": "\u0625\u063A\u0644\u0627\u0642",
              children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0627\u0633\u0645 \u0627\u0644\u0639\u0644\u0627\u0645\u0629" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: draft.brandName,
                onChange: (e) => setDraft({ ...draft, brandName: e.target.value }),
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0631\u0626\u064A\u0633\u064A (Hero)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: draft.heroTitle,
                onChange: (e) => setDraft({ ...draft, heroTitle: e.target.value }),
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 3,
                value: draft.heroSubtitle,
                onChange: (e) => setDraft({ ...draft, heroSubtitle: e.target.value }),
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: draft.studioTitle,
                onChange: (e) => setDraft({ ...draft, studioTitle: e.target.value }),
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#6E4E5A] mb-1", children: "\u0639\u0646\u0648\u0627\u0646 \u062C\u062F\u0648\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: draft.pricesTitle,
                onChange: (e) => setDraft({ ...draft, pricesTitle: e.target.value }),
                className: "w-full px-3.5 py-2 rounded-lg border border-[#F2D7DF] bg-[#FFF9FA] text-sm text-[#2A151D]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "flex-1 py-2.5 px-4 rounded-lg bg-[#8E244D] hover:bg-[#6D1839] text-white text-sm font-bold cursor-pointer",
                children: "\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "py-2.5 px-4 rounded-lg bg-[#FCE8EF] hover:bg-[#F5D6E1] text-[#2A151D] text-sm font-semibold cursor-pointer",
                children: "\u0625\u0644\u063A\u0627\u0621"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function getOrderItems(order) {
  if (Array.isArray(order.product_details?.items) && order.product_details.items.length > 0) {
    return order.product_details.items;
  }
  if (Array.isArray(order.order_items) && order.order_items.length > 0) {
    return order.order_items;
  }
  return [];
}
function getOrderNetProfit(order) {
  if (typeof order.net_profit === "number" && Number.isFinite(order.net_profit)) {
    return order.net_profit;
  }
  return Number(order.total_sell_price || 0) - Number(order.total_cost_price || 0);
}
function getOrderPaidAmount(order) {
  const raw = order.paid_amount ?? order.product_details?.paid_amount ?? 0;
  const num = Number(raw);
  return Number.isFinite(num) ? Math.max(0, num) : 0;
}
function isSafeReceiptSrc(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(trimmed) || /^https?:\/\/\S+$/i.test(trimmed);
}
function parseDeliveryTimestamp(deliveryDate) {
  if (!deliveryDate || typeof deliveryDate !== "string") return null;
  const trimmed = deliveryDate.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (!Number.isNaN(date.getTime())) return date.getTime();
  }
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback.getTime();
}
function getDaysUntilDelivery(deliveryDate) {
  const targetTs = parseDeliveryTimestamp(deliveryDate);
  if (targetTs === null) return null;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((targetTs - today.getTime()) / (1e3 * 60 * 60 * 24));
}
function formatRemainingDaysArabic(days) {
  if (days < 0) {
    const overdue = Math.abs(days);
    if (overdue === 1) return "\u0645\u062A\u0623\u062E\u0631 \u0628\u064A\u0648\u0645 \u0648\u0627\u062D\u062F";
    if (overdue === 2) return "\u0645\u062A\u0623\u062E\u0631 \u0628\u064A\u0648\u0645\u064A\u0646";
    if (overdue <= 10) return `\u0645\u062A\u0623\u062E\u0631 \u0628\u0640 ${overdue} \u0623\u064A\u0627\u0645`;
    return `\u0645\u062A\u0623\u062E\u0631 \u0628\u0640 ${overdue} \u064A\u0648\u0645\u0627\u064B`;
  }
  if (days === 0) return "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u064A\u0648\u0645!";
  if (days === 1) return "\u0628\u0627\u0642\u064A \u064A\u0648\u0645 \u0648\u0627\u062D\u062F";
  if (days === 2) return "\u0628\u0627\u0642\u064A \u064A\u0648\u0645\u0627\u0646";
  if (days <= 10) return `\u0628\u0627\u0642\u064A ${days} \u0623\u064A\u0627\u0645`;
  return `\u0628\u0627\u0642\u064A ${days} \u064A\u0648\u0645\u0627\u064B`;
}
function AdminDashboardModal({
  isOpen,
  storeName,
  dynamicSettings,
  newOrdersCount = 0,
  orderSignalNonce = 0,
  onAcknowledgeNewOrders,
  onUpdateDynamicSettings,
  onClose,
  onNotify
}) {
  const [activeTab, setActiveTab] = useState("orders");
  const [settingsSubView, setSettingsSubView] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("\u0627\u0644\u0643\u0644");
  const {
    isInstallable: isPwaInstallable,
    isInstalled: isPwaInstalled,
    isIOS: isPwaIOS,
    install: promptPwaInstall
  } = usePWAInstall();
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);
  const handleAdminPwaInstall = async () => {
    if (isPwaInstalled) {
      onNotify("success", "\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u062B\u0628\u0651\u062A \u0628\u0627\u0644\u0641\u0639\u0644 \u0648\u064A\u0639\u0645\u0644 \u0628\u0646\u062C\u0627\u062D.");
      return;
    }
    if (isPwaInstallable) {
      const outcome = await promptPwaInstall();
      if (outcome === "accepted") {
        onNotify("success", "\u062A\u0645 \u062A\u062B\u0628\u064A\u062A \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643 \u0628\u0646\u062C\u0627\u062D!");
      }
      return;
    }
    if (isPwaIOS) {
      setShowIosInstallGuide((prev) => !prev);
      return;
    }
    onNotify(
      "info",
      "\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062A\u062B\u0628\u064A\u062A \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u062A\u0635\u0641\u062D (\u22EE \u2190 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 / Install App) \u0639\u0646\u062F \u0641\u062A\u062D \u0627\u0644\u0645\u062A\u062C\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u062E\u0627\u0631\u062C \u0648\u0636\u0639 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629."
    );
  };
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortMode, setSortMode] = useState("urgent");
  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [workshopSlipOrder, setWorkshopSlipOrder] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [paidDrafts, setPaidDrafts] = useState({});
  const [savingPaidOrderId, setSavingPaidOrderId] = useState(null);
  const [lightboxReceipt, setLightboxReceipt] = useState(null);
  const [prodName, setProdName] = useState("");
  const [prodCost, setProdCost] = useState("");
  const [prodSell, setProdSell] = useState("");
  const [prodQty, setProdQty] = useState("");
  const [deliveryCompany, setDeliveryCompany] = useState("Yalidine");
  const [newOfficeName, setNewOfficeName] = useState("");
  const [newOfficeNotes, setNewOfficeNotes] = useState("");
  const [draftShippingCompanies, setDraftShippingCompanies] = useState(() => sanitizeShippingCompanies(dynamicSettings.shippingCompanies));
  const [editingCourierId, setEditingCourierId] = useState(null);
  const [courierName, setCourierName] = useState("Yalidine");
  const [courierApiId, setCourierApiId] = useState("");
  const [courierApiToken, setCourierApiToken] = useState("");
  const [courierIsDefault, setCourierIsDefault] = useState(true);
  const [courierIsActive, setCourierIsActive] = useState(true);
  const [showCourierToken, setShowCourierToken] = useState(false);
  const [savingCourier, setSavingCourier] = useState(false);
  const [draftDeliveryPricing, setDraftDeliveryPricing] = useState(
    () => sanitizeDeliveryPricing(dynamicSettings.deliveryPricing || DEFAULT_DELIVERY_PRICING)
  );
  const [bulkOfficePrice, setBulkOfficePrice] = useState("");
  const [bulkHomePrice, setBulkHomePrice] = useState("");
  const [wilayaSearch, setWilayaSearch] = useState("");
  const [savingDeliveryPricing, setSavingDeliveryPricing] = useState(false);
  const [newColorForms, setNewColorForms] = useState({
    stoleColors: { name: "", hex: "#8E244D", extraPrice: "0" },
    gownColors: { name: "", hex: "#141212", extraPrice: "0" },
    threadColors: { name: "", hex: "#C6A355", extraPrice: "0" },
    capColors: { name: "", hex: "#141212", extraPrice: "0" }
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [draftPaused, setDraftPaused] = useState(dynamicSettings.ordersPaused);
  const [draftPauseMessage, setDraftPauseMessage] = useState(
    dynamicSettings.pauseMessage || DEFAULT_PAUSE_MESSAGE
  );
  const [draftSeasonBannerEnabled, setDraftSeasonBannerEnabled] = useState(
    dynamicSettings.seasonBannerEnabled ?? true
  );
  const [draftSeasonBannerText, setDraftSeasonBannerText] = useState(
    dynamicSettings.seasonBannerText || DEFAULT_SEASON_BANNER_TEXT
  );
  const [draftPausedCategories, setDraftPausedCategories] = useState(dynamicSettings.pausedCategories || {});
  const [draftCategoryPauseBadge, setDraftCategoryPauseBadge] = useState(
    dynamicSettings.categoryPauseBadge || DEFAULT_CATEGORY_PAUSE_BADGE
  );
  const normalizeAdminCcpDraft = (raw) => {
    const trimmed = (raw || "").trim();
    if (!trimmed || trimmed === DEFAULT_PAYMENT_INFO || trimmed.startsWith("\u064A\u0645\u0643\u0646\u0643 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 (50%)")) {
      return "";
    }
    return trimmed;
  };
  const [draftPaymentInfo, setDraftPaymentInfo] = useState(
    () => normalizeAdminCcpDraft(dynamicSettings.paymentInfo)
  );
  const resolvedStoreName = (dynamicSettings.customTexts?.["header.brandName"] || storeName || "DG by Douaa").trim() || "DG by Douaa";
  const [draftStoreName, setDraftStoreName] = useState(resolvedStoreName);
  const [draftWhatsappNumber, setDraftWhatsappNumber] = useState(
    dynamicSettings.whatsappNumber ?? WHATSAPP_NUMBER
  );
  const [draftInstagramUrl, setDraftInstagramUrl] = useState(
    dynamicSettings.instagramUrl || ""
  );
  const [draftFacebookUrl, setDraftFacebookUrl] = useState(
    dynamicSettings.facebookUrl || ""
  );
  const [draftTiktokUrl, setDraftTiktokUrl] = useState(
    dynamicSettings.tiktokUrl || ""
  );
  const [draftTelegramEnabled, setDraftTelegramEnabled] = useState(
    Boolean(dynamicSettings.telegramEnabled)
  );
  const [draftTelegramToken, setDraftTelegramToken] = useState(
    dynamicSettings.telegramBotToken || ""
  );
  const [draftTelegramChatId, setDraftTelegramChatId] = useState(
    dynamicSettings.telegramChatId || ""
  );
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [draftMetaPixelId, setDraftMetaPixelId] = useState(
    dynamicSettings.customTexts?.["meta.pixelId"] || ""
  );
  const handleSaveMetaPixel = async (e) => {
    e.preventDefault();
    const id = draftMetaPixelId.trim();
    if (id && !/^\d{10,20}$/.test(id)) {
      onNotify("error", "\u0631\u0642\u0645 Meta Pixel ID \u063A\u064A\u0631 \u0635\u0627\u0644\u062D (\u0623\u0631\u0642\u0627\u0645 \u0641\u0642\u0637).");
      return;
    }
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        customTexts: { ...dynamicSettings.customTexts || {}, "meta.pixelId": id }
      });
      onNotify("success", id ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 Meta Pixel." : "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 Meta Pixel \u2014 \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u062F\u0648\u0646 \u062A\u062A\u0628\u0651\u0639.");
    } finally {
      setSavingSettings(false);
    }
  };
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoType, setNewPromoType] = useState("percent");
  const [newPromoValue, setNewPromoValue] = useState("10");
  const [newPromoLabel, setNewPromoLabel] = useState("");
  const activePromoSettings = dynamicSettings.promoSettings || DEFAULT_PROMO_SETTINGS;
  const savePromoConfig = async (nextPromo, successMsg) => {
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        promoSettings: nextPromo
      });
      if (successMsg) {
        onNotify("success", successMsg);
      }
    } finally {
      setSavingSettings(false);
    }
  };
  useEffect(() => {
    setDraftPaused(dynamicSettings.ordersPaused);
    setDraftPauseMessage(dynamicSettings.pauseMessage || DEFAULT_PAUSE_MESSAGE);
    setDraftSeasonBannerEnabled(dynamicSettings.seasonBannerEnabled ?? true);
    setDraftSeasonBannerText(
      dynamicSettings.seasonBannerText || DEFAULT_SEASON_BANNER_TEXT
    );
    setDraftPausedCategories(dynamicSettings.pausedCategories || {});
    setDraftCategoryPauseBadge(
      dynamicSettings.categoryPauseBadge || DEFAULT_CATEGORY_PAUSE_BADGE
    );
    setDraftPaymentInfo(normalizeAdminCcpDraft(dynamicSettings.paymentInfo));
    setDraftStoreName(
      (dynamicSettings.customTexts?.["header.brandName"] || storeName || "DG by Douaa").trim() || "DG by Douaa"
    );
    setDraftWhatsappNumber(dynamicSettings.whatsappNumber ?? WHATSAPP_NUMBER);
    setDraftInstagramUrl(dynamicSettings.instagramUrl || "");
    setDraftFacebookUrl(dynamicSettings.facebookUrl || "");
    setDraftTiktokUrl(dynamicSettings.tiktokUrl || "");
    setDraftTelegramEnabled(Boolean(dynamicSettings.telegramEnabled));
    setDraftTelegramToken(dynamicSettings.telegramBotToken || "");
    setDraftTelegramChatId(dynamicSettings.telegramChatId || "");
    setDraftDeliveryPricing(
      sanitizeDeliveryPricing(dynamicSettings.deliveryPricing || DEFAULT_DELIVERY_PRICING)
    );
    setDraftShippingCompanies(
      sanitizeShippingCompanies(dynamicSettings.shippingCompanies)
    );
  }, [
    storeName,
    dynamicSettings.customTexts,
    dynamicSettings.ordersPaused,
    dynamicSettings.pauseMessage,
    dynamicSettings.seasonBannerEnabled,
    dynamicSettings.seasonBannerText,
    dynamicSettings.pausedCategories,
    dynamicSettings.categoryPauseBadge,
    dynamicSettings.paymentInfo,
    dynamicSettings.whatsappNumber,
    dynamicSettings.instagramUrl,
    dynamicSettings.facebookUrl,
    dynamicSettings.tiktokUrl,
    dynamicSettings.telegramEnabled,
    dynamicSettings.telegramBotToken,
    dynamicSettings.telegramChatId,
    dynamicSettings.deliveryPricing,
    dynamicSettings.shippingCompanies
  ]);
  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [ordersRes, invRes, settingsRes, userRes] = await Promise.all([
        supabase.from("orders").select("*").order("order_number", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.auth.getUser()
      ]);
      if (ordersRes.data) {
        const loadedOrders = ordersRes.data;
        setOrders(loadedOrders);
        const validIds = new Set(loadedOrders.map((o) => o.id));
        setSelectedOrderIds((prev) => prev.filter((id) => validIds.has(id)));
        setPaidDrafts(() => {
          const map = {};
          for (const ord of loadedOrders) {
            map[ord.id] = String(getOrderPaidAmount(ord));
          }
          return map;
        });
      }
      if (invRes.data) setInventory(invRes.data);
      if (settingsRes.data) {
        setDeliveryCompany(settingsRes.data.delivery_company || "Yalidine");
        if ((!dynamicSettings.shippingCompanies || dynamicSettings.shippingCompanies.length === 0) && (settingsRes.data.delivery_api_id || settingsRes.data.delivery_api_token)) {
          setDraftShippingCompanies([
            {
              id: "courier-legacy-1",
              name: settingsRes.data.delivery_company || "Yalidine",
              apiId: settingsRes.data.delivery_api_id || "",
              apiToken: settingsRes.data.delivery_api_token || "",
              isDefault: true,
              isActive: true
            }
          ]);
        }
      }
      if (userRes.data?.user?.email) {
        setCurrentAdminEmail(userRes.data.user.email);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (activeTab === "orders") {
        onAcknowledgeNewOrders?.();
      }
    }
  }, [isOpen, orderSignalNonce]);
  const matchesOrderStatusFilter = (status, filter) => {
    if (filter === "\u0627\u0644\u0643\u0644") return true;
    if (filter === "\u062C\u062F\u064A\u062F") return status === "\u062C\u062F\u064A\u062F";
    if (filter === "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644") {
      return status === "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644" || status === "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631" || status === "\u0645\u0624\u0643\u062F";
    }
    if (filter === "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645") {
      return status === "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645" || status === "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644";
    }
    return status === "\u0645\u0643\u062A\u0645\u0644";
  };
  const displayedOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();
    const filtered = orders.filter((o) => {
      if (!matchesOrderStatusFilter(o.status, statusFilter)) return false;
      if (!query) return true;
      const name = (o.customer_name || "").toLowerCase();
      const phone = (o.phone || o.customer_phone || "").toLowerCase();
      const orderNum = String(o.order_number || "");
      const wilaya = (o.wilaya || "").toLowerCase();
      return name.includes(query) || phone.includes(query) || orderNum.includes(query.replace(/^#/, "")) || `#${orderNum}`.includes(query) || wilaya.includes(query);
    });
    const list = [...filtered];
    if (sortMode === "urgent") {
      list.sort((a, b) => {
        const aInactive = a.status === "\u0645\u0644\u063A\u0649" || a.status === "\u0645\u0643\u062A\u0645\u0644";
        const bInactive = b.status === "\u0645\u0644\u063A\u0649" || b.status === "\u0645\u0643\u062A\u0645\u0644";
        if (aInactive !== bInactive) return aInactive ? 1 : -1;
        if (!aInactive && !bInactive) {
          const aTs = parseDeliveryTimestamp(a.product_details?.deliveryDate);
          const bTs = parseDeliveryTimestamp(b.product_details?.deliveryDate);
          if (aTs !== null && bTs !== null) {
            if (aTs !== bTs) return aTs - bTs;
            return (b.order_number || 0) - (a.order_number || 0);
          }
          if (aTs !== null) return -1;
          if (bTs !== null) return 1;
        }
        return (b.order_number || 0) - (a.order_number || 0);
      });
    } else {
      list.sort((a, b) => (b.order_number || 0) - (a.order_number || 0));
    }
    return list;
  }, [orders, sortMode, orderSearch, statusFilter]);
  if (!isOpen) return null;
  const handleDeleteOrder = async (orderId) => {
    if (!supabase) return;
    setDeletingOrderId(orderId);
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    setDeletingOrderId(null);
    setConfirmDeleteOrder(null);
    if (error) {
      onNotify("error", `\u062A\u0639\u0630\u0631 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628: ${error.message}`);
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
      onNotify("success", "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0646\u0647\u0627\u0626\u064A\u0627\u064B.");
    }
  };
  const toggleSelectOrder = (orderId) => {
    setSelectedOrderIds(
      (prev) => prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };
  const allDisplayedSelected = displayedOrders.length > 0 && displayedOrders.every((o) => selectedOrderIds.includes(o.id));
  const handleToggleSelectAllOrders = () => {
    if (allDisplayedSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(displayedOrders.map((o) => o.id));
    }
  };
  const handleConfirmBulkDeleteOrders = async () => {
    if (!supabase || !confirmBulkDelete || confirmBulkDelete.ids.length === 0) {
      return;
    }
    const targetIds = confirmBulkDelete.ids;
    const mode = confirmBulkDelete.mode;
    setBulkDeleting(true);
    try {
      const chunkSize = 100;
      for (let i = 0; i < targetIds.length; i += chunkSize) {
        const chunk = targetIds.slice(i, i + chunkSize);
        const { error } = await supabase.from("orders").delete().in("id", chunk);
        if (error) {
          onNotify("error", `\u062A\u0639\u0630\u0631 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062A: ${error.message}`);
          return;
        }
      }
      const deletedSet = new Set(targetIds);
      setOrders((prev) => prev.filter((o) => !deletedSet.has(o.id)));
      setSelectedOrderIds((prev) => prev.filter((id) => !deletedSet.has(id)));
      setConfirmBulkDelete(null);
      onNotify(
        "success",
        mode === "all" ? `\u062A\u0645 \u062D\u0630\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A (${targetIds.length}) \u0646\u0647\u0627\u0626\u064A\u0627\u064B.` : `\u062A\u0645 \u062D\u0630\u0641 ${targetIds.length} \u0637\u0644\u0628\u0627\u062A \u0645\u062D\u062F\u062F\u0629 \u0646\u0647\u0627\u0626\u064A\u0627\u064B.`
      );
    } finally {
      setBulkDeleting(false);
    }
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!supabase) return;
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628.");
    } else {
      setOrders(
        (prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      onNotify("success", `\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u062D\u0627\u0644\u0629 \u0625\u0644\u0649: ${newStatus}`);
    }
  };
  const handleUpdateOrderCost = async (orderId, costValue) => {
    if (!supabase) return;
    const safeCost = Math.max(0, costValue);
    setOrders(
      (prev) => prev.map(
        (o) => o.id === orderId ? {
          ...o,
          total_cost_price: safeCost,
          net_profit: Number(o.total_sell_price || 0) - safeCost
        } : o
      )
    );
    const { error } = await supabase.from("orders").update({ total_cost_price: safeCost }).eq("id", orderId);
    if (error) {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062A\u0643\u0644\u0641\u0629.");
    } else {
      onNotify("success", "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062A\u0643\u0644\u0641\u0629 \u0648\u062D\u0633\u0627\u0628 \u0627\u0644\u0641\u0627\u0626\u062F\u0629 \u0627\u0644\u0635\u0627\u0641\u064A\u0629.");
    }
  };
  const handleUpdateOrderPaidAmount = async (order, paidValue) => {
    if (!supabase) return;
    const safePaid = Math.max(0, Math.round(Number.isFinite(paidValue) ? paidValue : 0));
    const currentPaid = getOrderPaidAmount(order);
    setPaidDrafts((prev) => ({ ...prev, [order.id]: String(safePaid) }));
    if (safePaid === currentPaid && order.paid_amount === safePaid) {
      return;
    }
    const updatedProductDetails = {
      ...order.product_details || {},
      paid_amount: safePaid
    };
    setOrders(
      (prev) => prev.map(
        (o) => o.id === order.id ? {
          ...o,
          paid_amount: safePaid,
          product_details: updatedProductDetails
        } : o
      )
    );
    setSavingPaidOrderId(order.id);
    try {
      const { error } = await supabase.from("orders").update({
        paid_amount: safePaid,
        product_details: updatedProductDetails
      }).eq("id", order.id);
      if (error) {
        const { error: fallbackError } = await supabase.from("orders").update({
          product_details: updatedProductDetails
        }).eq("id", order.id);
        if (fallbackError) {
          onNotify("error", "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639.");
          return;
        }
      }
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062A\u0628\u0642\u064A.");
    } finally {
      setSavingPaidOrderId(null);
    }
  };
  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!supabase || !prodName.trim()) return;
    const { error } = await supabase.from("products").insert([
      {
        name: prodName.trim(),
        cost_price: Number(prodCost) || 0,
        sell_price: Number(prodSell) || 0,
        stock_quantity: Number(prodQty) || 0
      }
    ]);
    if (error) {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0644\u0639\u0629.");
    } else {
      setProdName("");
      setProdCost("");
      setProdSell("");
      setProdQty("");
      fetchData();
      onNotify("success", "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0644\u0639\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062E\u0632\u0648\u0646.");
    }
  };
  const persistShippingCompanies = async (nextList, successMsg) => {
    const sanitized = sanitizeShippingCompanies(nextList);
    setDraftShippingCompanies(sanitized);
    setSavingCourier(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        shippingCompanies: sanitized
      });
      const def = sanitized.find((c) => c.isDefault) || sanitized[0];
      if (def) {
        setDeliveryCompany(def.name);
      }
      onNotify("success", successMsg);
    } finally {
      setSavingCourier(false);
    }
  };
  const resetCourierForm = () => {
    setEditingCourierId(null);
    setCourierName("Yalidine");
    setCourierApiId("");
    setCourierApiToken("");
    setCourierIsDefault(draftShippingCompanies.length === 0);
    setCourierIsActive(true);
    setShowCourierToken(false);
  };
  const handleStartEditCourier = (company) => {
    setEditingCourierId(company.id);
    setCourierName(company.name);
    setCourierApiId(company.apiId);
    setCourierApiToken(company.apiToken);
    setCourierIsDefault(company.isDefault);
    setCourierIsActive(company.isActive);
    setShowCourierToken(false);
  };
  const handleSaveCourier = async (e) => {
    e.preventDefault();
    const cleanName = courierName.trim();
    if (!cleanName) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0648 \u0643\u062A\u0627\u0628\u0629 \u0627\u0633\u0645 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644.");
      return;
    }
    if (!editingCourierId && draftShippingCompanies.length >= 5) {
      onNotify(
        "error",
        "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0647\u0648 5 \u0634\u0631\u0643\u0627\u062A \u062A\u0648\u0635\u064A\u0644. \u064A\u0645\u0643\u0646\u0643 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062D\u0630\u0641 \u0625\u062D\u062F\u0649 \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629."
      );
      return;
    }
    const isDefaultVal = courierIsActive && (courierIsDefault || draftShippingCompanies.length === 0);
    let nextList;
    if (editingCourierId) {
      nextList = draftShippingCompanies.map((item) => {
        if (item.id === editingCourierId) {
          return {
            ...item,
            name: cleanName,
            apiId: courierApiId.trim(),
            apiToken: courierApiToken.trim(),
            isDefault: isDefaultVal,
            isActive: courierIsActive
          };
        }
        return isDefaultVal ? { ...item, isDefault: false } : item;
      });
    } else {
      const created = {
        id: `courier-${Date.now()}`,
        name: cleanName,
        apiId: courierApiId.trim(),
        apiToken: courierApiToken.trim(),
        isDefault: isDefaultVal,
        isActive: courierIsActive
      };
      nextList = [
        ...isDefaultVal ? draftShippingCompanies.map((c) => ({ ...c, isDefault: false })) : draftShippingCompanies,
        created
      ];
    }
    await persistShippingCompanies(
      nextList,
      editingCourierId ? `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0633\u0627\u0628 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 "${cleanName}" \u0628\u0646\u062C\u0627\u062D.` : `\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 "${cleanName}" \u0628\u0646\u062C\u0627\u062D.`
    );
    resetCourierForm();
  };
  const handleSetDefaultCourier = async (companyId) => {
    const target = draftShippingCompanies.find((c) => c.id === companyId);
    if (!target) return;
    const nextList = draftShippingCompanies.map((c) => ({
      ...c,
      isDefault: c.id === companyId,
      isActive: c.id === companyId ? true : c.isActive
    }));
    await persistShippingCompanies(
      nextList,
      `\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 "${target.name}" \u0643\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629.`
    );
  };
  const handleToggleCourierActive = async (companyId) => {
    const target = draftShippingCompanies.find((c) => c.id === companyId);
    if (!target) return;
    const nextActive = !target.isActive;
    const nextList = draftShippingCompanies.map(
      (c) => c.id === companyId ? {
        ...c,
        isActive: nextActive,
        isDefault: nextActive ? c.isDefault : false
      } : c
    );
    await persistShippingCompanies(
      nextList,
      nextActive ? `\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u062D\u0633\u0627\u0628 "${target.name}".` : `\u062A\u0645 \u062A\u0639\u0637\u064A\u0644 \u062D\u0633\u0627\u0628 "${target.name}" \u0645\u0624\u0642\u062A\u0627\u064B.`
    );
  };
  const handleDeleteCourier = async (companyId) => {
    const target = draftShippingCompanies.find((c) => c.id === companyId);
    const nextList = draftShippingCompanies.filter((c) => c.id !== companyId);
    if (editingCourierId === companyId) {
      resetCourierForm();
    }
    await persistShippingCompanies(
      nextList,
      `\u062A\u0645 \u062D\u0630\u0641 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 "${target?.name || ""}".`
    );
  };
  const handleUpdateOrderCourier = async (order, nextCourier) => {
    if (!supabase) return;
    const updatedDetails = {
      ...order.product_details || {},
      courier: nextCourier
    };
    setOrders(
      (prev) => prev.map(
        (o) => o.id === order.id ? { ...o, product_details: updatedDetails } : o
      )
    );
    const { error } = await supabase.from("orders").update({ product_details: updatedDetails }).eq("id", order.id);
    if (error) {
      onNotify("error", "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628.");
    } else {
      onNotify("success", `\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0634\u0631\u0643\u0629 "${nextCourier}" \u0644\u0644\u0637\u0644\u0628 #${order.order_number}.`);
    }
  };
  const handleAddCustomDeliveryOffice = async (e) => {
    e.preventDefault();
    const cleanName = newOfficeName.trim();
    const cleanNotes = newOfficeNotes.trim();
    if (!cleanName) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0633\u0645 \u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0623\u0648 \u0627\u0644\u0634\u0631\u0643\u0629.");
      return;
    }
    const existingOffices = dynamicSettings.customDeliveryOffices || [];
    const builtInLower = [
      "yalidine",
      "yalidine express",
      "zr express",
      "noest",
      "noest express",
      "maystro",
      "maystro delivery",
      "anderson",
      "anderson logistics"
    ];
    const normalizedName = cleanName.toLowerCase();
    if (builtInLower.includes(normalizedName) || existingOffices.some((o) => o.name.trim().toLowerCase() === normalizedName)) {
      onNotify("error", "\u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0647\u0630\u0627 \u0645\u0648\u062C\u0648\u062F \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");
      return;
    }
    const newOffice = {
      id: `office-${Date.now()}`,
      name: cleanName,
      ...cleanNotes ? { notes: cleanNotes } : {}
    };
    const nextSettings = {
      ...dynamicSettings,
      customDeliveryOffices: [...existingOffices, newOffice]
    };
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings(nextSettings);
      setDeliveryCompany(cleanName);
      setNewOfficeName("");
      setNewOfficeNotes("");
      onNotify("success", `\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 "${cleanName}" \u0648\u062A\u062D\u062F\u064A\u062F\u0647 \u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629.`);
    } finally {
      setSavingSettings(false);
    }
  };
  const handleDeleteCustomDeliveryOffice = async (office) => {
    const existingOffices = dynamicSettings.customDeliveryOffices || [];
    const updatedOffices = existingOffices.filter((item) => item.id !== office.id);
    const nextSettings = {
      ...dynamicSettings,
      customDeliveryOffices: updatedOffices
    };
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings(nextSettings);
      if (deliveryCompany === office.name) {
        setDeliveryCompany("Yalidine");
        if (supabase) {
          await supabase.from("store_settings").upsert(
            {
              id: 1,
              delivery_company: "Yalidine",
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            },
            { onConflict: "id" }
          );
        }
      }
      onNotify("info", `\u062A\u0645 \u062D\u0630\u0641 \u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 "${office.name}".`);
    } finally {
      setSavingSettings(false);
    }
  };
  const handleBulkApplyDeliveryPricing = () => {
    const hasOffice = bulkOfficePrice.trim() !== "";
    const hasHome = bulkHomePrice.trim() !== "";
    if (!hasOffice && !hasHome) {
      onNotify(
        "error",
        "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0633\u0639\u0631 \u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0643\u062A\u0628 \u0623\u0648 \u0644\u0644\u0645\u0646\u0632\u0644 \u0642\u0628\u0644 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u062A\u0637\u0628\u064A\u0642."
      );
      return;
    }
    const nextOffice = hasOffice ? Math.max(0, Math.round(Number(bulkOfficePrice) || 0)) : null;
    const nextHome = hasHome ? Math.max(0, Math.round(Number(bulkHomePrice) || 0)) : null;
    setDraftDeliveryPricing((prev) => {
      const nextWilayas = { ...prev.wilayas };
      for (const wilaya of ALGERIA_WILAYAS) {
        const current = nextWilayas[wilaya] || {
          home: prev.defaultHomePrice || 0,
          office: prev.defaultOfficePrice || 0
        };
        nextWilayas[wilaya] = {
          office: nextOffice !== null ? nextOffice : current.office,
          home: nextHome !== null ? nextHome : current.home
        };
      }
      return {
        ...prev,
        defaultOfficePrice: nextOffice !== null ? nextOffice : prev.defaultOfficePrice,
        defaultHomePrice: nextHome !== null ? nextHome : prev.defaultHomePrice,
        wilayas: nextWilayas
      };
    });
    onNotify(
      "info",
      '\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u0648\u062D\u062F \u0639\u0644\u0649 \u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A (58). \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" \u0644\u0627\u0639\u062A\u0645\u0627\u062F\u0647.'
    );
  };
  const handleToggleFreeDelivery = async () => {
    const nextFree = !draftDeliveryPricing.freeDelivery;
    const nextPricing = {
      ...draftDeliveryPricing,
      freeDelivery: nextFree,
      ...nextFree ? { deliveryLocked: false } : {}
    };
    setDraftDeliveryPricing(nextPricing);
    setSavingDeliveryPricing(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        deliveryPricing: nextPricing
      });
      onNotify(
        nextFree ? "success" : "info",
        nextFree ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u062C\u0627\u0646\u064A \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0648\u062D\u0641\u0638\u0647." : "\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u062C\u0627\u0646\u064A \u0648\u062A\u0641\u0639\u064A\u0644 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u0645\u062D\u062F\u062F\u0629."
      );
    } finally {
      setSavingDeliveryPricing(false);
    }
  };
  const handleToggleDeliveryLocked = async () => {
    const nextLocked = !Boolean(draftDeliveryPricing.deliveryLocked);
    const nextPricing = {
      ...draftDeliveryPricing,
      deliveryLocked: nextLocked,
      ...nextLocked ? { freeDelivery: false } : {}
    };
    setDraftDeliveryPricing(nextPricing);
    setSavingDeliveryPricing(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        deliveryPricing: nextPricing
      });
      onNotify(
        nextLocked ? "info" : "success",
        nextLocked ? "\u062A\u0645 \u0642\u0641\u0644 \u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0645\u0624\u0642\u062A\u0627\u064B (\u064A\u064F\u062D\u062F\u0651\u062F \u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628)." : "\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0642\u0641\u0644 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0648\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629."
      );
    } finally {
      setSavingDeliveryPricing(false);
    }
  };
  const handleWilayaPriceChange = (wilayaName, field, rawValue) => {
    const cleanVal = rawValue.trim() === "" ? 0 : Math.max(0, Math.round(Number(rawValue) || 0));
    setDraftDeliveryPricing((prev) => {
      const existing = prev.wilayas[wilayaName] || {
        home: prev.defaultHomePrice || 0,
        office: prev.defaultOfficePrice || 0
      };
      return {
        ...prev,
        wilayas: {
          ...prev.wilayas,
          [wilayaName]: {
            ...existing,
            [field]: cleanVal
          }
        }
      };
    });
  };
  const handleSaveDeliveryPricing = async (e) => {
    e.preventDefault();
    setSavingDeliveryPricing(true);
    try {
      const sanitized = sanitizeDeliveryPricing(draftDeliveryPricing);
      setDraftDeliveryPricing(sanitized);
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        deliveryPricing: sanitized
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u0640 58 \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingDeliveryPricing(false);
    }
  };
  const handleResetDeliveryPricing = () => {
    setDraftDeliveryPricing(createDefaultDeliveryPricing(0, 0));
    setBulkOfficePrice("");
    setBulkHomePrice("");
    onNotify("info", '\u062A\u0645 \u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u0624\u0642\u062A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" \u0644\u0644\u062A\u0623\u0643\u064A\u062F.');
  };
  const handleAddColor = async (listKey, e) => {
    e.preventDefault();
    const form = newColorForms[listKey];
    const cleanName = form.name.trim();
    if (!cleanName) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0633\u0645 \u0627\u0644\u0644\u0648\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629.");
      return;
    }
    const extraPrice = Math.max(0, Number(form.extraPrice) || 0);
    const newSwatch = {
      name: cleanName,
      hex: form.hex || "#141212",
      extraPrice,
      ...listKey === "stoleColors" ? { defaultThreadHex: "#d4af37", defaultThreadName: "\u0630\u0647\u0628\u064A \u0645\u0644\u0643\u064A" } : {}
    };
    const nextSettings = {
      ...dynamicSettings,
      [listKey]: [...dynamicSettings[listKey], newSwatch]
    };
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings(nextSettings);
      setNewColorForms((prev) => ({
        ...prev,
        [listKey]: { name: "", hex: form.hex, extraPrice: "0" }
      }));
      onNotify("success", `\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0644\u0648\u0646 "${cleanName}" \u0648\u062D\u0641\u0638\u0647.`);
    } finally {
      setSavingSettings(false);
    }
  };
  const handleDeleteColor = async (listKey, index) => {
    const target = dynamicSettings[listKey][index];
    const updatedList = dynamicSettings[listKey].filter((_, idx) => idx !== index);
    const nextSettings = {
      ...dynamicSettings,
      [listKey]: updatedList
    };
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings(nextSettings);
      onNotify("info", `\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0644\u0648\u0646 "${target?.name || ""}".`);
    } finally {
      setSavingSettings(false);
    }
  };
  const handleResetColorList = async (listKey) => {
    const defaultsMap = {
      stoleColors: DEFAULT_STOLE_COLORS,
      gownColors: DEFAULT_GOWN_COLORS,
      threadColors: THREAD_COLORS,
      capColors: CAP_SWATCHES
    };
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        [listKey]: defaultsMap[listKey]
      });
      onNotify("success", "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleToggleOrdersPaused = async (nextPaused) => {
    setDraftPaused(nextPaused);
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        ordersPaused: nextPaused,
        pauseMessage: draftPauseMessage.trim() || DEFAULT_PAUSE_MESSAGE
      });
      onNotify(
        nextPaused ? "info" : "success",
        nextPaused ? "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0645\u0624\u0642\u062A\u0627\u064B \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062A\u062C\u0631." : "\u062A\u0645 \u0641\u062A\u062D \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0644\u0644\u0632\u0628\u0627\u0626\u0646 \u0628\u0646\u062C\u0627\u062D."
      );
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSavePauseSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        ordersPaused: draftPaused,
        pauseMessage: draftPauseMessage.trim() || DEFAULT_PAUSE_MESSAGE
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleToggleSeasonBanner = async (nextEnabled) => {
    setDraftSeasonBannerEnabled(nextEnabled);
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        seasonBannerEnabled: nextEnabled,
        seasonBannerText: draftSeasonBannerText.trim() || DEFAULT_SEASON_BANNER_TEXT
      });
      onNotify(
        nextEnabled ? "success" : "info",
        nextEnabled ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C \u0623\u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631." : "\u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C \u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631."
      );
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveSeasonBanner = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        seasonBannerEnabled: draftSeasonBannerEnabled,
        seasonBannerText: draftSeasonBannerText.trim() || DEFAULT_SEASON_BANNER_TEXT
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleToggleCategoryPaused = async (category, label) => {
    const nextPaused = !Boolean(draftPausedCategories[category]);
    const nextMap = {
      ...draftPausedCategories,
      [category]: nextPaused
    };
    if (!nextPaused) {
      delete nextMap[category];
    }
    setDraftPausedCategories(nextMap);
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        pausedCategories: nextMap,
        categoryPauseBadge: draftCategoryPauseBadge.trim() || DEFAULT_CATEGORY_PAUSE_BADGE
      });
      onNotify(
        nextPaused ? "info" : "success",
        nextPaused ? `\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 "${label}" \u0645\u0624\u0642\u062A\u0627\u064B \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062A\u062C\u0631.` : `\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 "${label}" \u0644\u0644\u0637\u0644\u0628 \u0627\u0644\u0622\u0646.`
      );
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveCategoryAvailability = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        pausedCategories: draftPausedCategories,
        categoryPauseBadge: draftCategoryPauseBadge.trim() || DEFAULT_CATEGORY_PAUSE_BADGE
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u062D\u0627\u0644\u0629 \u062A\u0648\u0641\u0631 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0639\u0628\u0627\u0631\u0629 \u0627\u0644\u062A\u0646\u0628\u064A\u0647 \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSavePaymentInfo = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        paymentInfo: draftPaymentInfo.trim() || DEFAULT_PAYMENT_INFO
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP (\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631) \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveStoreName = async (e) => {
    e.preventDefault();
    const cleanName = draftStoreName.trim() || "DG by Douaa";
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        customTexts: {
          ...dynamicSettings.customTexts || {},
          "header.brandName": cleanName,
          "footer.brandName": cleanName
        }
      });
      setDraftStoreName(cleanName);
      onNotify("success", `\u062A\u0645 \u062D\u0641\u0638 \u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631 "${cleanName}" \u0648\u062A\u062D\u062F\u064A\u062B\u0647 \u0641\u064A \u0627\u0644\u0645\u0648\u0642\u0639.`);
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveWhatsappNumber = async (e) => {
    e.preventDefault();
    const formatted = normalizeWhatsAppInput(draftWhatsappNumber);
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        whatsappNumber: formatted
      });
      setDraftWhatsappNumber(formatted);
      onNotify(
        "success",
        formatted ? `\u062A\u0645 \u062D\u0641\u0638 \u0631\u0642\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u0646\u062C\u0627\u062D (https://wa.me/${formatted}).` : `\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0631\u0642\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A (${WHATSAPP_NUMBER}).`
      );
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveSocialLinks = async (e) => {
    e.preventDefault();
    const instagramUrl = sanitizeSocialUrl(draftInstagramUrl);
    const facebookUrl = sanitizeSocialUrl(draftFacebookUrl);
    const tiktokUrl = sanitizeSocialUrl(draftTiktokUrl);
    if (draftInstagramUrl.trim() && !instagramUrl) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0627\u0628\u0637 \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645 \u0635\u0627\u0644\u062D.");
      return;
    }
    if (draftFacebookUrl.trim() && !facebookUrl) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0627\u0628\u0637 \u0641\u064A\u0633\u0628\u0648\u0643 \u0635\u0627\u0644\u062D.");
      return;
    }
    if (draftTiktokUrl.trim() && !tiktokUrl) {
      onNotify("error", "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0627\u0628\u0637 \u062A\u064A\u0643 \u062A\u0648\u0643 \u0635\u0627\u0644\u062D.");
      return;
    }
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        instagramUrl,
        facebookUrl,
        tiktokUrl
      });
      setDraftInstagramUrl(instagramUrl);
      setDraftFacebookUrl(facebookUrl);
      setDraftTiktokUrl(tiktokUrl);
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0631\u0648\u0627\u0628\u0637 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleToggleTelegramEnabled = async (nextEnabled) => {
    setDraftTelegramEnabled(nextEnabled);
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        telegramEnabled: nextEnabled,
        telegramBotToken: draftTelegramToken.trim(),
        telegramChatId: draftTelegramChatId.trim()
      });
      onNotify(
        nextEnabled ? "success" : "info",
        nextEnabled ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0625\u0634\u0639\u0627\u0631\u0627\u062A Telegram \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0644\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629." : "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0625\u0634\u0639\u0627\u0631\u0627\u062A Telegram."
      );
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveTelegramSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateDynamicSettings({
        ...dynamicSettings,
        telegramEnabled: draftTelegramEnabled,
        telegramBotToken: draftTelegramToken.trim(),
        telegramChatId: draftTelegramChatId.trim()
      });
      onNotify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0634\u0639\u0627\u0631\u0627\u062A Telegram \u0628\u0646\u062C\u0627\u062D.");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSendTelegramTest = async () => {
    setTestingTelegram(true);
    try {
      const res = await sendTelegramTestMessage(
        draftTelegramToken,
        draftTelegramChatId
      );
      if (res.ok) {
        onNotify("success", "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A\u0629 \u0625\u0644\u0649 Telegram \u0628\u0646\u062C\u0627\u062D!");
      } else {
        onNotify("error", res.error || "\u062A\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A\u0629.");
      }
    } finally {
      setTestingTelegram(false);
    }
  };
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    const cleanEmail = newAdminEmail.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const msg = "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0635\u062D\u064A\u062D.";
      setEmailError(msg);
      onNotify("error", msg);
      return;
    }
    setUpdatingEmail(true);
    try {
      await updateAdminEmail(cleanEmail);
      const successMsg = "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0627\u0628\u0637 \u062A\u0623\u0643\u064A\u062F \u0625\u0644\u0649 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u062C\u062F\u064A\u062F (\u0648\u0627\u0644\u062D\u0627\u0644\u064A \u0625\u0630\u0627 \u0644\u0632\u0645 \u0627\u0644\u0623\u0645\u0631). \u064A\u0631\u062C\u0649 \u0641\u062A\u062D \u0627\u0644\u0628\u0631\u064A\u062F \u0648\u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062A\u062D\u062F\u064A\u062B.";
      setEmailSuccess(successMsg);
      setNewAdminEmail("");
      onNotify("success", "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0628\u0646\u062C\u0627\u062D.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A.";
      setEmailError(msg);
      onNotify("error", msg);
    } finally {
      setUpdatingEmail(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      const msg = "\u064A\u062C\u0628 \u0623\u0646 \u062A\u062A\u0643\u0648\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0645\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.";
      setPasswordError(msg);
      onNotify("error", msg);
      return;
    }
    if (newPassword !== confirmPassword) {
      const msg = "\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646.";
      setPasswordError(msg);
      onNotify("error", msg);
      return;
    }
    setUpdatingPassword(true);
    try {
      await updateAdminPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      onNotify("success", "\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0628\u0646\u062C\u0627\u062D.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631.";
      setPasswordError(msg);
      onNotify("error", msg);
    } finally {
      setUpdatingPassword(false);
    }
  };
  const handleExportCSV = () => {
    const headers = [
      "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628",
      "\u0627\u0644\u0627\u0633\u0645",
      "\u0627\u0644\u0647\u0627\u062A\u0641",
      "\u0627\u0644\u0648\u0644\u0627\u064A\u0629",
      "\u0627\u0644\u0628\u0644\u062F\u064A\u0629",
      "\u0627\u0644\u062A\u0648\u0635\u064A\u0644",
      "\u0645\u0648\u0639\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
      "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0642\u0637\u0639",
      "\u0645\u0644\u0627\u062D\u0638\u0627\u062A",
      "\u0627\u0644\u0645\u0628\u0644\u063A",
      "\u0627\u0644\u0645\u062F\u0641\u0648\u0639 (\u062F\u062C)",
      "\u0627\u0644\u0645\u062A\u0628\u0642\u064A (\u062F\u062C)",
      "\u0627\u0644\u062A\u0643\u0644\u0641\u0629",
      "\u0627\u0644\u0641\u0627\u0626\u062F\u0629",
      "\u0627\u0644\u062D\u0627\u0644\u0629"
    ];
    const rows = orders.map((o) => {
      const phoneVal = o.phone || o.customer_phone || "";
      const itemsSummary = getOrderItems(o).map(
        (it) => `${it.title || it.name || "\u0645\u0646\u062A\u062C"} \xD7${it.quantity || 1}${it.details ? ` (${it.details})` : ""}`
      ).join(" | ");
      const deliveryDateVal = o.product_details?.deliveryDate || "";
      const notesVal = o.product_details?.notes || "";
      const totalSell = Number(o.total_sell_price || 0);
      const paidAmt = getOrderPaidAmount(o);
      const remainingAmt = Math.max(0, totalSell - paidAmt);
      return [
        o.order_number,
        `"${(o.customer_name || "").replace(/"/g, '""')}"`,
        `"${phoneVal.replace(/"/g, '""')}"`,
        `"${(o.wilaya || "").replace(/"/g, '""')}"`,
        `"${(o.commune || "").replace(/"/g, '""')}"`,
        `"${o.delivery_type === "office" ? "\u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" : "\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644"}"`,
        `"${deliveryDateVal}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${notesVal.replace(/"/g, '""')}"`,
        totalSell,
        paidAmt,
        remainingAmt,
        o.total_cost_price,
        getOrderNetProfit(o),
        `"${o.status}"`
      ];
    });
    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const activeOrders = orders.filter((o) => o.status !== "\u0645\u0644\u063A\u0649");
  const newStatusOrdersCount = orders.filter((o) => o.status === "\u062C\u062F\u064A\u062F").length;
  const totalSales = activeOrders.reduce((s, o) => s + Number(o.total_sell_price || 0), 0);
  const totalProfit = activeOrders.reduce((s, o) => s + getOrderNetProfit(o), 0);
  const activeStoreDisplayName = draftStoreName.trim() || resolvedStoreName;
  const saasCardClass = "bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]";
  const saasInputClass = "w-full bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E1734]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 transition-all";
  const saasCompactInputClass = "bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E1734]/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-900 tabular-nums transition-all";
  const statusFilterOptions = [
    { id: "\u0627\u0644\u0643\u0644", label: "\u0627\u0644\u0643\u0644", count: orders.length },
    {
      id: "\u062C\u062F\u064A\u062F",
      label: "\u062C\u062F\u064A\u062F",
      count: orders.filter((o) => matchesOrderStatusFilter(o.status, "\u062C\u062F\u064A\u062F")).length
    },
    {
      id: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644",
      label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644",
      count: orders.filter((o) => matchesOrderStatusFilter(o.status, "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644")).length
    },
    {
      id: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645",
      label: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645",
      count: orders.filter((o) => matchesOrderStatusFilter(o.status, "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645")).length
    },
    {
      id: "\u0645\u0643\u062A\u0645\u0644",
      label: "\u0645\u0643\u062A\u0645\u0644",
      count: orders.filter((o) => matchesOrderStatusFilter(o.status, "\u0645\u0643\u062A\u0645\u0644")).length
    }
  ];
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-neutral-950/50 backdrop-blur-xs",
      role: "dialog",
      "aria-modal": "true",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50 border border-neutral-200/90 rounded-2xl max-w-5xl w-[97vw] max-h-[94vh] h-[94vh] flex flex-col shadow-2xl overflow-hidden text-neutral-900", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-5 py-3.5 bg-white border-b border-neutral-200/80 flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-[#5E1734] text-white flex items-center justify-center shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(Store, { className: "w-4 h-4 text-[#E5C77A]", strokeWidth: 1.75 }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-sm sm:text-base font-bold tracking-tight text-neutral-900 truncate", children: "\u0644\u0648\u062D\u0629 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u0623\u0631\u0628\u0627\u062D" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium truncate", children: activeStoreDisplayName })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500 hidden sm:block mt-0.5", children: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\u060C \u0627\u0644\u0645\u062E\u0632\u0648\u0646\u060C \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0644\u0648\u0627\u0646\u060C \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            isPwaInstallable && !isPwaInstalled && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleAdminPwaInstall,
                className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer transition-colors",
                title: "\u062A\u062B\u0628\u064A\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0643\u062A\u0637\u0628\u064A\u0642",
                children: [
                  /* @__PURE__ */ jsx(Smartphone, { className: "w-3.5 h-3.5 text-[#E5C77A]", strokeWidth: 1.75 }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u062B\u0628\u064A\u062A \u0643\u062A\u0637\u0628\u064A\u0642" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  fetchData();
                  onAcknowledgeNewOrders?.();
                },
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-semibold cursor-pointer transition-colors",
                title: "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
                children: [
                  /* @__PURE__ */ jsx(
                    RefreshCw,
                    {
                      className: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`,
                      strokeWidth: 1.75
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "\u062A\u062D\u062F\u064A\u062B" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer transition-colors",
                "aria-label": "\u0625\u063A\u0644\u0627\u0642",
                children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4", strokeWidth: 1.75 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-3 sm:px-5 pt-3 pb-2.5 bg-neutral-50/70 border-b border-neutral-200/80 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2.5 sm:gap-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#5E1734] shrink-0" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-500 truncate", children: "\u0637\u0644\u0628\u0627\u062A \u062C\u062F\u064A\u062F\u0629" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-[#5E1734] tabular-nums mt-1.5 leading-none", children: newStatusOrdersCount.toLocaleString("en-US") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden sm:flex w-9 h-9 rounded-xl bg-[#5E1734]/8 border border-[#5E1734]/15 items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-500 truncate", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm sm:text-2xl font-bold text-neutral-900 tabular-nums mt-1.5 leading-none truncate", children: [
                totalSales.toLocaleString("en-US"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-medium text-neutral-500", children: "\u062F\u062C" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden sm:flex w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/80 items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 text-neutral-700", strokeWidth: 1.75 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-500 truncate", children: "\u0635\u0627\u0641\u064A \u0627\u0644\u0641\u0627\u0626\u062F\u0629" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm sm:text-2xl font-bold text-emerald-700 tabular-nums mt-1.5 leading-none truncate", children: [
                totalProfit.toLocaleString("en-US"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-medium text-emerald-600/80", children: "\u062F\u062C" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden sm:flex w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-emerald-700", strokeWidth: 1.75 }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "px-3 sm:px-5 py-2.5 bg-white border-b border-neutral-200/80 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-neutral-100/90 p-1 rounded-xl grid grid-cols-4 gap-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setActiveTab("orders");
                onAcknowledgeNewOrders?.();
              },
              className: `relative inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all ${activeTab === "orders" ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
              children: [
                /* @__PURE__ */ jsx(ShoppingBag, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums leading-none ${activeTab === "orders" ? "bg-[#5E1734] text-white" : "bg-neutral-200/80 text-neutral-700"}`,
                    children: orders.length
                  }
                ),
                newOrdersCount > 0 && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("inventory"),
              className: `inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all ${activeTab === "inventory" ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
              children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u0633\u0644\u0639\u0629 \u0648\u0627\u0644\u0641\u0627\u0626\u062F\u0629" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("colors"),
              className: `inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all ${activeTab === "colors" ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
              children: [
                /* @__PURE__ */ jsx(Palette, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("span", { children: "\u062F\u0648\u0627\u0626\u0631 \u0627\u0644\u0623\u0644\u0648\u0627\u0646" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("settings"),
              className: `relative inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all ${activeTab === "settings" ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : dynamicSettings.ordersPaused ? "text-rose-700 bg-rose-50/70 hover:bg-rose-50" : "text-neutral-600 hover:text-neutral-900"}`,
              children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("span", { children: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631" }),
                dynamicSettings.telegramEnabled && /* @__PURE__ */ jsx(
                  Bell,
                  {
                    className: `hidden sm:inline-block w-3 h-3 shrink-0 ${activeTab === "settings" ? "text-emerald-600" : "text-emerald-600"}`,
                    strokeWidth: 1.75
                  }
                )
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-3 sm:p-5 space-y-4", children: loading ? /* @__PURE__ */ jsx("div", { className: "py-16 flex justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-[#5E1734]", strokeWidth: 1.75 }) }) : activeTab === "orders" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200/80 rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsx(
                  Search,
                  {
                    className: "w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none",
                    strokeWidth: 1.75
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: orderSearch,
                    onChange: (e) => setOrderSearch(e.target.value),
                    placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646\u060C \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628...",
                    className: "w-full bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E1734]/10 rounded-xl pr-10 pl-9 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 transition-all"
                  }
                ),
                orderSearch && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOrderSearch(""),
                    "aria-label": "\u0645\u0633\u062D \u0627\u0644\u0628\u062D\u062B",
                    className: "absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer",
                    children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSortMode((prev) => prev === "newest" ? "urgent" : "newest"),
                    className: `inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${sortMode === "urgent" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"}`,
                    title: "\u062A\u0628\u062F\u064A\u0644 \u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
                    children: [
                      /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: sortMode === "newest" ? "\u0627\u0644\u0623\u062D\u062F\u062B \u0623\u0648\u0644\u0627\u064B" : "\u0627\u0644\u0623\u0642\u0631\u0628 \u062A\u062E\u0631\u062C\u0627\u064B" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleExportCSV,
                    className: "inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062A\u0635\u062F\u064A\u0631 Excel" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-neutral-100/90 p-1 rounded-xl flex items-center gap-1 overflow-x-auto", children: statusFilterOptions.map((opt) => {
              const active = statusFilter === opt.id;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setStatusFilter(opt.id),
                  className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all ${active ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: opt.label }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums leading-none ${active ? "bg-[#5E1734] text-white" : "bg-neutral-200/80 text-neutral-600"}`,
                        children: opt.count
                      }
                    )
                  ]
                },
                opt.id
              );
            }) })
          ] }),
          displayedOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-neutral-200/80 py-12 px-4 text-center space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-neutral-600", children: orders.length === 0 ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0642\u0627\u0639\u062F\u0629 \u0628\u0639\u062F." : "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0628\u062D\u062B \u0623\u0648 \u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062D\u062F\u062F\u0629." }),
            (orderSearch || statusFilter !== "\u0627\u0644\u0643\u0644") && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setOrderSearch("");
                  setStatusFilter("\u0627\u0644\u0643\u0644");
                },
                className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer transition-colors",
                children: [
                  "\u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A (",
                  orders.length,
                  ")"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)]", children: [
              /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 cursor-pointer select-none transition-colors", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: allDisplayedSelected,
                    onChange: handleToggleSelectAllOrders,
                    className: "w-4 h-4 accent-[#5E1734] rounded cursor-pointer"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: allDisplayedSelected ? `\u0625\u0644\u063A\u0627\u0621 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0643\u0644 (${displayedOrders.length})` : `\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0643\u0644 (${displayedOrders.length})` })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                selectedOrderIds.length > 0 && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: bulkDeleting,
                    onClick: () => setConfirmBulkDelete({
                      mode: "selected",
                      ids: [...selectedOrderIds]
                    }),
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60",
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
                        "\u062D\u0630\u0641 \u0627\u0644\u0645\u062D\u062F\u062F (",
                        selectedOrderIds.length,
                        ")"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: bulkDeleting,
                    onClick: () => setConfirmBulkDelete({
                      mode: "all",
                      ids: displayedOrders.map((o) => o.id)
                    }),
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-bold transition-colors cursor-pointer disabled:opacity-60",
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641 \u0627\u0644\u0643\u0644" })
                    ]
                  }
                )
              ] })
            ] }),
            displayedOrders.map((order) => {
              const rawItems = getOrderItems(order);
              const displayNotes = order.product_details?.notes || "";
              const deliveryDate = order.product_details?.deliveryDate || "";
              const daysUntil = getDaysUntilDelivery(deliveryDate);
              const isActiveOrder = order.status !== "\u0645\u0644\u063A\u0649" && order.status !== "\u0645\u0643\u062A\u0645\u0644";
              const priorityTier = !isActiveOrder ? "neutral" : daysUntil !== null && daysUntil <= 7 ? "red" : daysUntil !== null && daysUntil <= 20 ? "amber" : "green";
              const cardColorClass = priorityTier === "red" ? "bg-white border-rose-200/90" : priorityTier === "amber" ? "bg-white border-amber-200/90" : "bg-white border-neutral-200/80";
              const priorityBadge = priorityTier === "red" && daysUntil !== null ? {
                className: "bg-rose-50 text-rose-700 border border-rose-200/80",
                text: `\u0645\u0633\u062A\u0639\u062C\u0644 \xB7 ${formatRemainingDaysArabic(daysUntil)}`,
                Icon: AlertTriangle
              } : priorityTier === "amber" && daysUntil !== null ? {
                className: "bg-amber-50 text-amber-700 border border-amber-200/80",
                text: `\u0642\u0631\u064A\u0628 \xB7 ${formatRemainingDaysArabic(daysUntil)}`,
                Icon: Clock
              } : priorityTier === "green" ? {
                className: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
                text: daysUntil !== null ? `\u0645\u0631\u064A\u062D \xB7 ${formatRemainingDaysArabic(daysUntil)}` : "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F \u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                Icon: CheckCircle2
              } : null;
              const orderStatusPillClass = order.status === "\u062C\u062F\u064A\u062F" ? "bg-[#5E1734]/10 text-[#5E1734] border border-[#5E1734]/20" : order.status === "\u0645\u0643\u062A\u0645\u0644" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" : order.status === "\u0645\u0644\u063A\u0649" ? "bg-neutral-100 text-neutral-500 border border-neutral-200" : order.status === "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645" || order.status === "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644" ? "bg-sky-50 text-sky-700 border border-sky-200/80" : "bg-amber-50 text-amber-700 border border-amber-200/80";
              const customerPhone = order.phone || order.customer_phone || "";
              const netProfit = getOrderNetProfit(order);
              const cleanCustomerWa = normalizeWhatsAppInput(customerPhone);
              const courierNameForWa = order.product_details?.courier || draftShippingCompanies.find((c) => c.isDefault)?.name || deliveryCompany || "\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644";
              const waConfirmMessage = order.status === "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645" || order.status === "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644" ? `\u0645\u0631\u062D\u0628\u0627\u064B ${order.customer_name}\u060C \u0637\u0644\u0628\u0643 \u0631\u0642\u0645 #${order.order_number} \u0645\u0646 \u0645\u062A\u062C\u0631 ${activeStoreDisplayName} \u0623\u0635\u0628\u062D \u062C\u0627\u0647\u0632\u0627\u064B \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0639\u0628\u0631 (${courierNameForWa}) \u0646\u062D\u0648 \u0648\u0644\u0627\u064A\u0629 ${order.wilaya}. \u0634\u0643\u0631\u0627\u064B \u0644\u062B\u0642\u062A\u0643 \u0628\u0646\u0627!` : `\u0645\u0631\u062D\u0628\u0627\u064B ${order.customer_name}\u060C \u0646\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0628\u062E\u0635\u0648\u0635 \u0637\u0644\u0628\u0643 \u0631\u0642\u0645 #${order.order_number} \u0645\u0646 \u0645\u062A\u062C\u0631 ${activeStoreDisplayName} (\u0648\u0644\u0627\u064A\u0629 ${order.wilaya}). \u0646\u0624\u0643\u062F \u0644\u0643 \u0645\u062A\u0627\u0628\u0639\u0629 \u0637\u0644\u0628\u0643 \u0628\u0643\u0644 \u0639\u0646\u0627\u064A\u0629!`;
              const knownLegacyStatuses = ["\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631", "\u0645\u0624\u0643\u062F", "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644"];
              const isLegacyStatus = knownLegacyStatuses.includes(order.status);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `rounded-2xl border p-4 sm:p-5 space-y-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all ${cardColorClass}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-neutral-100", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 min-w-0", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg bg-[#5E1734] text-white tabular-nums", children: [
                            "#",
                            order.order_number
                          ] }),
                          /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-bold text-neutral-900", children: order.customer_name }),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${orderStatusPillClass}`,
                              children: order.status
                            }
                          ),
                          priorityBadge && /* @__PURE__ */ jsxs(
                            "span",
                            {
                              className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge.className}`,
                              children: [
                                /* @__PURE__ */ jsx(priorityBadge.Icon, { className: "w-3 h-3 shrink-0", strokeWidth: 1.75 }),
                                /* @__PURE__ */ jsx("span", { children: priorityBadge.text })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500", children: [
                          customerPhone && /* @__PURE__ */ jsx("span", { dir: "ltr", className: "font-semibold text-neutral-700 tabular-nums", children: customerPhone }),
                          customerPhone && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-[#5E1734]", strokeWidth: 1.75 }),
                            order.wilaya,
                            order.commune && order.commune !== "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629" ? ` - ${order.commune}` : "",
                            " \xB7 ",
                            order.delivery_type === "office" ? "\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646 \u0627\u0644\u0645\u0643\u062A\u0628" : "\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644"
                          ] }),
                          deliveryDate && /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                            /* @__PURE__ */ jsxs(
                              "span",
                              {
                                className: `inline-flex items-center gap-1 ${priorityTier === "red" ? "text-rose-700 font-semibold" : priorityTier === "amber" ? "text-amber-700 font-semibold" : "text-neutral-700"}`,
                                children: [
                                  /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-[#5E1734]", strokeWidth: 1.75 }),
                                  /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: deliveryDate })
                                ]
                              }
                            )
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                        /* @__PURE__ */ jsxs(
                          "select",
                          {
                            value: order.status,
                            onChange: (e) => handleUpdateOrderStatus(order.id, e.target.value),
                            "aria-label": `\u062A\u063A\u064A\u064A\u0631 \u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628 #${order.order_number}`,
                            className: "bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 cursor-pointer transition-all",
                            children: [
                              /* @__PURE__ */ jsx("option", { value: "\u062C\u062F\u064A\u062F", children: "\u062C\u062F\u064A\u062F" }),
                              /* @__PURE__ */ jsx("option", { value: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644", children: "\u0642\u064A\u062F \u0627\u0644\u062A\u0641\u0635\u064A\u0644" }),
                              /* @__PURE__ */ jsx("option", { value: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645", children: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645" }),
                              /* @__PURE__ */ jsx("option", { value: "\u0645\u0643\u062A\u0645\u0644", children: "\u0645\u0643\u062A\u0645\u0644" }),
                              /* @__PURE__ */ jsx("option", { value: "\u0645\u0644\u063A\u0649", children: "\u0645\u0644\u063A\u0649" }),
                              isLegacyStatus && /* @__PURE__ */ jsx("option", { value: order.status, children: order.status })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setConfirmDeleteOrder(order),
                            disabled: deletingOrderId === order.id,
                            title: "\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628",
                            "aria-label": `\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0631\u0642\u0645 ${order.order_number}`,
                            className: "p-2 rounded-xl bg-neutral-50 hover:bg-rose-50 text-neutral-500 hover:text-rose-700 border border-neutral-200 hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50",
                            children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: selectedOrderIds.includes(order.id),
                            onChange: () => toggleSelectOrder(order.id),
                            "aria-label": `\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0631\u0642\u0645 ${order.order_number}`,
                            title: "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0637\u0644\u0628",
                            className: "w-4 h-4 accent-[#5E1734] rounded cursor-pointer shrink-0"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs", children: [
                      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-3.5 space-y-2", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-neutral-500", children: "\u0627\u0644\u0642\u0637\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }),
                        rawItems.length > 0 ? rawItems.map((item, idx) => {
                          const unitPrice = Number(
                            item.unit_price ?? item.unitPrice ?? 0
                          );
                          const embroiderySidesLabel = item.right_embroidered_text || item.left_embroidered_text ? [
                            item.right_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${item.right_embroidered_text}` : null,
                            item.left_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${item.left_embroidered_text}` : null
                          ].filter(Boolean).join(" | ") : item.embroidered_text || null;
                          const structuredSpecs = [
                            item.fabric_type ? `\u0627\u0644\u0642\u0645\u0627\u0634: ${item.fabric_type}` : null,
                            item.shawl_color ? `\u0627\u0644\u0644\u0648\u0646: ${item.shawl_color}` : null,
                            item.thread_color ? `\u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${item.thread_color}` : null,
                            embroiderySidesLabel ? item.right_embroidered_text || item.left_embroidered_text ? embroiderySidesLabel : `\u0627\u0644\u0646\u0635: ${embroiderySidesLabel}` : null,
                            item.size ? `\u0627\u0644\u0645\u0642\u0627\u0633: ${item.size}` : null,
                            item.cap_style ? `\u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_style}` : null,
                            item.cap_color ? `\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_color}` : null,
                            item.cap_embroidery ? `\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ${item.cap_embroidery}` : null,
                            item.gown_option ? `\u0627\u0644\u0631\u0648\u0628: ${item.gown_option}` : null,
                            item.university_logo ? "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629: \u0645\u0631\u0641\u0642 (\u0645\u062C\u0627\u0646\u0627\u064B)" : null,
                            item.custom_model_image ? "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644: \u0645\u0631\u0641\u0642\u0629" : null
                          ].filter(Boolean);
                          return /* @__PURE__ */ jsxs(
                            "div",
                            {
                              className: "text-[#1E293B] leading-relaxed pb-1.5 border-b border-[#E2E8F0] last:border-0 last:pb-0",
                              children: [
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                                  /* @__PURE__ */ jsxs("span", { children: [
                                    "\u2022 ",
                                    /* @__PURE__ */ jsx("strong", { children: item.title || item.name || "\u0645\u0646\u062A\u062C" }),
                                    " \xD7",
                                    " ",
                                    /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: item.quantity || 1 })
                                  ] }),
                                  unitPrice > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[#5E1734] font-bold tabular-nums", children: [
                                    (unitPrice * (item.quantity || 1)).toLocaleString(
                                      "en-US"
                                    ),
                                    " ",
                                    "\u062F\u062C"
                                  ] })
                                ] }),
                                item.details ? /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#475569] mt-0.5 pr-3", children: item.details }) : structuredSpecs.length > 0 ? /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#475569] mt-0.5 pr-3", children: structuredSpecs.join(" \xB7 ") }) : null,
                                embroiderySidesLabel && /* @__PURE__ */ jsxs("div", { className: "mt-1 mr-3 inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#C6A355]/45 text-[11px] font-bold text-[#5E1734]", children: [
                                  /* @__PURE__ */ jsx("span", { children: "\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0648\u0634\u0627\u062D:" }),
                                  /* @__PURE__ */ jsx("span", { children: embroiderySidesLabel })
                                ] }),
                                isSafeReceiptSrc(item.university_logo) && /* @__PURE__ */ jsx("div", { className: "mt-1.5 pr-3", children: /* @__PURE__ */ jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setLightboxReceipt({
                                      url: item.university_logo,
                                      orderNumber: order.order_number,
                                      title: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642"
                                    }),
                                    className: "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#5E1734] text-[11px] font-bold text-[#5E1734] cursor-pointer",
                                    children: [
                                      /* @__PURE__ */ jsx(
                                        "img",
                                        {
                                          src: item.university_logo,
                                          alt: `\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0644\u0644\u0637\u0644\u0628 #${order.order_number}`,
                                          className: "w-6 h-6 rounded-full object-cover border border-[#5E1734]/40 bg-white"
                                        }
                                      ),
                                      /* @__PURE__ */ jsx("span", { children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642" })
                                    ]
                                  }
                                ) }),
                                isSafeReceiptSrc(item.custom_model_image) && /* @__PURE__ */ jsx("div", { className: "mt-1.5 pr-3", children: /* @__PURE__ */ jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setLightboxReceipt({
                                      url: item.custom_model_image,
                                      orderNumber: order.order_number,
                                      title: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629 \u0627\u0644\u0645\u0631\u0641\u0642\u0629"
                                    }),
                                    className: "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#C6A355]/50 hover:border-[#5E1734] text-[11px] font-bold text-[#5E1734] cursor-pointer",
                                    children: [
                                      /* @__PURE__ */ jsx(
                                        "img",
                                        {
                                          src: item.custom_model_image,
                                          alt: `\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0644\u0644\u0637\u0644\u0628 #${order.order_number}`,
                                          className: "w-10 h-10 rounded-lg object-cover border border-[#5E1734]/40 bg-white"
                                        }
                                      ),
                                      /* @__PURE__ */ jsx("span", { children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629" })
                                    ]
                                  }
                                ) }),
                                item.custom_notes && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#7C4A15] bg-[#FFF8EB] border border-[#F5D69E] rounded-lg px-2 py-1 mt-1 mr-3", children: [
                                  /* @__PURE__ */ jsx("strong", { children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062A\u0635\u0645\u064A\u0645:" }),
                                  " ",
                                  item.custom_notes
                                ] }),
                                Array.isArray(item.excluded_options) && item.excluded_options.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-1 pr-3", children: item.excluded_options.map((excl) => /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: "inline-block px-2 py-0.5 rounded-md bg-[#FFF1F2] border border-[#FECDD3] text-[10px] font-bold text-[#BE123C]",
                                    children: excl
                                  },
                                  excl
                                )) })
                              ]
                            },
                            idx
                          );
                        }) : /* @__PURE__ */ jsx("p", { className: "text-[#64748B]", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0641\u0627\u0635\u064A\u0644 \u0625\u0636\u0627\u0641\u064A\u0629 \u0645\u0633\u062C\u0644\u0629." })
                      ] }),
                      displayNotes && /* @__PURE__ */ jsxs("p", { className: "text-[#7C4A15] bg-[#FFF8EB] p-2.5 rounded-lg border border-[#F5D69E]", children: [
                        /* @__PURE__ */ jsx("strong", { children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0632\u0628\u0648\u0646:" }),
                        " ",
                        displayNotes
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-neutral-50/80 border border-neutral-200/70 p-3.5 space-y-2.5 text-xs", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-semibold text-neutral-800", children: [
                          /* @__PURE__ */ jsx(Wallet, { className: "w-3.5 h-3.5 text-[#5E1734]", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0639\u0631\u0628\u0648\u0646" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[11px] text-neutral-500", children: [
                          /* @__PURE__ */ jsxs("span", { children: [
                            "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:",
                            " ",
                            /* @__PURE__ */ jsxs("strong", { className: "text-neutral-900 tabular-nums", children: [
                              Number(order.total_sell_price || 0).toLocaleString("en-US"),
                              " \u062F\u062C"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "\u0627\u0644\u0645\u0642\u062A\u0631\u062D 50%:",
                            " ",
                            /* @__PURE__ */ jsxs("strong", { className: "text-[#5E1734] tabular-nums", children: [
                              Math.round(
                                Number(order.total_sell_price || 0) * 0.5
                              ).toLocaleString("en-US"),
                              " ",
                              "\u062F\u062C"
                            ] })
                          ] })
                        ] })
                      ] }),
                      (() => {
                        const totalSell = Number(order.total_sell_price || 0);
                        const suggestedDeposit = Math.round(totalSell * 0.5);
                        const draftRaw = paidDrafts[order.id] ?? String(getOrderPaidAmount(order));
                        const parsedDraft = Math.max(
                          0,
                          Number(draftRaw === "" ? 0 : draftRaw) || 0
                        );
                        const remainingAmount = Math.max(
                          0,
                          totalSell - parsedDraft
                        );
                        return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2.5", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                            /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-medium text-neutral-600", children: "\u0627\u0644\u0645\u062F\u0641\u0648\u0639 (\u062F\u062C):" }),
                              /* @__PURE__ */ jsx(
                                "input",
                                {
                                  type: "number",
                                  min: 0,
                                  value: draftRaw,
                                  onChange: (e) => setPaidDrafts((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value
                                  })),
                                  onBlur: (e) => handleUpdateOrderPaidAmount(
                                    order,
                                    Number(e.target.value) || 0
                                  ),
                                  onKeyDown: (e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  },
                                  disabled: savingPaidOrderId === order.id,
                                  className: `w-24 ${saasCompactInputClass}`
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => handleUpdateOrderPaidAmount(
                                  order,
                                  suggestedDeposit
                                ),
                                disabled: savingPaidOrderId === order.id,
                                className: "px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-[#5E1734]/40 text-[#5E1734] text-[11px] font-semibold cursor-pointer transition-colors",
                                children: "50%"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => handleUpdateOrderPaidAmount(order, totalSell),
                                disabled: savingPaidOrderId === order.id,
                                className: "px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold cursor-pointer transition-colors",
                                children: "\u062E\u0627\u0644\u0635"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-neutral-600 font-medium", children: "\u0627\u0644\u0645\u062A\u0628\u0642\u064A:" }),
                            remainingAmount > 0 ? /* @__PURE__ */ jsxs("span", { className: "rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-50 border border-rose-200/80 text-rose-700 tabular-nums", children: [
                              remainingAmount.toLocaleString("en-US"),
                              " \u062F\u062C"
                            ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 border border-emerald-200/80 text-emerald-700", children: [
                              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3", strokeWidth: 1.75 }),
                              /* @__PURE__ */ jsx("span", { children: "\u062E\u0627\u0644\u0635" })
                            ] })
                          ] })
                        ] });
                      })(),
                      isSafeReceiptSrc(order.product_details?.receipt_image) && /* @__PURE__ */ jsxs("div", { className: "pt-2.5 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-semibold text-neutral-700 inline-flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-[#5E1734]", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: "\u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u0631\u0641\u0642\u0629" })
                        ] }),
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setLightboxReceipt({
                              url: order.product_details.receipt_image,
                              orderNumber: order.order_number
                            }),
                            className: "inline-flex items-center gap-2 p-1 rounded-xl bg-white border border-neutral-200 hover:border-[#5E1734] cursor-pointer transition-colors",
                            title: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0627\u0644\u062D\u062C\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
                            children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: order.product_details.receipt_image,
                                  alt: `\u0648\u0635\u0644 \u062F\u0641\u0639 \u0627\u0644\u0637\u0644\u0628 #${order.order_number}`,
                                  className: "w-9 h-9 rounded-lg object-cover"
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#5E1734] pl-1.5", children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0648\u0635\u0644" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2.5 text-xs pt-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                        /* @__PURE__ */ jsxs("span", { className: "text-neutral-600", children: [
                          "\u0627\u0644\u0628\u064A\u0639:",
                          " ",
                          /* @__PURE__ */ jsxs("strong", { className: "text-neutral-900 tabular-nums", children: [
                            Number(order.total_sell_price).toLocaleString("en-US"),
                            " \u062F\u062C"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-neutral-600", children: "\u0627\u0644\u062A\u0643\u0644\u0641\u0629:" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "number",
                              defaultValue: order.total_cost_price,
                              onBlur: (e) => handleUpdateOrderCost(
                                order.id,
                                Number(e.target.value) || 0
                              ),
                              className: `w-20 ${saasCompactInputClass}`
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "text-emerald-700 font-bold tabular-nums", children: [
                          "\u0627\u0644\u0641\u0627\u0626\u062F\u0629: ",
                          netProfit.toLocaleString("en-US"),
                          " \u062F\u062C"
                        ] })
                      ] }),
                      (() => {
                        const availableCouriers = draftShippingCompanies.length > 0 ? draftShippingCompanies : SHIPPING_COMPANY_PRESETS.map((name, idx) => ({
                          id: `preset-${idx}`,
                          name,
                          apiId: "",
                          apiToken: "",
                          isDefault: idx === 0,
                          isActive: true
                        }));
                        const defaultCourierName = availableCouriers.find((c) => c.isDefault)?.name || deliveryCompany || availableCouriers[0]?.name || "Yalidine";
                        const selectedOrderCourier = order.product_details?.courier || defaultCourierName;
                        return /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-neutral-600 font-medium", children: "\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644:" }),
                          /* @__PURE__ */ jsxs(
                            "select",
                            {
                              value: selectedOrderCourier,
                              onChange: (e) => handleUpdateOrderCourier(order, e.target.value),
                              "aria-label": `\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0637\u0644\u0628 #${order.order_number}`,
                              className: "bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none rounded-xl px-2.5 py-1.5 text-neutral-800 text-xs font-semibold transition-all cursor-pointer",
                              children: [
                                availableCouriers.map((c) => /* @__PURE__ */ jsxs("option", { value: c.name, children: [
                                  c.name,
                                  c.isDefault ? " (\u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629)" : ""
                                ] }, c.id)),
                                !availableCouriers.some(
                                  (c) => c.name === selectedOrderCourier
                                ) && /* @__PURE__ */ jsx("option", { value: selectedOrderCourier, children: selectedOrderCourier })
                              ]
                            }
                          )
                        ] });
                      })()
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2", children: [
                      cleanCustomerWa ? /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: `https://wa.me/${cleanCustomerWa}?text=${encodeURIComponent(
                            waConfirmMessage
                          )}`,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap",
                          children: [
                            /* @__PURE__ */ jsx(MessageCircle, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: "\u0648\u0627\u062A\u0633\u0627\u0628" })
                          ]
                        }
                      ) : /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold whitespace-nowrap", children: [
                        /* @__PURE__ */ jsx(MessageCircle, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0648\u0627\u062A\u0633\u0627\u0628" })
                      ] }),
                      customerPhone ? /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: `tel:${customerPhone}`,
                          className: "flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold transition-colors whitespace-nowrap",
                          children: [
                            /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 shrink-0 text-neutral-600", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: "\u0627\u062A\u0635\u0627\u0644" })
                          ]
                        }
                      ) : /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-400 text-xs font-semibold whitespace-nowrap", children: [
                        /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0627\u062A\u0635\u0627\u0644" })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setWorkshopSlipOrder(order),
                          className: "flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap",
                          children: [
                            /* @__PURE__ */ jsx(Printer, { className: "w-3.5 h-3.5 shrink-0 text-[#5E1734]", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0648\u0635\u0644" })
                          ]
                        }
                      ),
                      (order.status === "\u0645\u0624\u0643\u062F" || order.status === "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645") && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            const defaultCourier = draftShippingCompanies.find((c) => c.isDefault)?.name || deliveryCompany || "Yalidine";
                            const chosenCourier = order.product_details?.courier || defaultCourier;
                            onNotify(
                              "info",
                              `\u062C\u0627\u0647\u0632 \u0644\u0644\u0625\u0631\u0633\u0627\u0644 \u0639\u0628\u0631 ${chosenCourier} (\u062A\u0623\u0643\u062F \u0645\u0646 \u0625\u0639\u062F\u0627\u062F \u0645\u0641\u0627\u062A\u064A\u062D API \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631).`
                            );
                          },
                          className: "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5 shrink-0", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: "\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u062A\u0648\u0635\u064A\u0644" })
                          ]
                        }
                      )
                    ] })
                  ]
                },
                order.id
              );
            })
          ] })
        ] }) : activeTab === "inventory" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: saasCardClass, children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-neutral-500", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-[#5E1734] mt-1.5 tabular-nums", children: [
                totalSales.toLocaleString("en-US"),
                " \u062F\u062C"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: saasCardClass, children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-neutral-500", children: "\u0635\u0627\u0641\u064A \u0627\u0644\u0641\u0627\u0626\u062F\u0629 \u0627\u0644\u0645\u062D\u0642\u0642\u0629" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-emerald-700 mt-1.5 tabular-nums", children: [
                totalProfit.toLocaleString("en-US"),
                " \u062F\u062C"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: handleAddInventory,
              className: `${saasCardClass} space-y-3.5`,
              children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                  /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0633\u0644\u0639\u0629 \u0648\u0631\u0623\u0633 \u0645\u0627\u0644 \u0644\u0644\u0645\u062E\u0632\u0648\u0646" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-2.5", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: prodName,
                      onChange: (e) => setProdName(e.target.value),
                      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0633\u0644\u0639\u0629 (\u0645\u062B\u0644\u0627\u064B: \u0642\u0645\u0627\u0634 \u0643\u0631\u064A\u0628)",
                      className: saasInputClass
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: prodCost,
                      onChange: (e) => setProdCost(e.target.value),
                      placeholder: "\u0633\u0639\u0631 \u0627\u0644\u062A\u0643\u0644\u0641\u0629 (\u062F\u062C)",
                      className: saasInputClass
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: prodSell,
                      onChange: (e) => setProdSell(e.target.value),
                      placeholder: "\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 (\u062F\u062C)",
                      className: saasInputClass
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: prodQty,
                      onChange: (e) => setProdQty(e.target.value),
                      placeholder: "\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u062A\u0648\u0641\u0631\u0629",
                      className: saasInputClass
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "submit",
                    className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062D\u0641\u0638 \u0641\u064A \u0627\u0644\u0645\u062E\u0632\u0648\u0646" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden", children: inventory.map((item) => /* @__PURE__ */ jsxs("div", { className: "p-3.5 sm:px-5 flex items-center justify-between text-xs hover:bg-neutral-50/70 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-neutral-900 text-sm", children: item.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-neutral-500 tabular-nums mt-0.5", children: [
                "\u0627\u0644\u062A\u0643\u0644\u0641\u0629: ",
                item.cost_price,
                " \u062F\u062C \xB7 \u0627\u0644\u0628\u064A\u0639: ",
                item.sell_price,
                " \u062F\u062C \xB7 \u0627\u0644\u0641\u0627\u0626\u062F\u0629 \u0644\u0644\u0642\u0637\u0639\u0629:",
                " ",
                /* @__PURE__ */ jsxs("span", { className: "text-emerald-700 font-semibold", children: [
                  item.sell_price - item.cost_price,
                  " \u062F\u062C"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-800 tabular-nums", children: [
              "\u0627\u0644\u0643\u0645\u064A\u0629: ",
              item.stock_quantity
            ] })
          ] }, item.id)) })
        ] }) : activeTab === "colors" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} flex flex-wrap items-center justify-between gap-2`, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Palette, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("span", { children: "\u0625\u062F\u0627\u0631\u0629 \u062F\u0648\u0627\u0626\u0631 \u0627\u0644\u0623\u0644\u0648\u0627\u0646" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0623\u0636\u064A\u0641\u064A \u0623\u0648 \u0627\u062D\u0630\u0641\u064A \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u0648\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0639 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u062A\u062D\u062F\u064A\u062F \u0632\u064A\u0627\u062F\u0629 \u0633\u0639\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629." })
            ] }),
            savingSettings && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E1734]", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin", strokeWidth: 1.75 }),
              /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." })
            ] })
          ] }),
          [
            {
              key: "stoleColors",
              title: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0648\u0634\u0627\u062D",
              subtitle: "\u062A\u0638\u0647\u0631 \u062D\u0635\u0631\u064A\u0627\u064B \u0641\u064A \u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u0634\u0627\u062D \u0648\u0641\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0634\u0627\u0644\u0627\u062A."
            },
            {
              key: "gownColors",
              title: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0631\u0648\u0628",
              subtitle: "\u062A\u0638\u0647\u0631 \u062D\u0635\u0631\u064A\u0627\u064B \u0641\u064A \u0635\u0641\u062D\u0627\u062A \u0631\u0648\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0631\u062C (\u0631\u0648\u0628 \u0639\u0627\u062F\u064A \u0648\u062E\u0644\u064A\u062C\u064A)."
            },
            {
              key: "threadColors",
              title: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062A\u0637\u0631\u064A\u0632",
              subtitle: "\u0623\u0644\u0648\u0627\u0646 \u062E\u064A\u0648\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0645\u062A\u0648\u0641\u0631\u0629 \u0641\u064A \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u0648\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0634\u0627\u0644\u0627\u062A."
            },
            {
              key: "capColors",
              title: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0642\u0628\u0639\u0629",
              subtitle: '\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0642\u0628\u0639\u0627\u062A \u0627\u0644\u0645\u0646\u0641\u0631\u062F\u0629 \u0648\u062E\u064A\u0627\u0631 "\u0644\u0648\u0646 \u0622\u062E\u0631" \u0644\u0644\u0642\u0628\u0639\u0629.'
            }
          ].map((group) => {
            const list = dynamicSettings[group.key];
            const form = newColorForms[group.key];
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-neutral-900", children: [
                        group.title,
                        " ",
                        /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-[#5E1734] tabular-nums", children: [
                          "(",
                          list.length,
                          ")"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500", children: group.subtitle })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleResetColorList(group.key),
                        disabled: savingSettings,
                        className: "text-xs font-semibold text-neutral-500 hover:text-[#5E1734] underline cursor-pointer disabled:opacity-50",
                        children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A"
                      }
                    )
                  ] }),
                  list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 py-2", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0644\u0648\u0627\u0646 \u062D\u0627\u0644\u064A\u0627\u064B \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u0642\u0627\u0626\u0645\u0629. \u0623\u0636\u064A\u0641\u064A \u0644\u0648\u0646\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B \u0623\u062F\u0646\u0627\u0647." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: list.map((swatch, idx) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-800",
                      children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "w-4 h-4 rounded-full border border-neutral-900/15 shrink-0",
                            style: { backgroundColor: swatch.hex }
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { children: swatch.name }),
                        swatch.extraPrice && swatch.extraPrice > 0 ? /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold text-[#5E1734] tabular-nums", children: [
                          "+",
                          swatch.extraPrice.toLocaleString("en-US"),
                          " \u062F\u062C"
                        ] }) : null,
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleDeleteColor(group.key, idx),
                            disabled: savingSettings,
                            title: `\u062D\u0630\u0641 ${swatch.name}`,
                            "aria-label": `\u062D\u0630\u0641 ${swatch.name}`,
                            className: "w-4 h-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 inline-flex items-center justify-center text-[11px] font-bold leading-none cursor-pointer disabled:opacity-50",
                            children: "\xD7"
                          }
                        )
                      ]
                    },
                    `${swatch.name}-${swatch.hex}-${idx}`
                  )) }),
                  /* @__PURE__ */ jsxs(
                    "form",
                    {
                      onSubmit: (e) => handleAddColor(group.key, e),
                      className: "pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center",
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            value: form.name,
                            onChange: (e) => setNewColorForms((prev) => ({
                              ...prev,
                              [group.key]: { ...prev[group.key], name: e.target.value }
                            })),
                            placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0644\u0648\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0645\u062B\u0627\u0644: \u0623\u062E\u0636\u0631 \u0632\u0645\u0631\u062F\u064A)",
                            className: `sm:col-span-5 ${saasInputClass}`
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/70", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "color",
                              value: form.hex,
                              onChange: (e) => setNewColorForms((prev) => ({
                                ...prev,
                                [group.key]: { ...prev[group.key], hex: e.target.value }
                              })),
                              "aria-label": `\u0627\u062E\u062A\u064A\u0627\u0631 \u0644\u0648\u0646 ${group.title}`,
                              className: "w-7 h-6 rounded border-0 bg-transparent cursor-pointer p-0"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              dir: "ltr",
                              className: "text-xs font-mono font-semibold text-neutral-600",
                              children: form.hex.toUpperCase()
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "number",
                            min: 0,
                            value: form.extraPrice,
                            onChange: (e) => setNewColorForms((prev) => ({
                              ...prev,
                              [group.key]: { ...prev[group.key], extraPrice: e.target.value }
                            })),
                            placeholder: "\u0633\u0639\u0631 \u0625\u0636\u0627\u0641\u064A (\u062F\u062C)",
                            title: "\u0633\u0639\u0631 \u0625\u0636\u0627\u0641\u064A \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 (0 \u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0627\u064B)",
                            className: `sm:col-span-2 ${saasInputClass} tabular-nums`
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "submit",
                            disabled: savingSettings,
                            className: "sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 whitespace-nowrap transition-colors",
                            children: [
                              /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                              /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0644\u0648\u0646" })
                            ]
                          }
                        )
                      ]
                    }
                  )
                ]
              },
              group.key
            );
          })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white border border-neutral-200/80 rounded-2xl p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]", children: /* @__PURE__ */ jsx("div", { className: "bg-neutral-100/90 p-1 rounded-xl flex items-center gap-1 overflow-x-auto", children: [
            { id: "all", label: "\u0627\u0644\u0643\u0644" },
            { id: "identity", label: "\u0627\u0644\u0647\u0648\u064A\u0629 \xB7 \u0648\u0627\u062A\u0633\u0627\u0628 \xB7 CCP" },
            { id: "telegram", label: "\u0625\u0634\u0639\u0627\u0631\u0627\u062A Telegram" },
            { id: "delivery", label: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (58 \u0648\u0644\u0627\u064A\u0629)" },
            { id: "advanced", label: "\u0627\u0644\u0639\u0631\u0648\u0636 \xB7 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \xB7 \u0627\u0644\u062D\u0645\u0627\u064A\u0629" }
          ].map((sub) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSettingsSubView(sub.id),
              className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all ${settingsSubView === sub.id ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
              children: sub.label
            },
            sub.id
          )) }) }),
          (settingsSubView === "all" || settingsSubView === "identity") && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: handleSaveStoreName,
              className: `${saasCardClass} space-y-3.5`,
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Store, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u064A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A\u060C \u0623\u0633\u0641\u0644 \u0627\u0644\u0645\u0648\u0642\u0639\u060C \u0648\u0631\u0642\u0629 \u0627\u0644\u0648\u0631\u0634\u0629\u060C \u0648\u0631\u0633\u0627\u0626\u0644 \u0648\u0627\u062A\u0633\u0627\u0628 \u0644\u0644\u0632\u0628\u0627\u0626\u0646." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2.5", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: draftStoreName,
                      onChange: (e) => setDraftStoreName(e.target.value),
                      placeholder: "DG by Douaa",
                      className: `${saasInputClass} font-semibold`
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 whitespace-nowrap transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631" })
                      ]
                    }
                  )
                ] })
              ]
            }
          ) }),
          (settingsSubView === "all" || settingsSubView === "advanced") && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} space-y-3`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: "\u0625\u0638\u0647\u0627\u0631 \u062E\u0627\u0646\u0629 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0641\u064A \u0633\u0644\u0629 \u0627\u0644\u0632\u0628\u0627\u0626\u0646" })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral-500 mt-0.5 leading-relaxed", children: [
                    "\u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629:",
                    " ",
                    /* @__PURE__ */ jsx(
                      "strong",
                      {
                        className: activePromoSettings.promoCodeInputEnabled ? "text-emerald-700" : "text-neutral-600",
                        children: activePromoSettings.promoCodeInputEnabled ? "\u0638\u0627\u0647\u0631\u0629 \u0641\u064A \u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 (\u0645\u0641\u0639\u0651\u0644\u0629)" : "\u0645\u062E\u0641\u064A\u0629 \u062A\u0645\u0627\u0645\u0627\u064B \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646 (\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A)"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    "aria-checked": activePromoSettings.promoCodeInputEnabled,
                    disabled: savingSettings,
                    onClick: () => savePromoConfig(
                      {
                        ...activePromoSettings,
                        promoCodeInputEnabled: !activePromoSettings.promoCodeInputEnabled
                      },
                      !activePromoSettings.promoCodeInputEnabled ? "\u062A\u0645 \u0625\u0638\u0647\u0627\u0631 \u062E\u0627\u0646\u0629 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0641\u064A \u0633\u0644\u0629 \u0627\u0644\u0632\u0628\u0627\u0626\u0646." : "\u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u062E\u0627\u0646\u0629 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0639\u0646 \u0633\u0644\u0629 \u0627\u0644\u0632\u0628\u0627\u0626\u0646."
                    ),
                    className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${activePromoSettings.promoCodeInputEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/70"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `w-2 h-2 rounded-full ${activePromoSettings.promoCodeInputEnabled ? "bg-emerald-600" : "bg-neutral-400"}`
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: activePromoSettings.promoCodeInputEnabled ? "\u0625\u062E\u0641\u0627\u0621 \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646" : "\u0625\u0638\u0647\u0627\u0631 \u0641\u064A \u0627\u0644\u0633\u0644\u0629" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200/80 rounded-xl px-3 py-2", children: "\u0639\u0646\u062F\u0645\u0627 \u064A\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u062E\u064A\u0627\u0631 \u0645\u063A\u0644\u0642\u0627\u064B (OFF)\u060C \u0644\u0627 \u064A\u0631\u0649 \u0627\u0644\u0632\u0628\u0627\u0626\u0646 \u0623\u064A \u062E\u0627\u0646\u0629 \u0644\u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0641\u064A \u0627\u0644\u0633\u0644\u0629." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} space-y-3`, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A \u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631 (10% / 20% / \u0628\u062F\u0648\u0646)" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0641\u0639\u0651\u0644\u064A \u062A\u062E\u0641\u064A\u0636\u0627\u064B \u0645\u0628\u0627\u0634\u0631\u0627\u064B \u064A\u0638\u0647\u0631 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u064A\u064F\u062E\u0635\u0645 \u0641\u064A \u0627\u0644\u0633\u0644\u0629 \u062F\u0648\u0646 \u062D\u0627\u062C\u0629 \u0644\u0643\u0648\u062F." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-neutral-100/90 p-1 rounded-xl grid grid-cols-3 gap-1", children: [
                { value: 0, label: "\u0628\u062F\u0648\u0646 \u062A\u062E\u0641\u064A\u0636 (\u0645\u062E\u0641\u064A)" },
                { value: 10, label: "\u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A -10%" },
                { value: 20, label: "\u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A -20%" }
              ].map((opt) => {
                const selected = activePromoSettings.storewideDiscountPercent === opt.value;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: savingSettings,
                    onClick: () => savePromoConfig(
                      {
                        ...activePromoSettings,
                        storewideDiscountPercent: opt.value
                      },
                      opt.value === 0 ? "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631." : `\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631 (-${opt.value}%) \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631.`
                    ),
                    className: `py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 ${selected ? "bg-white text-[#5E1734] shadow-xs border border-neutral-200/60" : "text-neutral-600 hover:text-neutral-900"}`,
                    children: opt.label
                  },
                  opt.value
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} space-y-3`, children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Percent, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                  /* @__PURE__ */ jsx("span", { children: "\u0623\u0643\u0648\u0627\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 (10% \u0648 20%)" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral-500 mt-0.5", children: [
                  "\u062A\u0641\u0639\u064A\u0644 \u0628\u0646\u0642\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u0643\u0648\u062F ",
                  /* @__PURE__ */ jsx("strong", { children: "GRAD10" }),
                  " (10%) \u0623\u0648 ",
                  /* @__PURE__ */ jsx("strong", { children: "GRAD20" }),
                  " (20%)."
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                {
                  presetId: "promo-grad10",
                  code: "GRAD10",
                  value: 10,
                  label: "\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u062A\u062E\u0631\u062C 10%"
                },
                {
                  presetId: "promo-grad20",
                  code: "GRAD20",
                  value: 20,
                  label: "\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u062A\u062E\u0631\u062C 20%"
                }
              ].map((preset) => {
                const existing = activePromoSettings.promoCodes.find(
                  (c) => c.code.toUpperCase() === preset.code
                );
                const isActive = Boolean(existing?.active);
                const handleQuickToggle = async () => {
                  let nextCodes;
                  if (existing) {
                    nextCodes = activePromoSettings.promoCodes.map(
                      (c) => c.code.toUpperCase() === preset.code ? { ...c, active: !c.active } : c
                    );
                  } else {
                    nextCodes = [
                      {
                        id: preset.presetId,
                        code: preset.code,
                        type: "percent",
                        value: preset.value,
                        active: true,
                        label: preset.label
                      },
                      ...activePromoSettings.promoCodes
                    ];
                  }
                  await savePromoConfig(
                    {
                      ...activePromoSettings,
                      promoCodes: nextCodes
                    },
                    !isActive ? `\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0643\u0648\u062F ${preset.code} (-${preset.value}%).` : `\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0643\u0648\u062F ${preset.code}.`
                  );
                };
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-xl border p-3.5 flex items-center justify-between gap-3 transition-colors ${isActive ? "bg-emerald-50/50 border-emerald-200/80" : "bg-neutral-50/70 border-neutral-200/80"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              dir: "ltr",
                              className: "px-2.5 py-0.5 rounded-md bg-white border border-neutral-200 text-xs font-extrabold text-[#5E1734] tracking-wider",
                              children: preset.code
                            }
                          ),
                          /* @__PURE__ */ jsxs("span", { className: "text-xs font-extrabold text-neutral-900 tabular-nums", children: [
                            "-",
                            preset.value,
                            "%"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500 mt-1 inline-flex items-center gap-1", children: isActive ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-600", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: "\u0645\u0641\u0639\u0651\u0644 \u0648\u062C\u0627\u0647\u0632 \u0644\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645" })
                        ] }) : /* @__PURE__ */ jsx("span", { children: "\u0645\u062A\u0648\u0642\u0641 \u062D\u0627\u0644\u064A\u0627\u064B" }) })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          disabled: savingSettings,
                          onClick: handleQuickToggle,
                          className: `px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors ${isActive ? "bg-white border border-rose-200 text-rose-700 hover:bg-rose-50" : "bg-[#5E1734] hover:bg-[#491028] text-white"}`,
                          children: isActive ? "\u0625\u064A\u0642\u0627\u0641" : `\u062A\u0641\u0639\u064A\u0644 ${preset.value}%`
                        }
                      )
                    ]
                  },
                  preset.code
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: async (e) => {
                  e.preventDefault();
                  const cleanCode = newPromoCode.trim().toUpperCase();
                  const numericVal = Math.round(Number(newPromoValue) || 0);
                  if (!cleanCode) {
                    onNotify("error", "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0631\u0645\u0632 \u0627\u0644\u0643\u0648\u0628\u0648\u0646.");
                    return;
                  }
                  if (numericVal <= 0) {
                    onNotify("error", "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0642\u064A\u0645\u0629 \u062A\u062E\u0641\u064A\u0636 \u0635\u062D\u064A\u062D\u0629 \u0623\u0643\u0628\u0631 \u0645\u0646 0.");
                    return;
                  }
                  if (newPromoType === "percent" && numericVal > 90) {
                    onNotify("error", "\u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0626\u0648\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0647\u064A 90%.");
                    return;
                  }
                  if (activePromoSettings.promoCodes.some(
                    (c) => c.code.toUpperCase() === cleanCode
                  )) {
                    onNotify("error", "\u0647\u0630\u0627 \u0627\u0644\u0643\u0648\u062F \u0645\u0648\u062C\u0648\u062F \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");
                    return;
                  }
                  const entry = {
                    id: `promo-${Date.now()}`,
                    code: cleanCode,
                    type: newPromoType,
                    value: numericVal,
                    active: true,
                    ...newPromoLabel.trim() ? { label: newPromoLabel.trim() } : {}
                  };
                  await savePromoConfig(
                    {
                      ...activePromoSettings,
                      promoCodes: [entry, ...activePromoSettings.promoCodes]
                    },
                    `\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0643\u0648\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 ${cleanCode} \u0648\u062A\u0641\u0639\u064A\u0644\u0647.`
                  );
                  setNewPromoCode("");
                  setNewPromoValue("10");
                  setNewPromoLabel("");
                },
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-neutral-900", children: "\u0625\u0636\u0627\u0641\u0629 \u0643\u0648\u062F \u062A\u062E\u0641\u064A\u0636 \u0645\u062E\u0635\u0635" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u064A\u0645\u0643\u0646\u0643 \u0625\u0646\u0634\u0627\u0621 \u0643\u0648\u0628\u0648\u0646\u0627\u062A \u0628\u0646\u0633\u0628\u0629 \u0645\u0626\u0648\u064A\u0629 (%) \u0623\u0648 \u0628\u0645\u0628\u0644\u063A \u062B\u0627\u0628\u062A \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u062C\u0632\u0627\u0626\u0631\u064A (\u062F\u062C)." })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-12 gap-2.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        dir: "ltr",
                        value: newPromoCode,
                        onChange: (e) => setNewPromoCode(e.target.value.toUpperCase()),
                        placeholder: "CODE (\u0645\u062B\u0627\u0644: DOUAA15)",
                        className: `sm:col-span-4 ${saasInputClass} font-bold uppercase`
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: newPromoType,
                        onChange: (e) => setNewPromoType(e.target.value === "fixed" ? "fixed" : "percent"),
                        className: `sm:col-span-3 ${saasInputClass} font-semibold cursor-pointer`,
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "percent", children: "\u0646\u0633\u0628\u0629 \u0645\u0626\u0648\u064A\u0629 (%)" }),
                          /* @__PURE__ */ jsx("option", { value: "fixed", children: "\u0645\u0628\u0644\u063A \u062B\u0627\u0628\u062A (\u062F\u062C)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        max: newPromoType === "percent" ? 90 : void 0,
                        value: newPromoValue,
                        onChange: (e) => setNewPromoValue(e.target.value),
                        placeholder: newPromoType === "percent" ? "15" : "500",
                        className: `sm:col-span-2 ${saasInputClass} font-bold tabular-nums`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: newPromoLabel,
                        onChange: (e) => setNewPromoLabel(e.target.value),
                        placeholder: "\u0648\u0635\u0641 \u0627\u062E\u062A\u064A\u0627\u0631\u064A",
                        className: `sm:col-span-3 ${saasInputClass}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0643\u0648\u0628\u0648\u0646" })
                      ]
                    }
                  ),
                  activePromoSettings.promoCodes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-neutral-100 space-y-2", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-neutral-600", children: [
                      "\u062C\u0645\u064A\u0639 \u0623\u0643\u0648\u0627\u062F \u0627\u0644\u062A\u062E\u0641\u064A\u0636 (",
                      activePromoSettings.promoCodes.length,
                      "):"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: activePromoSettings.promoCodes.map((promo) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/80",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                dir: "ltr",
                                className: "px-2.5 py-0.5 rounded-md bg-white border border-neutral-200 text-xs font-extrabold text-[#5E1734]",
                                children: promo.code
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-neutral-900 tabular-nums", children: promo.type === "percent" ? `-${promo.value}%` : `-${promo.value.toLocaleString("en-US")} \u062F\u062C` }),
                            promo.label && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-neutral-500", children: [
                              "\xB7 ",
                              promo.label
                            ] }),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${promo.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70" : "bg-neutral-100 text-neutral-600 border border-neutral-200"}`,
                                children: promo.active ? "\u0645\u0641\u0639\u0651\u0644" : "\u0645\u062A\u0648\u0642\u0641"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                disabled: savingSettings,
                                onClick: () => savePromoConfig({
                                  ...activePromoSettings,
                                  promoCodes: activePromoSettings.promoCodes.map(
                                    (c) => c.id === promo.id ? { ...c, active: !c.active } : c
                                  )
                                }),
                                className: "px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 cursor-pointer disabled:opacity-50 transition-colors",
                                children: promo.active ? "\u0625\u064A\u0642\u0627\u0641" : "\u062A\u0641\u0639\u064A\u0644"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                disabled: savingSettings,
                                onClick: () => savePromoConfig(
                                  {
                                    ...activePromoSettings,
                                    promoCodes: activePromoSettings.promoCodes.filter(
                                      (c) => c.id !== promo.id
                                    )
                                  },
                                  `\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0643\u0648\u0628\u0648\u0646 ${promo.code}.`
                                ),
                                "aria-label": `\u062D\u0630\u0641 ${promo.code}`,
                                className: "p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer disabled:opacity-50 transition-colors",
                                children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                              }
                            )
                          ] })
                        ]
                      },
                      promo.id
                    )) })
                  ] })
                ]
              }
            )
          ] }),
          (settingsSubView === "all" || settingsSubView === "advanced") && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} space-y-3`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u062B\u0628\u064A\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0643\u062A\u0637\u0628\u064A\u0642" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0647\u0630\u0627 \u0627\u0644\u062E\u064A\u0627\u0631 \u0645\u062E\u0641\u064A \u062A\u0645\u0627\u0645\u0627\u064B \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646 \u0648\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0644\u0635\u0627\u062D\u0628\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0634\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0644\u0644\u0647\u0627\u062A\u0641." })
                ] }),
                isPwaInstalled ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                  /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u062B\u0628\u0651\u062A \u0648\u064A\u0639\u0645\u0644" })
                ] }) : /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleAdminPwaInstall,
                    className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4 text-[#E5C77A]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0643\u062A\u0637\u0628\u064A\u0642 \u0639\u0644\u0649 \u0647\u0627\u062A\u0641\u0643 (\u062E\u0627\u0635 \u0628\u0627\u0644\u0625\u062F\u0627\u0631\u0629)" })
                    ]
                  }
                )
              ] }),
              showIosInstallGuide && !isPwaInstalled && /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-700 space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[#5E1734]", children: "\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u062A\u062B\u0628\u064A\u062A \u0639\u0644\u0649 \u0622\u064A\u0641\u0648\u0646 / \u0622\u064A\u0628\u0627\u062F (Safari):" }),
                /* @__PURE__ */ jsx("p", { children: "1. \u0627\u0636\u063A\u0637\u064A \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0641\u064A \u0623\u0633\u0641\u0644 \u0645\u062A\u0635\u0641\u062D Safari." }),
                /* @__PURE__ */ jsx("p", { children: "2. \u0645\u0631\u0651\u0631\u064A \u0644\u0644\u0623\u0633\u0641\u0644 \u0648\u0627\u062E\u062A\u0627\u0631\u064A \xAB\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0634\u0627\u0634\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629\xBB (Add to Home Screen)." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveSeasonBanner,
                className: `${saasCardClass} space-y-4`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0628\u064A\u0647 \u0627\u0644\u0630\u0643\u064A \u0644\u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u064A\u0638\u0647\u0631 \u0627\u0644\u0634\u0631\u064A\u0637 \u0623\u0639\u0644\u0649 \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u064A\u0645\u0643\u0646 \u0644\u0644\u0632\u0628\u0627\u0626\u0646 \u0625\u063A\u0644\u0627\u0642\u0647 \u0623\u0648 \u0644\u0643\u0650 \u062A\u0639\u062F\u064A\u0644\u0647 \u0648\u0625\u062E\u0641\u0627\u0624\u0647 \u0641\u064A \u0623\u064A \u0648\u0642\u062A." })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        role: "switch",
                        "aria-checked": draftSeasonBannerEnabled,
                        disabled: savingSettings,
                        onClick: () => handleToggleSeasonBanner(!draftSeasonBannerEnabled),
                        className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${draftSeasonBannerEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/70"}`,
                        children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `w-2 h-2 rounded-full ${draftSeasonBannerEnabled ? "bg-emerald-600" : "bg-neutral-400"}`
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: draftSeasonBannerEnabled ? "\u062A\u0641\u0639\u064A\u0644 \u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C: \u0645\u0641\u0639\u0651\u0644" : "\u062A\u0641\u0639\u064A\u0644 \u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C: \u0645\u062E\u0641\u064A" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0646\u0635 \u062A\u0646\u0628\u064A\u0647 \u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: draftSeasonBannerText,
                        onChange: (e) => setDraftSeasonBannerText(e.target.value),
                        placeholder: DEFAULT_SEASON_BANNER_TEXT,
                        className: saasInputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0628\u064A\u0647" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSavePauseSettings,
                className: `${saasCardClass} space-y-4`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(PauseCircle, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A \u0645\u0624\u0642\u062A\u0627\u064B" })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral-500 mt-0.5", children: [
                        "\u062D\u0627\u0644\u0629 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A:",
                        " ",
                        /* @__PURE__ */ jsx(
                          "strong",
                          {
                            className: draftPaused ? "text-rose-700" : "text-emerald-700",
                            children: draftPaused ? "\u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B" : "\u0645\u0641\u062A\u0648\u062D"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        role: "switch",
                        "aria-checked": draftPaused,
                        disabled: savingSettings,
                        onClick: () => handleToggleOrdersPaused(!draftPaused),
                        className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${draftPaused ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"}`,
                        children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `w-2 h-2 rounded-full ${draftPaused ? "bg-rose-600" : "bg-emerald-600"}`
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: draftPaused ? "\u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B (\u0627\u0636\u063A\u0637\u064A \u0644\u0644\u0641\u062A\u062D)" : "\u0645\u0641\u062A\u0648\u062D (\u0627\u0636\u063A\u0637\u064A \u0644\u0644\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0624\u0642\u062A)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0645\u0624\u0642\u062A \u0644\u0644\u0632\u0628\u0627\u0626\u0646" }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        rows: 3,
                        value: draftPauseMessage,
                        onChange: (e) => setDraftPauseMessage(e.target.value),
                        placeholder: DEFAULT_PAUSE_MESSAGE,
                        className: saasInputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u0631\u0633\u0627\u0644\u0629" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveCategoryAvailability,
                className: `${saasCardClass} space-y-4`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "pb-3 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062D\u0627\u0644\u0629 \u062A\u0648\u0641\u0631 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 (\u0625\u062F\u0627\u0631\u0629 \u062A\u0648\u0641\u0631 \u0627\u0644\u0623\u0642\u0633\u0627\u0645)" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0623\u0648\u0642\u0641\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0645\u0624\u0642\u062A\u0627\u064B \u0644\u0623\u064A \u0642\u0633\u0645 \u0645\u062D\u062F\u062F (\u0645\u062B\u0644\u0627\u064B \u0639\u0646\u062F \u0636\u063A\u0637 \u0627\u0644\u0637\u0644\u0628\u0627\u062A) \u0645\u0639 \u0625\u0628\u0642\u0627\u0621 \u0628\u0642\u064A\u0629 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0645\u0641\u062A\u0648\u062D\u0629 \u0644\u0644\u0632\u0628\u0627\u0626\u0646." })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: [
                    {
                      id: "shawl",
                      title: "\u0642\u0633\u0645 \u0627\u0644\u0648\u0634\u0627\u062D",
                      desc: "\u0627\u0644\u0634\u0627\u0644\u0627\u062A \u0628\u062C\u0645\u064A\u0639 \u0623\u0646\u0648\u0627\u0639\u0647\u0627 \u0648\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u0634\u0627\u062D"
                    },
                    {
                      id: "robe",
                      title: "\u0642\u0633\u0645 \u0627\u0644\u0631\u0648\u0628",
                      desc: "\u0623\u0631\u0648\u0627\u0628 \u0627\u0644\u062A\u062E\u0631\u062C \u0627\u0644\u0639\u0627\u062F\u064A \u0648\u0627\u0644\u062E\u0644\u064A\u062C\u064A"
                    },
                    {
                      id: "accessories",
                      title: "\u0642\u0633\u0645 \u0627\u0644\u0648\u0631\u062F",
                      desc: "\u0628\u0627\u0642\u0627\u062A \u0648\u0631\u062F \u0627\u0644\u062A\u062E\u0631\u062C \u0627\u0644\u0645\u062E\u0635\u0635\u0629"
                    },
                    {
                      id: "cap",
                      title: "\u0642\u0633\u0645 \u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u0645\u0646\u0641\u0631\u062F\u0629",
                      desc: "\u0627\u0644\u0642\u0628\u0639\u0627\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 \u0627\u0644\u0645\u0646\u0641\u0631\u062F\u0629"
                    }
                  ].map((cat) => {
                    const isCatPaused = Boolean(draftPausedCategories[cat.id]);
                    const badgePreview = draftCategoryPauseBadge.trim() || DEFAULT_CATEGORY_PAUSE_BADGE;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${isCatPaused ? "bg-rose-50/50 border-rose-200/80" : "bg-neutral-50/70 border-neutral-200/80"}`,
                        children: [
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-bold text-neutral-900", children: cat.title }),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${isCatPaused ? "bg-rose-50 text-rose-700 border border-rose-200/70" : "bg-emerald-50 text-emerald-700 border border-emerald-200/70"}`,
                                  children: isCatPaused ? `\u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B (${badgePreview})` : "\u0645\u062A\u0648\u0641\u0631 \u0644\u0644\u0637\u0644\u0628"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500 mt-0.5", children: cat.desc })
                          ] }),
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              role: "switch",
                              "aria-checked": !isCatPaused,
                              disabled: savingSettings,
                              onClick: () => handleToggleCategoryPaused(cat.id, cat.title),
                              className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all touch-manipulation active:scale-95 cursor-pointer disabled:opacity-60 ${isCatPaused ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"}`,
                              children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `w-2 h-2 rounded-full ${isCatPaused ? "bg-rose-600" : "bg-emerald-600"}`
                                  }
                                ),
                                /* @__PURE__ */ jsx("span", { children: isCatPaused ? "\u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B" : "\u0645\u062A\u0648\u0641\u0631" })
                              ]
                            }
                          )
                        ]
                      },
                      cat.id
                    );
                  }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0646\u0635 \u0634\u0627\u0631\u0629 \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0645\u062A\u0648\u0642\u0641 (\u064A\u0638\u0647\u0631 \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0648\u0632\u0631 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: draftCategoryPauseBadge,
                        onChange: (e) => setDraftCategoryPauseBadge(e.target.value),
                        placeholder: "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B \xB7 \u0623\u0648 \u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u0627\u064B \u0644\u0643\u062B\u0631\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
                        className: saasInputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0642\u0633\u0627\u0645" })
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          (settingsSubView === "all" || settingsSubView === "identity") && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSavePaymentInfo,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u2014 CCP (\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631)" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u064A\u0638\u0647\u0631 \u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP \u062F\u0627\u062E\u0644 \u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0637\u0644\u0628 \u0641\u0648\u0642 \u0632\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u062F\u0641\u0639 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 (50%) \u0645\u0639 \u0632\u0631 \u0646\u0633\u062E \u0633\u0631\u064A\u0639." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        htmlFor: "admin-ccp-input",
                        className: "block text-xs font-semibold text-neutral-600 mb-1.5",
                        children: "\u0631\u0642\u0645 \u062D\u0633\u0627\u0628 CCP (\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0632\u0627\u0626\u0631)"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        id: "admin-ccp-input",
                        type: "text",
                        dir: "auto",
                        value: draftPaymentInfo,
                        onChange: (e) => setDraftPaymentInfo(e.target.value),
                        placeholder: "\u0645\u062B\u0627\u0644: 0012345678 Cl\xE9 90",
                        className: `${saasInputClass} font-bold tabular-nums`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0631\u0642\u0645 CCP" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveWhatsappNumber,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4 text-emerald-600", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0631\u0642\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0645\u062A\u062C\u0631 (WhatsApp Number)" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u064A\u064F\u0631\u0628\u0637 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0628\u0632\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0639\u0627\u0626\u0645\u060C \u0632\u0631 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0641\u064A \u0627\u0644\u062D\u0642\u064A\u0628\u0629\u060C \u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u062F\u0641\u0639\u060C \u0648\u0627\u0644\u0631\u0648\u0627\u0628\u0637 \u0623\u0633\u0641\u0644 \u0627\u0644\u0645\u062A\u062C\u0631." })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        dir: "ltr",
                        className: "rounded-full px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 tabular-nums",
                        children: [
                          "wa.me/",
                          formatWhatsAppNumber(draftWhatsappNumber)
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0642\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 \u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0627\u0635\u0644 (\u0645\u062B\u0627\u0644: 0550123456 \u0623\u0648 213550123456)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "tel",
                        dir: "ltr",
                        value: draftWhatsappNumber,
                        onChange: (e) => setDraftWhatsappNumber(e.target.value),
                        placeholder: `\u0645\u062B\u0627\u0644: 0550123456 \u0623\u0648 ${WHATSAPP_NUMBER}`,
                        className: `${saasInputClass} font-bold tabular-nums`
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500 mt-1.5", children: "\u064A\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u062C\u0632\u0627\u0626\u0631\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u0628\u062F\u0623 \u0628\u0640 05 / 06 / 07 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0625\u0644\u0649 \u0635\u064A\u063A\u0629 213 \u0648\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062A \u0648\u0639\u0644\u0627\u0645\u0629 + \u0639\u0646\u062F \u0627\u0644\u062D\u0641\u0638 (\u0627\u062A\u0631\u0643\u064A\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A)." })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0627\u0644\u0631\u0642\u0645" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveSocialLinks,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u0631\u0648\u0627\u0628\u0637 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A (Footer)" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0623\u062F\u062E\u0644\u064A \u0631\u0648\u0627\u0628\u0637 \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u062A\u0638\u0647\u0631 \u0643\u0623\u064A\u0642\u0648\u0646\u0627\u062A \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0646\u0642\u0631 \u0623\u0633\u0641\u0644 \u0627\u0644\u0645\u0648\u0642\u0639\u061B \u064A\u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0623\u064A \u0623\u064A\u0642\u0648\u0646\u0629 \u064A\u064F\u062A\u0631\u0643 \u062D\u0642\u0644\u0647\u0627 \u0641\u0627\u0631\u063A\u0627\u064B \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0627\u0628\u0637 \u062D\u0633\u0627\u0628 \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645 (Instagram URL)" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "url",
                          dir: "ltr",
                          value: draftInstagramUrl,
                          onChange: (e) => setDraftInstagramUrl(e.target.value),
                          placeholder: "https://instagram.com/dg_by_douaa",
                          className: saasInputClass
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0627\u0628\u0637 \u0635\u0641\u062D\u0629 \u0641\u064A\u0633\u0628\u0648\u0643 (Facebook URL)" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "url",
                          dir: "ltr",
                          value: draftFacebookUrl,
                          onChange: (e) => setDraftFacebookUrl(e.target.value),
                          placeholder: "https://facebook.com/dg.by.douaa",
                          className: saasInputClass
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0627\u0628\u0637 \u062D\u0633\u0627\u0628 \u062A\u064A\u0643 \u062A\u0648\u0643 (TikTok URL)" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "url",
                          dir: "ltr",
                          value: draftTiktokUrl,
                          onChange: (e) => setDraftTiktokUrl(e.target.value),
                          placeholder: "https://tiktok.com/@dg_by_douaa",
                          className: saasInputClass
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u062A\u0648\u0627\u0635\u0644" })
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          (settingsSubView === "all" || settingsSubView === "advanced") && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleChangeEmail,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" })
                    ] }),
                    currentAdminEmail && /* @__PURE__ */ jsx(
                      "span",
                      {
                        dir: "ltr",
                        className: "rounded-full px-2.5 py-0.5 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200",
                        children: currentAdminEmail
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500", children: "\u0623\u062F\u062E\u0644\u064A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u062C\u062F\u064A\u062F \u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0625\u062F\u0627\u0631\u0629\u061B \u0633\u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u062A\u0623\u0643\u064A\u062F \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u063A\u064A\u064A\u0631." }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u062C\u062F\u064A\u062F" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "email",
                        dir: "ltr",
                        value: newAdminEmail,
                        onChange: (e) => {
                          setNewAdminEmail(e.target.value);
                          if (emailError) setEmailError("");
                          if (emailSuccess) setEmailSuccess("");
                        },
                        placeholder: "admin@example.com",
                        className: saasInputClass
                      }
                    )
                  ] }),
                  emailError && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-rose-700", children: emailError }),
                  emailSuccess && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3", children: emailSuccess }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: updatingEmail,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: updatingEmail ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u062F\u064A\u062B..." : "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleChangePassword,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(KeyRound, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500", children: "\u0623\u062F\u062E\u0644\u064A \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629 (6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644) \u0644\u062D\u0645\u0627\u064A\u0629 \u062D\u0633\u0627\u0628 \u0627\u0644\u0625\u062F\u0627\u0631\u0629." }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "password",
                          autoComplete: "new-password",
                          value: newPassword,
                          onChange: (e) => {
                            setNewPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          },
                          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                          className: saasInputClass
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "password",
                          autoComplete: "new-password",
                          value: confirmPassword,
                          onChange: (e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          },
                          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                          className: saasInputClass
                        }
                      )
                    ] })
                  ] }),
                  passwordError && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-rose-700", children: passwordError }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: updatingPassword,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(KeyRound, { className: "w-4 h-4", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: updatingPassword ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u062F\u064A\u062B..." : "\u062D\u0641\u0638 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" })
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          (settingsSubView === "all" || settingsSubView === "telegram") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveTelegramSettings,
                className: `${saasCardClass} space-y-4`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0639\u0628\u0631 Telegram" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0627\u0633\u062A\u0642\u0628\u0644\u064A \u0631\u0633\u0627\u0644\u0629 \u0641\u0648\u0631\u064A\u0629 \u0639\u0644\u0649 Telegram \u0641\u0648\u0631 \u0625\u0631\u0633\u0627\u0644 \u0623\u064A \u0632\u0628\u0648\u0646 \u0644\u0637\u0644\u0628 \u062C\u062F\u064A\u062F\u060C \u0645\u0639 \u0635\u0648\u062A \u062A\u0646\u0628\u064A\u0647 \u0648\u0634\u0627\u0631\u0629 \u062F\u0627\u062E\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629." })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        role: "switch",
                        "aria-checked": draftTelegramEnabled,
                        disabled: savingSettings,
                        onClick: () => handleToggleTelegramEnabled(!draftTelegramEnabled),
                        className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${draftTelegramEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/70"}`,
                        children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `w-2 h-2 rounded-full ${draftTelegramEnabled ? "bg-emerald-600" : "bg-neutral-400"}`
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: draftTelegramEnabled ? "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0645\u0641\u0639\u0651\u0644\u0629 (\u0627\u0636\u063A\u0637\u064A \u0644\u0644\u0625\u064A\u0642\u0627\u0641)" : "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0645\u062A\u0648\u0642\u0641\u0629 (\u0627\u0636\u063A\u0637\u064A \u0644\u0644\u062A\u0641\u0639\u064A\u0644)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "Telegram Bot Token" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: showTelegramToken ? "text" : "password",
                            dir: "ltr",
                            autoComplete: "off",
                            value: draftTelegramToken,
                            onChange: (e) => setDraftTelegramToken(e.target.value),
                            placeholder: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
                            className: `${saasInputClass} pl-10`
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowTelegramToken((prev) => !prev),
                            "aria-label": showTelegramToken ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0631\u0645\u0632" : "\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0631\u0645\u0632",
                            className: "absolute left-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-[#5E1734] cursor-pointer",
                            children: showTelegramToken ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4", strokeWidth: 1.75 }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4", strokeWidth: 1.75 })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "Telegram Chat ID" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          dir: "ltr",
                          value: draftTelegramChatId,
                          onChange: (e) => setDraftTelegramChatId(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: 987654321",
                          className: saasInputClass
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500 mt-1.5", children: "\u0623\u0646\u0634\u0626\u064A \u0627\u0644\u0628\u0648\u062A \u0639\u0628\u0631 @BotFather \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 Token\u060C \u0648\u0627\u062D\u0635\u0644\u064A \u0639\u0644\u0649 Chat ID \u0639\u0628\u0631 @userinfobot \u062B\u0645 \u0627\u0628\u062F\u0626\u064A \u0645\u062D\u0627\u062F\u062B\u0629 \u0645\u0639 \u0627\u0644\u0628\u0648\u062A \u0628\u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 Start." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2.5 pt-1", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "submit",
                        disabled: savingSettings,
                        className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleSendTelegramTest,
                        disabled: testingTelegram || savingSettings,
                        className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                        children: [
                          testingTelegram ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin", strokeWidth: 1.75 }) : /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: "\u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u062A\u062C\u0631\u064A\u0628\u064A" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveMetaPixel, className: "mt-5 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-neutral-900", children: "Meta Pixel ID (\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0641\u064A\u0633\u0628\u0648\u0643 \u0648\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645)" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  dir: "ltr",
                  inputMode: "numeric",
                  value: draftMetaPixelId,
                  onChange: (e) => setDraftMetaPixelId(e.target.value),
                  placeholder: "\u0645\u062B\u0627\u0644: 123456789012345",
                  className: saasInputClass
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-neutral-500", children: "\u0627\u062E\u062A\u064A\u0627\u0631\u064A. \u0639\u0646\u062F \u0625\u062F\u062E\u0627\u0644\u0647 \u064A\u062A\u0645 \u062A\u062A\u0628\u0651\u0639 \u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0635\u0641\u062D\u0629\u060C \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629\u060C \u0648\u0627\u0644\u0634\u0631\u0627\u0621 (\u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631) \u0628\u0639\u062F \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0632\u0627\u0626\u0631. \u0627\u062A\u0631\u0643\u064A\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u0645\u062A\u062C\u0631 \u0628\u062F\u0648\u0646 \u062A\u062A\u0628\u0651\u0639." }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: savingSettings,
                  className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 Meta Pixel" })
                  ]
                }
              )
            ] })
          ] }),
          (settingsSubView === "all" || settingsSubView === "delivery") && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `${saasCardClass} space-y-4`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsx("span", { children: "\u0625\u062F\u0627\u0631\u0629 \u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (\u062D\u062A\u0649 5 \u0634\u0631\u0643\u0627\u062A)" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u0623\u0636\u064A\u0641\u064A \u062D\u0633\u0627\u0628\u0627\u062A \u0634\u0631\u0643\u0627\u062A \u0627\u0644\u0634\u062D\u0646 (Yalidine\u060C ZR Express\u060C Guepex\u060C Maystro\u060C Nord et Ouest...) \u0645\u0639 \u0645\u0641\u0627\u062A\u064A\u062D API\u060C \u0648\u0639\u064A\u0651\u0646\u064A \u0627\u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0623\u0648 \u0627\u062E\u062A\u0627\u0631\u064A\u0647\u0627 \u0644\u0643\u0644 \u0637\u0644\u0628." })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "rounded-full px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium tabular-nums", children: [
                  draftShippingCompanies.length,
                  " / 5 \u0634\u0631\u0643\u0627\u062A"
                ] })
              ] }),
              draftShippingCompanies.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: draftShippingCompanies.map((company) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `rounded-2xl border p-4 space-y-2.5 transition-colors ${company.isDefault ? "bg-neutral-50/80 border-[#5E1734]/35" : "bg-white border-neutral-200"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-neutral-900", children: company.name }),
                          company.isDefault && /* @__PURE__ */ jsx("span", { className: "rounded-full px-2.5 py-0.5 bg-[#5E1734] text-white text-[11px] font-medium", children: "\u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629" }),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `rounded-full px-2.5 py-0.5 text-[11px] font-medium ${company.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" : "bg-rose-50 text-rose-700 border border-rose-200/80"}`,
                              children: company.isActive ? "\u0645\u0641\u0639\u0651\u0644\u0629" : "\u0645\u0639\u0637\u0651\u0644\u0629"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 space-y-0.5 text-[11px] text-neutral-500", dir: "ltr", children: [
                          /* @__PURE__ */ jsxs("p", { className: "truncate", children: [
                            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "API ID:" }),
                            " ",
                            company.apiId ? company.apiId : "\u2014"
                          ] }),
                          /* @__PURE__ */ jsxs("p", { className: "truncate", children: [
                            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "API Token:" }),
                            " ",
                            company.apiToken ? `${company.apiToken.slice(0, 4)}\u2022\u2022\u2022\u2022\u2022\u2022` : "\u2014"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: savingCourier,
                            onClick: () => handleStartEditCourier(company),
                            title: "\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0631\u0643\u0629",
                            "aria-label": `\u062A\u0639\u062F\u064A\u0644 ${company.name}`,
                            className: "p-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-[#5E1734] border border-neutral-200 cursor-pointer disabled:opacity-50",
                            children: /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: savingCourier,
                            onClick: () => handleDeleteCourier(company.id),
                            title: "\u062D\u0630\u0641 \u0627\u0644\u0634\u0631\u0643\u0629",
                            "aria-label": `\u062D\u0630\u0641 ${company.name}`,
                            className: "p-1.5 rounded-xl bg-neutral-50 hover:bg-rose-50 text-neutral-500 hover:text-rose-700 border border-neutral-200 hover:border-rose-200 cursor-pointer disabled:opacity-50",
                            children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/70", children: [
                      !company.isDefault && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          disabled: savingCourier,
                          onClick: () => handleSetDefaultCourier(company.id),
                          className: "px-2.5 py-1 rounded-lg bg-[#5E1734]/10 hover:bg-[#5E1734]/15 text-[#5E1734] text-[11px] font-semibold cursor-pointer disabled:opacity-50",
                          children: "\u062A\u0639\u064A\u064A\u0646 \u0643\u0627\u0641\u062A\u0631\u0627\u0636\u064A"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          disabled: savingCourier,
                          onClick: () => handleToggleCourierActive(company.id),
                          className: `px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer disabled:opacity-50 ${company.isActive ? "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`,
                          children: company.isActive ? "\u062A\u0639\u0637\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628" : "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628"
                        }
                      )
                    ] })
                  ]
                },
                company.id
              )) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-xl p-3", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0634\u0631\u0643\u0627\u062A \u062A\u0648\u0635\u064A\u0644 \u0645\u062D\u0641\u0648\u0638\u0629 \u0628\u0639\u062F. \u0623\u0636\u064A\u0641\u064A \u0623\u0648\u0644 \u0634\u0631\u0643\u0629 \u0634\u062D\u0646 \u0645\u0646 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0623\u062F\u0646\u0627\u0647." }),
              /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSaveCourier,
                  className: "rounded-2xl bg-neutral-50/70 border border-neutral-200/80 p-4 space-y-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734] inline-flex items-center gap-1.5", children: editingCourierId ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644 \u062D\u0633\u0627\u0628 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" })
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u062D\u0633\u0627\u0628 \u0634\u0631\u0643\u0629 \u062A\u0648\u0635\u064A\u0644 \u062C\u062F\u064A\u062F" })
                      ] }) }),
                      editingCourierId && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: resetCourierForm,
                          className: "text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer",
                          children: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0639\u062F\u064A\u0644"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: SHIPPING_COMPANY_PRESETS.map((preset) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setCourierName(preset),
                        className: `px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${courierName.trim() === preset ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-neutral-600 border-neutral-200 hover:border-[#5E1734]/40"}`,
                        children: preset
                      },
                      preset
                    )) }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-neutral-600 mb-1", children: "\u0627\u0633\u0645 \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 *" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            value: courierName,
                            onChange: (e) => setCourierName(e.target.value),
                            placeholder: "\u0645\u062B\u0627\u0644: Yalidine \u0623\u0648 Guepex",
                            className: `${saasInputClass} bg-white font-semibold`
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-neutral-600 mb-1", children: "API ID" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            dir: "ltr",
                            value: courierApiId,
                            onChange: (e) => setCourierApiId(e.target.value),
                            placeholder: "\u0623\u062F\u062E\u0644 API ID",
                            className: `${saasInputClass} bg-white`
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-neutral-600 mb-1", children: "API Token" }),
                        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: showCourierToken ? "text" : "password",
                              dir: "ltr",
                              value: courierApiToken,
                              onChange: (e) => setCourierApiToken(e.target.value),
                              placeholder: "\u0623\u062F\u062E\u0644 API Token",
                              className: `${saasInputClass} bg-white pl-9`
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setShowCourierToken((prev) => !prev),
                              "aria-label": showCourierToken ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0631\u0645\u0632" : "\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0631\u0645\u0632",
                              className: "absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-[#5E1734] cursor-pointer",
                              children: showCourierToken ? /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }) : /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs", children: [
                        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 font-semibold text-neutral-700 cursor-pointer", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: courierIsActive,
                              onChange: (e) => setCourierIsActive(e.target.checked),
                              className: "w-4 h-4 accent-[#5E1734] rounded cursor-pointer"
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0641\u0639\u0651\u0644" })
                        ] }),
                        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 font-semibold text-neutral-700 cursor-pointer", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: courierIsDefault,
                              onChange: (e) => setCourierIsDefault(e.target.checked),
                              className: "w-4 h-4 accent-[#5E1734] rounded cursor-pointer"
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u064A\u064A\u0646 \u0643\u0627\u0641\u062A\u0631\u0627\u0636\u064A" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "submit",
                          disabled: savingCourier || !editingCourierId && draftShippingCompanies.length >= 5,
                          className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-55 transition-colors",
                          children: [
                            savingCourier ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin", strokeWidth: 1.75 }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: editingCourierId ? "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A" : draftShippingCompanies.length >= 5 ? "\u062A\u0645 \u0628\u0644\u0648\u063A \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 (5 \u0634\u0631\u0643\u0627\u062A)" : "\u0625\u0636\u0627\u0641\u0629 \u0648\u062D\u0641\u0638 \u0627\u0644\u0634\u0631\u0643\u0629" })
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSaveDeliveryPricing,
                className: `${saasCardClass} space-y-4`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629 (58 \u0648\u0644\u0627\u064A\u0629)" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: "\u062D\u062F\u0651\u062F\u064A \u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0643\u062A\u0628 (Stop Desk) \u0648\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644 \u0644\u0643\u0644 \u0648\u0644\u0627\u064A\u0629\u060C \u0644\u064A\u064F\u062D\u0633\u0628 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0641\u064A \u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0632\u0628\u0648\u0646." })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          role: "switch",
                          "aria-checked": Boolean(draftDeliveryPricing.deliveryLocked),
                          disabled: savingDeliveryPricing,
                          onClick: handleToggleDeliveryLocked,
                          className: `inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${draftDeliveryPricing.deliveryLocked ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/70"}`,
                          children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${draftDeliveryPricing.deliveryLocked ? "bg-amber-600" : "bg-neutral-300"}`,
                                children: /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${draftDeliveryPricing.deliveryLocked ? "-translate-x-3.5" : "-translate-x-0.5"}`
                                  }
                                )
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { children: "\u0642\u0641\u0644 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0645\u0624\u0642\u062A\u0627\u064B (\u064A\u064F\u062D\u062F\u0651\u062F \u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          role: "switch",
                          "aria-checked": draftDeliveryPricing.freeDelivery,
                          disabled: savingDeliveryPricing,
                          onClick: handleToggleFreeDelivery,
                          className: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-60 ${draftDeliveryPricing.freeDelivery ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/70"}`,
                          children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `w-2 h-2 rounded-full ${draftDeliveryPricing.freeDelivery ? "bg-emerald-600" : "bg-neutral-400"}`
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { children: draftDeliveryPricing.freeDelivery ? "\u062A\u0648\u0635\u064A\u0644 \u0645\u062C\u0627\u0646\u064A (\u0645\u0641\u0639\u0651\u0644)" : "\u062A\u0648\u0635\u064A\u0644 \u0645\u062C\u0627\u0646\u064A" })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  draftDeliveryPricing.deliveryLocked && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-[#FEF3C7]/70 border border-[#FCD34D] px-3 py-2 text-xs font-semibold text-[#92400E]", children: "\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0645\u0642\u0641\u0644 \u0645\u0624\u0642\u062A\u0627\u064B: \u064A\u0638\u0647\u0631 \u0644\u0644\u0632\u0628\u0627\u0626\u0646 \u062F\u0627\u062E\u0644 \u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u062E\u064A\u0627\u0631 \xAB\u064A\u064F\u062D\u062F\u0651\u062F \u062D\u0633\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0629\xBB \u0645\u0639 \xAB\u0627\u0644\u0645\u062C\u0645\u0648\u0639 (\u0628\u062F\u0648\u0646 \u062A\u0648\u0635\u064A\u0644)\xBB \u062F\u0648\u0646 \u0625\u0636\u0627\u0641\u0629 \u0623\u064A \u0631\u0633\u0648\u0645 \u0634\u062D\u0646 \u062A\u0644\u0642\u0627\u0626\u064A\u0629." }),
                  !draftDeliveryPricing.deliveryLocked && draftDeliveryPricing.freeDelivery && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-[#EBF9F2] border border-[#BEEBD4] px-3 py-2 text-xs font-semibold text-[#147A53]", children: "\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u062C\u0627\u0646\u064A \u0645\u0641\u0639\u0651\u0644 \u062D\u0627\u0644\u064A\u0627\u064B: \u0633\u064A\u0638\u0647\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0628\u0642\u064A\u0645\u0629 0 \u062F\u062C \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0641\u064A \u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0632\u0628\u0627\u0626\u0646 \u0645\u0639 \u0627\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0623\u062F\u0646\u0627\u0647." }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-neutral-50/70 border border-neutral-200/80 p-3.5 space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-[#5E1734] inline-flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: "\u062A\u0637\u0628\u064A\u0642 \u0633\u0639\u0631 \u0645\u0648\u062D\u062F \u0639\u0644\u0649 \u0643\u0644 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A (58)" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleResetDeliveryPricing,
                          className: "text-xs font-semibold text-neutral-500 hover:text-rose-700 cursor-pointer",
                          children: "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0623\u0633\u0639\u0627\u0631"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-neutral-600 mb-1.5", children: "\u0633\u0639\u0631 \u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0643\u062A\u0628 (Stop Desk - \u062F\u062C)" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "number",
                            min: 0,
                            value: bulkOfficePrice,
                            onChange: (e) => setBulkOfficePrice(e.target.value),
                            placeholder: "\u0645\u062B\u0627\u0644: 400",
                            className: `${saasInputClass} bg-white font-bold tabular-nums`
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-neutral-600 mb-1.5", children: "\u0633\u0639\u0631 \u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0646\u0632\u0644 (Home - \u062F\u062C)" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "number",
                            min: 0,
                            value: bulkHomePrice,
                            onChange: (e) => setBulkHomePrice(e.target.value),
                            placeholder: "\u0645\u062B\u0627\u0644: 600",
                            className: `${saasInputClass} bg-white font-bold tabular-nums`
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleBulkApplyDeliveryPricing,
                          className: "w-full py-2.5 px-3.5 rounded-xl bg-[#5E1734]/10 hover:bg-[#5E1734]/15 text-[#5E1734] border border-[#5E1734]/20 text-xs font-semibold transition-colors cursor-pointer",
                          children: "\u062A\u0637\u0628\u064A\u0642 \u0633\u0639\u0631 \u0645\u0648\u062D\u062F \u0639\u0644\u0649 \u0643\u0644 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
                      /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: wilayaSearch,
                          onChange: (e) => setWilayaSearch(e.target.value),
                          placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0648\u0644\u0627\u064A\u0629 (\u0645\u062B\u0627\u0644: \u0627\u0644\u062C\u0632\u0627\u0626\u0631\u060C \u062A\u064A\u0627\u0631\u062A\u060C 16)...",
                          className: "w-full bg-neutral-50/70 border border-neutral-200 focus:border-[#5E1734] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E1734]/10 rounded-xl pr-10 pl-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 transition-all"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "rounded-full px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 tabular-nums", children: [
                      ALGERIA_WILAYAS.length,
                      " \u0648\u0644\u0627\u064A\u0629"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "border border-neutral-200/80 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "max-h-[380px] overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-right border-collapse", children: [
                    /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-10 bg-neutral-100 text-neutral-700 text-[11px] font-bold border-b border-neutral-200", children: /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3.5", children: "\u0627\u0644\u0648\u0644\u0627\u064A\u0629" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3.5", children: "\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0643\u062A\u0628 (Stop Desk - \u062F\u062C)" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3.5", children: "\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644 (Home Delivery - \u062F\u062C)" })
                    ] }) }),
                    /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-100 text-xs", children: ALGERIA_WILAYAS.filter(
                      (w) => !wilayaSearch.trim() ? true : w.toLowerCase().includes(wilayaSearch.trim().toLowerCase())
                    ).map((wilayaName) => {
                      const rate = draftDeliveryPricing.wilayas[wilayaName] || {
                        office: draftDeliveryPricing.defaultOfficePrice || 0,
                        home: draftDeliveryPricing.defaultHomePrice || 0
                      };
                      return /* @__PURE__ */ jsxs(
                        "tr",
                        {
                          className: "hover:bg-neutral-50/80 transition-colors",
                          children: [
                            /* @__PURE__ */ jsx("td", { className: "py-2 px-3.5 font-semibold text-neutral-900 whitespace-nowrap", children: wilayaName }),
                            /* @__PURE__ */ jsx("td", { className: "py-1.5 px-3.5", children: /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                "aria-label": `\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0643\u062A\u0628 - ${wilayaName}`,
                                value: rate.office,
                                onChange: (e) => handleWilayaPriceChange(
                                  wilayaName,
                                  "office",
                                  e.target.value
                                ),
                                className: `w-full max-w-[140px] ${saasCompactInputClass}`
                              }
                            ) }),
                            /* @__PURE__ */ jsx("td", { className: "py-1.5 px-3.5", children: /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                "aria-label": `\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u0646\u0632\u0644 - ${wilayaName}`,
                                value: rate.home,
                                onChange: (e) => handleWilayaPriceChange(
                                  wilayaName,
                                  "home",
                                  e.target.value
                                ),
                                className: `w-full max-w-[140px] ${saasCompactInputClass}`
                              }
                            ) })
                          ]
                        },
                        wilayaName
                      );
                    }) })
                  ] }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "submit",
                        disabled: savingDeliveryPricing,
                        className: "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                        children: [
                          savingDeliveryPricing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin", strokeWidth: 1.75 }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4", strokeWidth: 1.75 }),
                          /* @__PURE__ */ jsx("span", { children: savingDeliveryPricing ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-neutral-500", children: "\u064A\u062A\u0645 \u0627\u0644\u062D\u0641\u0638 \u0645\u0628\u0627\u0634\u0631\u0629 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u064A\u0638\u0647\u0631 \u0641\u0648\u0631\u0627\u064B \u0641\u064A \u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A." })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleAddCustomDeliveryOffice,
                className: `${saasCardClass} space-y-3.5`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u0645\u0643\u0627\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-neutral-500 tabular-nums", children: [
                      (dynamicSettings.customDeliveryOffices || []).length,
                      " \u0645\u0643\u062A\u0628 \u0645\u0636\u0627\u0641"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0643\u062A\u0628 / \u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 *" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: newOfficeName,
                          onChange: (e) => setNewOfficeName(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: \u0645\u0643\u062A\u0628 \u062A\u064A\u0627\u0631\u062A \u0644\u0644\u062A\u0648\u0635\u064A\u0644\u060C Elogistia",
                          className: saasInputClass
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-neutral-600 mb-1.5", children: "\u0631\u0627\u0628\u0637 API \u0623\u0648 \u0645\u0644\u0627\u062D\u0638\u0627\u062A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: newOfficeNotes,
                          onChange: (e) => setNewOfficeNotes(e.target.value),
                          placeholder: "\u0631\u0627\u0628\u0637 API \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 / \u0645\u0644\u0627\u062D\u0638\u0627\u062A",
                          className: saasInputClass
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingSettings,
                      className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5", strokeWidth: 1.75 }),
                        /* @__PURE__ */ jsx("span", { children: savingSettings ? "\u062C\u0627\u0631\u064A \u0627\u0644\u0625\u0636\u0627\u0641\u0629..." : "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0643\u062A\u0628" })
                      ]
                    }
                  ),
                  (dynamicSettings.customDeliveryOffices || []).length > 0 && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-neutral-100 space-y-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-neutral-600", children: "\u0645\u0643\u0627\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0636\u0627\u0641\u0629 \u064A\u062F\u0648\u064A\u0627\u064B:" }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: (dynamicSettings.customDeliveryOffices || []).map((office) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between gap-2 p-3 rounded-xl border bg-neutral-50/70 border-neutral-200/80",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-neutral-900 truncate", children: office.name }),
                            office.notes && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-neutral-500 truncate mt-0.5", children: office.notes })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              disabled: savingSettings,
                              onClick: () => handleDeleteCustomDeliveryOffice(office),
                              "aria-label": `\u062D\u0630\u0641 ${office.name}`,
                              title: "\u062D\u0630\u0641 \u0627\u0644\u0645\u0643\u062A\u0628",
                              className: "w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 text-rose-700 flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors",
                              children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5", strokeWidth: 1.75 })
                            }
                          )
                        ]
                      },
                      office.id
                    )) })
                  ] })
                ]
              }
            )
          ] })
        ] }) }),
        confirmDeleteOrder && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "\u062A\u0623\u0643\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628",
            children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-neutral-900", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5", strokeWidth: 1.75 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-neutral-900", children: [
                    "\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 #",
                    confirmDeleteOrder.order_number
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral-500 mt-1 leading-relaxed", children: [
                    "\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0637\u0644\u0628 ",
                    /* @__PURE__ */ jsx("strong", { children: confirmDeleteOrder.customer_name }),
                    " \u0646\u0647\u0627\u0626\u064A\u0627\u064B \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0647 \u0627\u0644\u0639\u0645\u0644\u064A\u0629."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfirmDeleteOrder(null),
                    disabled: Boolean(deletingOrderId),
                    className: "px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors",
                    children: "\u0625\u0644\u063A\u0627\u0621"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDeleteOrder(confirmDeleteOrder.id),
                    disabled: Boolean(deletingOrderId),
                    className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                    children: deletingOrderId === confirmDeleteOrder.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0630\u0641..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: "\u0646\u0639\u0645\u060C \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628" })
                  }
                )
              ] })
            ] })
          }
        ),
        confirmBulkDelete && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "\u062A\u0623\u0643\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
            children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-neutral-900", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5", strokeWidth: 1.75 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-neutral-900", children: confirmBulkDelete.mode === "all" ? `\u062D\u0630\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A (${confirmBulkDelete.ids.length})` : `\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u062D\u062F\u062F\u0629 (${confirmBulkDelete.ids.length})` }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-1 leading-relaxed", children: confirmBulkDelete.mode === "all" ? `\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A (${confirmBulkDelete.ids.length} \u0637\u0644\u0628) \u0646\u0647\u0627\u0626\u064A\u0627\u064B \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0647 \u0627\u0644\u0639\u0645\u0644\u064A\u0629.` : `\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 ${confirmBulkDelete.ids.length} \u0637\u0644\u0628\u0627\u062A \u0645\u062D\u062F\u062F\u0629 \u0646\u0647\u0627\u0626\u064A\u0627\u064B \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0647 \u0627\u0644\u0639\u0645\u0644\u064A\u0629.` })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfirmBulkDelete(null),
                    disabled: bulkDeleting,
                    className: "px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors",
                    children: "\u0625\u0644\u063A\u0627\u0621"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleConfirmBulkDeleteOrders,
                    disabled: bulkDeleting,
                    className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors",
                    children: bulkDeleting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0630\u0641..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: confirmBulkDelete.mode === "all" ? "\u0646\u0639\u0645\u060C \u062D\u0630\u0641 \u0627\u0644\u0643\u0644" : `\u0646\u0639\u0645\u060C \u062D\u0630\u0641 (${confirmBulkDelete.ids.length})` })
                  }
                )
              ] })
            ] })
          }
        ),
        lightboxReceipt && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-70 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": `${lightboxReceipt.title || "\u0635\u0648\u0631\u0629 \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639"} \u0644\u0644\u0637\u0644\u0628 #${lightboxReceipt.orderNumber}`,
            onClick: () => setLightboxReceipt(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-3 sm:p-4 shadow-2xl space-y-3",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-100", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-neutral-900 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-[#5E1734]", strokeWidth: 1.75 }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        lightboxReceipt.title || "\u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u0631\u0641\u0642",
                        " \u2014 \u0627\u0644\u0637\u0644\u0628 #",
                        lightboxReceipt.orderNumber
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setLightboxReceipt(null),
                        "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                        className: "p-1.5 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer transition-colors",
                        children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4", strokeWidth: 1.75 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "max-h-[75vh] overflow-auto flex items-center justify-center bg-neutral-50 rounded-xl border border-neutral-200/80 p-2", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: lightboxReceipt.url,
                      alt: `${lightboxReceipt.title || "\u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639"} \u0644\u0644\u0637\u0644\u0628 #${lightboxReceipt.orderNumber}`,
                      className: "max-w-full max-h-[70vh] object-contain rounded-lg"
                    }
                  ) })
                ]
              }
            )
          }
        ),
        workshopSlipOrder && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-70 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": `\u0648\u0631\u0642\u0629 \u0627\u0644\u0648\u0631\u0634\u0629 \u0644\u0644\u0637\u0644\u0628 #${workshopSlipOrder.order_number}`,
            onClick: () => setWorkshopSlipOrder(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                id: "workshop-print-slip",
                className: "relative bg-white border border-neutral-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 text-neutral-900",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-neutral-500", children: [
                        activeStoreDisplayName,
                        " \xB7 \u0648\u0631\u0642\u0629 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0648\u0631\u0634\u0629"
                      ] }),
                      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-extrabold text-[#5E1734] tabular-nums", children: [
                        "\u0637\u0644\u0628 #",
                        workshopSlipOrder.order_number
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "no-print flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            document.body.classList.add("printing-workshop-slip");
                            const cleanup = () => {
                              document.body.classList.remove("printing-workshop-slip");
                              window.removeEventListener("afterprint", cleanup);
                            };
                            window.addEventListener("afterprint", cleanup);
                            window.print();
                            setTimeout(cleanup, 1200);
                          },
                          className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5E1734] hover:bg-[#491028] text-white text-xs font-semibold cursor-pointer transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4", strokeWidth: 1.75 }),
                            /* @__PURE__ */ jsx("span", { children: "\u0637\u0628\u0627\u0639\u0629 \u0648\u0631\u0642\u0629 \u0627\u0644\u0648\u0631\u0634\u0629" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setWorkshopSlipOrder(null),
                          "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0648\u0631\u0642\u0629 \u0627\u0644\u0648\u0631\u0634\u0629",
                          className: "p-2 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer transition-colors",
                          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4", strokeWidth: 1.75 })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#FAF8F5] border border-[#C6A355]/35 rounded-xl p-3 text-xs", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[#6E4E5A]", children: "\u0627\u0644\u0632\u0628\u0648\u0646:" }),
                      " ",
                      /* @__PURE__ */ jsx("strong", { children: workshopSlipOrder.customer_name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[#6E4E5A]", children: "\u0627\u0644\u0647\u0627\u062A\u0641:" }),
                      " ",
                      /* @__PURE__ */ jsx("strong", { dir: "ltr", children: workshopSlipOrder.phone || workshopSlipOrder.customer_phone || "\u2014" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[#6E4E5A]", children: "\u0627\u0644\u0648\u0644\u0627\u064A\u0629:" }),
                      " ",
                      /* @__PURE__ */ jsxs("strong", { children: [
                        workshopSlipOrder.wilaya,
                        workshopSlipOrder.commune && workshopSlipOrder.commune !== "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629" ? ` - ${workshopSlipOrder.commune}` : ""
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[#6E4E5A]", children: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0633\u0644\u064A\u0645:" }),
                      " ",
                      /* @__PURE__ */ jsx("strong", { children: workshopSlipOrder.product_details?.deliveryDate || "\u0623\u0642\u0631\u0628 \u0645\u0648\u0639\u062F" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-extrabold text-[#5E1734]", children: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0648\u0627\u0644\u062A\u0641\u0635\u064A\u0644:" }),
                    getOrderItems(workshopSlipOrder).map((item, idx) => {
                      const sidesText = item.right_embroidered_text || item.left_embroidered_text ? [
                        item.right_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${item.right_embroidered_text}` : null,
                        item.left_embroidered_text ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${item.left_embroidered_text}` : null
                      ].filter(Boolean).join(" | ") : item.embroidered_text || null;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "rounded-xl border border-[#C6A355]/40 bg-white p-3.5 space-y-2 text-xs",
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between font-extrabold text-sm text-[#2A151D]", children: [
                              /* @__PURE__ */ jsxs("span", { children: [
                                idx + 1,
                                ". ",
                                item.title || item.name || "\u0645\u0646\u062A\u062C"
                              ] }),
                              /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-lg bg-[#FCE8EF] text-[#5E1734] tabular-nums", children: [
                                "\u0627\u0644\u0643\u0645\u064A\u0629: ",
                                item.quantity || 1
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#6E4E5A]", children: [
                              item.fabric_type && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0627\u0644\u0642\u0645\u0627\u0634: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.fabric_type })
                              ] }),
                              item.shawl_color && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0627\u0644\u0644\u0648\u0646: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.shawl_color })
                              ] }),
                              item.thread_color && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0644\u0648\u0646 \u0627\u0644\u062A\u0637\u0631\u064A\u0632: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.thread_color })
                              ] }),
                              item.size && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0627\u0644\u0645\u0642\u0627\u0633: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.size })
                              ] }),
                              item.cap_style && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0627\u0644\u0642\u0628\u0639\u0629: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.cap_style })
                              ] }),
                              item.cap_color && /* @__PURE__ */ jsxs("div", { children: [
                                "\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.cap_color })
                              ] }),
                              item.cap_embroidery && /* @__PURE__ */ jsxs("div", { children: [
                                "\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ",
                                /* @__PURE__ */ jsx("strong", { className: "text-[#2A151D]", children: item.cap_embroidery })
                              ] })
                            ] }),
                            sidesText && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#FAF8F5] border border-[#5E1734]/25 p-2.5 text-xs font-extrabold text-[#5E1734]", children: sidesText }),
                            item.details && !sidesText && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#6E4E5A]", children: item.details }),
                            isSafeReceiptSrc(item.university_logo) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: item.university_logo,
                                  alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                                  className: "w-12 h-12 rounded-full object-cover border border-[#5E1734]"
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#5E1734]", children: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642" })
                            ] }),
                            isSafeReceiptSrc(item.custom_model_image) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 pt-1", children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: item.custom_model_image,
                                  alt: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629",
                                  className: "w-16 h-16 rounded-xl object-cover border border-[#C6A355]/60 bg-white"
                                }
                              ),
                              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                                /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-bold text-[#5E1734]", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629 (\u0645\u0631\u0641\u0642\u0629 \u0645\u0646 \u0627\u0644\u0632\u0628\u0648\u0646)" }),
                                item.custom_notes && /* @__PURE__ */ jsxs("span", { className: "block text-[11px] text-[#6E4E5A]", children: [
                                  "\u0645\u0644\u0627\u062D\u0638\u0627\u062A: ",
                                  item.custom_notes
                                ] })
                              ] })
                            ] })
                          ]
                        },
                        idx
                      );
                    })
                  ] }),
                  workshopSlipOrder.product_details?.notes && /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#FFF8EB] border border-[#F5D69E] p-3 text-xs text-[#7C4A15]", children: [
                    /* @__PURE__ */ jsx("strong", { children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0632\u0628\u0648\u0646:" }),
                    " ",
                    workshopSlipOrder.product_details.notes
                  ] })
                ]
              }
            )
          }
        )
      ] })
    }
  );
}
export {
  AdminDashboardModal,
  AdminLoginModal,
  CopyEditorModal,
  ProductEditorModal
};
