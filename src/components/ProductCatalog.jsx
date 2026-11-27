import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Eye,
  ImageOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Share2,
  ShoppingBag,
  Trash2,
  X,
  ZoomIn
} from "lucide-react";
import {
  BOUQUET_IMAGE_PATH,
  CAP_SWATCHES,
  CATEGORY_BRANCHES,
  CATEGORY_IMAGE_BG_PRESETS,
  DEFAULT_GOWN_COLORS,
  DEFAULT_STOLE_COLORS,
  ROBE_IMAGE_PATH,
  ROYAL_SIX_STOLE_COLORS,
  SHAWL_AMERICAN_IMAGE_PATH,
  SHAWL_BACK_IMAGE_PATH,
  SHAWL_IMAGE_PATH,
  SHAWL_REGULAR_IMAGE_PATH,
  THREAD_COLORS,
  WHATSAPP_NUMBER,
  formatWhatsAppNumber
} from "../data/defaultStore";
import { compressReceiptImage } from "../lib/supabase";
import { StoleCapLivePreview, exportStoleDesignCardPng } from "./StoleCapLivePreview";
import { GownColorPreviewImage } from "./GownColorPreviewImage";
import { CustomModelRequestCard, CustomModelRequestView } from "./CustomModelRequestView";
import { EditableText } from "./EditableText";
import capRoundImg from "../assets/images/round.webp";
import capTriangleImg from "../assets/images/triangle.webp";
import capTuxedoImg from "../assets/images/tuxedo.webp";
const MAIN_SECTIONS = [
  {
    id: "shawl",
    slug: "shawl",
    title: "\u0627\u0644\u0648\u0634\u0627\u062D",
    subtitle: "\u0634\u0627\u0644 \u0645\u064A\u0633 \u0623\u0648 \u0639\u0627\u062F\u064A \u0623\u0648 \u0628\u0627\u0644\u0638\u0647\u0631 \u0645\u0639 \u0627\u0644\u0642\u0628\u0639\u0629\u060C \u0628\u0642\u0645\u0627\u0634 \u0627\u0644\u0643\u0631\u064A\u0628 \u0623\u0648 \u0627\u0644\u062F\u0627\u0646\u060C \u0648\u062A\u0635\u0645\u0651\u0645\u0647 \u0628\u0627\u0633\u0645\u0643 \u0648\u0634\u0639\u0627\u0631\u0643.",
    priceLabel: "\u0645\u0646 3,800 \u062F\u062C \u0645\u0639 \u0627\u0644\u0642\u0628\u0639\u0629",
    buttonText: "\u0635\u0645\u0651\u0645 \u0648\u0634\u0627\u062D\u0643",
    fallbackImg: SHAWL_IMAGE_PATH
  },
  {
    id: "robe",
    slug: "robe",
    title: "\u0627\u0644\u0631\u0648\u0628",
    subtitle: "\u0631\u0648\u0628 \u0627\u0644\u062A\u062E\u0631\u062C \u0628\u0623\u0644\u0648\u0627\u0646 \u0645\u0644\u0643\u064A\u0629 \u0648\u0645\u0642\u0627\u0633 \u0631\u062C\u0627\u0644\u064A \u0623\u0648 \u0646\u0633\u0627\u0626\u064A \u0623\u0648 \u0628\u0642\u064A\u0627\u0633\u0627\u062A\u0643 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u062F\u0642\u0629.",
    priceLabel: "\u0645\u0646 2,500 \u062F\u062C",
    buttonText: "\u0627\u062E\u062A\u0631 \u0631\u0648\u0628\u0643",
    fallbackImg: ROBE_IMAGE_PATH
  },
  {
    id: "accessories",
    slug: "accessories",
    title: "\u0627\u0644\u0648\u0631\u062F",
    subtitle: "\u0628\u0627\u0642\u0627\u062A \u0648\u0631\u062F \u0627\u0644\u062A\u062E\u0631\u062C \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0645\u0646 \u0627\u0644\u0648\u0631\u062F \u0627\u0644\u062F\u0627\u0626\u0645 \u0623\u0648 \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0645\u0639 \u0628\u0637\u0627\u0642\u0629 \u062A\u0647\u0646\u0626\u0629 \u0645\u062E\u0635\u0635\u0629 \u0644\u0625\u0637\u0644\u0627\u0644\u0629 \u062A\u062E\u0631\u062C\u0643.",
    priceLabel: "\u0645\u0646 1,500 \u062F\u062C",
    buttonText: "\u0627\u062E\u062A\u0631 \u0628\u0627\u0642\u062A\u0643",
    fallbackImg: BOUQUET_IMAGE_PATH
  }
];
const EXTRA_SECTION_META = {
  shawl: { id: "shawl", title: "\u0627\u0644\u0648\u0634\u0627\u062D", subtitle: MAIN_SECTIONS[0].subtitle },
  robe: { id: "robe", title: "\u0627\u0644\u0631\u0648\u0628", subtitle: MAIN_SECTIONS[1].subtitle },
  accessories: { id: "accessories", title: "\u0627\u0644\u0648\u0631\u062F", subtitle: MAIN_SECTIONS[2].subtitle },
  cap: {
    id: "cap",
    title: "\u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u0645\u0646\u0641\u0631\u062F\u0629",
    subtitle: "\u0642\u0628\u0639\u0627\u062A \u062A\u062E\u0631\u062C \u0645\u062E\u0635\u0635\u0629 \u0628\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0627\u0633\u0645 \u0648\u0645\u062D\u064A\u0637 \u0627\u0644\u0631\u0623\u0633 \u0627\u0644\u062F\u0642\u064A\u0642."
  }
};
const BASE_CAP_STYLES = [
  {
    id: "round",
    label: "\u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u062F\u0627\u0626\u0631\u064A\u0629",
    extraPrice: 0,
    priceText: "\u0645\u0634\u0645\u0648\u0644\u0629",
    image: capRoundImg
  },
  {
    id: "triangle",
    label: "\u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u0645\u062B\u0644\u062B\u0629",
    extraPrice: 0,
    priceText: "\u0645\u0634\u0645\u0648\u0644\u0629",
    image: capTriangleImg
  },
  {
    id: "tuxedo",
    label: "\u0642\u0628\u0639\u0629 \u062A\u0648\u0643\u0633\u064A\u062F\u0648",
    extraPrice: 100,
    priceText: "+100 \u062F\u062C",
    image: capTuxedoImg
  }
];
const isCapSecondaryOption = (opt) => opt.includes("\u0642\u0628\u0639\u0629 \u0639\u0627\u062F\u064A\u0629") || opt.includes("\u062A\u0648\u0643\u0633\u064A\u062F\u0648 (+100");
const SEAMLESS_VIGNETTE_STYLE = {
  maskImage: "radial-gradient(ellipse 94% 94% at 50% 50%, #000 72%, rgba(0,0,0,0.68) 88%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 94% 94% at 50% 50%, #000 72%, rgba(0,0,0,0.68) 88%, transparent 100%)"
};
function scrollToCatalogTop(targetEl) {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    const el = targetEl || document.getElementById("catalog-sec");
    if (!el) return;
    const stickyHeader = document.querySelector("header");
    const headerHeight = stickyHeader ? Math.round(stickyHeader.getBoundingClientRect().height) : 64;
    const offset = headerHeight + 12;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({ top, behavior: "smooth" });
  });
}
function ProductDetailView({
  product,
  hasSavedOptionsOverride = false,
  sectionTitle,
  isAdminMode,
  isCategoryPaused = false,
  categoryPauseBadge = "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B",
  storewideDiscountPercent = 0,
  imageBgColor = "#FAF8F5",
  americanShawlFrontImage,
  americanShawlBackImage,
  regularShawlBaseImage,
  initialDesign = null,
  stoleColors,
  crystalRoyalColors,
  onUpdateCrystalRoyalColors,
  gownColors,
  threadColors,
  capColors,
  onBackToHome,
  onBackToSection,
  onAddToCart,
  onNotify,
  onSetColorImage,
  onUpdateProductOptions,
  onUpdateSecondaryOptions,
  onToggleField,
  onEdit,
  onDelete,
  onUpdatePrice,
  onUpdateDescription,
  onToggleAutoColorize,
  capOptionPrices,
  onUpdateCapOptionPrice,
  onReplaceImage,
  onReplaceAmericanShawlImage,
  onReplaceRegularShawlBaseImage,
  onExpressCheckout,
  whatsappNumber = WHATSAPP_NUMBER
}) {
  const matchingShared = initialDesign && initialDesign.productId === product.id ? initialDesign : null;
  const isFlowerProduct = product.category === "accessories";
  const isStoleProduct = product.category === "shawl";
  const normalizedProductTitle = product.name.trim().replace(/أ/g, "\u0627");
  const isAmericanShawlPreview = isStoleProduct && normalizedProductTitle === "\u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0627\u0645\u0631\u064A\u0643\u064A";
  const isCrystalRoyalStole = isStoleProduct && (product.id === "shawl-crystal-royal-1" || normalizedProductTitle.includes("\u0643\u0631\u064A\u0633\u062A\u0627\u0644") || normalizedProductTitle.includes("\u0645\u0631\u0635\u0639"));
  const resolvedStoleColors = useMemo(() => {
    if (isCrystalRoyalStole) {
      const source = Array.isArray(crystalRoyalColors) && crystalRoyalColors.length > 0 ? crystalRoyalColors : ROYAL_SIX_STOLE_COLORS;
      return source.slice(0, 6);
    }
    return stoleColors.length > 0 ? stoleColors : DEFAULT_STOLE_COLORS;
  }, [isCrystalRoyalStole, crystalRoyalColors, stoleColors]);
  const activeMainColors = product.category === "cap" ? capColors.length > 0 ? capColors : CAP_SWATCHES : product.category === "robe" ? gownColors.length > 0 ? gownColors : DEFAULT_GOWN_COLORS : resolvedStoleColors;
  const activeThreadColors = threadColors.length > 0 ? threadColors : THREAD_COLORS;
  const activeCapColors = capColors.length > 0 ? capColors : CAP_SWATCHES;
  const effectiveOptions = useMemo(() => {
    if (!isStoleProduct) return product.options;
    if (hasSavedOptionsOverride || isAmericanShawlPreview) {
      return product.options;
    }
    const base = Array.isArray(product.options) ? [...product.options] : [];
    const hasCrepe = base.some((o) => o.label.includes("\u0643\u0631\u064A\u0628"));
    const hasDan = base.some((o) => o.label.includes("\u062F\u0627\u0646"));
    const fallbackCrepePrice = Math.max(
      0,
      product.basePrice || base[0]?.price || 0
    );
    const fallbackDanPrice = Math.max(
      0,
      base[0]?.price ?? product.basePrice ?? 0
    );
    const next = [...base];
    if (!hasCrepe) {
      next.unshift({ label: "\u0643\u0631\u064A\u0628", price: fallbackCrepePrice });
    }
    if (!hasDan) {
      next.push({ label: "\u062F\u0627\u0646", price: fallbackDanPrice });
    }
    return next;
  }, [
    isStoleProduct,
    isAmericanShawlPreview,
    hasSavedOptionsOverride,
    product.options,
    product.basePrice
  ]);
  const DEFAULT_GOWN_SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "\u0645\u0642\u0627\u0633 \u062E\u0627\u0635"];
  const rawFilteredSecondaryOptions = product.secondaryLabel === "\u0646\u0648\u0639 \u0627\u0644\u0642\u0628\u0639\u0629" ? [] : (product.secondaryOptions || []).filter((opt) => !isCapSecondaryOption(opt));
  const visibleSecondaryOptions = product.category === "robe" && rawFilteredSecondaryOptions.length === 0 ? DEFAULT_GOWN_SIZE_OPTIONS : rawFilteredSecondaryOptions;
  const formatCapPriceText = (extraPrice) => {
    if (extraPrice === 0) return "\u0645\u0634\u0645\u0648\u0644\u0629 / 0 \u062F\u062C";
    if (extraPrice > 0) return `+${extraPrice.toLocaleString("en-US")} \u062F\u062C`;
    return `${extraPrice.toLocaleString("en-US")} \u062F\u062C`;
  };
  const defaultNoCapDeduction = Math.max(0, product.noCapDeduction ?? 500);
  const noneCapExtraPrice = capOptionPrices?.none !== void 0 ? capOptionPrices.none : -defaultNoCapDeduction;
  const capStyles = [
    ...BASE_CAP_STYLES.map((cap) => {
      const resolvedExtra = capOptionPrices?.[cap.id] !== void 0 ? capOptionPrices[cap.id] : cap.extraPrice;
      return {
        ...cap,
        extraPrice: resolvedExtra,
        priceText: formatCapPriceText(resolvedExtra)
      };
    }),
    {
      id: "none",
      label: "\u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629",
      extraPrice: noneCapExtraPrice,
      priceText: formatCapPriceText(noneCapExtraPrice),
      image: null
    }
  ];
  const PRODUCT_DRAFT_KEY = `dg_stole_draft_${product.id}`;
  const readProductDraft = () => {
    if (!isStoleProduct || typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(PRODUCT_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };
  const savedProductDraft = !matchingShared ? readProductDraft() : null;
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(() => {
    if (matchingShared?.optIdx !== void 0 && matchingShared.optIdx >= 0 && matchingShared.optIdx < effectiveOptions.length) {
      return matchingShared.optIdx;
    }
    if (savedProductDraft?.optIdx !== void 0 && savedProductDraft.optIdx >= 0 && savedProductDraft.optIdx < effectiveOptions.length) {
      return savedProductDraft.optIdx;
    }
    return 0;
  });
  const [draftOptions, setDraftOptions] = useState(
    () => effectiveOptions.map((o) => ({ label: o.label, price: String(o.price) }))
  );
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState("");
  const [selectedSecondary, setSelectedSecondary] = useState(() => {
    if (matchingShared?.secondary && visibleSecondaryOptions.includes(matchingShared.secondary)) {
      return matchingShared.secondary;
    }
    return visibleSecondaryOptions.at(0) || "";
  });
  const [draftSecondaryEntries, setDraftSecondaryEntries] = useState(
    () => visibleSecondaryOptions.map((name) => ({
      name,
      extraPrice: String(product.secondaryOptionPrices?.[name] ?? 0)
    }))
  );
  const [newSecondaryOption, setNewSecondaryOption] = useState("");
  const [newSecondaryPrice, setNewSecondaryPrice] = useState("0");
  const [selectedColor, setSelectedColor] = useState(() => {
    if (matchingShared?.colorName) {
      const found = activeMainColors.find((c) => c.name === matchingShared.colorName);
      if (found) return found;
    }
    if (savedProductDraft?.colorName) {
      const found = activeMainColors.find((c) => c.name === savedProductDraft.colorName);
      if (found) return found;
    }
    return activeMainColors[0];
  });
  const [selectedThreadColor, setSelectedThreadColor] = useState(() => {
    if (matchingShared?.threadName) {
      const found = activeThreadColors.find((t) => t.name === matchingShared.threadName);
      if (found) return found;
    }
    if (savedProductDraft?.threadName) {
      const found = activeThreadColors.find((t) => t.name === savedProductDraft.threadName);
      if (found) return found;
    }
    return activeThreadColors[0];
  });
  const [embroideredText, setEmbroideredText] = useState(
    () => matchingShared?.embroideredText || savedProductDraft?.embroideredText || ""
  );
  const [rightEmbroideredText, setRightEmbroideredText] = useState(
    () => matchingShared?.rightEmbroideredText || savedProductDraft?.rightEmbroideredText || ""
  );
  const [leftEmbroideredText, setLeftEmbroideredText] = useState(
    () => matchingShared?.leftEmbroideredText || savedProductDraft?.leftEmbroideredText || ""
  );
  const [customColorText, setCustomColorText] = useState(
    () => matchingShared?.customColorText || savedProductDraft?.customColorText || ""
  );
  const [selectedCapStyleId, setSelectedCapStyleId] = useState(
    () => matchingShared?.capStyleId || savedProductDraft?.capStyleId || "round"
  );
  const [customCapImages, setCustomCapImages] = useState({});
  const [gender, setGender] = useState("\u0646\u0633\u0627\u0626\u064A");
  const [numericSize, setNumericSize] = useState("");
  const [fullLength, setFullLength] = useState("");
  const [shoulderAndSleeve, setShoulderAndSleeve] = useState("");
  const [capSameColor, setCapSameColor] = useState(
    () => matchingShared?.capSameColor !== void 0 ? matchingShared.capSameColor : savedProductDraft?.capSameColor !== void 0 ? savedProductDraft.capSameColor : true
  );
  const [capCustomColor, setCapCustomColor] = useState(() => {
    if (matchingShared?.capColorName) {
      const found = activeCapColors.find((c) => c.name === matchingShared.capColorName);
      if (found) return found;
    }
    if (savedProductDraft?.capColorName) {
      const found = activeCapColors.find((c) => c.name === savedProductDraft.capColorName);
      if (found) return found;
    }
    return activeCapColors[0];
  });
  const [headSize, setHeadSize] = useState("");
  const [capEmbroideryPos, setCapEmbroideryPos] = useState(
    () => matchingShared?.capEmbroideryPos || savedProductDraft?.capEmbroideryPos || "\u0633\u0637\u062D \u0627\u0644\u0642\u0628\u0639\u0629"
  );
  const [capNotes, setCapNotes] = useState("");
  const [customNotes, setCustomNotes] = useState(
    () => savedProductDraft?.customNotes || ""
  );
  const [universityLogo, setUniversityLogo] = useState(null);
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [justShared, setJustShared] = useState(false);
  const [showGownSilhouette, setShowGownSilhouette] = useState(false);
  const [isDownloadingDesign, setIsDownloadingDesign] = useState(false);
  const [lightboxTarget, setLightboxTarget] = useState(null);
  const [uploadingAmericanSide, setUploadingAmericanSide] = useState(null);
  const [uploadingRegularBase, setUploadingRegularBase] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingDetailPrice, setEditingDetailPrice] = useState(false);
  const [detailPriceDraft, setDetailPriceDraft] = useState(
    String(product.basePrice)
  );
  const [savingDetailPrice, setSavingDetailPrice] = useState(false);
  const [editingOptionIdx, setEditingOptionIdx] = useState(null);
  const [optionPriceDraft, setOptionPriceDraft] = useState("");
  const [savingOptionPrice, setSavingOptionPrice] = useState(false);
  const [editingFabricNameIdx, setEditingFabricNameIdx] = useState(null);
  const [fabricNameDraft, setFabricNameDraft] = useState("");
  const [savingFabricName, setSavingFabricName] = useState(false);
  const [isAddingFabricOpen, setIsAddingFabricOpen] = useState(false);
  const [addingFabricOption, setAddingFabricOption] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(product.description);
  const [savingDescription, setSavingDescription] = useState(false);
  const [togglingAutoColorize, setTogglingAutoColorize] = useState(false);
  const [editingCapId, setEditingCapId] = useState(null);
  const [capPriceDraft, setCapPriceDraft] = useState("");
  const [savingCapPrice, setSavingCapPrice] = useState(false);
  const [editingRoyalColors, setEditingRoyalColors] = useState(false);
  const [royalColorDrafts, setRoyalColorDrafts] = useState(
    () => (Array.isArray(crystalRoyalColors) && crystalRoyalColors.length > 0 ? crystalRoyalColors : ROYAL_SIX_STOLE_COLORS).slice(0, 6).map((c) => ({
      ...c,
      extraPrice: Number(c.extraPrice || 0)
    }))
  );
  const [savingRoyalColors, setSavingRoyalColors] = useState(false);
  useEffect(() => {
    if (!editingRoyalColors) {
      const source = Array.isArray(crystalRoyalColors) && crystalRoyalColors.length > 0 ? crystalRoyalColors : ROYAL_SIX_STOLE_COLORS;
      setRoyalColorDrafts(
        source.slice(0, 6).map((c) => ({
          ...c,
          extraPrice: Number(c.extraPrice || 0)
        }))
      );
    }
  }, [crystalRoyalColors, editingRoyalColors]);
  useEffect(() => {
    if (!isStoleProduct || typeof window === "undefined") return;
    try {
      localStorage.setItem(
        PRODUCT_DRAFT_KEY,
        JSON.stringify({
          optIdx: selectedOptionIdx,
          colorName: selectedColor?.name,
          threadName: selectedThreadColor?.name,
          embroideredText,
          rightEmbroideredText,
          leftEmbroideredText,
          customColorText,
          capStyleId: selectedCapStyleId,
          capSameColor,
          capColorName: capCustomColor?.name,
          capEmbroideryPos,
          customNotes,
          updatedAt: Date.now()
        })
      );
    } catch {
    }
  }, [
    isStoleProduct,
    PRODUCT_DRAFT_KEY,
    selectedOptionIdx,
    selectedColor?.name,
    selectedThreadColor?.name,
    embroideredText,
    rightEmbroideredText,
    leftEmbroideredText,
    customColorText,
    selectedCapStyleId,
    capSameColor,
    capCustomColor?.name,
    capEmbroideryPos,
    customNotes
  ]);
  const openProductLightbox = (target) => {
    const resolvedUrl = target?.url || colorizerImageUrl || activeImageUrl;
    if (!resolvedUrl) return;
    const current = window.history.state || {};
    if (!current.productLightbox) {
      window.history.pushState(
        {
          ...current,
          dgBase: true,
          productLightbox: true,
          catalogDepth: Number(current.catalogDepth || 0) + 1
        },
        ""
      );
    }
    setLightboxTarget({
      url: resolvedUrl,
      label: target?.label,
      skipColorizer: target?.skipColorizer
    });
  };
  const closeProductLightbox = () => {
    if (window.history.state?.productLightbox) {
      window.history.back();
      return;
    }
    setLightboxTarget(null);
  };
  useEffect(() => {
    const handleLightboxPop = (event) => {
      if (!event.state?.productLightbox) {
        setLightboxTarget(null);
      }
    };
    window.addEventListener("popstate", handleLightboxPop);
    return () => window.removeEventListener("popstate", handleLightboxPop);
  }, []);
  useEffect(() => {
    if (!lightboxTarget) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeProductLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxTarget]);
  const normalizedTitle = product.name.trim().replace(/أ/g, "\u0627");
  const normalizedBranch = product.branch.trim().replace(/أ/g, "\u0627");
  const isAmericanShawl = product.category === "shawl" && normalizedTitle === "\u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0627\u0645\u0631\u064A\u0643\u064A";
  const isBackShawl = product.category === "shawl" && !isAmericanShawl && (product.id === "shawl-back-1" || normalizedBranch === "\u0634\u0627\u0644 \u0628\u0627\u0644\u0638\u0647\u0631" || normalizedTitle.includes("\u0634\u0627\u0644 \u0628\u0627\u0644\u0638\u0647\u0631"));
  const isRegularShawl = product.category === "shawl" && !isAmericanShawl && (product.id === "shawl-regular-1" || normalizedBranch === "\u0634\u0627\u0644 \u0639\u0627\u062F\u064A" || normalizedTitle.includes("\u0634\u0627\u0644 \u0639\u0627\u062F\u064A"));
  const isAutoColorDisabled = isCrystalRoyalStole ? product.disableAutoColorize !== false : Boolean(product.disableAutoColorize);
  const supportsAutoColorizeToggle = product.category === "robe" || isStoleProduct && !isAmericanShawl;
  const supportsLivePreview = isStoleProduct && !isAmericanShawl || product.category === "cap";
  const [visualTab, setVisualTab] = useState(
    supportsLivePreview && !(isAutoColorDisabled && !matchingShared && Boolean(product.imageUrl)) ? "live" : "photo"
  );
  const colorFileRef = useRef(null);
  const universityLogoInputRef = useRef(null);
  useEffect(() => {
    setDraftOptions(
      effectiveOptions.map((o) => ({ label: o.label, price: String(o.price) }))
    );
    if (effectiveOptions.length > 0 && selectedOptionIdx >= effectiveOptions.length) {
      setSelectedOptionIdx(0);
    }
  }, [effectiveOptions]);
  useEffect(() => {
    setDraftSecondaryEntries(
      visibleSecondaryOptions.map((name) => ({
        name,
        extraPrice: String(product.secondaryOptionPrices?.[name] ?? 0)
      }))
    );
    if (!visibleSecondaryOptions.includes(selectedSecondary)) {
      setSelectedSecondary(visibleSecondaryOptions[0] || "");
    }
  }, [product.secondaryOptions, product.secondaryOptionPrices]);
  useEffect(() => {
    const foundMain = activeMainColors.find(
      (c) => c.name === selectedColor.name && c.hex === selectedColor.hex
    );
    if (foundMain) {
      if (foundMain.extraPrice !== selectedColor.extraPrice) {
        setSelectedColor(foundMain);
      }
    } else if (activeMainColors[0]) {
      setSelectedColor(activeMainColors[0]);
    }
  }, [activeMainColors, selectedColor.name, selectedColor.hex, selectedColor.extraPrice]);
  useEffect(() => {
    const foundThread = activeThreadColors.find(
      (t) => t.name === selectedThreadColor.name && t.hex === selectedThreadColor.hex
    );
    if (foundThread) {
      if (foundThread.extraPrice !== selectedThreadColor.extraPrice) {
        setSelectedThreadColor(foundThread);
      }
    } else if (activeThreadColors[0]) {
      setSelectedThreadColor(activeThreadColors[0]);
    }
  }, [
    activeThreadColors,
    selectedThreadColor.name,
    selectedThreadColor.hex,
    selectedThreadColor.extraPrice
  ]);
  useEffect(() => {
    const foundCap = activeCapColors.find(
      (c) => c.name === capCustomColor.name && c.hex === capCustomColor.hex
    );
    if (foundCap) {
      if (foundCap.extraPrice !== capCustomColor.extraPrice) {
        setCapCustomColor(foundCap);
      }
    } else if (activeCapColors[0]) {
      setCapCustomColor(activeCapColors[0]);
    }
  }, [activeCapColors, capCustomColor.name, capCustomColor.hex, capCustomColor.extraPrice]);
  const selectedCapStyle = capStyles.find((cap) => cap.id === selectedCapStyleId) || capStyles[0];
  const isNoCap = selectedCapStyle.id === "none";
  const handleCapImageUpload = (capId, e) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCustomCapImages((prev) => ({ ...prev, [capId]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };
  const handleUniversityLogoUpload = async (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setLogoError("");
    setIsCompressingLogo(true);
    try {
      const compressed = await compressReceiptImage(file, 360, 0.82);
      setUniversityLogo(compressed);
      if (supportsLivePreview) {
        setVisualTab("live");
      }
    } catch (err) {
      setLogoError(
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629."
      );
    } finally {
      setIsCompressingLogo(false);
      e.target.value = "";
    }
  };
  const activeOption = effectiveOptions[selectedOptionIdx] || effectiveOptions[0];
  const basePrice = activeOption ? activeOption.price : product.basePrice;
  const saveEffectiveOptionPrice = async (nextPrice, optionIdx) => {
    const safePrice = Math.max(0, Math.round(nextPrice));
    if (effectiveOptions.length !== product.options.length && onUpdateProductOptions) {
      const targetIdx = optionIdx !== void 0 && optionIdx >= 0 && optionIdx < effectiveOptions.length ? optionIdx : 0;
      const mergedOptions = effectiveOptions.map(
        (o, i) => i === targetIdx ? { ...o, price: safePrice } : o
      );
      await onUpdateProductOptions(mergedOptions);
      return;
    }
    if (onUpdatePrice) {
      await onUpdatePrice(safePrice, optionIdx);
    }
  };
  const handleSaveFabricName = async (idx) => {
    if (!onUpdateProductOptions) return;
    const cleanLabel = fabricNameDraft.trim();
    if (!cleanLabel) return;
    setSavingFabricName(true);
    try {
      const nextOptions = effectiveOptions.map(
        (o, i) => i === idx ? { ...o, label: cleanLabel } : o
      );
      await onUpdateProductOptions(nextOptions);
      setEditingFabricNameIdx(null);
    } finally {
      setSavingFabricName(false);
    }
  };
  const handleDeleteFabricOption = async (idx) => {
    if (!onUpdateProductOptions) return;
    const nextOptions = effectiveOptions.filter((_, i) => i !== idx);
    if (editingOptionIdx === idx) setEditingOptionIdx(null);
    if (editingFabricNameIdx === idx) setEditingFabricNameIdx(null);
    if (selectedOptionIdx >= nextOptions.length) {
      setSelectedOptionIdx(Math.max(0, nextOptions.length - 1));
    } else if (selectedOptionIdx > idx) {
      setSelectedOptionIdx((prev) => Math.max(0, prev - 1));
    }
    await onUpdateProductOptions(nextOptions);
  };
  const handleAddStoleFabricOption = async () => {
    if (!onUpdateProductOptions) return;
    const label = newOptionLabel.trim();
    if (!label) return;
    const parsedPrice = Number(newOptionPrice);
    const price = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? Math.round(parsedPrice) : 0;
    setAddingFabricOption(true);
    try {
      const nextOptions = [...effectiveOptions, { label, price }];
      await onUpdateProductOptions(nextOptions);
      setSelectedOptionIdx(nextOptions.length - 1);
      setNewOptionLabel("");
      setNewOptionPrice("");
      setIsAddingFabricOpen(false);
    } finally {
      setAddingFabricOption(false);
    }
  };
  const showCapSection = product.category !== "accessories" && product.category !== "cap" && !product.hideCapDetails;
  const capStyleSurcharge = showCapSection ? selectedCapStyle.extraPrice : 0;
  const mainColorSurcharge = !isAmericanShawl && !isFlowerProduct ? selectedColor.extraPrice || 0 : 0;
  const threadColorSurcharge = isStoleProduct ? selectedThreadColor.extraPrice || 0 : 0;
  const capColorSurcharge = showCapSection && !isNoCap && !capSameColor ? capCustomColor.extraPrice || 0 : 0;
  const secondaryOptionSurcharge = selectedSecondary && visibleSecondaryOptions.includes(selectedSecondary) ? product.secondaryOptionPrices?.[selectedSecondary] || 0 : 0;
  const displayPrice = Math.max(
    0,
    basePrice + capStyleSurcharge + mainColorSurcharge + threadColorSurcharge + capColorSurcharge + secondaryOptionSurcharge
  );
  const activeImageUrl = isAmericanShawl ? americanShawlFrontImage || product.imageUrl : isFlowerProduct ? product.imageUrl : product.colorImages?.[selectedColor.name] || product.imageUrl;
  const regularShawlColorizerImage = regularShawlBaseImage || SHAWL_REGULAR_IMAGE_PATH;
  const colorizerImageUrl = isRegularShawl && !product.colorImages?.[selectedColor.name] ? regularShawlColorizerImage : activeImageUrl;
  const americanFrontImg = americanShawlFrontImage || product.imageUrl || SHAWL_AMERICAN_IMAGE_PATH;
  const americanBackImg = americanShawlBackImage || SHAWL_BACK_IMAGE_PATH;
  const hasDedicatedColorImg = Boolean(product.colorImages?.[selectedColor.name]);
  const dedicatedColorImgUrl = product.colorImages?.[selectedColor.name];
  const hasRegularReferenceGallery = isRegularShawl && (Boolean(product.imageUrl && product.imageUrl !== regularShawlColorizerImage) || Boolean(
    dedicatedColorImgUrl && dedicatedColorImgUrl !== regularShawlColorizerImage
  ));
  const handleColorFileChange = (e) => {
    const file = e.target.files?.item(0);
    if (file && onSetColorImage) {
      onSetColorImage(selectedColor.name, file);
      e.target.value = "";
    }
  };
  const commitStyleOptions = (entries) => {
    const cleaned = entries.map((entry) => ({
      label: entry.label.trim(),
      price: Math.max(0, Number(entry.price) || 0)
    })).filter((entry) => entry.label.length > 0);
    setDraftOptions(
      cleaned.map((o) => ({ label: o.label, price: String(o.price) }))
    );
    onUpdateProductOptions?.(cleaned);
    if (cleaned.length > 0 && selectedOptionIdx >= cleaned.length) {
      setSelectedOptionIdx(0);
    }
  };
  const handleSaveStyleOption = (idx) => {
    const target = draftOptions[idx];
    if (!target || !target.label.trim()) {
      const filtered = draftOptions.filter((_, i) => i !== idx);
      commitStyleOptions(filtered);
      return;
    }
    commitStyleOptions(draftOptions);
  };
  const handleDeleteStyleOption = (idx) => {
    const next = draftOptions.filter((_, i) => i !== idx);
    commitStyleOptions(next);
  };
  const handleAddStyleOption = () => {
    const label = newOptionLabel.trim();
    if (!label) return;
    const price = String(Math.max(0, Number(newOptionPrice) || 0));
    const next = [...draftOptions, { label, price }];
    setNewOptionLabel("");
    setNewOptionPrice("");
    commitStyleOptions(next);
    setSelectedOptionIdx(next.length - 1);
  };
  const commitSecondaryEntries = (entries) => {
    const cleanedEntries = entries.map((e) => ({
      name: e.name.trim(),
      extraPrice: product.category === "robe" ? 0 : Number.isFinite(Number(e.extraPrice)) ? Number(e.extraPrice) : 0
    })).filter((e) => e.name.length > 0);
    const nextOptions = cleanedEntries.map((e) => e.name);
    const nextPrices = {};
    cleanedEntries.forEach((e) => {
      if (e.extraPrice !== 0) {
        nextPrices[e.name] = e.extraPrice;
      }
    });
    setDraftSecondaryEntries(
      cleanedEntries.map((e) => ({
        name: e.name,
        extraPrice: String(e.extraPrice)
      }))
    );
    onUpdateSecondaryOptions?.(nextOptions, nextPrices);
    if (nextOptions.length > 0 && !nextOptions.includes(selectedSecondary)) {
      setSelectedSecondary(nextOptions[0]);
    } else if (nextOptions.length === 0) {
      setSelectedSecondary("");
    }
  };
  const handleAddSecondaryOption = () => {
    const trimmed = newSecondaryOption.trim();
    if (!trimmed) return;
    const priceVal = Number.isFinite(Number(newSecondaryPrice)) ? String(Number(newSecondaryPrice)) : "0";
    const next = [
      ...draftSecondaryEntries,
      { name: trimmed, extraPrice: priceVal }
    ];
    setNewSecondaryOption("");
    setNewSecondaryPrice("0");
    commitSecondaryEntries(next);
    setSelectedSecondary(trimmed);
  };
  const handleSaveEditedSecondaryOption = (idx) => {
    const edited = draftSecondaryEntries[idx]?.name.trim() || "";
    if (!edited) {
      const filtered = draftSecondaryEntries.filter((_, i) => i !== idx);
      commitSecondaryEntries(filtered);
      return;
    }
    commitSecondaryEntries(draftSecondaryEntries);
  };
  const handleDeleteSecondaryOption = (idx) => {
    const next = draftSecondaryEntries.filter((_, i) => i !== idx);
    commitSecondaryEntries(next);
  };
  const handleShareDesign = async () => {
    try {
      const url = new URL(window.location.href);
      url.search = "";
      url.searchParams.set("p", product.id);
      url.searchParams.set("opt", String(selectedOptionIdx));
      if (!isFlowerProduct) {
        if (isAmericanShawl && customColorText.trim()) {
          url.searchParams.set("ct", customColorText.trim());
        } else {
          url.searchParams.set("col", selectedColor.name);
        }
      }
      if (isStoleProduct) {
        url.searchParams.set("thr", selectedThreadColor.name);
        if (isAmericanShawl) {
          if (embroideredText.trim()) {
            url.searchParams.set("txt", embroideredText.trim());
          }
        } else {
          if (rightEmbroideredText.trim()) {
            url.searchParams.set("sr", rightEmbroideredText.trim());
          }
          if (leftEmbroideredText.trim()) {
            url.searchParams.set("sl", leftEmbroideredText.trim());
          }
        }
      }
      if (selectedSecondary && visibleSecondaryOptions.includes(selectedSecondary)) {
        url.searchParams.set("sec", selectedSecondary);
      }
      if (showCapSection) {
        url.searchParams.set("cap", selectedCapStyle.id);
        url.searchParams.set("csame", capSameColor ? "1" : "0");
        if (!capSameColor) {
          url.searchParams.set("ccol", capCustomColor.name);
        }
        url.searchParams.set("cpos", capEmbroideryPos);
      }
      const shareUrl = url.toString();
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: `\u062A\u0635\u0645\u064A\u0645\u064A \u0627\u0644\u062E\u0627\u0635 \xB7 ${product.name}`,
            text: `\u0634\u0627\u0647\u062F \u062A\u0635\u0645\u064A\u0645\u064A \u0627\u0644\u0645\u062E\u0635\u0635 \u0644\u0640 ${product.name} \u0645\u0646 DG by Douaa`,
            url: shareUrl
          });
          setJustShared(true);
          setTimeout(() => setJustShared(false), 2500);
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setJustShared(true);
        setTimeout(() => setJustShared(false), 2500);
        onNotify?.(
          "success",
          "\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u062A\u0635\u0645\u064A\u0645\u0643! \u0634\u0627\u0631\u0643\u0647 \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0648\u0627\u062A\u0633\u0627\u0628 \u0623\u0648 \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645."
        );
      } else {
        onNotify?.("info", `\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0635\u0645\u064A\u0645: ${shareUrl}`);
      }
    } catch {
      onNotify?.("error", "\u062A\u0639\u0630\u0631 \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u062D\u0627\u0644\u064A\u0627\u064B.");
    }
  };
  const resolvedPauseBadge = (categoryPauseBadge || "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B").trim() || "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B";
  const handleDownloadDesignPng = async () => {
    setIsDownloadingDesign(true);
    try {
      await exportStoleDesignCardPng({
        mode: product.category === "cap" ? "cap-only" : "stole-cap",
        productName: product.name,
        stoleColor: selectedColor,
        threadColor: selectedThreadColor,
        capColor: product.category === "cap" ? selectedColor : capSameColor ? selectedColor : capCustomColor,
        capStyleId: product.category === "cap" ? activeOption?.label.includes("\u062A\u0648\u0643\u0633\u064A\u062F\u0648") ? "tuxedo" : "triangle" : selectedCapStyle.id,
        hideCap: product.category !== "cap" && (!showCapSection || isNoCap),
        isMissSash: isStoleProduct && (product.branch.includes("\u0645\u064A\u0633") || product.name.includes("\u0645\u064A\u0633") || product.id.includes("miss")),
        isAmericanShawl,
        customColorText,
        fabricLabel: activeOption?.label || "",
        rightEmbroideredText,
        leftEmbroideredText,
        embroideredText,
        universityLogoUrl: universityLogo,
        showGownSilhouette
      });
      onNotify?.("success", "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u062A\u0635\u0645\u064A\u0645\u0643 \u0628\u0646\u062C\u0627\u062D!");
    } catch {
      onNotify?.("error", "\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u062D\u0627\u0644\u064A\u0627\u064B.");
    } finally {
      setIsDownloadingDesign(false);
    }
  };
  const handleAdd = (openCartAfter = false) => {
    if (isCategoryPaused) return;
    const detailParts = [];
    const excludedOptions = [];
    const fabricType = activeOption?.label || "";
    const shawlColor = isFlowerProduct ? void 0 : isAmericanShawl && customColorText.trim() ? customColorText.trim() : selectedColor.name;
    const threadColor = isStoleProduct ? selectedThreadColor.name : void 0;
    const rightClean = !isAmericanShawl ? rightEmbroideredText.trim() : "";
    const leftClean = !isAmericanShawl ? leftEmbroideredText.trim() : "";
    const formattedStoleSides = [
      rightClean ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${rightClean}` : null,
      leftClean ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${leftClean}` : null
    ].filter(Boolean).join(" | ");
    const customEmbroider = isStoleProduct ? isAmericanShawl ? embroideredText.trim() || void 0 : formattedStoleSides || void 0 : void 0;
    const showClothingSizing = !isFlowerProduct && !isStoleProduct && product.category === "robe" && !product.hideSizing;
    const sizeText = showClothingSizing ? [
      gender,
      numericSize.trim() ? `\u0645\u0642\u0627\u0633 ${numericSize.trim()}` : null,
      fullLength.trim() ? `\u0637\u0648\u0644 ${fullLength.trim()} \u0633\u0645` : null
    ].filter(Boolean).join(" \xB7 ") : void 0;
    if (activeOption) detailParts.push(activeOption.label);
    if (selectedSecondary && visibleSecondaryOptions.includes(selectedSecondary)) {
      const secExtra = product.secondaryOptionPrices?.[selectedSecondary] || 0;
      detailParts.push(
        secExtra !== 0 ? `${selectedSecondary} (${secExtra > 0 ? `+${secExtra.toLocaleString("en-US")}` : secExtra.toLocaleString("en-US")} \u062F\u062C)` : selectedSecondary
      );
    }
    if (!isFlowerProduct) {
      if (isAmericanShawl && customColorText.trim()) {
        detailParts.push(`\u0627\u0644\u0623\u0644\u0648\u0627\u0646: ${customColorText.trim()}`);
      } else if (!isAmericanShawl) {
        detailParts.push(
          selectedColor.extraPrice && selectedColor.extraPrice > 0 ? `\u0627\u0644\u0644\u0648\u0646: ${selectedColor.name} (+${selectedColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : `\u0627\u0644\u0644\u0648\u0646: ${selectedColor.name}`
        );
      }
    }
    if (isStoleProduct) {
      detailParts.push(
        selectedThreadColor.extraPrice && selectedThreadColor.extraPrice > 0 ? `\u062E\u064A\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${selectedThreadColor.name} (+${selectedThreadColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : `\u062E\u064A\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${selectedThreadColor.name}`
      );
      if (customEmbroider) {
        detailParts.push(
          isAmericanShawl ? `\u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0631\u0632: ${customEmbroider}` : customEmbroider
        );
      }
    }
    const gownOption = void 0;
    if (showClothingSizing) {
      detailParts.push(`\u0627\u0644\u0641\u0626\u0629: ${gender}`);
      if (numericSize.trim()) {
        detailParts.push(`\u0627\u0644\u0645\u0642\u0627\u0633: ${numericSize.trim()}`);
      }
      if (fullLength.trim()) detailParts.push(`\u0627\u0644\u0637\u0648\u0644: ${fullLength.trim()} \u0633\u0645`);
      if (shoulderAndSleeve.trim()) detailParts.push(`\u0627\u0644\u0643\u062A\u0641/\u0627\u0644\u0643\u0645: ${shoulderAndSleeve.trim()}`);
    }
    let capStyleLabel;
    let capEmbroideryLabel;
    if (showCapSection) {
      if (isNoCap) {
        capStyleLabel = "\u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629";
        detailParts.push(
          selectedCapStyle.extraPrice < 0 ? `\u0627\u0644\u0642\u0628\u0639\u0629: \u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629 (${selectedCapStyle.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : selectedCapStyle.extraPrice > 0 ? `\u0627\u0644\u0642\u0628\u0639\u0629: \u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629 (+${selectedCapStyle.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : "\u0627\u0644\u0642\u0628\u0639\u0629: \u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629"
        );
        excludedOptions.push("\u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629");
      } else {
        capStyleLabel = selectedCapStyle.label;
        detailParts.push(`\u0634\u0643\u0644 \u0627\u0644\u0642\u0628\u0639\u0629: ${selectedCapStyle.label}`);
        const finalCapColor = capSameColor ? isAmericanShawl ? "\u0646\u0641\u0633 \u0627\u0644\u0623\u0644\u0648\u0627\u0646" : selectedColor.name : capCustomColor.extraPrice && capCustomColor.extraPrice > 0 ? `${capCustomColor.name} (+${capCustomColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : capCustomColor.name;
        detailParts.push(`\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629: ${finalCapColor}`);
        if (headSize.trim()) detailParts.push(`\u0645\u062D\u064A\u0637 \u0627\u0644\u0631\u0623\u0633: ${headSize.trim()} \u0633\u0645`);
        capEmbroideryLabel = capEmbroideryPos;
        detailParts.push(`\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ${capEmbroideryPos}`);
        if (capEmbroideryPos === "\u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u0628\u0639\u0629") {
          excludedOptions.push("\u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u0628\u0639\u0629");
        }
        if (capNotes.trim()) detailParts.push(`\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0642\u0628\u0639\u0629: ${capNotes.trim()}`);
      }
    }
    const resolvedCapColor = product.category === "cap" ? selectedColor : capSameColor ? selectedColor : capCustomColor;
    if (isStoleProduct && universityLogo) {
      detailParts.push("\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629: \u0645\u0631\u0641\u0642 (\u0645\u062C\u0627\u0646\u0627\u064B)");
    }
    if (customNotes.trim()) {
      detailParts.push(
        isFlowerProduct ? `\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062A\u0647\u0646\u0626\u0629 / \u0645\u0644\u0627\u062D\u0638\u0627\u062A: ${customNotes.trim()}` : `\u0645\u0644\u0627\u062D\u0638\u0629: ${customNotes.trim()}`
      );
    }
    onAddToCart({
      productId: product.id,
      category: product.category,
      title: product.name,
      details: detailParts.join(" \xB7 "),
      unitPrice: displayPrice,
      fabricType,
      shawlColor,
      threadColor,
      embroideredText: customEmbroider,
      rightEmbroideredText: rightClean || void 0,
      leftEmbroideredText: leftClean || void 0,
      size: sizeText,
      capStyle: capStyleLabel,
      capColor: showCapSection && !isNoCap || product.category === "cap" ? resolvedCapColor.name : void 0,
      capEmbroidery: capEmbroideryLabel,
      gownOption,
      universityLogo: isStoleProduct && universityLogo ? universityLogo : void 0,
      excludedOptions: excludedOptions.length > 0 ? excludedOptions : void 0
    });
    if (openCartAfter) {
      onExpressCheckout?.();
    }
  };
  const discountedPreviewPrice = storewideDiscountPercent > 0 ? Math.max(0, Math.round(displayPrice * (1 - storewideDiscountPercent / 100))) : displayPrice;
  const activeWhatsappNumber = formatWhatsAppNumber(whatsappNumber);
  const chosenColorLabel = isFlowerProduct ? selectedSecondary || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : isAmericanShawl && customColorText.trim() ? customColorText.trim() : selectedColor.name;
  const inquiryLines = [
    "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645\u060C \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0645\u0646 \u0645\u062A\u062C\u0631 DG by Douaa:",
    `\u2022 \u0627\u0644\u0645\u0646\u062A\u062C: ${product.name}${activeOption?.label ? ` (${activeOption.label})` : ""}`,
    `\u2022 \u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u062E\u062A\u0627\u0631: ${chosenColorLabel}`
  ];
  if (isStoleProduct) {
    inquiryLines.push(`\u2022 \u0644\u0648\u0646 \u062E\u064A\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${selectedThreadColor.name}`);
    if (isAmericanShawl) {
      if (embroideredText.trim()) {
        inquiryLines.push(`\u2022 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0637\u0631\u064A\u0632\u0647: ${embroideredText.trim()}`);
      }
    } else {
      if (rightEmbroideredText.trim()) {
        inquiryLines.push(`\u2022 \u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${rightEmbroideredText.trim()}`);
      }
      if (leftEmbroideredText.trim()) {
        inquiryLines.push(`\u2022 \u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${leftEmbroideredText.trim()}`);
      }
    }
  }
  const whatsappInquiryUrl = `https://wa.me/${activeWhatsappNumber}?text=${encodeURIComponent(
    inquiryLines.join("\n")
  )}`;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl overflow-hidden shadow-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-5 py-3 bg-[#FAF8F5] border-b border-[#C6A355]/30 flex flex-col gap-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onBackToHome,
            className: "inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-white border border-[#5E1734]/30 hover:bg-[#5E1734] hover:text-white hover:border-[#5E1734] text-[#5E1734] text-xs sm:text-sm font-extrabold shadow-2xs touch-manipulation transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer",
            children: /* @__PURE__ */ jsx("span", { children: "\u2190 \u0631\u062C\u0648\u0639 \u0625\u0644\u0649 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0642\u0633\u0627\u0645" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-bold", children: [
          isAdminMode && onEdit && onDelete && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 border-l pl-3 border-[#C6A355]/30", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onEdit,
                className: "inline-flex items-center gap-1 text-[#5E1734] hover:underline touch-manipulation cursor-pointer font-bold",
                children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644" })
                ]
              }
            ),
            confirmingDelete ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl px-2 py-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#9F1239]", children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0630\u0641\u061F" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setConfirmingDelete(false);
                    onDelete();
                  },
                  className: "px-2 py-0.5 rounded-lg bg-[#BE123C] hover:bg-[#9F1239] text-white text-[11px] font-bold cursor-pointer",
                  children: "\u0646\u0639\u0645\u060C \u062D\u0630\u0641"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirmingDelete(false),
                  className: "px-2 py-0.5 rounded-lg bg-white border border-[#C6A355]/35 text-[#65525A] text-[11px] font-bold cursor-pointer",
                  children: "\u0625\u0644\u063A\u0627\u0621"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                "aria-label": `\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 ${product.name}`,
                onClick: () => setConfirmingDelete(true),
                className: "inline-flex items-center gap-1 text-[#BE123C] hover:underline touch-manipulation cursor-pointer font-bold",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onBackToSection,
              className: "inline-flex items-center gap-1 text-[#65525A] hover:text-[#5E1734] hover:underline touch-manipulation transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u0631\u062C\u0648\u0639 \u0644\u0642\u0633\u0645 ",
                  sectionTitle
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "nav",
        {
          "aria-label": "\u0645\u0633\u0627\u0631 \u0627\u0644\u062A\u0646\u0642\u0644",
          className: "flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#65525A]",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onBackToHome,
                className: "hover:text-[#5E1734] transition-colors touch-manipulation cursor-pointer",
                children: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[#C6A355]", children: "/" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onBackToSection,
                className: "hover:text-[#5E1734] transition-colors touch-manipulation cursor-pointer",
                children: sectionTitle
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[#C6A355]", children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-[#1A1617] truncate max-w-[220px] sm:max-w-none", children: product.name })
          ]
        }
      )
    ] }),
    isCategoryPaused && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "status",
        className: "px-5 py-3 bg-[#FFF1F3] border-b border-[#FECDD3] flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#9F1239]",
        children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 shrink-0 text-[#BE123C]" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u062D\u0627\u0644\u064A\u0627\u064B \u2014 ",
            resolvedPauseBadge
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8 items-start", children: [
      supportsLivePreview ? /* @__PURE__ */ jsxs("div", { className: "md:sticky md:top-24 space-y-3 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setVisualTab("live"),
              className: `inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${visualTab === "live" ? "bg-white text-[#5E1734] shadow-xs border border-[#C6A355]/30" : "text-[#65525A] hover:text-[#1A1617]"}`,
              children: [
                /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u062D\u064A\u0629 \u0644\u0644\u062A\u0635\u0645\u064A\u0645" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setVisualTab("photo"),
              className: `inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${visualTab === "photo" ? "bg-white text-[#5E1734] shadow-xs border border-[#C6A355]/30" : "text-[#65525A] hover:text-[#1A1617]"}`,
              children: [
                /* @__PURE__ */ jsx(ShoppingBag, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644" })
              ]
            }
          )
        ] }),
        visualTab === "live" ? /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsx(
            StoleCapLivePreview,
            {
              mode: product.category === "cap" ? "cap-only" : "stole-cap",
              stoleColor: selectedColor,
              isMissSash: isStoleProduct && (product.branch.includes("\u0645\u064A\u0633") || product.name.includes("\u0645\u064A\u0633") || product.id.includes("miss")),
              isAmericanShawl,
              customColorText,
              fabricLabel: activeOption?.label || "",
              threadColor: selectedThreadColor,
              embroideredText,
              rightEmbroideredText,
              leftEmbroideredText,
              universityLogoUrl: universityLogo,
              onRemoveUniversityLogo: () => setUniversityLogo(null),
              hideCap: product.category !== "cap" && (!showCapSection || isNoCap),
              capStyleId: product.category === "cap" ? activeOption?.label.includes("\u062A\u0648\u0643\u0633\u064A\u062F\u0648") ? "tuxedo" : "triangle" : selectedCapStyle.id,
              capStyleLabel: product.category === "cap" ? activeOption?.label || product.branch : selectedCapStyle.label,
              capColor: product.category === "cap" ? selectedColor : capSameColor ? selectedColor : capCustomColor,
              capEmbroideryPos,
              showGownSilhouette,
              onToggleGownSilhouette: setShowGownSilhouette
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                disabled: isDownloadingDesign,
                onClick: handleDownloadDesignPng,
                className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-65",
                children: isDownloadingDesign ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-[#C6A355]" }),
                  /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0635\u0648\u0631\u0629..." })
                ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F8} \u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u062A\u0635\u0645\u064A\u0645\u064A" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleShareDesign,
                className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#C6A355]/45 hover:border-[#5E1734]/50 text-xs font-bold text-[#5E1734] shadow-2xs transition-all cursor-pointer active:scale-[0.99]",
                children: justShared ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-[#147A53]" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[#147A53]", children: "\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u2713" })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645" })
                ] })
              }
            )
          ] }),
          (isRegularShawl ? colorizerImageUrl : activeImageUrl) && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setVisualTab("photo"),
              onContextMenu: (e) => e.preventDefault(),
              className: "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 hover:border-[#5E1734]/50 transition-colors cursor-pointer text-right protected-media select-none",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: { backgroundColor: imageBgColor || "#FFFFFF" },
                      className: "w-10 h-10 rounded-xl border border-[#C6A355]/20 shrink-0 overflow-hidden p-0 transition-colors duration-300",
                      children: isStoleProduct && !isAmericanShawl ? /* @__PURE__ */ jsx(
                        GownColorPreviewImage,
                        {
                          src: colorizerImageUrl,
                          alt: product.name,
                          colorHex: selectedColor.hex,
                          colorName: selectedColor.name,
                          garmentType: "stole",
                          isDisabled: isAutoColorDisabled || hasDedicatedColorImg,
                          className: "w-full h-full object-cover object-center p-0 pointer-events-none select-none"
                        }
                      ) : /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: activeImageUrl,
                          alt: product.name,
                          referrerPolicy: "no-referrer",
                          draggable: false,
                          onContextMenu: (e) => e.preventDefault(),
                          className: "w-full h-full object-cover object-center p-0 mix-blend-multiply pointer-events-none select-none"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-[#1A1617] truncate", children: isRegularShawl ? `\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0644\u0648\u0646 (${selectedColor.name}) \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0633\u0627\u062F\u0629` : "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629" }),
                    /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-[#65525A]", children: isRegularShawl ? "\u0627\u0636\u063A\u0637\u064A \u0647\u0646\u0627 \u0644\u0645\u0634\u0627\u0647\u062F\u0629 \u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0633\u0627\u062F\u0629 \u0628\u0627\u0644\u062D\u062C\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" : "\u0627\u0636\u063A\u0637\u064A \u0647\u0646\u0627 \u0644\u0645\u0634\u0627\u0647\u062F\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0643\u0627\u0645\u0644\u0629" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-[#5E1734] shrink-0" })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onContextMenu: (e) => e.preventDefault(),
              onClick: () => {
                const targetUrl = isRegularShawl ? colorizerImageUrl : activeImageUrl;
                if (targetUrl) openProductLightbox({ url: targetUrl });
              },
              role: (isRegularShawl ? colorizerImageUrl : activeImageUrl) ? "button" : void 0,
              tabIndex: (isRegularShawl ? colorizerImageUrl : activeImageUrl) ? 0 : void 0,
              onKeyDown: (e) => {
                const targetUrl = isRegularShawl ? colorizerImageUrl : activeImageUrl;
                if (targetUrl && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  openProductLightbox({ url: targetUrl });
                }
              },
              "aria-label": (isRegularShawl ? colorizerImageUrl : activeImageUrl) ? `\u062A\u0643\u0628\u064A\u0631 \u0635\u0648\u0631\u0629 ${product.name}` : void 0,
              style: isBackShawl ? void 0 : { backgroundColor: imageBgColor || "#FFFFFF" },
              className: `relative min-h-[300px] w-full min-w-0 overflow-hidden p-0 flex items-center justify-center protected-media select-none ${isBackShawl ? "bg-transparent border-0 shadow-none" : "rounded-2xl border border-[#C6A355]/20 shadow-sm transition-colors duration-300"} ${(isRegularShawl ? colorizerImageUrl : activeImageUrl) ? "cursor-zoom-in group" : ""}`,
              children: [
                isAdminMode && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none",
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      supportsAutoColorizeToggle && onToggleAutoColorize ? /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          disabled: togglingAutoColorize,
                          onClick: async (e) => {
                            e.stopPropagation();
                            setTogglingAutoColorize(true);
                            try {
                              await onToggleAutoColorize();
                            } finally {
                              setTogglingAutoColorize(false);
                            }
                          },
                          className: `pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-65 ${isAutoColorDisabled ? "bg-[#FFF4E5]/95 text-[#9A3412] border-[#F59E0B]/55 hover:bg-[#FFEDD5]" : "bg-white/95 text-[#14532D] border-[#22C55E]/45 hover:bg-[#F0FDF4]"}`,
                          children: /* @__PURE__ */ jsx("span", { children: isAutoColorDisabled ? "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u062A\u0648\u0642\u0641" : "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u0641\u0639\u0651\u0644" })
                        }
                      ) : /* @__PURE__ */ jsx("span", {}),
                      /* @__PURE__ */ jsxs("label", { className: "pointer-events-auto cursor-pointer bg-white/95 backdrop-blur-md text-[#1A1617] px-3 py-1.5 rounded-xl border border-[#C6A355]/45 text-xs font-bold shadow-sm hover:bg-[#FAF8F5] flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4 text-[#5E1734]" }),
                        isRegularShawl ? "\u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u0637\u0631\u0632" : "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629",
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            onChange: (e) => {
                              const file = e.target.files?.item(0);
                              if (file && onReplaceImage) {
                                onReplaceImage(file);
                              }
                              e.target.value = "";
                            }
                          }
                        )
                      ] })
                    ]
                  }
                ),
                (isRegularShawl ? colorizerImageUrl : activeImageUrl) ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  isStoleProduct && !isAmericanShawl ? /* @__PURE__ */ jsx(
                    GownColorPreviewImage,
                    {
                      src: colorizerImageUrl,
                      alt: product.name,
                      colorHex: selectedColor.hex,
                      colorName: selectedColor.name,
                      garmentType: "stole",
                      isDisabled: isAutoColorDisabled || hasDedicatedColorImg,
                      style: isBackShawl ? SEAMLESS_VIGNETTE_STYLE : void 0,
                      className: `w-full h-auto max-h-[480px] object-contain mx-auto block pointer-events-none select-none ${isBackShawl ? "mix-blend-multiply" : ""}`
                    }
                  ) : /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: activeImageUrl,
                      alt: product.name,
                      referrerPolicy: "no-referrer",
                      draggable: false,
                      onContextMenu: (e) => e.preventDefault(),
                      style: isBackShawl ? SEAMLESS_VIGNETTE_STYLE : void 0,
                      className: "w-full h-auto max-h-[480px] object-contain mx-auto block mix-blend-multiply pointer-events-none select-none"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "pointer-events-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[11px] font-bold text-[#5E1734]", children: [
                    /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u0643\u0628\u064A\u0631" })
                  ] }),
                  !isAmericanShawl && !isFlowerProduct && /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-xs font-bold text-[#1A1617]", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "w-3.5 h-3.5 rounded-full border border-[#1A1617]/20",
                        style: { backgroundColor: selectedColor.hex }
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "\u0627\u0644\u0644\u0648\u0646: ",
                      selectedColor.name
                    ] })
                  ] })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-6 text-center", children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-10 h-10 text-[#5E1734] mb-2 opacity-75" }),
                  /* @__PURE__ */ jsx("span", { className: "font-editorial text-lg font-bold text-[#1A1617]", children: product.name })
                ] })
              ]
            }
          ),
          hasRegularReferenceGallery && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 p-3 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617]", children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0645\u0631\u062C\u0639\u064A\u0629 \u0644\u0644\u0645\u0648\u062F\u064A\u0644 (\u0627\u0644\u062A\u0637\u0631\u064A\u0632 / \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629)" }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#65525A]", children: "\u0627\u0636\u063A\u0637 \u0644\u0644\u062A\u0643\u0628\u064A\u0631" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              product.imageUrl && product.imageUrl !== regularShawlColorizerImage && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openProductLightbox({
                    url: product.imageUrl,
                    label: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0628\u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0645\u0631\u062C\u0639)",
                    skipColorizer: true
                  }),
                  onContextMenu: (e) => e.preventDefault(),
                  className: "group relative flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#C6A355]/35 hover:border-[#5E1734]/60 text-right transition-all cursor-pointer protected-media select-none",
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.imageUrl,
                        alt: `${product.name} - \u0645\u0631\u062C\u0639 \u0627\u0644\u062A\u0637\u0631\u064A\u0632`,
                        referrerPolicy: "no-referrer",
                        draggable: false,
                        className: "w-12 h-14 rounded-lg object-cover border border-[#C6A355]/20 shrink-0 pointer-events-none select-none"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-extrabold text-[#5E1734] truncate", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0628\u0627\u0644\u062A\u0637\u0631\u064A\u0632" }),
                      /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-[#65525A]", children: "\u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0645\u0631\u062C\u0639\u064A\u0629" })
                    ] })
                  ]
                }
              ),
              dedicatedColorImgUrl && dedicatedColorImgUrl !== regularShawlColorizerImage && dedicatedColorImgUrl !== product.imageUrl && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openProductLightbox({
                    url: dedicatedColorImgUrl,
                    label: `\u0635\u0648\u0631\u0629 \u062D\u0642\u064A\u0642\u064A\u0629 \u0644\u0644\u0648\u0646: ${selectedColor.name}`,
                    skipColorizer: true
                  }),
                  onContextMenu: (e) => e.preventDefault(),
                  className: "group relative flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#C6A355]/35 hover:border-[#5E1734]/60 text-right transition-all cursor-pointer protected-media select-none",
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: dedicatedColorImgUrl,
                        alt: `${product.name} - ${selectedColor.name}`,
                        referrerPolicy: "no-referrer",
                        draggable: false,
                        className: "w-12 h-14 rounded-lg object-cover border border-[#C6A355]/20 shrink-0 pointer-events-none select-none"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxs("span", { className: "block text-[11px] font-extrabold text-[#5E1734] truncate", children: [
                        "\u0635\u0648\u0631\u0629 \u0644\u0644\u0648\u0646 ",
                        selectedColor.name
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-[#65525A]", children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0645\u0631\u062C\u0639\u064A\u0629" })
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }) : isAmericanShawl ? /* @__PURE__ */ jsxs("div", { className: "md:sticky md:top-24 space-y-2.5 min-w-0", children: [
        isAdminMode && onReplaceAmericanShawlImage && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/40", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#C6A355]/50 hover:border-[#5E1734] text-[#1A1617] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95", children: [
            uploadingAmericanSide === "front" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin text-[#5E1734]" }),
              /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u0641\u0639..." })
            ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                disabled: uploadingAmericanSide === "front",
                className: "hidden",
                onChange: async (e) => {
                  const file = e.target.files?.item(0);
                  e.target.value = "";
                  if (!file) return;
                  setUploadingAmericanSide("front");
                  try {
                    await onReplaceAmericanShawlImage("front", file);
                  } finally {
                    setUploadingAmericanSide(null);
                  }
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#C6A355]/50 hover:border-[#5E1734] text-[#1A1617] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95", children: [
            uploadingAmericanSide === "back" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin text-[#5E1734]" }),
              /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u0641\u0639..." })
            ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u062E\u0644\u0641\u064A\u0629" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                disabled: uploadingAmericanSide === "back",
                className: "hidden",
                onChange: async (e) => {
                  const file = e.target.files?.item(0);
                  e.target.value = "";
                  if (!file) return;
                  setUploadingAmericanSide("back");
                  try {
                    await onReplaceAmericanShawlImage("back", file);
                  } finally {
                    setUploadingAmericanSide(null);
                  }
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5 w-full min-w-0", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onContextMenu: (e) => e.preventDefault(),
              onClick: () => openProductLightbox({
                url: americanFrontImg,
                label: "\u0645\u0646 \u0627\u0644\u0623\u0645\u0627\u0645"
              }),
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProductLightbox({
                    url: americanFrontImg,
                    label: "\u0645\u0646 \u0627\u0644\u0623\u0645\u0627\u0645"
                  });
                }
              },
              "aria-label": `\u062A\u0643\u0628\u064A\u0631 ${product.name} - \u0645\u0646 \u0627\u0644\u0623\u0645\u0627\u0645`,
              className: "relative min-h-[240px] w-full min-w-0 bg-transparent border-0 p-0 shadow-none overflow-hidden flex items-center justify-center protected-media select-none cursor-zoom-in group",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: americanFrontImg,
                    alt: `${product.name} - \u0645\u0646 \u0627\u0644\u0623\u0645\u0627\u0645`,
                    referrerPolicy: "no-referrer",
                    draggable: false,
                    onContextMenu: (e) => e.preventDefault(),
                    style: SEAMLESS_VIGNETTE_STYLE,
                    className: "w-full h-auto max-h-[480px] object-contain mx-auto block mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.02] pointer-events-none select-none"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute bottom-2.5 right-2.5 z-10 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[11px] font-extrabold text-[#5E1734]", children: "\u0645\u0646 \u0627\u0644\u0623\u0645\u0627\u0645" }),
                /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute bottom-2.5 left-2.5 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[#5E1734]", children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5 text-[#C6A355]" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onContextMenu: (e) => e.preventDefault(),
              onClick: () => openProductLightbox({
                url: americanBackImg,
                label: "\u0645\u0646 \u0627\u0644\u062E\u0644\u0641"
              }),
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProductLightbox({
                    url: americanBackImg,
                    label: "\u0645\u0646 \u0627\u0644\u062E\u0644\u0641"
                  });
                }
              },
              "aria-label": `\u062A\u0643\u0628\u064A\u0631 ${product.name} - \u0645\u0646 \u0627\u0644\u062E\u0644\u0641`,
              className: "relative min-h-[240px] w-full min-w-0 bg-transparent border-0 p-0 shadow-none overflow-hidden flex items-center justify-center protected-media select-none cursor-zoom-in group",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: americanBackImg,
                    alt: `${product.name} - \u0645\u0646 \u0627\u0644\u062E\u0644\u0641`,
                    referrerPolicy: "no-referrer",
                    draggable: false,
                    onContextMenu: (e) => e.preventDefault(),
                    style: SEAMLESS_VIGNETTE_STYLE,
                    className: "w-full h-auto max-h-[480px] object-contain mx-auto block mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.02] pointer-events-none select-none"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute bottom-2.5 right-2.5 z-10 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[11px] font-extrabold text-[#5E1734]", children: "\u0645\u0646 \u0627\u0644\u062E\u0644\u0641" }),
                /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute bottom-2.5 left-2.5 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[#5E1734]", children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5 text-[#C6A355]" }) })
              ]
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs(
        "div",
        {
          onContextMenu: (e) => e.preventDefault(),
          onClick: () => {
            if (activeImageUrl) openProductLightbox({ url: activeImageUrl });
          },
          role: activeImageUrl ? "button" : void 0,
          tabIndex: activeImageUrl ? 0 : void 0,
          onKeyDown: (e) => {
            if (activeImageUrl && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              openProductLightbox({ url: activeImageUrl });
            }
          },
          "aria-label": activeImageUrl ? `\u062A\u0643\u0628\u064A\u0631 \u0635\u0648\u0631\u0629 ${product.name}` : void 0,
          style: isBackShawl ? void 0 : { backgroundColor: imageBgColor || "#FFFFFF" },
          className: `relative min-h-[300px] w-full min-w-0 overflow-hidden p-0 flex items-center justify-center protected-media select-none ${isBackShawl ? "bg-transparent border-0 shadow-none" : "rounded-2xl border border-[#C6A355]/20 shadow-sm transition-colors duration-300"} ${activeImageUrl ? "cursor-zoom-in group" : ""}`,
          children: [
            isAdminMode && /* @__PURE__ */ jsxs(
              "div",
              {
                className: "absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none",
                onClick: (e) => e.stopPropagation(),
                children: [
                  supportsAutoColorizeToggle && onToggleAutoColorize ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      disabled: togglingAutoColorize,
                      onClick: async (e) => {
                        e.stopPropagation();
                        setTogglingAutoColorize(true);
                        try {
                          await onToggleAutoColorize();
                        } finally {
                          setTogglingAutoColorize(false);
                        }
                      },
                      className: `pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-65 ${isAutoColorDisabled ? "bg-[#FFF4E5]/95 text-[#9A3412] border-[#F59E0B]/55 hover:bg-[#FFEDD5]" : "bg-white/95 text-[#14532D] border-[#22C55E]/45 hover:bg-[#F0FDF4]"}`,
                      children: /* @__PURE__ */ jsx("span", { children: isAutoColorDisabled ? "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u062A\u0648\u0642\u0641" : "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u0641\u0639\u0651\u0644" })
                    }
                  ) : /* @__PURE__ */ jsx("span", {}),
                  /* @__PURE__ */ jsxs("label", { className: "pointer-events-auto cursor-pointer bg-white/95 backdrop-blur-md text-[#1A1617] px-3 py-1.5 rounded-xl border border-[#C6A355]/45 text-xs font-bold shadow-sm hover:bg-[#FAF8F5] flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4 text-[#5E1734]" }),
                    "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629",
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: (e) => {
                          const file = e.target.files?.item(0);
                          if (file && onReplaceImage) {
                            onReplaceImage(file);
                          }
                          e.target.value = "";
                        }
                      }
                    )
                  ] })
                ]
              }
            ),
            activeImageUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
              product.category === "robe" || isStoleProduct && !isAmericanShawl ? /* @__PURE__ */ jsx(
                GownColorPreviewImage,
                {
                  src: activeImageUrl,
                  alt: product.name,
                  colorHex: selectedColor.hex,
                  colorName: selectedColor.name,
                  garmentType: product.category === "robe" ? "robe" : "stole",
                  isDisabled: isAutoColorDisabled || hasDedicatedColorImg,
                  style: isBackShawl ? SEAMLESS_VIGNETTE_STYLE : void 0,
                  className: `w-full h-auto max-h-[480px] object-contain mx-auto block pointer-events-none select-none ${isBackShawl ? "mix-blend-multiply" : ""}`
                }
              ) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: activeImageUrl,
                  alt: product.name,
                  referrerPolicy: "no-referrer",
                  draggable: false,
                  onContextMenu: (e) => e.preventDefault(),
                  style: isBackShawl ? SEAMLESS_VIGNETTE_STYLE : void 0,
                  className: "w-full h-auto max-h-[480px] object-contain mx-auto block mix-blend-multiply pointer-events-none select-none"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "pointer-events-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-[11px] font-bold text-[#5E1734]", children: [
                /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                /* @__PURE__ */ jsx("span", { children: "\u062A\u0643\u0628\u064A\u0631" })
              ] }),
              !isAmericanShawl && !isFlowerProduct && /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#C6A355]/45 shadow-sm text-xs font-bold text-[#1A1617]", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "w-3.5 h-3.5 rounded-full border border-[#1A1617]/20",
                    style: { backgroundColor: selectedColor.hex }
                  }
                ),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u0627\u0644\u0644\u0648\u0646: ",
                  selectedColor.name
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-6 text-center", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "w-10 h-10 text-[#5E1734] mb-2 opacity-75" }),
              /* @__PURE__ */ jsx("span", { className: "font-editorial text-lg font-bold text-[#1A1617]", children: product.name })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between space-y-5 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.branch`,
                defaultText: product.branch,
                valueOverride: product.branch,
                as: "span",
                compact: true,
                className: "inline-block px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-xs font-bold text-[#5E1734] mb-1.5"
              }
            ),
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.name`,
                defaultText: product.name,
                valueOverride: product.name,
                as: "h3",
                className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617]"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-2.5", children: [
              storewideDiscountPercent > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xl font-extrabold text-[#5E1734] tabular-nums", children: [
                  discountedPreviewPrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-[#8C7780] line-through tabular-nums", children: [
                  displayPrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-full bg-[#5E1734] text-white text-[11px] font-extrabold tabular-nums", children: [
                  "-",
                  storewideDiscountPercent,
                  "%"
                ] })
              ] }) : /* @__PURE__ */ jsxs("p", { className: "text-xl font-extrabold text-[#5E1734] tabular-nums", children: [
                displayPrice.toLocaleString("en-US"),
                " \u062F\u062C"
              ] }),
              isAdminMode && onUpdatePrice && !editingDetailPrice && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setDetailPriceDraft(String(basePrice));
                    setEditingDetailPrice(true);
                  },
                  title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631",
                  "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${product.name}`,
                  className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[#5E1734] text-xs font-bold shadow-2xs cursor-pointer transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u270F\uFE0F" }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631" })
                  ]
                }
              )
            ] }),
            isAdminMode && onUpdatePrice && editingDetailPrice && /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: async (e) => {
                  e.preventDefault();
                  const parsed = Number(detailPriceDraft);
                  if (!Number.isFinite(parsed) || parsed < 0) return;
                  setSavingDetailPrice(true);
                  try {
                    await saveEffectiveOptionPrice(
                      Math.round(parsed),
                      activeOption ? selectedOptionIdx : void 0
                    );
                    setEditingDetailPrice(false);
                  } finally {
                    setSavingDetailPrice(false);
                  }
                },
                className: "mt-2 inline-flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/55 shadow-xs",
                children: [
                  activeOption && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#65525A]", children: [
                    "\u0633\u0639\u0631 ",
                    activeOption.label,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: 50,
                      autoFocus: true,
                      value: detailPriceDraft,
                      onChange: (e) => setDetailPriceDraft(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Escape") setEditingDetailPrice(false);
                      },
                      className: "w-24 px-2.5 py-1 rounded-xl border border-[#C6A355]/45 bg-white text-sm font-extrabold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#65525A]", children: "\u062F\u062C" }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: savingDetailPrice,
                      className: "inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] disabled:opacity-60 text-white text-xs font-bold cursor-pointer",
                      children: [
                        savingDetailPrice ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: "\u062D\u0641\u0638" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditingDetailPrice(false),
                      className: "inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white border border-[#C6A355]/35 text-[#65525A] hover:text-[#1A1617] cursor-pointer",
                      "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                      children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              }
            ),
            isAdminMode && onUpdateDescription ? editingDescription ? /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: async (e) => {
                  e.preventDefault();
                  const clean = descriptionDraft.trim();
                  if (!clean) return;
                  setSavingDescription(true);
                  try {
                    await onUpdateDescription(clean);
                    setEditingDescription(false);
                  } finally {
                    setSavingDescription(false);
                  }
                },
                className: "mt-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/55 space-y-2 shadow-xs",
                children: [
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      rows: 3,
                      autoFocus: true,
                      value: descriptionDraft,
                      onChange: (e) => setDescriptionDraft(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Escape") setEditingDescription(false);
                      },
                      placeholder: "\u0627\u0643\u062A\u0628 \u0648\u0635\u0641 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0647\u0646\u0627...",
                      className: "w-full px-3 py-2 rounded-xl border border-[#C6A355]/45 bg-white text-xs sm:text-sm text-[#1A1617] leading-relaxed focus:outline-none focus:border-[#5E1734]"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "submit",
                        disabled: savingDescription,
                        className: "inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] disabled:opacity-60 text-white text-xs font-bold cursor-pointer",
                        children: [
                          savingDescription ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx("span", { children: "\u062D\u0641\u0638 \u0627\u0644\u0648\u0635\u0641" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditingDescription(false),
                        className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#C6A355]/35 text-[#65525A] hover:text-[#1A1617] text-xs font-bold cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx("span", { children: "\u0625\u0644\u063A\u0627\u0621" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-start gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#65525A] leading-relaxed flex-1 min-w-[180px]", children: product.description || "\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0635\u0641 \u0628\u0639\u062F." }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setDescriptionDraft(product.description || "");
                    setEditingDescription(true);
                  },
                  title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0648\u0635\u0641",
                  "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0648\u0635\u0641 ${product.name}`,
                  className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[#5E1734] text-xs font-bold shadow-2xs cursor-pointer transition-colors shrink-0",
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u270F\uFE0F" }),
                    /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0648\u0635\u0641" })
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.desc`,
                defaultText: product.description,
                valueOverride: product.description,
                as: "p",
                multiline: true,
                className: "text-sm text-[#65525A] leading-relaxed mt-2"
              }
            )
          ] }),
          (effectiveOptions.length > 0 || isAdminMode && (isFlowerProduct || isStoleProduct)) && /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617]", children: isFlowerProduct ? "\u0627\u062E\u062A\u0631 \u0646\u0648\u0639 \u0627\u0644\u062A\u0646\u0633\u064A\u0642:" : "\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0645\u0627\u0634:" }),
            effectiveOptions.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5", children: effectiveOptions.map((opt, idx) => {
              const active = idx === selectedOptionIdx;
              const isEditingThisOption = isAdminMode && editingOptionIdx === idx && Boolean(onUpdatePrice || onUpdateProductOptions);
              const isEditingThisFabricName = isAdminMode && isStoleProduct && editingFabricNameIdx === idx && Boolean(onUpdateProductOptions);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: () => setSelectedOptionIdx(idx),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedOptionIdx(idx);
                    }
                  },
                  className: `p-3 rounded-2xl border text-right transition-all touch-manipulation cursor-pointer ${active ? "border-[#5E1734] bg-[#FAF8F5] ring-1 ring-[#C6A355]/50" : "border-[#C6A355]/35 bg-white hover:border-[#5E1734]/45"}`,
                  children: [
                    isEditingThisFabricName ? /* @__PURE__ */ jsxs(
                      "form",
                      {
                        onClick: (e) => e.stopPropagation(),
                        onSubmit: async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await handleSaveFabricName(idx);
                        },
                        className: "flex flex-wrap items-center gap-1 mb-1",
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              autoFocus: true,
                              value: fabricNameDraft,
                              onChange: (e) => setFabricNameDraft(e.target.value),
                              onKeyDown: (e) => {
                                if (e.key === "Escape") {
                                  e.stopPropagation();
                                  setEditingFabricNameIdx(null);
                                }
                              },
                              placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0642\u0645\u0627\u0634",
                              className: "flex-1 min-w-[72px] px-1.5 py-0.5 rounded-lg border border-[#C6A355]/55 bg-white text-xs font-bold text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "submit",
                              disabled: savingFabricName,
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
                                setEditingFabricNameIdx(null);
                              },
                              "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                              className: "w-5 h-5 rounded-lg bg-white border border-[#C6A355]/35 text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                            }
                          )
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-1.5", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617] truncate", children: opt.label }),
                        isAdminMode && isStoleProduct && onUpdateProductOptions && /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              setFabricNameDraft(opt.label);
                              setEditingFabricNameIdx(idx);
                            },
                            title: `\u062A\u0639\u062F\u064A\u0644 \u0627\u0633\u0645 ${opt.label}`,
                            "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0627\u0633\u0645 ${opt.label}`,
                            className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[10px] cursor-pointer shadow-2xs shrink-0",
                            children: "\u270F\uFE0F"
                          }
                        )
                      ] }),
                      isAdminMode && isStoleProduct && onUpdateProductOptions && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            void handleDeleteFabricOption(idx);
                          },
                          title: `\u062D\u0630\u0641 \u0642\u0645\u0627\u0634 ${opt.label}`,
                          "aria-label": `\u062D\u0630\u0641 \u0642\u0645\u0627\u0634 ${opt.label}`,
                          className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-[11px] cursor-pointer shrink-0",
                          children: "\u{1F5D1}\uFE0F"
                        }
                      )
                    ] }),
                    isEditingThisOption ? /* @__PURE__ */ jsxs(
                      "form",
                      {
                        onClick: (e) => e.stopPropagation(),
                        onSubmit: async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const parsed = Number(optionPriceDraft);
                          if (!Number.isFinite(parsed) || parsed < 0) return;
                          setSavingOptionPrice(true);
                          try {
                            await saveEffectiveOptionPrice(Math.round(parsed), idx);
                            setEditingOptionIdx(null);
                          } finally {
                            setSavingOptionPrice(false);
                          }
                        },
                        className: "mt-1.5 flex flex-wrap items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "number",
                              min: 0,
                              step: 50,
                              autoFocus: true,
                              value: optionPriceDraft,
                              onChange: (e) => setOptionPriceDraft(e.target.value),
                              onKeyDown: (e) => {
                                if (e.key === "Escape") {
                                  e.stopPropagation();
                                  setEditingOptionIdx(null);
                                }
                              },
                              className: "w-20 px-1.5 py-0.5 rounded-lg border border-[#C6A355]/50 bg-white text-xs font-extrabold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#65525A]", children: "\u062F\u062C" }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "submit",
                              disabled: savingOptionPrice,
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
                                setEditingOptionIdx(null);
                              },
                              "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                              className: "w-5 h-5 rounded-lg bg-white border border-[#C6A355]/35 text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                            }
                          )
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1.5 tabular-nums", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-extrabold text-[#5E1734]", children: [
                        opt.price.toLocaleString("en-US"),
                        " \u062F\u062C"
                      ] }),
                      isAdminMode && (onUpdatePrice || onUpdateProductOptions) && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            setOptionPriceDraft(String(opt.price));
                            setEditingOptionIdx(idx);
                          },
                          title: `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${opt.label}`,
                          "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${opt.label}`,
                          className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[11px] cursor-pointer shadow-2xs shrink-0",
                          children: "\u270F\uFE0F"
                        }
                      )
                    ] })
                  ]
                },
                `${opt.label}-${idx}`
              );
            }) }),
            isAdminMode && isStoleProduct && onUpdateProductOptions && /* @__PURE__ */ jsx("div", { children: !isAddingFabricOpen ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setNewOptionLabel("");
                  setNewOptionPrice(
                    String(activeOption?.price ?? product.basePrice ?? 0)
                  );
                  setIsAddingFabricOpen(true);
                },
                className: "w-full py-2.5 px-3 rounded-2xl border border-dashed border-[#C6A355]/65 bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#5E1734] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                children: /* @__PURE__ */ jsx("span", { children: "+ \u0625\u0636\u0627\u0641\u0629 \u0646\u0648\u0639 \u0642\u0645\u0627\u0634 \u062C\u062F\u064A\u062F" })
              }
            ) : /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  void handleAddStoleFabricOption();
                },
                className: "p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/45 space-y-2",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        autoFocus: true,
                        value: newOptionLabel,
                        onChange: (e) => setNewOptionLabel(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Escape") {
                            setIsAddingFabricOpen(false);
                          }
                        },
                        placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0642\u0645\u0627\u0634 (\u0645\u062B\u0627\u0644: \u0645\u062E\u0645\u0644\u060C \u0633\u0627\u062A\u0627\u0646)...",
                        className: "flex-1 min-w-[130px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/40 bg-white text-xs font-semibold text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          min: 0,
                          step: 50,
                          value: newOptionPrice,
                          onChange: (e) => setNewOptionPrice(e.target.value),
                          placeholder: "\u0627\u0644\u0633\u0639\u0631",
                          className: "w-24 px-2 py-1.5 rounded-xl border border-[#C6A355]/40 bg-white text-xs font-bold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "submit",
                        disabled: addingFabricOption || !newOptionLabel.trim(),
                        className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] disabled:opacity-55 text-white text-xs font-bold cursor-pointer",
                        children: [
                          addingFabricOption ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0642\u0645\u0627\u0634" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setIsAddingFabricOpen(false),
                        className: "px-3 py-1.5 rounded-xl bg-white border border-[#C6A355]/35 text-xs font-bold text-[#65525A] hover:text-[#1A1617] cursor-pointer",
                        children: "\u0625\u0644\u063A\u0627\u0621"
                      }
                    )
                  ] })
                ]
              }
            ) }),
            isAdminMode && isFlowerProduct && onUpdateProductOptions && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 space-y-2.5", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#5E1734]", children: "\u270F\uFE0F \u0625\u062F\u0627\u0631\u0629 \u062E\u064A\u0627\u0631\u0627\u062A \u0646\u0648\u0639 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0648\u0627\u0644\u0633\u0639\u0631 (\u0648\u0636\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629)" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: draftOptions.map((opt, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: opt.label,
                    onChange: (e) => setDraftOptions(
                      (prev) => prev.map(
                        (item, i) => i === idx ? { ...item, label: e.target.value } : item
                      )
                    ),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveStyleOption(idx);
                      }
                    },
                    placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062A\u0646\u0633\u064A\u0642",
                    className: "flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs font-semibold text-[#1A1617]"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      value: opt.price,
                      onChange: (e) => setDraftOptions(
                        (prev) => prev.map(
                          (item, i) => i === idx ? { ...item, price: e.target.value } : item
                        )
                      ),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveStyleOption(idx);
                        }
                      },
                      placeholder: "\u0627\u0644\u0633\u0639\u0631",
                      className: "w-20 px-2 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs font-bold text-[#1A1617] tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSaveStyleOption(idx),
                    title: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644",
                    className: "px-2.5 py-1.5 rounded-xl bg-[#EBF9F2] hover:bg-[#D5F5E5] text-[#147A53] border border-[#BEEBD4] text-[11px] font-bold cursor-pointer",
                    children: "\u062D\u0641\u0638"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDeleteStyleOption(idx),
                    title: "\u062D\u0630\u0641 \u0627\u0644\u062A\u0646\u0633\u064A\u0642",
                    "aria-label": `\u062D\u0630\u0641 ${opt.label}`,
                    className: "px-2 py-1.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-bold cursor-pointer",
                    children: "\xD7"
                  }
                )
              ] }, idx)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-center gap-1.5 pt-1 border-t border-[#C6A355]/25", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: newOptionLabel,
                    onChange: (e) => setNewOptionLabel(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStyleOption();
                      }
                    },
                    placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u062C\u062F\u064A\u062F (\u0645\u062B\u0627\u0644: \u062A\u0646\u0633\u064A\u0642 \u0641\u0627\u062E\u0631)...",
                    className: "flex-1 min-w-[130px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      value: newOptionPrice,
                      onChange: (e) => setNewOptionPrice(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStyleOption();
                        }
                      },
                      placeholder: "\u0627\u0644\u0633\u0639\u0631",
                      className: "w-20 px-2 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddStyleOption,
                    className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-[11px] font-bold cursor-pointer whitespace-nowrap",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0646\u0633\u064A\u0642 \u062C\u062F\u064A\u062F" })
                    ]
                  }
                )
              ] })
            ] }),
            isAdminMode && !isFlowerProduct && !isStoleProduct && effectiveOptions.length === 0 && onUpdateProductOptions && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 flex flex-wrap sm:flex-nowrap items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: newOptionLabel,
                  onChange: (e) => setNewOptionLabel(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddStyleOption();
                    }
                  },
                  placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062E\u064A\u0627\u0631...",
                  className: "flex-1 min-w-[130px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: 0,
                    value: newOptionPrice,
                    onChange: (e) => setNewOptionPrice(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStyleOption();
                      }
                    },
                    placeholder: "\u0627\u0644\u0633\u0639\u0631",
                    className: "w-20 px-2 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] tabular-nums"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleAddStyleOption,
                  className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-[11px] font-bold cursor-pointer whitespace-nowrap",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u062E\u064A\u0627\u0631" })
                  ]
                }
              )
            ] })
          ] }),
          (visibleSecondaryOptions.length > 0 || isAdminMode && isFlowerProduct) && /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-[#1A1617]", children: [
              product.secondaryLabel || (product.category === "robe" ? "\u0627\u0644\u0645\u0642\u0627\u0633 \u0627\u0644\u0642\u064A\u0627\u0633\u064A" : isFlowerProduct ? "\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u062F" : "\u062E\u064A\u0627\u0631 \u0625\u0636\u0627\u0641\u064A"),
              ":"
            ] }),
            visibleSecondaryOptions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: visibleSecondaryOptions.map((sec) => {
              const active = sec === selectedSecondary;
              const extra = product.secondaryOptionPrices?.[sec] || 0;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedSecondary(sec),
                  className: `px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${active ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: sec }),
                    extra !== 0 && /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: `mr-1.5 text-[11px] tabular-nums ${active ? "text-white/90" : "text-[#5E1734]"}`,
                        children: [
                          "(",
                          extra > 0 ? `+${extra.toLocaleString("en-US")}` : extra.toLocaleString("en-US"),
                          " \u062F\u062C)"
                        ]
                      }
                    )
                  ]
                },
                sec
              );
            }) }),
            isAdminMode && onUpdateSecondaryOptions && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 space-y-2.5", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#5E1734]", children: [
                "\u270F\uFE0F \u0625\u062F\u0627\u0631\u0629 \u062E\u064A\u0627\u0631\u0627\u062A ",
                product.secondaryLabel || "\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u062F",
                " (\u0648\u0636\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629)"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: draftSecondaryEntries.map((entry, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: entry.name,
                    onChange: (e) => setDraftSecondaryEntries(
                      (prev) => prev.map(
                        (item, i) => i === idx ? { ...item, name: e.target.value } : item
                      )
                    ),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveEditedSecondaryOption(idx);
                      }
                    },
                    className: "flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs font-semibold text-[#1A1617]"
                  }
                ),
                product.category !== "robe" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: entry.extraPrice,
                      onChange: (e) => setDraftSecondaryEntries(
                        (prev) => prev.map(
                          (item, i) => i === idx ? { ...item, extraPrice: e.target.value } : item
                        )
                      ),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveEditedSecondaryOption(idx);
                        }
                      },
                      title: "\u0641\u0631\u0642 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 (0 \u0628\u062F\u0648\u0646 \u0632\u064A\u0627\u062F\u0629)",
                      placeholder: "0",
                      className: "w-20 px-2 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs font-bold text-[#1A1617] tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSaveEditedSecondaryOption(idx),
                    title: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644",
                    className: "px-2.5 py-1.5 rounded-xl bg-[#EBF9F2] hover:bg-[#D5F5E5] text-[#147A53] border border-[#BEEBD4] text-[11px] font-bold cursor-pointer",
                    children: "\u062D\u0641\u0638"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDeleteSecondaryOption(idx),
                    title: "\u062D\u0630\u0641 \u0627\u0644\u062E\u064A\u0627\u0631",
                    "aria-label": `\u062D\u0630\u0641 ${entry.name}`,
                    className: "px-2 py-1.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-bold cursor-pointer",
                    children: "\xD7"
                  }
                )
              ] }, idx)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-center gap-1.5 pt-1 border-t border-[#C6A355]/25", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: newSecondaryOption,
                    onChange: (e) => setNewSecondaryOption(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSecondaryOption();
                      }
                    },
                    placeholder: isFlowerProduct ? "\u0623\u0636\u064A\u0641\u064A \u0646\u0648\u0639 \u0648\u0631\u062F \u062C\u062F\u064A\u062F (\u0645\u062B\u0627\u0644: \u0648\u0631\u062F \u0645\u062C\u0641\u0641)..." : "\u0623\u0636\u064A\u0641\u064A \u062E\u064A\u0627\u0631\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B...",
                    className: "flex-1 min-w-[130px] px-2.5 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                  }
                ),
                product.category !== "robe" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: newSecondaryPrice,
                      onChange: (e) => setNewSecondaryPrice(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSecondaryOption();
                        }
                      },
                      title: "\u0641\u0631\u0642 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 (0 \u0628\u062F\u0648\u0646 \u0632\u064A\u0627\u062F\u0629)",
                      placeholder: "0",
                      className: "w-20 px-2 py-1.5 rounded-xl border border-[#C6A355]/35 bg-white text-xs text-[#1A1617] tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddSecondaryOption,
                    className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-[11px] font-bold cursor-pointer whitespace-nowrap",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { children: isFlowerProduct ? "\u0625\u0636\u0627\u0641\u0629 \u0646\u0648\u0639 \u0648\u0631\u062F" : "\u0625\u0636\u0627\u0641\u0629 \u062E\u064A\u0627\u0631" })
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          !isFlowerProduct && (isAmericanShawl ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-2", children: "\u0627\u0643\u062A\u0628 \u0644\u0648\u0646 \u0627\u0644\u0634\u0627\u0644 (\u0644\u0648\u0646\u064A\u0646):" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: customColorText,
                onChange: (e) => setCustomColorText(e.target.value),
                placeholder: "\u0645\u062B\u0627\u0644: \u0623\u0633\u0648\u062F \u0648\u0630\u0647\u0628\u064A\u060C \u0623\u0648 \u0643\u062D\u0644\u064A \u0648\u0623\u0628\u064A\u0636...",
                className: "w-full px-3.5 py-3 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-sm font-semibold text-[#1A1617] placeholder:text-[#8C7780] focus:outline-none focus:border-[#5E1734]"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-[#1A1617] mb-2", children: [
              "\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u0648\u0646:",
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-[#5E1734]", children: [
                selectedColor.name,
                selectedColor.extraPrice && selectedColor.extraPrice > 0 ? ` (+${selectedColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2.5", children: activeMainColors.map((swatch) => {
              const isActive = swatch.name === selectedColor.name && swatch.hex === selectedColor.hex;
              const hasPhoto = Boolean(product.colorImages?.[swatch.name]);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  title: swatch.extraPrice && swatch.extraPrice > 0 ? `${swatch.name} (+${swatch.extraPrice} \u062F\u062C)` : swatch.name,
                  onClick: () => setSelectedColor(swatch),
                  className: `relative w-8 h-8 rounded-full border flex items-center justify-center transition-transform cursor-pointer ${isActive ? "ring-2 ring-[#5E1734] ring-offset-2 ring-offset-white scale-110 border-[#5E1734]" : "border-[#C6A355]/45"}`,
                  style: { backgroundColor: swatch.hex },
                  children: [
                    isActive && /* @__PURE__ */ jsx(
                      Check,
                      {
                        className: `w-4 h-4 ${swatch.hex.toLowerCase() === "#f5f5f4" || swatch.hex.toLowerCase() === "#e7d8c9" || swatch.hex.toLowerCase() === "#9ca3af" || swatch.hex.toLowerCase() === "#ede6d8" || swatch.hex.toLowerCase() === "#f4efe6" || swatch.hex.toLowerCase() === "#f7f3ea" || swatch.hex.toLowerCase() === "#faf8f5" || swatch.hex.toLowerCase() === "#ffffff" ? "text-[#1A1617]" : "text-white"}`
                      }
                    ),
                    hasPhoto && !isActive && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#5E1734] border border-white" })
                  ]
                },
                `${swatch.name}-${swatch.hex}`
              );
            }) }),
            isAdminMode && /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 space-y-2", children: [
              isCrystalRoyalStole && onUpdateCrystalRoyalColors && /* @__PURE__ */ jsxs("div", { className: "pb-2.5 border-b border-[#C6A355]/30 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617]", children: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u0644\u0643\u064A\u0629 \u0627\u0644\u0633\u062A\u0629 (6 \u0623\u0644\u0648\u0627\u0646 \u0641\u0642\u0637):" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditingRoyalColors((v) => !v),
                      className: "inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-xs font-bold text-[#5E1734] cursor-pointer",
                      children: editingRoyalColors ? "\u0625\u063A\u0644\u0627\u0642 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0623\u0644\u0648\u0627\u0646" : "\u{1F3A8} \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0633\u062A\u0629"
                    }
                  )
                ] }),
                editingRoyalColors && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: royalColorDrafts.map((draft, idx) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-[#C6A355]/35",
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "color",
                            value: /^#[0-9a-fA-F]{6}$/.test(draft.hex) ? draft.hex : "#141414",
                            "aria-label": `\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646 ${idx + 1}`,
                            onChange: (e) => {
                              const nextHex = e.target.value.toUpperCase();
                              setRoyalColorDrafts((prev) => prev.map((item, i) => i === idx ? { ...item, hex: nextHex } : item));
                            },
                            className: "w-7 h-7 rounded-lg border border-[#C6A355]/45 cursor-pointer shrink-0 p-0 bg-transparent"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            value: draft.name,
                            "aria-label": `\u0627\u0633\u0645 \u0627\u0644\u0644\u0648\u0646 ${idx + 1}`,
                            onChange: (e) => {
                              const val = e.target.value;
                              setRoyalColorDrafts((prev) => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                            },
                            className: "flex-1 min-w-0 px-2 py-1 rounded-lg border border-[#C6A355]/30 bg-[#FAF8F5] text-xs font-bold text-[#1A1617]"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "number",
                            min: 0,
                            step: 50,
                            value: draft.extraPrice ?? 0,
                            title: "\u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0633\u0639\u0631 (\u062F\u062C)",
                            "aria-label": `\u0633\u0639\u0631 \u0625\u0636\u0627\u0641\u064A \u0644\u0644\u0648\u0646 ${idx + 1}`,
                            onChange: (e) => {
                              const num = Math.max(0, Number(e.target.value || 0));
                              setRoyalColorDrafts((prev) => prev.map((item, i) => i === idx ? { ...item, extraPrice: Number.isFinite(num) ? num : 0 } : item));
                            },
                            className: "w-16 px-1.5 py-1 rounded-lg border border-[#C6A355]/30 bg-[#FAF8F5] text-xs font-bold text-[#1A1617] text-center tabular-nums"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#65525A]", children: "\u062F\u062C" })
                      ]
                    },
                    idx
                  )) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        disabled: savingRoyalColors,
                        onClick: async () => {
                          setSavingRoyalColors(true);
                          try {
                            const defaults = ROYAL_SIX_STOLE_COLORS.map((c) => ({ ...c }));
                            setRoyalColorDrafts(defaults);
                            await onUpdateCrystalRoyalColors(defaults);
                            setEditingRoyalColors(false);
                          } finally {
                            setSavingRoyalColors(false);
                          }
                        },
                        className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EDE2] border border-[#C6A355]/45 text-xs font-bold text-[#65525A] cursor-pointer disabled:opacity-60",
                        children: [
                          /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
                          /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        disabled: savingRoyalColors,
                        onClick: async () => {
                          setSavingRoyalColors(true);
                          try {
                            await onUpdateCrystalRoyalColors(royalColorDrafts);
                            setEditingRoyalColors(false);
                          } finally {
                            setSavingRoyalColors(false);
                          }
                        },
                        className: "inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer disabled:opacity-60",
                        children: savingRoyalColors ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0633\u062A\u0629"
                      }
                    )
                  ] })
                ] })
              ] }),
              supportsAutoColorizeToggle && onToggleAutoColorize && /* @__PURE__ */ jsxs("div", { className: "pb-2 border-b border-[#C6A355]/30 flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617]", children: "\u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C:" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: togglingAutoColorize,
                    onClick: async () => {
                      setTogglingAutoColorize(true);
                      try {
                        await onToggleAutoColorize();
                      } finally {
                        setTogglingAutoColorize(false);
                      }
                    },
                    className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95 disabled:opacity-65 ${isAutoColorDisabled ? "bg-[#FFF4E5] text-[#9A3412] border-[#F59E0B]/55 hover:bg-[#FFEDD5]" : "bg-white text-[#14532D] border-[#22C55E]/45 hover:bg-[#F0FDF4]"}`,
                    children: /* @__PURE__ */ jsx("span", { children: isAutoColorDisabled ? "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u062A\u0648\u0642\u0641" : "\u{1F3A8} \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A: \u0645\u0641\u0639\u0651\u0644" })
                  }
                )
              ] }),
              isRegularShawl && onReplaceRegularShawlBaseImage && /* @__PURE__ */ jsx("div", { className: "pb-2.5 border-b border-[#C6A355]/30 space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: regularShawlColorizerImage,
                      alt: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0644\u0644\u062A\u0644\u0648\u064A\u0646",
                      className: "w-9 h-9 rounded-lg object-cover border border-[#C6A355]/40 bg-white shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-[#1A1617]", children: "\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u0633\u0627\u062F\u0629 \u0644\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u0641\u0648\u0631\u064A" }),
                    /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-[#65525A]", children: "\u062A\u064F\u0633\u062A\u062E\u062F\u0645 \u0644\u062A\u0644\u0648\u064A\u0646 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0623\u0648 \u0642\u0628\u0639\u0629" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer shadow-2xs transition-all active:scale-95", children: [
                    uploadingRegularBase ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u0641\u0639..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0644\u0644\u062A\u0644\u0648\u064A\u0646" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "file",
                        accept: "image/*",
                        disabled: uploadingRegularBase,
                        className: "hidden",
                        onChange: async (e) => {
                          const file = e.target.files?.item(0);
                          e.target.value = "";
                          if (!file) return;
                          setUploadingRegularBase(true);
                          try {
                            await onReplaceRegularShawlBaseImage(file);
                            setVisualTab("photo");
                          } finally {
                            setUploadingRegularBase(false);
                          }
                        }
                      }
                    )
                  ] }),
                  regularShawlBaseImage && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      disabled: uploadingRegularBase,
                      onClick: async () => {
                        setUploadingRegularBase(true);
                        try {
                          await onReplaceRegularShawlBaseImage(null);
                        } finally {
                          setUploadingRegularBase(false);
                        }
                      },
                      className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#65525A] border border-[#C6A355]/40 text-xs font-bold cursor-pointer",
                      title: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629",
                      children: [
                        /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0627\u0641\u062A\u0631\u0627\u0636\u064A" })
                      ]
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: colorFileRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handleColorFileChange
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617]", children: isRegularShawl ? `\u0635\u0648\u0631\u0629 \u0645\u0631\u062C\u0639\u064A\u0629 \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0644\u0648\u0646 "${selectedColor.name}":` : `\u0635\u0648\u0631\u0629 \u0645\u062E\u0635\u0635\u0629 \u0644\u0644\u0648\u0646 "${selectedColor.name}":` }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => colorFileRef.current?.click(),
                      className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: hasDedicatedColorImg ? "\u{1F4F7} \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0644\u0648\u0646" : "\u{1F4F7} \u0635\u0648\u0631\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646" })
                      ]
                    }
                  ),
                  hasDedicatedColorImg && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => onSetColorImage?.(selectedColor.name, null),
                      className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] text-xs font-bold cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641" })
                      ]
                    }
                  )
                ] })
              ] }),
              (product.category === "robe" || isStoleProduct && !isAmericanShawl) && (isRegularShawl || !hasDedicatedColorImg) && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-[#65525A]", children: isRegularShawl ? "\u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0627\u0644\u0641\u0648\u0631\u064A \u0645\u064F\u0641\u0639\u0651\u0644 \u062F\u0627\u0626\u0645\u0627\u064B \u0639\u0644\u0649 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u2014 \u064A\u0645\u0643\u0646\u0643 \u062A\u062D\u062F\u064A\u062B\u0647\u0627 \u0623\u0648 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631 \u0645\u0631\u062C\u0639\u064A\u0629 \u0644\u0643\u0644 \u0644\u0648\u0646 \u0641\u064A \u0623\u064A \u0648\u0642\u062A." : "\u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0627\u0644\u0641\u0648\u0631\u064A \u0645\u064F\u0641\u0639\u0651\u0644 \u0639\u0644\u0649 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u2014 \u064A\u0645\u0643\u0646\u0643 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u062D\u0642\u064A\u0642\u064A\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646 \u0641\u064A \u0623\u064A \u0648\u0642\u062A." })
            ] })
          ] })),
          isStoleProduct && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#C6A355]/25 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-[#1A1617] mb-2", children: [
                "\u0644\u0648\u0646 \u062E\u064A\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632:",
                " ",
                /* @__PURE__ */ jsxs("span", { className: "text-[#5E1734]", children: [
                  selectedThreadColor.name,
                  selectedThreadColor.extraPrice && selectedThreadColor.extraPrice > 0 ? ` (+${selectedThreadColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: activeThreadColors.map((t) => {
                const active = t.name === selectedThreadColor.name && t.hex === selectedThreadColor.hex;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    title: t.extraPrice && t.extraPrice > 0 ? `${t.name} (+${t.extraPrice} \u062F\u062C)` : t.name,
                    onClick: () => setSelectedThreadColor(t),
                    className: `w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer transition-transform ${active ? "ring-2 ring-[#5E1734] ring-offset-2 ring-offset-white scale-110 border-[#5E1734]" : "border-[#C6A355]/45"}`,
                    style: { backgroundColor: t.hex },
                    children: active && /* @__PURE__ */ jsx(
                      Check,
                      {
                        className: `w-3.5 h-3.5 ${t.hex === "#ffffff" || t.hex === "#e2e8f0" || t.hex === "#f5f5f4" ? "text-[#1A1617]" : "text-white"}`
                      }
                    )
                  },
                  `${t.name}-${t.hex}`
                );
              }) })
            ] }),
            isAmericanShawl ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0639\u0628\u0627\u0631\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0637\u0631\u064A\u0632\u0647\u0627 \u0639\u0644\u0649 \u0627\u0644\u0648\u0634\u0627\u062D:" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: embroideredText,
                  onChange: (e) => setEmbroideredText(e.target.value),
                  placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0637\u0631\u064A\u0632\u0647...",
                  className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649 \u0644\u0644\u0648\u0634\u0627\u062D:" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    maxLength: 40,
                    value: rightEmbroideredText,
                    onChange: (e) => setRightEmbroideredText(e.target.value),
                    placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649 (\u0645\u062B\u0627\u0644: \u062F\u0639\u0627\u0621)",
                    className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 \u0644\u0644\u0648\u0634\u0627\u062D:" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    maxLength: 40,
                    value: leftEmbroideredText,
                    onChange: (e) => setLeftEmbroideredText(e.target.value),
                    placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 (\u0645\u062B\u0627\u0644: \u062A\u062E\u0635\u0635 \u0635\u064A\u062F\u0644\u0629 / 2026)",
                    className: "w-full px-3.5 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0625\u0636\u0627\u0641\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 (\u0645\u062C\u0627\u0646\u0627\u064B):" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: universityLogoInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleUniversityLogoUpload
                }
              ),
              universityLogo ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5]", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: universityLogo,
                      alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642",
                      className: "w-11 h-11 rounded-full object-cover border-2 border-[#5E1734] bg-white shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-[#1A1617]", children: "\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629" }),
                    /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-[#65525A]", children: "\u0633\u064A\u0638\u0647\u0631 \u062F\u0627\u0626\u0631\u064A\u0627\u064B \u0641\u0648\u0642 \u0627\u0644\u0627\u0633\u0645 \u0641\u064A \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0648\u064A\u064F\u0631\u0641\u0642 \u0628\u0627\u0644\u0637\u0644\u0628" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => universityLogoInputRef.current?.click(),
                      className: "px-2.5 py-1.5 rounded-xl bg-white border border-[#C6A355]/40 hover:bg-[#FAF8F5] text-xs font-bold text-[#5E1734] cursor-pointer",
                      children: "\u062A\u063A\u064A\u064A\u0631"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setUniversityLogo(null),
                      "aria-label": "\u062D\u0630\u0641 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                      className: "p-1.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] hover:bg-[#FFE4E6] text-[#BE123C] cursor-pointer",
                      children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  disabled: isCompressingLogo,
                  onClick: () => universityLogoInputRef.current?.click(),
                  className: "w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-dashed border-[#C6A355]/55 bg-[#FAF8F5] hover:border-[#5E1734]/60 text-xs font-bold text-[#65525A] hover:text-[#5E1734] transition-colors cursor-pointer disabled:opacity-60",
                  children: isCompressingLogo ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0634\u0639\u0627\u0631..." })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4 text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A \xB7 \u0645\u062C\u0627\u0646\u0627\u064B)" })
                  ] })
                }
              ),
              logoError && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[#BE123C] mt-1", children: logoError })
            ] })
          ] }),
          !isFlowerProduct && !isStoleProduct && product.category === "robe" && (isAdminMode || !product.hideSizing) && /* @__PURE__ */ jsxs("div", { className: `pt-3 border-t border-[#C6A355]/25 space-y-3 ${product.hideSizing ? "opacity-50" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617]", children: "\u0627\u0644\u0645\u0642\u0627\u0633:" }),
              isAdminMode && onToggleField && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onToggleField("hideSizing"),
                  className: `px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${product.hideSizing ? "bg-[#EBF9F2] text-[#147A53] border border-[#BEEBD4]" : "bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]"}`,
                  children: product.hideSizing ? "+ \u0625\u0638\u0647\u0627\u0631 \u0644\u0644\u0632\u0628\u0627\u0626\u0646" : "\u2715 \u062D\u0630\u0641 \u0648\u0625\u062E\u0641\u0627\u0621"
                }
              )
            ] }),
            !product.hideSizing && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 p-1 rounded-full bg-[#FAF8F5] border border-[#C6A355]/35", children: ["\u0646\u0633\u0627\u0626\u064A", "\u0631\u062C\u0627\u0644\u064A"].map((g) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setGender(g),
                  className: `py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${gender === g ? "bg-[#5E1734] text-white shadow-sm" : "text-[#65525A] hover:text-[#1A1617]"}`,
                  children: g
                },
                g
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-[#65525A] mb-1", children: "\u0631\u0642\u0645 \u0627\u0644\u0645\u0642\u0627\u0633 (34 - 70):" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 34,
                      max: 70,
                      value: numericSize,
                      onChange: (e) => setNumericSize(e.target.value),
                      placeholder: "44 - 70",
                      className: "w-full px-3 py-2 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-[#65525A] mb-1", children: "\u0627\u0644\u0637\u0648\u0644 \u0627\u0644\u0643\u0627\u0645\u0644 (80 - 200 \u0633\u0645):" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 80,
                      max: 200,
                      value: fullLength,
                      onChange: (e) => setFullLength(e.target.value),
                      placeholder: "\u0633\u0645",
                      className: "w-full px-3 py-2 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: shoulderAndSleeve,
                  onChange: (e) => setShoulderAndSleeve(e.target.value),
                  placeholder: "\u0639\u0631\u0636 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0648\u0637\u0648\u0644 \u0627\u0644\u0643\u0645 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)...",
                  className: "w-full px-3 py-2 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                }
              )
            ] })
          ] }),
          product.category !== "accessories" && product.category !== "cap" && (isAdminMode || !product.hideCapDetails) && /* @__PURE__ */ jsxs("div", { className: `pt-3 border-t border-[#C6A355]/25 space-y-3 ${product.hideCapDetails ? "opacity-50" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617]", children: "\u0627\u0644\u0642\u0628\u0639\u0629 \u0648\u062A\u0641\u0627\u0635\u064A\u0644\u0647\u0627:" }),
              isAdminMode && onToggleField && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onToggleField("hideCapDetails"),
                  className: `px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${product.hideCapDetails ? "bg-[#EBF9F2] text-[#147A53] border border-[#BEEBD4]" : "bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]"}`,
                  children: product.hideCapDetails ? "+ \u0625\u0638\u0647\u0627\u0631 \u0644\u0644\u0632\u0628\u0627\u0626\u0646" : "\u2715 \u062D\u0630\u0641 \u0648\u0625\u062E\u0641\u0627\u0621"
                }
              )
            ] }),
            !product.hideCapDetails && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5 min-w-0", children: capStyles.map((cap) => {
                const active = selectedCapStyle.id === cap.id;
                const capImgSrc = cap.id !== "none" ? customCapImages[cap.id] || cap.image : null;
                const isEditingCap = isAdminMode && editingCapId === cap.id && Boolean(onUpdateCapOptionPrice);
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    role: "button",
                    tabIndex: 0,
                    onClick: () => setSelectedCapStyleId(cap.id),
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCapStyleId(cap.id);
                      }
                    },
                    className: `min-w-0 w-full p-2 sm:p-2.5 rounded-xl border text-right cursor-pointer flex items-center gap-2.5 overflow-hidden transition-all ${active ? "border-[#5E1734] ring-2 ring-[#C6A355]/45 bg-[#FAF8F5]" : "border-[#C6A355]/35 bg-white hover:border-[#5E1734]/45"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          onContextMenu: (e) => e.preventDefault(),
                          className: "w-10 h-10 rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#C6A355]/25 flex items-center justify-center shrink-0 protected-media select-none",
                          children: capImgSrc ? /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: capImgSrc,
                              alt: cap.label,
                              loading: "lazy",
                              draggable: false,
                              onContextMenu: (e) => e.preventDefault(),
                              className: "w-10 h-10 rounded-lg object-cover shrink-0 pointer-events-none select-none"
                            }
                          ) : /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", "aria-hidden": "true", children: "\u{1F6AB}" })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "block text-[11px] sm:text-xs font-extrabold text-[#1A1617] leading-tight truncate", children: cap.label }),
                        isEditingCap ? /* @__PURE__ */ jsxs(
                          "form",
                          {
                            onClick: (e) => e.stopPropagation(),
                            onSubmit: async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!onUpdateCapOptionPrice) return;
                              const parsed = Number(capPriceDraft);
                              if (!Number.isFinite(parsed)) return;
                              setSavingCapPrice(true);
                              try {
                                await onUpdateCapOptionPrice(
                                  cap.id,
                                  Math.round(parsed)
                                );
                                setEditingCapId(null);
                              } finally {
                                setSavingCapPrice(false);
                              }
                            },
                            className: "mt-1 flex flex-wrap items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsx(
                                "input",
                                {
                                  type: "number",
                                  step: 50,
                                  autoFocus: true,
                                  value: capPriceDraft,
                                  onChange: (e) => setCapPriceDraft(e.target.value),
                                  onKeyDown: (e) => {
                                    if (e.key === "Escape") {
                                      e.stopPropagation();
                                      setEditingCapId(null);
                                    }
                                  },
                                  className: "w-16 px-1 py-0.5 rounded-md border border-[#C6A355]/50 bg-white text-[11px] font-extrabold text-[#1A1617] text-center tabular-nums focus:outline-none focus:border-[#5E1734]"
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#65525A]", children: "\u062F\u062C" }),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  type: "submit",
                                  disabled: savingCapPrice,
                                  className: "px-1.5 py-0.5 rounded-md bg-[#147A53] text-white text-[10px] font-bold cursor-pointer",
                                  children: "\u062D\u0641\u0638"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    setEditingCapId(null);
                                  },
                                  "aria-label": "\u0625\u0644\u063A\u0627\u0621",
                                  className: "w-4 h-4 rounded bg-white border border-[#C6A355]/35 text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                                  children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
                                }
                              )
                            ]
                          }
                        ) : /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex items-center gap-1 tabular-nums", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-[11px] font-bold text-[#5E1734] truncate", children: cap.priceText }),
                          isAdminMode && onUpdateCapOptionPrice && /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                setCapPriceDraft(String(cap.extraPrice));
                                setEditingCapId(cap.id);
                              },
                              title: `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${cap.label}`,
                              "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${cap.label}`,
                              className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-[10px] shrink-0 cursor-pointer shadow-2xs",
                              children: "\u270F\uFE0F"
                            }
                          )
                        ] })
                      ] })
                    ]
                  },
                  cap.id
                );
              }) }),
              isAdminMode && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1.5 pt-1", children: BASE_CAP_STYLES.map((cap) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: "cursor-pointer flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 hover:border-[#5E1734] text-[10px] font-bold text-[#1A1617] text-center",
                  children: [
                    /* @__PURE__ */ jsx(ImagePlus, { className: "w-3 h-3 text-[#5E1734] shrink-0" }),
                    /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                      "\u0635\u0648\u0631\u0629 ",
                      cap.label.replace("\u0627\u0644\u0642\u0628\u0639\u0629 ", "").replace("\u0642\u0628\u0639\u0629 ", "")
                    ] }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: (e) => handleCapImageUpload(cap.id, e)
                      }
                    )
                  ]
                },
                cap.id + "-upload"
              )) }),
              isNoCap ? /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 text-xs text-[#65525A]", children: [
                "\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 ",
                /* @__PURE__ */ jsx("strong", { className: "text-[#5E1734]", children: "\u0628\u062F\u0648\u0646 \u0642\u0628\u0639\u0629" }),
                selectedCapStyle.extraPrice < 0 ? ` \u2014 \u062A\u0645 \u062E\u0635\u0645 ${Math.abs(selectedCapStyle.extraPrice).toLocaleString("en-US")} \u062F\u062C \u0645\u0646 \u0627\u0644\u0633\u0639\u0631 \u0648\u0644\u0646 \u062A\u0638\u0647\u0631 \u062D\u0642\u0648\u0644 \u0627\u0644\u0642\u0628\u0639\u0629.` : selectedCapStyle.extraPrice > 0 ? ` (+${selectedCapStyle.extraPrice.toLocaleString("en-US")} \u062F\u062C) \u2014 \u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0642\u0628\u0639\u0629.` : " \u2014 \u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0642\u0628\u0639\u0629."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] pt-1", children: "\u0644\u0648\u0646 \u0627\u0644\u0642\u0628\u0639\u0629:" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 p-1 rounded-full bg-[#FAF8F5] border border-[#C6A355]/35", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCapSameColor(true),
                      className: `py-2 rounded-full text-xs font-bold cursor-pointer ${capSameColor ? "bg-[#5E1734] text-white shadow-sm" : "text-[#65525A]"}`,
                      children: product.category === "robe" ? "\u0646\u0641\u0633 \u0644\u0648\u0646 \u0627\u0644\u0631\u0648\u0628" : "\u0646\u0641\u0633 \u0644\u0648\u0646 \u0627\u0644\u0648\u0634\u0627\u062D"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCapSameColor(false),
                      className: `py-2 rounded-full text-xs font-bold cursor-pointer ${!capSameColor ? "bg-[#5E1734] text-white shadow-sm" : "text-[#65525A]"}`,
                      children: "\u0644\u0648\u0646 \u0622\u062E\u0631"
                    }
                  )
                ] }),
                !capSameColor && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35", children: [
                  activeCapColors.map((sw) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      title: sw.extraPrice && sw.extraPrice > 0 ? `${sw.name} (+${sw.extraPrice} \u062F\u062C)` : sw.name,
                      onClick: () => setCapCustomColor(sw),
                      className: `w-6 h-6 rounded-full border cursor-pointer ${capCustomColor.name === sw.name && capCustomColor.hex === sw.hex ? "ring-2 ring-[#5E1734] ring-offset-1 ring-offset-white scale-110" : "border-[#C6A355]/45"}`,
                      style: { backgroundColor: sw.hex }
                    },
                    `${sw.name}-${sw.hex}`
                  )),
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#5E1734] mr-1", children: [
                    capCustomColor.name,
                    capCustomColor.extraPrice && capCustomColor.extraPrice > 0 ? ` (+${capCustomColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1", children: "\u0645\u062D\u064A\u0637 \u0627\u0644\u0631\u0623\u0633 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A\u060C 45 - 70 \u0633\u0645):" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 45,
                      max: 70,
                      value: headSize,
                      onChange: (e) => setHeadSize(e.target.value),
                      placeholder: "45 - 70 \u0633\u0645",
                      className: "w-full px-3 py-2 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629:" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                    {
                      value: "\u0633\u0637\u062D \u0627\u0644\u0642\u0628\u0639\u0629",
                      label: "\u0637\u0631\u0651\u0632 \u0639\u0644\u0649 \u0633\u0637\u062D \u0627\u0644\u0642\u0628\u0639\u0629"
                    },
                    {
                      value: "\u062C\u0628\u0647\u0629 \u0627\u0644\u0642\u0628\u0639\u0629",
                      label: "\u0637\u0631\u0651\u0632 \u0639\u0644\u0649 \u062C\u0628\u0647\u0629 \u0627\u0644\u0642\u0628\u0639\u0629"
                    },
                    {
                      value: "\u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u0628\u0639\u0629",
                      label: "\u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u0628\u0639\u0629"
                    }
                  ].map((opt) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCapEmbroideryPos(opt.value),
                      className: `py-2 px-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-colors ${capEmbroideryPos === opt.value ? "bg-[#5E1734] text-white border-[#5E1734]" : "bg-white text-[#1A1617] border-[#C6A355]/35 hover:border-[#5E1734]/50"}`,
                      children: opt.label
                    },
                    opt.value
                  )) })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: capNotes,
                    onChange: (e) => setCapNotes(e.target.value),
                    placeholder: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0644\u0644\u0642\u0628\u0639\u0629 (\u0645\u062B\u0644\u0627\u064B: \u0627\u0644\u0627\u0633\u0645 \u0639\u0644\u0649 \u0627\u0644\u062C\u0628\u0647\u0629 \u0628\u062E\u064A\u0637 \u0630\u0647\u0628\u064A)...",
                    className: "w-full px-3 py-2 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#C6A355]/25 space-y-2", children: [
            isFlowerProduct && /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617]", children: "\u0639\u0628\u0627\u0631\u0629 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062A\u0647\u0646\u0626\u0629 / \u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0627\u0642\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A):" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: customNotes,
                onChange: (e) => setCustomNotes(e.target.value),
                placeholder: isFlowerProduct ? "\u0645\u062B\u0627\u0644: \u0645\u0628\u0627\u0631\u0643 \u0627\u0644\u062A\u062E\u0631\u062C \u064A\u0627 \u0623\u063A\u0644\u0649 \u062F\u0643\u062A\u0648\u0631\u0629 + \u0644\u0648\u0646 \u0627\u0644\u062A\u063A\u0644\u064A\u0641 \u0627\u0644\u0645\u0641\u0636\u0644..." : "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0644\u0648\u0634\u0627\u062D \u0623\u0648 \u0627\u0644\u062A\u0637\u0631\u064A\u0632 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)...",
                className: "w-full px-3 py-2.5 rounded-2xl border border-[#C6A355]/35 bg-[#FAF8F5] text-xs text-[#1A1617] placeholder:text-[#8C7780]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[#C6A355]/25 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-xs text-[#65525A]", children: "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A" }),
              storewideDiscountPercent > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-[#5E1734] tabular-nums", children: [
                  discountedPreviewPrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-[#8C7780] line-through tabular-nums", children: [
                  displayPrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] })
              ] }) : /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-[#5E1734] tabular-nums", children: [
                displayPrice.toLocaleString("en-US"),
                " \u062F\u062C"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                disabled: isCategoryPaused,
                onClick: () => handleAdd(false),
                className: `flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all touch-manipulation ${isCategoryPaused ? "bg-[#E5DFD7] text-[#65525A] cursor-not-allowed" : "cta-luxury-shimmer bg-[#5E1734] hover:bg-[#4A1129] text-white active:scale-95 cursor-pointer"}`,
                children: isCategoryPaused ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: resolvedPauseBadge })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: isCategoryPaused,
              onClick: () => handleAdd(true),
              className: `w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all touch-manipulation ${isCategoryPaused ? "bg-[#FAF8F5] border-[#E5DFD7] text-[#8C7780] cursor-not-allowed" : "bg-white hover:bg-[#5E1734] text-[#5E1734] hover:text-white border-[#5E1734] shadow-2xs active:scale-[0.99] cursor-pointer"}`,
              children: /* @__PURE__ */ jsx("span", { children: "\u26A1 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646 \u0645\u0628\u0627\u0634\u0631\u0629" })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: whatsappInquiryUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#EBF9F2] hover:bg-[#147A53] text-[#147A53] hover:text-white border border-[#147A53]/35 hover:border-[#147A53] text-xs sm:text-sm font-bold shadow-2xs transition-all touch-manipulation active:scale-[0.99]",
              children: /* @__PURE__ */ jsx("span", { children: "\u{1F4AC} \u0627\u0633\u062A\u0641\u0633\u0631 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628" })
            }
          ),
          /* @__PURE__ */ jsxs("ul", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 px-4 py-3 space-y-1.5 text-xs font-semibold text-[#1A1617]", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[#5E1734] font-extrabold shrink-0", "aria-hidden": "true", children: "\u2713" }),
              /* @__PURE__ */ jsx("span", { children: "\u0644\u0627 \u062A\u062F\u0641\u0639 \u0634\u064A\u0626\u0627\u064B \u0625\u0644\u0632\u0627\u0645\u064A\u0627\u064B \u0639\u0646\u062F \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[#5E1734] font-extrabold shrink-0", "aria-hidden": "true", children: "\u2713" }),
              /* @__PURE__ */ jsx("span", { children: "\u0639\u0631\u0628\u0648\u0646 (50%) \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628\u060C \u0648\u0627\u0644\u0628\u0627\u0642\u064A \u0639\u0646\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[#5E1734] font-extrabold shrink-0", "aria-hidden": "true", children: "\u2713" }),
              /* @__PURE__ */ jsx("span", { children: "\u062A\u062E\u062A\u0627\u0631 \u064A\u0648\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0644\u0645\u0648\u0639\u062F \u062A\u062E\u0631\u062C\u0643" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    lightboxTarget && typeof document !== "undefined" && ReactDOM.createPortal(
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `\u0645\u0639\u0627\u064A\u0646\u0629 ${product.name}${lightboxTarget.label ? ` - ${lightboxTarget.label}` : ""}`,
          onClick: closeProductLightbox,
          onContextMenu: (e) => e.preventDefault(),
          className: "fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 protected-media select-none cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  closeProductLightbox();
                },
                "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                className: "fixed top-4 left-1/2 -translate-x-1/2 z-[10000] inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-white text-[#1A1617] border border-[#C6A355]/60 hover:bg-[#FAF8F5] text-xs sm:text-sm font-extrabold shadow-xl cursor-pointer touch-manipulation",
                children: /* @__PURE__ */ jsx("span", { children: "\u2715 \u0625\u063A\u0644\u0627\u0642" })
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: (e) => e.stopPropagation(),
                onContextMenu: (e) => e.preventDefault(),
                className: "relative w-auto max-w-[92vw] sm:max-w-3xl max-h-[82vh] rounded-2xl bg-white border border-[#C6A355]/25 overflow-hidden p-0 shadow-2xl flex flex-col items-center justify-center protected-media select-none cursor-default",
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: { backgroundColor: imageBgColor || "#FFFFFF" },
                      className: "relative w-full max-h-[72vh] flex items-center justify-center overflow-hidden p-0 bg-white",
                      children: [
                        !lightboxTarget.skipColorizer && (product.category === "robe" || isStoleProduct && !isAmericanShawl) ? /* @__PURE__ */ jsx(
                          GownColorPreviewImage,
                          {
                            src: lightboxTarget.url,
                            alt: product.name,
                            colorHex: selectedColor.hex,
                            colorName: selectedColor.name,
                            garmentType: product.category === "robe" ? "robe" : "stole",
                            isDisabled: isAutoColorDisabled || hasDedicatedColorImg,
                            className: "max-w-full max-h-[72vh] w-auto h-auto object-contain mx-auto block pointer-events-none select-none"
                          }
                        ) : /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: lightboxTarget.url,
                            alt: lightboxTarget.label ? `${product.name} - ${lightboxTarget.label}` : product.name,
                            referrerPolicy: "no-referrer",
                            draggable: false,
                            onContextMenu: (e) => e.preventDefault(),
                            className: "max-w-full max-h-[72vh] w-auto h-auto object-contain mx-auto block mix-blend-multiply pointer-events-none select-none"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            "aria-hidden": "true",
                            onContextMenu: (e) => e.preventDefault(),
                            className: "absolute inset-0 z-10 bg-transparent select-none"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "w-full py-2.5 px-4 border-t border-[#C6A355]/15 bg-white flex items-center justify-between gap-3 text-xs text-[#65525A]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-editorial text-sm sm:text-base font-bold text-[#1A1617] truncate", children: product.name }),
                      lightboxTarget.label && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-white border border-[#C6A355]/45 text-[11px] font-extrabold text-[#5E1734] shrink-0", children: lightboxTarget.label })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#65525A] shrink-0", children: "\u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0641\u0642\u0637 \u2022 \u0627\u0636\u063A\u0637 \u062E\u0627\u0631\u062C \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0644\u0625\u063A\u0644\u0627\u0642" })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
}
function SectionCard({
  product,
  isAdminMode,
  isCategoryPaused = false,
  pauseBadge = "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B",
  storewideDiscountPercent = 0,
  imageBgColor = "#FAF8F5",
  layout = "vertical",
  onSelect,
  onZoomImage,
  onEdit,
  onDelete,
  onUpdatePrice,
  onReplaceImage,
  onRemoveImage
}) {
  const [imgError, setImgError] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceDraft, setPriceDraft] = useState(String(product.basePrice));
  const [savingPrice, setSavingPrice] = useState(false);
  const fileInputRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files?.item(0);
    if (file) {
      setImgError(false);
      onReplaceImage(file);
      e.target.value = "";
    }
  };
  const handleStartDelete = (e) => {
    e.stopPropagation();
    setConfirmingDelete(true);
  };
  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setConfirmingDelete(false);
    onDelete();
  };
  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmingDelete(false);
  };
  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onUpdatePrice) return;
    const parsed = Number(priceDraft);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setSavingPrice(true);
    try {
      await onUpdatePrice(Math.round(parsed));
      setEditingPrice(false);
    } finally {
      setSavingPrice(false);
    }
  };
  const hasValidImage = Boolean(product.imageUrl) && !imgError;
  const discountedBasePrice = storewideDiscountPercent > 0 ? Math.max(0, Math.round(product.basePrice * (1 - storewideDiscountPercent / 100))) : product.basePrice;
  if (layout === "horizontal") {
    return /* @__PURE__ */ jsxs(
      "article",
      {
        role: "button",
        tabIndex: 0,
        onClick: onSelect,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        },
        className: `group bg-white border rounded-2xl overflow-hidden p-0 shadow-sm flex flex-row items-stretch justify-between gap-0 cursor-pointer touch-manipulation transition-all duration-150 ease-out active:scale-[0.985] hover:shadow-md ${isCategoryPaused ? "border-[#FECDD3] hover:border-[#BE123C]/50" : "border-[#C6A355]/20 hover:border-[#C6A355]/60"}`,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: handleImageChange
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 p-3.5 sm:p-4 flex flex-col justify-between text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              isAdminMode && /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: (e) => e.stopPropagation(),
                  className: "flex flex-wrap items-center gap-1.5 pb-1",
                  children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: onEdit,
                        className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#1A1617] border border-[#C6A355]/45 text-[10px] sm:text-[11px] font-bold shadow-2xs hover:bg-[#F3EDE2] cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx(Pencil, { className: "w-3 h-3 text-[#5E1734]" }),
                          /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644" })
                        ]
                      }
                    ),
                    confirmingDelete ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#FFF1F2] border border-[#FECDD3]", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleConfirmDelete,
                          className: "px-1.5 py-0.5 rounded bg-[#BE123C] text-white text-[10px] font-bold hover:bg-[#9F1239] cursor-pointer",
                          children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0630\u0641"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleCancelDelete,
                          className: "px-1.5 py-0.5 rounded bg-white text-[#65525A] border border-[#C6A355]/30 text-[10px] font-bold cursor-pointer",
                          children: "\u0625\u0644\u063A\u0627\u0621"
                        }
                      )
                    ] }) : /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        "aria-label": `\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 ${product.name}`,
                        onClick: handleStartDelete,
                        className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#BE123C] text-white text-[10px] sm:text-[11px] font-bold shadow-2xs hover:bg-[#9F1239] cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }),
                          /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639" })
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `product.${product.id}.branch`,
                    defaultText: product.branch,
                    valueOverride: product.branch,
                    as: "span",
                    compact: true,
                    className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-[10px] sm:text-[11px] font-bold text-[#5E1734]"
                  }
                ),
                storewideDiscountPercent > 0 && !isAdminMode && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full bg-[#5E1734] text-white text-[10px] font-extrabold", children: [
                  "-",
                  storewideDiscountPercent,
                  "%"
                ] }),
                isCategoryPaused && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF1F3] border border-[#FECDD3] text-[10px] font-bold text-[#BE123C]", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-2.5 h-2.5 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: pauseBadge })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                EditableText,
                {
                  textKey: `product.${product.id}.name`,
                  defaultText: product.name,
                  valueOverride: product.name,
                  as: "h3",
                  compact: true,
                  className: "font-editorial text-lg sm:text-xl font-bold text-[#1A1617] leading-snug"
                }
              ),
              editingPrice && isAdminMode && onUpdatePrice ? /* @__PURE__ */ jsxs(
                "form",
                {
                  onClick: (e) => e.stopPropagation(),
                  onSubmit: handleSubmitPrice,
                  className: "mt-1 inline-flex flex-wrap items-center gap-1 px-2 py-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/60",
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
              ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 pt-0.5 tabular-nums", children: [
                storewideDiscountPercent > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-block px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-xs sm:text-sm font-extrabold text-[#5E1734]", children: [
                    "\u0645\u0646 ",
                    discountedBasePrice.toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#8C7780] line-through", children: [
                    product.basePrice.toLocaleString("en-US"),
                    " \u062F\u062C"
                  ] })
                ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-block px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-xs sm:text-sm font-extrabold text-[#5E1734]", children: [
                  "\u0645\u0646 ",
                  product.basePrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                isAdminMode && onUpdatePrice && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      setPriceDraft(String(product.basePrice));
                      setEditingPrice(true);
                    },
                    title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631",
                    "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${product.name}`,
                    className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-xs cursor-pointer shadow-2xs",
                    children: "\u270F\uFE0F"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxs(
              "span",
              {
                className: `inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${isCategoryPaused ? "bg-[#FFF1F3] text-[#9F1239] border border-[#FECDD3] group-hover:bg-[#FFE4E6]" : "cta-luxury-shimmer bg-[#5E1734] group-hover:bg-[#4A1129] text-white shadow-xs"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { children: isCategoryPaused ? `\u062A\u0635\u0641\u062D \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \xB7 ${pauseBadge}` : "\u062A\u062E\u0635\u064A\u0635 \u0648\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0644\u0648\u0646" }),
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "w-3.5 h-3.5 shrink-0" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onContextMenu: (e) => e.preventDefault(),
              style: { backgroundColor: imageBgColor || "#FFFFFF" },
              className: "relative w-36 sm:w-44 min-h-[155px] shrink-0 self-stretch overflow-hidden p-0 border-0 rounded-none flex items-center justify-center protected-media select-none transition-colors duration-300",
              children: [
                hasValidImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: product.imageUrl,
                      alt: product.name,
                      referrerPolicy: "no-referrer",
                      draggable: false,
                      onContextMenu: (e) => e.preventDefault(),
                      onError: () => setImgError(true),
                      className: "w-full h-full object-cover object-center p-0 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] pointer-events-none select-none"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      "aria-hidden": "true",
                      className: "pointer-events-none absolute inset-y-0 right-0 w-4 z-[5] bg-gradient-to-r from-transparent to-white"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#FAF8F5] to-[#F3EDE2]", children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-6 h-6 text-[#5E1734] mb-1.5 opacity-80" }),
                  /* @__PURE__ */ jsx("span", { className: "font-editorial text-xs font-bold text-[#1A1617] line-clamp-2", children: product.name }),
                  isAdminMode && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      },
                      className: "mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5E1734] text-white text-[10px] font-bold shadow-sm cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(ImagePlus, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631\u0629" })
                      ]
                    }
                  )
                ] }),
                isAdminMode && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: (e) => e.stopPropagation(),
                    className: "absolute top-1.5 left-1.5 right-1.5 z-10 flex flex-wrap items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => fileInputRef.current?.click(),
                          className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/92 backdrop-blur-sm text-[#1A1617] border border-[#C6A355]/45 text-[10px] font-bold shadow-sm hover:bg-[#FAF8F5] cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(ImagePlus, { className: "w-3 h-3 text-[#5E1734]" }),
                            /* @__PURE__ */ jsx("span", { children: hasValidImage ? "\u062A\u063A\u064A\u064A\u0631" : "\u0625\u0636\u0627\u0641\u0629" })
                          ]
                        }
                      ),
                      hasValidImage && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: onRemoveImage,
                          "aria-label": "\u062D\u0630\u0641 \u0627\u0644\u0635\u0648\u0631\u0629",
                          title: "\u062D\u0630\u0641 \u0627\u0644\u0635\u0648\u0631\u0629",
                          className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white/92 backdrop-blur-sm text-[#9F580A] border border-[#F5D69E] text-[10px] font-bold shadow-sm hover:bg-[#FFF8EB] cursor-pointer",
                          children: /* @__PURE__ */ jsx(ImageOff, { className: "w-3 h-3" })
                        }
                      )
                    ]
                  }
                ),
                hasValidImage && onZoomImage && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      onZoomImage();
                    },
                    "aria-label": `\u062A\u0643\u0628\u064A\u0631 \u0635\u0648\u0631\u0629 ${product.name}`,
                    title: "\u062A\u0643\u0628\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                    className: "absolute bottom-2 left-2 z-10 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/92 backdrop-blur-sm border border-[#C6A355]/45 text-[#5E1734] hover:bg-white shadow-sm cursor-pointer transition-transform active:scale-95",
                    children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "article",
    {
      role: "button",
      tabIndex: 0,
      onClick: onSelect,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      },
      className: `group bg-white border rounded-2xl overflow-hidden p-0 shadow-sm flex flex-col cursor-pointer touch-manipulation transition-all duration-150 ease-out active:scale-[0.98] hover:shadow-md ${isCategoryPaused ? "border-[#FECDD3] hover:border-[#BE123C]/50" : "border-[#C6A355]/20 hover:border-[#C6A355]/60"}`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onContextMenu: (e) => e.preventDefault(),
            style: { backgroundColor: imageBgColor || "#FFFFFF" },
            className: "relative h-72 sm:h-80 w-full overflow-hidden p-0 border-0 flex items-center justify-center protected-media select-none transition-colors duration-300",
            children: [
              hasValidImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: product.imageUrl,
                    alt: product.name,
                    referrerPolicy: "no-referrer",
                    draggable: false,
                    onContextMenu: (e) => e.preventDefault(),
                    onError: () => setImgError(true),
                    className: "w-full h-full object-cover object-center p-0 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] pointer-events-none select-none"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-x-0 bottom-0 h-4 z-[5] bg-gradient-to-b from-transparent to-white"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-[#FAF8F5] to-[#F3EDE2]", children: [
                /* @__PURE__ */ jsx(ShoppingBag, { className: "w-7 h-7 text-[#5E1734] mb-2 opacity-80" }),
                /* @__PURE__ */ jsx("span", { className: "font-editorial text-sm font-bold text-[#1A1617]", children: product.name }),
                isAdminMode && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    },
                    className: "mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5E1734] text-white text-xs font-bold shadow-sm cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631\u0629" })
                    ]
                  }
                )
              ] }),
              isAdminMode && /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: (e) => e.stopPropagation(),
                  className: "pointer-events-none absolute top-2 left-2 right-2 flex items-start justify-between gap-1 z-10",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: handleImageChange
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex flex-wrap items-center gap-1", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => fileInputRef.current?.click(),
                          className: "inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-white/92 backdrop-blur-sm text-[#1A1617] border border-[#C6A355]/45 text-[10px] sm:text-[11px] font-bold shadow-sm hover:bg-[#FAF8F5] cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(ImagePlus, { className: "w-3 h-3 text-[#5E1734]" }),
                            /* @__PURE__ */ jsx("span", { children: hasValidImage ? "\u062A\u063A\u064A\u064A\u0631" : "\u0625\u0636\u0627\u0641\u0629" })
                          ]
                        }
                      ),
                      hasValidImage && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: onRemoveImage,
                          className: "inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-white/92 backdrop-blur-sm text-[#9F580A] border border-[#F5D69E] text-[10px] sm:text-[11px] font-bold shadow-sm hover:bg-[#FFF8EB] cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(ImageOff, { className: "w-3 h-3" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641 \u0627\u0644\u0635\u0648\u0631\u0629" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex flex-wrap items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: onEdit,
                          className: "inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-white/92 backdrop-blur-sm text-[#1A1617] border border-[#C6A355]/45 text-[10px] sm:text-[11px] font-bold shadow-sm hover:bg-[#FAF8F5] cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(Pencil, { className: "w-3 h-3 text-[#5E1734]" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062A\u0639\u062F\u064A\u0644" })
                          ]
                        }
                      ),
                      confirmingDelete ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/95 backdrop-blur-sm border border-[#FECDD3] shadow-sm", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleConfirmDelete,
                            className: "px-1.5 py-0.5 rounded bg-[#BE123C] text-white text-[10px] sm:text-[11px] font-bold hover:bg-[#9F1239] cursor-pointer",
                            children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0630\u0641"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleCancelDelete,
                            className: "px-1.5 py-0.5 rounded bg-[#FAF8F5] text-[#65525A] border border-[#C6A355]/30 text-[10px] sm:text-[11px] font-bold cursor-pointer",
                            children: "\u0625\u0644\u063A\u0627\u0621"
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          "aria-label": `\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 ${product.name}`,
                          onClick: handleStartDelete,
                          className: "inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-[#BE123C]/95 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold shadow-sm hover:bg-[#9F1239] cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }),
                            /* @__PURE__ */ jsx("span", { children: "\u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639" })
                          ]
                        }
                      )
                    ] })
                  ]
                }
              ),
              storewideDiscountPercent > 0 && !isAdminMode && /* @__PURE__ */ jsxs("div", { className: "absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#5E1734] text-white text-[10px] sm:text-[11px] font-extrabold shadow-sm", children: [
                "-",
                storewideDiscountPercent,
                "%"
              ] }),
              isCategoryPaused && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5E1734] text-white text-[10px] sm:text-[11px] font-bold shadow-md border border-[#C6A355]/40", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: pauseBadge })
              ] }),
              hasValidImage && onZoomImage && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    onZoomImage();
                  },
                  "aria-label": `\u062A\u0643\u0628\u064A\u0631 \u0635\u0648\u0631\u0629 ${product.name}`,
                  title: "\u062A\u0643\u0628\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                  className: "absolute bottom-2.5 left-2.5 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/92 backdrop-blur-sm border border-[#C6A355]/45 text-[#5E1734] hover:bg-white shadow-sm cursor-pointer transition-transform active:scale-95",
                  children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-4 text-center flex-1 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.name`,
                defaultText: product.name,
                valueOverride: product.name,
                as: "h3",
                compact: true,
                className: "font-editorial text-lg font-bold text-[#1A1617] leading-snug"
              }
            ),
            editingPrice && isAdminMode && onUpdatePrice ? /* @__PURE__ */ jsxs(
              "form",
              {
                onClick: (e) => e.stopPropagation(),
                onSubmit: handleSubmitPrice,
                className: "mt-1.5 inline-flex flex-wrap items-center justify-center gap-1 px-2 py-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/60 shadow-2xs",
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
                      className: "px-2 py-0.5 rounded-lg bg-[#147A53] hover:bg-[#0F5E40] disabled:opacity-60 text-white text-[10px] font-bold cursor-pointer",
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
            ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 mt-1 tabular-nums", children: [
              storewideDiscountPercent > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm font-extrabold text-[#5E1734]", children: [
                  "\u0645\u0646 ",
                  discountedBasePrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#8C7780] line-through", children: [
                  product.basePrice.toLocaleString("en-US"),
                  " \u062F\u062C"
                ] })
              ] }) : /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-extrabold text-[#5E1734]", children: [
                "\u0645\u0646 ",
                product.basePrice.toLocaleString("en-US"),
                " \u062F\u062C"
              ] }),
              isAdminMode && onUpdatePrice && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setPriceDraft(String(product.basePrice));
                    setEditingPrice(true);
                  },
                  title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631",
                  "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0631 ${product.name}`,
                  className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/55 text-xs cursor-pointer shadow-2xs",
                  children: "\u270F\uFE0F"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex justify-center", children: /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.branch`,
                defaultText: product.branch,
                valueOverride: product.branch,
                as: "span",
                compact: true,
                className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-[11px] font-bold text-[#5E1734]"
              }
            ) }),
            product.category === "robe" && /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: `product.${product.id}.desc`,
                defaultText: product.description,
                valueOverride: product.description,
                as: "p",
                multiline: true,
                compact: true,
                className: "text-[11px] text-[#65525A] leading-relaxed mt-1.5 line-clamp-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 pt-2.5 border-t border-[#C6A355]/25", children: /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-1 text-xs font-bold group-hover:underline ${isCategoryPaused ? "text-[#9F1239]" : "text-[#5E1734]"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: isCategoryPaused ? `\u062A\u0635\u0641\u062D \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \xB7 ${pauseBadge}` : product.category === "robe" ? "\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0644\u0648\u0646 \u0648\u0627\u0644\u0645\u0642\u0627\u0633" : product.category === "accessories" ? "\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0628\u0627\u0642\u0629" : "\u062A\u062E\u0635\u064A\u0635 \u0648\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0644\u0648\u0646" }),
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-3.5 h-3.5" })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function ProductCatalog({
  products,
  isAdminMode,
  requestedSection,
  pausedCategories,
  categoryPauseBadge = "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B",
  storewideDiscountPercent = 0,
  stoleColors = DEFAULT_STOLE_COLORS,
  crystalRoyalColors,
  onUpdateCrystalRoyalColors,
  gownColors = DEFAULT_GOWN_COLORS,
  threadColors = THREAD_COLORS,
  capColors = CAP_SWATCHES,
  categoryBranches,
  categoryImageBgColors,
  categoryCoverImages,
  americanShawlFrontImage,
  americanShawlBackImage,
  regularShawlBaseImage,
  onUpdateCategoryImageBgColor,
  onReplaceCategoryCoverImage,
  onReplaceAmericanShawlImage,
  onReplaceRegularShawlBaseImage,
  onUpdateCategoryBranches,
  onAddToCart,
  onNotify,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateProductPrice,
  onUpdateProductDescription,
  onToggleAutoColorize,
  capOptionPrices,
  onUpdateCapOptionPrice,
  customModelBasePrice,
  onUpdateCustomModelPrice,
  overriddenOptionProductIds,
  onQuickAddRobe,
  onReplaceProductImage,
  onRemoveProductImage,
  onSetProductColorImage,
  onUpdateProductOptions,
  onUpdateSecondaryOptions,
  onToggleProductField,
  onExpressCheckout,
  whatsappNumber = WHATSAPP_NUMBER
}) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [customModelOpen, setCustomModelOpen] = useState(false);
  const [initialSharedDesign, setInitialSharedDesign] = useState(null);
  const [activeBranch, setActiveBranch] = useState("\u0627\u0644\u0643\u0644");
  const [cardLightbox, setCardLightbox] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchDraft, setBranchDraft] = useState("");
  const [addingBranchOpen, setAddingBranchOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [uploadingCategoryCover, setUploadingCategoryCover] = useState(null);
  const getCategoryImageBg = (category) => categoryImageBgColors?.[category] || "#FAF8F5";
  const catalogSectionRef = useRef(null);
  const selectedSectionRef = useRef(selectedSection);
  const selectedProductIdRef = useRef(selectedProductId);
  const customModelOpenRef = useRef(customModelOpen);
  const lastRequestedNonceRef = useRef(null);
  const didHydrateUrlRef = useRef(false);
  useEffect(() => {
    selectedSectionRef.current = selectedSection;
    selectedProductIdRef.current = selectedProductId;
    customModelOpenRef.current = customModelOpen;
  }, [selectedSection, selectedProductId, customModelOpen]);
  useEffect(() => {
    if (didHydrateUrlRef.current || products.length === 0 || typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const sharedProductId = params.get("p");
    if (!sharedProductId) {
      didHydrateUrlRef.current = true;
      return;
    }
    const matched = products.find((p) => p.id === sharedProductId);
    didHydrateUrlRef.current = true;
    if (!matched) return;
    const optParam = params.get("opt");
    const parsedOpt = optParam !== null ? Number.parseInt(optParam, 10) : void 0;
    const capPos = params.get("cpos");
    const validCapPos = capPos === "\u0633\u0637\u062D \u0627\u0644\u0642\u0628\u0639\u0629" || capPos === "\u062C\u0628\u0647\u0629 \u0627\u0644\u0642\u0628\u0639\u0629" || capPos === "\u0628\u062F\u0648\u0646 \u062A\u0637\u0631\u064A\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u0628\u0639\u0629" ? capPos : void 0;
    setInitialSharedDesign({
      productId: matched.id,
      optIdx: Number.isFinite(parsedOpt) ? parsedOpt : void 0,
      colorName: params.get("col") || void 0,
      customColorText: params.get("ct") || void 0,
      threadName: params.get("thr") || void 0,
      embroideredText: params.get("txt") || void 0,
      rightEmbroideredText: params.get("sr") || void 0,
      leftEmbroideredText: params.get("sl") || void 0,
      secondary: params.get("sec") || void 0,
      capStyleId: params.get("cap") || void 0,
      capSameColor: params.get("csame") === "1" ? true : params.get("csame") === "0" ? false : void 0,
      capColorName: params.get("ccol") || void 0,
      capEmbroideryPos: validCapPos
    });
    setSelectedSection(matched.category);
    setSelectedProductId(matched.id);
    setActiveBranch("\u0627\u0644\u0643\u0644");
    scrollToCatalogTop();
  }, [products]);
  const openCardLightbox = (payload) => {
    const current = window.history.state || {};
    if (!current.catalogLightbox) {
      window.history.pushState(
        {
          ...current,
          dgBase: true,
          catalogLightbox: true,
          catalogDepth: Number(current.catalogDepth || 0) + 1
        },
        ""
      );
    }
    setCardLightbox(payload);
  };
  const closeCardLightbox = () => {
    if (window.history.state?.catalogLightbox) {
      window.history.back();
      return;
    }
    setCardLightbox(null);
  };
  useEffect(() => {
    if (!cardLightbox) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCardLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cardLightbox]);
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state || {};
      if (!state.catalogLightbox) {
        setCardLightbox(null);
      }
      let nextSection = null;
      let nextProductId = null;
      let nextCustomModel = false;
      if (state.catalogLevel === "custom-model") {
        nextSection = state.section || null;
        nextProductId = null;
        nextCustomModel = true;
      } else if (state.catalogLevel === "product") {
        nextSection = state.section || null;
        nextProductId = state.productId || null;
      } else if (state.catalogLevel === "section") {
        nextSection = state.section || null;
        nextProductId = null;
      }
      const sectionChanged = nextSection !== selectedSectionRef.current;
      const productChanged = nextProductId !== selectedProductIdRef.current;
      const customModelChanged = nextCustomModel !== customModelOpenRef.current;
      if (sectionChanged || productChanged || customModelChanged) {
        selectedSectionRef.current = nextSection;
        selectedProductIdRef.current = nextProductId;
        customModelOpenRef.current = nextCustomModel;
        setSelectedSection(nextSection);
        setSelectedProductId(nextProductId);
        setCustomModelOpen(nextCustomModel);
        if (sectionChanged) {
          setActiveBranch("\u0627\u0644\u0643\u0644");
        }
        scrollToCatalogTop(catalogSectionRef.current);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const handleOpenSection = (cat) => {
    setEditingBranch(null);
    setAddingBranchOpen(false);
    setCardLightbox(null);
    setCustomModelOpen(false);
    customModelOpenRef.current = false;
    if (selectedSectionRef.current === cat && !selectedProductIdRef.current) {
      scrollToCatalogTop(catalogSectionRef.current);
      return;
    }
    const baseState = { ...window.history.state || {} };
    delete baseState.appModal;
    delete baseState.catalogLightbox;
    delete baseState.productLightbox;
    const nextDepth = Number(baseState.catalogDepth || 0) + 1;
    window.history.pushState(
      {
        ...baseState,
        dgBase: true,
        catalogLevel: "section",
        section: cat,
        productId: null,
        fromSection: false,
        catalogDepth: nextDepth
      },
      ""
    );
    selectedSectionRef.current = cat;
    selectedProductIdRef.current = null;
    setSelectedSection(cat);
    setSelectedProductId(null);
    setActiveBranch("\u0627\u0644\u0643\u0644");
    scrollToCatalogTop(catalogSectionRef.current);
  };
  useEffect(() => {
    if (!requestedSection || requestedSection.nonce === lastRequestedNonceRef.current) {
      return;
    }
    lastRequestedNonceRef.current = requestedSection.nonce;
    handleOpenSection(requestedSection.category);
  }, [requestedSection]);
  const handleOpenProduct = (productId) => {
    const baseState = { ...window.history.state || {} };
    delete baseState.appModal;
    delete baseState.catalogLightbox;
    delete baseState.productLightbox;
    const nextDepth = Number(baseState.catalogDepth || 0) + 1;
    window.history.pushState(
      {
        ...baseState,
        dgBase: true,
        catalogLevel: "product",
        section: selectedSectionRef.current,
        productId,
        fromSection: Boolean(selectedSectionRef.current),
        catalogDepth: nextDepth
      },
      ""
    );
    customModelOpenRef.current = false;
    selectedProductIdRef.current = productId;
    setCustomModelOpen(false);
    setSelectedProductId(productId);
    scrollToCatalogTop(catalogSectionRef.current);
  };
  const handleOpenCustomModel = () => {
    const baseState = { ...window.history.state || {} };
    delete baseState.appModal;
    delete baseState.catalogLightbox;
    delete baseState.productLightbox;
    const nextDepth = Number(baseState.catalogDepth || 0) + 1;
    window.history.pushState(
      {
        ...baseState,
        dgBase: true,
        catalogLevel: "custom-model",
        section: selectedSectionRef.current,
        productId: null,
        fromSection: Boolean(selectedSectionRef.current),
        catalogDepth: nextDepth
      },
      ""
    );
    selectedProductIdRef.current = null;
    customModelOpenRef.current = true;
    setSelectedProductId(null);
    setCustomModelOpen(true);
    scrollToCatalogTop(catalogSectionRef.current);
  };
  const handleCloseCustomModel = () => {
    const state = window.history.state;
    if (state?.catalogLevel === "custom-model") {
      window.history.back();
      return;
    }
    customModelOpenRef.current = false;
    setCustomModelOpen(false);
    scrollToCatalogTop(catalogSectionRef.current);
  };
  const handleBackToHome = () => {
    setEditingBranch(null);
    setAddingBranchOpen(false);
    setCardLightbox(null);
    const state = window.history.state;
    const depth = Number(state?.catalogDepth || 0);
    selectedSectionRef.current = null;
    selectedProductIdRef.current = null;
    customModelOpenRef.current = false;
    setSelectedSection(null);
    setSelectedProductId(null);
    setCustomModelOpen(false);
    setActiveBranch("\u0627\u0644\u0643\u0644");
    scrollToCatalogTop(catalogSectionRef.current);
    if (depth > 0) {
      window.history.go(-depth);
    } else if (state?.catalogLevel === "section" || state?.catalogLevel === "product" || state?.catalogLevel === "custom-model") {
      window.history.back();
    }
  };
  const handleBackToSection = () => {
    const state = window.history.state;
    if (state?.catalogLevel === "product" && state?.fromSection) {
      window.history.back();
      return;
    }
    selectedProductIdRef.current = null;
    setSelectedProductId(null);
    scrollToCatalogTop(catalogSectionRef.current);
  };
  const activeSectionMeta = selectedSection ? MAIN_SECTIONS.find((s) => s.id === selectedSection) || EXTRA_SECTION_META[selectedSection] : null;
  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;
  const sectionProducts = products.filter((p) => {
    if (!selectedSection) return false;
    return p.category === selectedSection;
  });
  const defaultBranchesForSection = selectedSection && CATEGORY_BRANCHES[selectedSection] ? CATEGORY_BRANCHES[selectedSection] : ["\u0627\u0644\u0643\u0644"];
  const customBranchesForSection = selectedSection && categoryBranches?.[selectedSection]?.length ? categoryBranches[selectedSection] : null;
  const branches = useMemo(() => {
    const base = customBranchesForSection || defaultBranchesForSection;
    if (selectedSection === "shawl" && sectionProducts.some((p) => p.branch === "\u0634\u0627\u0644 \u0645\u0644\u0643\u064A \u0645\u0631\u0635\u0639 \u0628\u0627\u0644\u0643\u0631\u064A\u0633\u062A\u0627\u0644") && !base.includes("\u0634\u0627\u0644 \u0645\u0644\u0643\u064A \u0645\u0631\u0635\u0639 \u0628\u0627\u0644\u0643\u0631\u064A\u0633\u062A\u0627\u0644")) {
      const next = [...base];
      const backIdx = next.indexOf("\u0634\u0627\u0644 \u0628\u0627\u0644\u0638\u0647\u0631");
      if (backIdx >= 0) {
        next.splice(backIdx + 1, 0, "\u0634\u0627\u0644 \u0645\u0644\u0643\u064A \u0645\u0631\u0635\u0639 \u0628\u0627\u0644\u0643\u0631\u064A\u0633\u062A\u0627\u0644");
      } else {
        next.push("\u0634\u0627\u0644 \u0645\u0644\u0643\u064A \u0645\u0631\u0635\u0639 \u0628\u0627\u0644\u0643\u0631\u064A\u0633\u062A\u0627\u0644");
      }
      return next;
    }
    return base;
  }, [customBranchesForSection, defaultBranchesForSection, selectedSection, sectionProducts]);
  const filteredProducts = sectionProducts.filter((p) => {
    if (activeBranch !== "\u0627\u0644\u0643\u0644" && p.branch !== activeBranch) return false;
    return true;
  });
  const resolvedPauseBadge = (categoryPauseBadge || "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B").trim() || "\u064A\u062A\u0648\u0641\u0631 \u0642\u0631\u064A\u0628\u0627\u064B";
  const isCategoryPaused = (cat) => Boolean(pausedCategories?.[cat]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "section",
      {
        id: "catalog-sec",
        ref: catalogSectionRef,
        className: "py-12 sm:py-16 border-b border-[#C6A355]/25 scroll-mt-20",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "max-w-5xl mx-auto px-4 sm:px-6 catalog-enter",
            children: customModelOpen ? /* @__PURE__ */ jsx(
              CustomModelRequestView,
              {
                stoleColors,
                whatsappNumber,
                isAdminMode,
                estimatePrice: customModelBasePrice,
                onUpdateEstimatePrice: onUpdateCustomModelPrice,
                onBack: handleCloseCustomModel,
                onAddToCart,
                onExpressCheckout,
                onNotify
              }
            ) : selectedProduct && activeSectionMeta ? /* @__PURE__ */ jsx(
              ProductDetailView,
              {
                product: selectedProduct,
                hasSavedOptionsOverride: Boolean(
                  overriddenOptionProductIds?.includes(selectedProduct.id)
                ),
                sectionTitle: activeSectionMeta.title,
                isCategoryPaused: isCategoryPaused(selectedProduct.category),
                categoryPauseBadge: resolvedPauseBadge,
                storewideDiscountPercent,
                imageBgColor: getCategoryImageBg(selectedProduct.category),
                americanShawlFrontImage,
                americanShawlBackImage,
                regularShawlBaseImage,
                initialDesign: initialSharedDesign,
                stoleColors,
                crystalRoyalColors,
                onUpdateCrystalRoyalColors,
                gownColors,
                threadColors,
                capColors,
                onBackToHome: handleBackToHome,
                onBackToSection: handleBackToSection,
                onAddToCart,
                onNotify,
                isAdminMode,
                onSetColorImage: (colorName, file) => onSetProductColorImage?.(selectedProduct.id, colorName, file),
                onUpdateProductOptions: (nextOptions) => onUpdateProductOptions?.(selectedProduct.id, nextOptions),
                onUpdateSecondaryOptions: (nextOptions, nextPrices) => onUpdateSecondaryOptions?.(selectedProduct.id, nextOptions, nextPrices),
                onToggleField: (field) => onToggleProductField?.(selectedProduct.id, field),
                onEdit: () => onEditProduct(selectedProduct),
                onDelete: () => {
                  onDeleteProduct(selectedProduct.id);
                  handleBackToHome();
                },
                onUpdatePrice: (nextPrice, optionIdx) => onUpdateProductPrice?.(selectedProduct.id, nextPrice, optionIdx),
                onUpdateDescription: (nextDesc) => onUpdateProductDescription?.(selectedProduct.id, nextDesc),
                onToggleAutoColorize: () => onToggleAutoColorize?.(selectedProduct.id),
                capOptionPrices,
                onUpdateCapOptionPrice,
                onReplaceImage: (file) => onReplaceProductImage(selectedProduct.id, file),
                onReplaceAmericanShawlImage,
                onReplaceRegularShawlBaseImage,
                onExpressCheckout,
                whatsappNumber
              },
              selectedProduct.id
            ) : selectedSection && activeSectionMeta ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-[#65525A]", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleBackToHome,
                      className: "hover:text-[#5E1734] underline touch-manipulation transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer",
                      children: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
                    }
                  ),
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "w-3.5 h-3.5 text-[#5E1734]/60" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[#1A1617]", children: activeSectionMeta.title })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleBackToHome,
                      className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white border border-[#C6A355]/40 text-xs font-bold text-[#1A1617] hover:bg-[#FAF8F5] transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0643\u0644 \u0627\u0644\u0623\u0642\u0633\u0627\u0645" })
                      ]
                    }
                  ),
                  isAdminMode && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => onOpenAddProduct(selectedSection),
                      className: "inline-flex items-center gap-1 px-3.5 py-1.5 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0642\u0637\u0639\u0629 \u0644\u0644\u0642\u0633\u0645" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  role: "tablist",
                  "aria-label": "\u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0644\u0644\u0623\u0642\u0633\u0627\u0645",
                  className: "flex flex-wrap items-center gap-2 mb-5",
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        role: "tab",
                        "aria-selected": false,
                        onClick: handleBackToHome,
                        className: "px-4 py-1.5 rounded-full bg-white border border-[#C6A355]/35 text-xs font-bold text-[#65525A] hover:text-[#1A1617] hover:border-[#5E1734]/40 transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                        children: "\u0627\u0644\u0643\u0644"
                      }
                    ),
                    MAIN_SECTIONS.map((catMeta) => {
                      const isActiveCat = selectedSection === catMeta.id;
                      return /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          "aria-selected": isActiveCat,
                          "data-category-id": catMeta.id,
                          onClick: () => handleOpenSection(catMeta.id),
                          className: `px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer ${isActiveCat ? "bg-[#5E1734] text-white border border-[#5E1734] shadow-xs" : "bg-white border border-[#C6A355]/35 text-[#1A1617] hover:border-[#5E1734]/50 hover:bg-[#FAF8F5]"}`,
                          children: catMeta.title
                        },
                        catMeta.id
                      );
                    })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `catalog.cat.${activeSectionMeta.id}.title`,
                    defaultText: activeSectionMeta.title,
                    as: "h2",
                    className: "font-editorial text-3xl sm:text-4xl font-bold text-[#1A1617]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `catalog.cat.${activeSectionMeta.id}.subtitle`,
                    defaultText: activeSectionMeta.subtitle,
                    as: "p",
                    multiline: true,
                    className: "text-sm text-[#65525A] mt-1.5 max-w-xl"
                  }
                )
              ] }),
              (branches.length > 1 || isAdminMode) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mb-6 pb-3 border-b border-[#C6A355]/25", children: [
                branches.map((branch) => {
                  const active = activeBranch === branch;
                  const isAllTag = branch === "\u0627\u0644\u0643\u0644";
                  if (isAdminMode && editingBranch === branch) {
                    return /* @__PURE__ */ jsxs(
                      "form",
                      {
                        onSubmit: (e) => {
                          e.preventDefault();
                          const trimmed = branchDraft.trim();
                          if (!trimmed || !selectedSection || !onUpdateCategoryBranches) {
                            setEditingBranch(null);
                            return;
                          }
                          if (trimmed !== branch) {
                            const nextList = branches.map(
                              (b) => b === branch ? trimmed : b
                            );
                            onUpdateCategoryBranches(selectedSection, nextList, {
                              from: branch,
                              to: trimmed
                            });
                            if (activeBranch === branch) {
                              setActiveBranch(trimmed);
                            }
                          }
                          setEditingBranch(null);
                        },
                        className: "inline-flex items-center gap-1 bg-white border-2 border-[#C6A355] rounded-full px-2 py-0.5 shadow-sm",
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              autoFocus: true,
                              value: branchDraft,
                              onChange: (e) => setBranchDraft(e.target.value),
                              className: "w-28 px-2 py-0.5 text-xs font-bold text-[#1A1617] bg-[#FAF8F5] rounded-full focus:outline-none"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "submit",
                              title: "\u062D\u0641\u0638",
                              className: "w-5 h-5 rounded-full bg-[#147A53] text-white inline-flex items-center justify-center cursor-pointer",
                              children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setEditingBranch(null),
                              title: "\u0625\u0644\u063A\u0627\u0621",
                              className: "w-5 h-5 rounded-full bg-[#FAF8F5] text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                            }
                          )
                        ]
                      },
                      branch
                    );
                  }
                  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setActiveBranch(branch),
                        className: `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer ${active ? "bg-[#5E1734] text-white" : "bg-white border border-[#C6A355]/35 text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5]"}`,
                        children: branch
                      }
                    ),
                    isAdminMode && !isAllTag && onUpdateCategoryBranches && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-0.5", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setEditingBranch(branch);
                            setBranchDraft(branch);
                          },
                          title: `\u062A\u0639\u062F\u064A\u0644 \u062A\u0635\u0646\u064A\u0641 ${branch}`,
                          "aria-label": `\u062A\u0639\u062F\u064A\u0644 \u062A\u0635\u0646\u064A\u0641 ${branch}`,
                          className: "w-6 h-6 rounded-full bg-white border border-[#C6A355]/50 text-[#5E1734] hover:bg-[#FAF8F5] inline-flex items-center justify-center cursor-pointer shadow-2xs",
                          children: /* @__PURE__ */ jsx(Pencil, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            if (!selectedSection) return;
                            const nextList = branches.filter((b) => b !== branch);
                            onUpdateCategoryBranches(selectedSection, nextList);
                            if (activeBranch === branch) {
                              setActiveBranch("\u0627\u0644\u0643\u0644");
                            }
                          },
                          title: `\u062D\u0630\u0641 \u062A\u0635\u0646\u064A\u0641 ${branch}`,
                          "aria-label": `\u062D\u0630\u0641 \u062A\u0635\u0646\u064A\u0641 ${branch}`,
                          className: "w-6 h-6 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] hover:bg-[#FFE4E6] inline-flex items-center justify-center cursor-pointer shadow-2xs",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ] }, branch);
                }),
                isAdminMode && selectedSection && onUpdateCategoryBranches && /* @__PURE__ */ jsxs(Fragment, { children: [
                  addingBranchOpen ? /* @__PURE__ */ jsxs(
                    "form",
                    {
                      onSubmit: (e) => {
                        e.preventDefault();
                        const clean = newBranchName.trim();
                        if (!clean) {
                          setAddingBranchOpen(false);
                          return;
                        }
                        if (!branches.includes(clean)) {
                          onUpdateCategoryBranches(selectedSection, [
                            ...branches,
                            clean
                          ]);
                        }
                        setNewBranchName("");
                        setAddingBranchOpen(false);
                      },
                      className: "inline-flex items-center gap-1 bg-white border-2 border-[#C6A355] rounded-full px-2 py-0.5 shadow-sm",
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            autoFocus: true,
                            value: newBranchName,
                            onChange: (e) => setNewBranchName(e.target.value),
                            placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u062C\u062F\u064A\u062F...",
                            className: "w-32 px-2 py-0.5 text-xs font-bold text-[#1A1617] bg-[#FAF8F5] rounded-full focus:outline-none"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "submit",
                            className: "px-2 py-0.5 rounded-full bg-[#5E1734] text-white text-[11px] font-bold cursor-pointer",
                            children: "\u0625\u0636\u0627\u0641\u0629"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              setAddingBranchOpen(false);
                              setNewBranchName("");
                            },
                            className: "w-5 h-5 rounded-full bg-[#FAF8F5] text-[#65525A] inline-flex items-center justify-center cursor-pointer",
                            children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                          }
                        )
                      ]
                    }
                  ) : /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAddingBranchOpen(true),
                      className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-dashed border-[#C6A355] text-xs font-bold text-[#5E1734] cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641" })
                      ]
                    }
                  ),
                  customBranchesForSection && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        onUpdateCategoryBranches(
                          selectedSection,
                          defaultBranchesForSection
                        );
                        setActiveBranch("\u0627\u0644\u0643\u0644");
                      },
                      title: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629",
                      className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-[#C6A355]/40 text-[11px] font-bold text-[#65525A] hover:text-[#5E1734] cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629" })
                      ]
                    }
                  )
                ] })
              ] }),
              isAdminMode && selectedSection === "robe" && onQuickAddRobe && /* @__PURE__ */ jsx("div", { className: "mb-5 flex flex-wrap items-center justify-start", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveBranch("\u0627\u0644\u0643\u0644");
                    onQuickAddRobe();
                  },
                  className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-extrabold shadow-md border border-[#C6A355]/45 transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                  children: /* @__PURE__ */ jsx("span", { children: "+ \u0625\u0636\u0627\u0641\u0629 \u0646\u0648\u0639 \u0631\u0648\u0628 \u062C\u062F\u064A\u062F" })
                }
              ) }),
              isCategoryPaused(selectedSection) && /* @__PURE__ */ jsxs(
                "div",
                {
                  role: "status",
                  className: "mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#FFF1F3] border border-[#FECDD3] text-xs sm:text-sm font-bold text-[#9F1239]",
                  children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 shrink-0 text-[#BE123C]" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u062D\u0627\u0644\u064A\u0627\u064B \u2014 ",
                      resolvedPauseBadge
                    ] })
                  ]
                }
              ),
              filteredProducts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#C6A355]/35 rounded-2xl p-10 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#65525A]", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0637\u0639 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u062D\u0627\u0644\u064A\u0627\u064B." }) }) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: selectedSection === "shawl" ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5" : "grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6",
                  children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
                    SectionCard,
                    {
                      product,
                      isAdminMode,
                      isCategoryPaused: isCategoryPaused(product.category),
                      pauseBadge: resolvedPauseBadge,
                      storewideDiscountPercent,
                      imageBgColor: getCategoryImageBg(product.category),
                      layout: selectedSection === "shawl" ? "horizontal" : "vertical",
                      onSelect: () => handleOpenProduct(product.id),
                      onZoomImage: product.imageUrl ? () => openCardLightbox({
                        url: product.imageUrl,
                        title: product.name,
                        bgColor: getCategoryImageBg(product.category)
                      }) : void 0,
                      onEdit: () => onEditProduct(product),
                      onDelete: () => onDeleteProduct(product.id),
                      onUpdatePrice: (nextPrice) => onUpdateProductPrice?.(product.id, nextPrice),
                      onReplaceImage: (file) => onReplaceProductImage(product.id, file),
                      onRemoveImage: () => onRemoveProductImage?.(product.id)
                    },
                    product.id
                  ))
                }
              ),
              isAdminMode && selectedSection === "robe" && onQuickAddRobe && /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveBranch("\u0627\u0644\u0643\u0644");
                    onQuickAddRobe();
                  },
                  className: "inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-extrabold shadow-md border border-[#C6A355]/45 transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                  children: /* @__PURE__ */ jsx("span", { children: "+ \u0625\u0636\u0627\u0641\u0629 \u0646\u0648\u0639 \u0631\u0648\u0628 \u062C\u062F\u064A\u062F" })
                }
              ) }),
              selectedSection === "shawl" && /* @__PURE__ */ jsx("div", { className: "mt-4 sm:mt-5", children: /* @__PURE__ */ jsx(
                CustomModelRequestCard,
                {
                  onOpen: handleOpenCustomModel,
                  isAdminMode,
                  estimatePrice: customModelBasePrice,
                  onUpdateEstimatePrice: onUpdateCustomModelPrice
                }
              ) })
            ] }) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center gap-3 mb-6", children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "catalog.eyebrow",
                    defaultText: "\u062A\u0633\u0648\u0642 \u062D\u0633\u0628 \u0627\u0644\u0641\u0626\u0629",
                    as: "p",
                    compact: true,
                    className: "text-xs sm:text-sm font-bold text-[#5E1734]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "catalog.title",
                    defaultText: "\u0643\u0644 \u0645\u0627 \u062A\u062D\u062A\u0627\u062C\u0647 \u0644\u064A\u0648\u0645 \u062A\u062E\u0631\u062C\u0643",
                    as: "h2",
                    className: "font-editorial text-2xl sm:text-4xl font-bold text-[#1A1617]"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-12 h-0.5 rounded-full bg-[#C6A355]/60", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    role: "tablist",
                    "aria-label": "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0633\u0631\u064A\u0639\u0629",
                    className: "mt-2 flex flex-wrap items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          "aria-selected": true,
                          onClick: handleBackToHome,
                          className: "px-4 py-1.5 rounded-full bg-[#5E1734] text-white border border-[#5E1734] text-xs font-bold shadow-xs transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                          children: "\u0627\u0644\u0643\u0644"
                        }
                      ),
                      MAIN_SECTIONS.map((catMeta) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          "aria-selected": false,
                          "data-category-id": catMeta.id,
                          onClick: () => handleOpenSection(catMeta.id),
                          className: "px-4 py-1.5 rounded-full bg-white border border-[#C6A355]/40 text-xs font-bold text-[#1A1617] hover:border-[#5E1734]/60 hover:bg-[#FAF8F5] transition-all duration-150 ease-out touch-manipulation active:scale-[0.98] cursor-pointer",
                          children: catMeta.title
                        },
                        catMeta.id
                      ))
                    ]
                  }
                ),
                isAdminMode && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => onOpenAddProduct("shawl"),
                    className: "mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-all touch-manipulation active:scale-95 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u062F\u064A\u0644 \u062C\u062F\u064A\u062F" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5", children: MAIN_SECTIONS.map((sec) => {
                const firstProdWithImg = products.find(
                  (p) => p.category === sec.id && p.imageUrl
                );
                const coverImg = categoryCoverImages?.[sec.id] || firstProdWithImg?.imageUrl || sec.fallbackImg;
                const bgColor = getCategoryImageBg(sec.id);
                const paused = isCategoryPaused(sec.id);
                const isCustomBg = !CATEGORY_IMAGE_BG_PRESETS.some(
                  (preset) => preset.hex.toUpperCase() === bgColor.toUpperCase()
                );
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-category-id": sec.id,
                    role: "button",
                    tabIndex: 0,
                    onClick: () => handleOpenSection(sec.id),
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenSection(sec.id);
                      }
                    },
                    className: `group bg-white border rounded-2xl overflow-hidden p-0 shadow-sm grid grid-cols-12 items-stretch md:flex md:flex-col cursor-pointer touch-manipulation transition-all duration-150 ease-out active:scale-[0.98] hover:shadow-md ${paused ? "border-[#FECDD3] hover:border-[#BE123C]/50" : "border-[#C6A355]/20 hover:border-[#C6A355]/60"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "col-span-5 md:col-span-auto md:order-1 order-2 flex flex-col p-0 h-full md:h-auto", children: [
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            onContextMenu: (e) => e.preventDefault(),
                            style: {
                              backgroundColor: categoryImageBgColors?.[sec.id] || "#FFFFFF"
                            },
                            className: "relative flex-1 h-full min-h-[180px] md:flex-none md:h-56 w-full overflow-hidden p-0 border-0 flex items-center justify-center protected-media select-none transition-colors duration-300",
                            children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: coverImg,
                                  alt: sec.title,
                                  referrerPolicy: "no-referrer",
                                  draggable: false,
                                  onContextMenu: (e) => e.preventDefault(),
                                  className: `w-full h-full object-cover object-center p-0 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] pointer-events-none select-none ${paused ? "opacity-85" : ""}`
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  "aria-hidden": "true",
                                  className: "pointer-events-none absolute inset-y-0 right-0 w-4 z-[5] bg-gradient-to-r from-transparent to-white md:inset-y-auto md:inset-x-0 md:bottom-0 md:w-full md:h-4 md:bg-gradient-to-b md:from-transparent md:to-white"
                                }
                              ),
                              isAdminMode && onReplaceCategoryCoverImage && /* @__PURE__ */ jsx(
                                "div",
                                {
                                  onClick: (e) => e.stopPropagation(),
                                  onKeyDown: (e) => e.stopPropagation(),
                                  className: "absolute top-2.5 left-2.5 z-20",
                                  children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-sm border border-[#C6A355]/50 text-[#1A1617] hover:bg-[#FAF8F5] hover:border-[#5E1734] text-[10px] sm:text-[11px] font-bold shadow-sm cursor-pointer transition-all active:scale-95", children: [
                                    uploadingCategoryCover === sec.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                                      /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin text-[#5E1734]" }),
                                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u0641\u0639..." })
                                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                                      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u{1F4F7}" }),
                                      /* @__PURE__ */ jsx("span", { children: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629" })
                                    ] }),
                                    /* @__PURE__ */ jsx(
                                      "input",
                                      {
                                        type: "file",
                                        accept: "image/*",
                                        disabled: uploadingCategoryCover === sec.id,
                                        className: "hidden",
                                        onChange: async (e) => {
                                          const file = e.target.files?.item(0);
                                          e.target.value = "";
                                          if (!file) return;
                                          setUploadingCategoryCover(sec.id);
                                          try {
                                            await onReplaceCategoryCoverImage(sec.id, file);
                                          } finally {
                                            setUploadingCategoryCover(null);
                                          }
                                        }
                                      }
                                    )
                                  ] })
                                }
                              ),
                              paused && /* @__PURE__ */ jsxs("div", { className: "absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5E1734] text-white text-[10px] sm:text-xs font-bold shadow-md border border-[#C6A355]/40", children: [
                                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                                /* @__PURE__ */ jsx("span", { children: resolvedPauseBadge })
                              ] }),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    openCardLightbox({
                                      url: coverImg,
                                      title: sec.title,
                                      bgColor
                                    });
                                  },
                                  "aria-label": `\u062A\u0643\u0628\u064A\u0631 \u0635\u0648\u0631\u0629 ${sec.title}`,
                                  title: "\u062A\u0643\u0628\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                                  className: "absolute bottom-2.5 left-2.5 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/92 backdrop-blur-sm border border-[#C6A355]/45 text-[#5E1734] hover:bg-white shadow-sm touch-manipulation cursor-pointer transition-transform active:scale-95",
                                  children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-3.5 h-3.5" })
                                }
                              )
                            ]
                          }
                        ),
                        isAdminMode && onUpdateCategoryImageBgColor && /* @__PURE__ */ jsxs(
                          "div",
                          {
                            onClick: (e) => e.stopPropagation(),
                            onKeyDown: (e) => e.stopPropagation(),
                            className: "px-2.5 py-2 bg-[#FAF8F5] border-t border-[#C6A355]/25 flex flex-wrap items-center justify-between gap-1.5",
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-[11px] font-bold text-[#5E1734] whitespace-nowrap", children: "\u0644\u0648\u0646 \u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0635\u0648\u0631\u0629" }),
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                                CATEGORY_IMAGE_BG_PRESETS.map((sw) => {
                                  const isActive = bgColor.toUpperCase() === sw.hex.toUpperCase();
                                  return /* @__PURE__ */ jsx(
                                    "button",
                                    {
                                      type: "button",
                                      title: sw.name,
                                      "aria-label": `\u062A\u0639\u064A\u064A\u0646 \u0644\u0648\u0646 \u062E\u0644\u0641\u064A\u0629 ${sec.title} \u0625\u0644\u0649 ${sw.name}`,
                                      "aria-pressed": isActive,
                                      onClick: (e) => {
                                        e.stopPropagation();
                                        onUpdateCategoryImageBgColor(sec.id, sw.hex);
                                      },
                                      style: { backgroundColor: sw.hex },
                                      className: `w-5 h-5 rounded-full border transition-transform cursor-pointer flex items-center justify-center ${isActive ? "ring-2 ring-[#5E1734] ring-offset-1 ring-offset-[#FAF8F5] scale-110 border-[#5E1734]" : "border-[#C6A355]/60 hover:scale-105"}`,
                                      children: isActive && /* @__PURE__ */ jsx(Check, { className: "w-2.5 h-2.5 text-[#5E1734]" })
                                    },
                                    sw.hex
                                  );
                                }),
                                /* @__PURE__ */ jsxs(
                                  "label",
                                  {
                                    title: "\u0644\u0648\u0646 \u0645\u062E\u0635\u0635",
                                    "aria-label": `\u0627\u062E\u062A\u064A\u0627\u0631 \u0644\u0648\u0646 \u062E\u0644\u0641\u064A\u0629 \u0645\u062E\u0635\u0635 \u0644\u0642\u0633\u0645 ${sec.title}`,
                                    onClick: (e) => e.stopPropagation(),
                                    className: `relative w-5 h-5 rounded-full border cursor-pointer flex items-center justify-center overflow-hidden transition-transform ${isCustomBg ? "ring-2 ring-[#5E1734] ring-offset-1 ring-offset-[#FAF8F5] scale-110 border-[#5E1734]" : "border-[#C6A355]/60 hover:scale-105"}`,
                                    style: {
                                      background: isCustomBg ? bgColor : "conic-gradient(from 0deg, #F7F4EF, #FDF2F5, #EFEAE2, #F3F4F6, #C6A355, #F7F4EF)"
                                    },
                                    children: [
                                      /* @__PURE__ */ jsx(
                                        "input",
                                        {
                                          type: "color",
                                          value: /^#[0-9a-fA-F]{6}$/.test(bgColor) ? bgColor : "#F7F4EF",
                                          onChange: (e) => {
                                            onUpdateCategoryImageBgColor(
                                              sec.id,
                                              e.target.value.toUpperCase()
                                            );
                                          },
                                          className: "sr-only"
                                        }
                                      ),
                                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-extrabold text-[#1A1617] pointer-events-none", children: "+" })
                                    ]
                                  }
                                )
                              ] })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "col-span-7 p-4 sm:p-5 flex-1 flex flex-col justify-between md:order-2 order-1", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                            /* @__PURE__ */ jsx(
                              EditableText,
                              {
                                textKey: `catalog.cat.${sec.id}.title`,
                                defaultText: sec.title,
                                as: "h3",
                                className: "font-editorial text-xl sm:text-2xl font-bold text-[#1A1617]"
                              }
                            ),
                            paused && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF1F3] border border-[#FECDD3] text-[10px] sm:text-xs font-extrabold text-[#BE123C]", children: [
                              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                              /* @__PURE__ */ jsx("span", { children: resolvedPauseBadge })
                            ] }),
                            storewideDiscountPercent > 0 && !paused && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full bg-[#5E1734] text-white text-[10px] font-extrabold", children: [
                              "-",
                              storewideDiscountPercent,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx(
                            EditableText,
                            {
                              textKey: `catalog.cat.${sec.id}.subtitle`,
                              defaultText: sec.subtitle,
                              as: "p",
                              multiline: true,
                              className: "text-xs sm:text-sm text-[#65525A] leading-relaxed mt-1.5 line-clamp-3 md:line-clamp-none"
                            }
                          ),
                          /* @__PURE__ */ jsx("div", { className: "mt-2.5", children: /* @__PURE__ */ jsx(
                            EditableText,
                            {
                              textKey: `catalog.cat.${sec.id}.priceLabel`,
                              defaultText: sec.priceLabel,
                              as: "span",
                              compact: true,
                              className: "inline-block px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-xs sm:text-sm font-extrabold text-[#5E1734] tabular-nums"
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "mt-3.5", children: /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${paused ? "bg-[#FFF1F3] text-[#9F1239] border border-[#FECDD3] group-hover:bg-[#FFE4E6]" : "cta-luxury-shimmer bg-[#5E1734] group-hover:bg-[#4A1129] text-white"}`,
                            children: paused ? /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
                              /* @__PURE__ */ jsxs("span", { children: [
                                "\u062A\u0635\u0641\u062D \u0627\u0644\u0642\u0633\u0645 \xB7 ",
                                resolvedPauseBadge
                              ] })
                            ] }) : /* @__PURE__ */ jsx(
                              EditableText,
                              {
                                textKey: `catalog.cat.${sec.id}.buttonText`,
                                defaultText: sec.buttonText,
                                compact: true,
                                darkSurface: true
                              }
                            )
                          }
                        ) })
                      ] })
                    ]
                  },
                  sec.id
                );
              }) }),
              /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
                CustomModelRequestCard,
                {
                  onOpen: handleOpenCustomModel,
                  isAdminMode,
                  estimatePrice: customModelBasePrice,
                  onUpdateEstimatePrice: onUpdateCustomModelPrice
                }
              ) })
            ] })
          },
          customModelOpen ? "custom-model" : selectedProductId || selectedSection || "home"
        )
      }
    ),
    cardLightbox && typeof document !== "undefined" && ReactDOM.createPortal(
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `\u0645\u0639\u0627\u064A\u0646\u0629 ${cardLightbox.title}`,
          onClick: closeCardLightbox,
          onContextMenu: (e) => e.preventDefault(),
          className: "fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 protected-media select-none cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  closeCardLightbox();
                },
                "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
                className: "fixed top-4 left-1/2 -translate-x-1/2 z-[10000] inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-white text-[#1A1617] border border-[#C6A355]/60 hover:bg-[#FAF8F5] text-xs sm:text-sm font-extrabold shadow-xl cursor-pointer touch-manipulation",
                children: /* @__PURE__ */ jsx("span", { children: "\u2715 \u0625\u063A\u0644\u0627\u0642" })
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: (e) => e.stopPropagation(),
                onContextMenu: (e) => e.preventDefault(),
                className: "relative w-auto max-w-[92vw] sm:max-w-3xl max-h-[82vh] rounded-2xl bg-white border border-[#C6A355]/25 overflow-hidden p-0 shadow-2xl flex flex-col items-center justify-center protected-media select-none cursor-default",
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: { backgroundColor: cardLightbox.bgColor || "#FFFFFF" },
                      className: "relative w-full max-h-[72vh] flex items-center justify-center overflow-hidden p-0 bg-white",
                      children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: cardLightbox.url,
                            alt: cardLightbox.title,
                            referrerPolicy: "no-referrer",
                            draggable: false,
                            onContextMenu: (e) => e.preventDefault(),
                            className: "max-w-full max-h-[72vh] w-auto h-auto object-contain mx-auto block mix-blend-multiply pointer-events-none select-none"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            "aria-hidden": "true",
                            onContextMenu: (e) => e.preventDefault(),
                            className: "absolute inset-0 z-10 bg-transparent select-none"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "w-full py-2.5 px-4 border-t border-[#C6A355]/15 bg-white flex items-center justify-between gap-3 text-xs text-[#65525A]", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-editorial text-sm sm:text-base font-bold text-[#1A1617] truncate", children: cardLightbox.title }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#65525A] shrink-0", children: "\u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0641\u0642\u0637 \u2022 \u0627\u0636\u063A\u0637 \u062E\u0627\u0631\u062C \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0644\u0625\u063A\u0644\u0627\u0642" })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
}
export {
  ProductCatalog
};
