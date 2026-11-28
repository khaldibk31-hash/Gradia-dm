import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Home,
  LayoutGrid,
  Loader2,
  MessageCircle,
  PackageSearch,
  PauseCircle,
  ShoppingBag,
  X
} from "lucide-react";
import {
  AdminDashboardModal,
  AdminLoginModal,
  CopyEditorModal,
  ProductEditorModal
} from "@/components/AdminModals";
import { CartDrawer } from "@/components/CartDrawer";
import {
  SectionHideButton,
  StoreEditProvider
} from "@/components/EditableText";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { OurStorySection } from "@/components/OurStorySection";
import { HowToOrderSection } from "@/components/HowToOrderSection";
import { OrderTrackingModal } from "@/components/OrderTrackingModal";
import { PricingAndFaq } from "@/components/PricingAndFaq";
import { ProductCatalog } from "@/components/ProductCatalog";
import { StoleStudio } from "@/components/StoleStudio";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ToastContainer } from "@/components/Toast";
import {
  BOUQUET_IMAGE_PATH,
  BRAND_LOGO_PATH,
  CAP_IMAGE_PATH,
  CREPE_STOLE_COLORS,
  DEFAULT_CAP_OPTION_PRICES,
  DEFAULT_DYNAMIC_SETTINGS,
  DEFAULT_PAUSE_MESSAGE,
  DEFAULT_PRODUCTS,
  DEFAULT_SHOWCASE_PHOTOS,
  DEFAULT_STORE_STATE,
  ROBE_IMAGE_PATH,
  ROYAL_SIX_STOLE_COLORS,
  SHAWL_IMAGE_PATH,
  WHATSAPP_NUMBER,
  formatWhatsAppNumber,
  normalizeLegacyAssetPath
} from "@/data/defaultStore";
import {
  compressReceiptImage,
  deleteCustomerReview,
  loadCustomerReviews,
  loadDynamicSettings,
  loadStoreState,
  readCachedDynamicSettings,
  readCachedProducts,
  saveDynamicSettings,
  signInAdmin,
  signOutAdmin,
  submitCustomerReview,
  supabase,
  uploadStoreImage,
  writeCachedDynamicSettings,
  writeCachedProducts
} from "@/lib/supabase";
const CART_STORAGE_KEY = "dg_by_douaa_cart_v1";
function playOrderNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [587.33, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(1e-3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + idx * 0.12 + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });
    setTimeout(() => {
      void ctx.close().catch(() => {
      });
    }, 900);
  } catch {
  }
}
const DEFAULT_PRODUCT_ID_SET = new Set(DEFAULT_PRODUCTS.map((p) => p.id));
function parseCustomProducts(raw) {
  if (!raw || typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => Boolean(item) && typeof item === "object" && typeof item.id === "string" && typeof item.category === "string" && typeof item.name === "string"
    );
  } catch {
    return [];
  }
}
function syncCustomProductsToTexts(products, texts) {
  const nextTexts = { ...texts };
  const customOnly = products.filter((p) => !DEFAULT_PRODUCT_ID_SET.has(p.id));
  if (customOnly.length > 0) {
    nextTexts["catalog.customProducts"] = JSON.stringify(customOnly);
  } else {
    delete nextTexts["catalog.customProducts"];
  }
  return nextTexts;
}
function sanitizeCrystalRoyalColors(raw) {
  let parsed = [];
  if (typeof raw === "string" && raw.trim()) {
    try {
      const json = JSON.parse(raw);
      if (Array.isArray(json)) parsed = json;
    } catch {
      parsed = [];
    }
  } else if (Array.isArray(raw)) {
    parsed = raw;
  }
  return ROYAL_SIX_STOLE_COLORS.map((fallback, idx) => {
    const item = parsed[idx];
    if (!item || typeof item !== "object") {
      return { ...fallback };
    }
    const cleanName = typeof item.name === "string" && item.name.trim() ? item.name.trim() : fallback.name;
    const rawHex = typeof item.hex === "string" ? item.hex.trim() : "";
    const cleanHex = /^#[0-9a-fA-F]{6}$/.test(rawHex) ? rawHex.toUpperCase() : fallback.hex;
    const rawExtra = Number(item.extraPrice);
    const cleanExtra = Number.isFinite(rawExtra) && rawExtra >= 0 ? Math.round(rawExtra) : fallback.extraPrice ?? 0;
    const rawThreadHex = typeof item.defaultThreadHex === "string" ? item.defaultThreadHex.trim() : "";
    const cleanThreadHex = /^#[0-9a-fA-F]{6}$/.test(rawThreadHex) ? rawThreadHex : fallback.defaultThreadHex;
    const cleanThreadName = typeof item.defaultThreadName === "string" && item.defaultThreadName.trim() ? item.defaultThreadName.trim() : fallback.defaultThreadName;
    return {
      name: cleanName,
      hex: cleanHex,
      extraPrice: cleanExtra,
      defaultThreadHex: cleanThreadHex,
      defaultThreadName: cleanThreadName
    };
  });
}
import MetaPixelConsent from "@/components/MetaPixelConsent";
import { trackMeta, META_PIXEL_SETTING_KEY } from "@/lib/metaPixel";
function App() {
  const [storeState, setStoreState] = useState(DEFAULT_STORE_STATE);
  const [dynamicSettings, setDynamicSettings] = useState(
    DEFAULT_DYNAMIC_SETTINGS
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [orderSignalNonce, setOrderSignalNonce] = useState(0);
  const lastKnownOrderNumberRef = useRef(null);
  const lastNotifiedOrderIdRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const bgColorSaveTimerRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const rawSectionOrder = Array.isArray(storeState.sectionOrder) && storeState.sectionOrder.length >= 3 ? storeState.sectionOrder : ["catalog", "studio", "howToOrder", "pricing"];
  const sectionOrder = rawSectionOrder.includes("howToOrder") ? rawSectionOrder : [
    ...rawSectionOrder.filter((id) => id !== "pricing"),
    "howToOrder",
    ...rawSectionOrder.includes("pricing") ? ["pricing"] : []
  ];
  const moveSection = (id, dir) => {
    const idx = sectionOrder.indexOf(id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[idx], next[target]] = [next[target], next[idx]];
    setStoreState((prev) => ({ ...prev, sectionOrder: next }));
  };
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [productModalState, setProductModalState] = useState({
    isOpen: false,
    category: "shawl",
    editing: null
  });
  const [requestedCatalogSection, setRequestedCatalogSection] = useState(null);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const [isUploadingStoryImage, setIsUploadingStoryImage] = useState(false);
  const [addedCartAlert, setAddedCartAlert] = useState(null);
  const [cartPulseActive, setCartPulseActive] = useState(false);
  const addedCartTimerRef = useRef(null);
  const cartPulseTimerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (addedCartTimerRef.current !== null) {
        window.clearTimeout(addedCartTimerRef.current);
      }
      if (cartPulseTimerRef.current !== null) {
        window.clearTimeout(cartPulseTimerRef.current);
      }
    };
  }, []);
  const syncModalsFromHistory = useCallback((appModal) => {
    setIsCartOpen(appModal === "cart");
    setIsTrackingOpen(appModal === "tracking");
    setIsLoginOpen(appModal === "login");
    setIsCopyModalOpen(appModal === "copy");
    setIsDashboardOpen(appModal === "dashboard");
    setProductModalState(
      (prev) => appModal === "productEditor" ? { ...prev, isOpen: true } : prev.isOpen ? { ...prev, isOpen: false } : prev
    );
  }, []);
  useEffect(() => {
    if (!window.history.state?.dgBase) {
      window.history.replaceState(
        { ...window.history.state || {}, dgBase: true },
        ""
      );
    }
    const handlePopState = (event) => {
      const appModal = event.state?.appModal ?? void 0;
      syncModalsFromHistory(appModal);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncModalsFromHistory]);
  const openAppModal = useCallback(
    (modal) => {
      if (modal === "cart") {
        setAddedCartAlert(null);
      }
      const current = window.history.state || {};
      if (current.appModal !== modal) {
        window.history.pushState(
          { ...current, dgBase: true, appModal: modal },
          ""
        );
      }
      syncModalsFromHistory(modal);
    },
    [syncModalsFromHistory]
  );
  const closeAppModal = useCallback((modal) => {
    if (window.history.state?.appModal === modal) {
      window.history.back();
      return;
    }
    if (modal === "cart") setIsCartOpen(false);
    else if (modal === "tracking") setIsTrackingOpen(false);
    else if (modal === "login") setIsLoginOpen(false);
    else if (modal === "copy") setIsCopyModalOpen(false);
    else if (modal === "dashboard") setIsDashboardOpen(false);
    else if (modal === "productEditor") {
      setProductModalState((prev) => ({ ...prev, isOpen: false }));
    }
  }, []);
  const [toasts, setToasts] = useState([]);
  const notify = useCallback(
    (type, text) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, text }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
    }
  }, [cart]);
  useEffect(() => {
    let active = true;
    const hasRecoveryUrlParams = typeof window !== "undefined" && (window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).get("type") === "recovery");
    if (hasRecoveryUrlParams) {
      setIsPasswordRecoveryMode(true);
      openAppModal("login");
    }
    loadStoreState().then(async ({ state, session, error }) => {
      if (!active) return;
      setStoreState(state);
      const authed = Boolean(session);
      setIsAdminAuthenticated(authed);
      setIsAdminMode(authed);
      if (hasRecoveryUrlParams && session) {
        setIsPasswordRecoveryMode(true);
        openAppModal("login");
      }
      if (error) {
        console.warn("Store load note:", error);
      }
      const initialBackup = {
        ...state.dynamicSettings || DEFAULT_DYNAMIC_SETTINGS,
        customTexts: state.dynamicSettings?.customTexts && Object.keys(state.dynamicSettings.customTexts).length > 0 ? state.dynamicSettings.customTexts : state.customTexts || {}
      };
      const loadedSettings = await loadDynamicSettings(initialBackup);
      if (!active) return;
      const mergedReviews = await loadCustomerReviews(
        loadedSettings.testimonials ?? []
      );
      if (!active) return;
      const hydratedTexts = loadedSettings.customTexts ?? state.customTexts ?? {};
      const hydratedProductColorImages = loadedSettings.productColorImages || {};
      const hasSettingsColorMap = Object.keys(hydratedProductColorImages).length > 0;
      const deletedSet = new Set(loadedSettings.deletedProductIds || []);
      const disabledColorizeSet = new Set(
        loadedSettings.disabledColorizeProductIds || []
      );
      const priceOverrides = loadedSettings.productPriceOverrides || {};
      const cachedDynamic = readCachedDynamicSettings();
      const cachedProducts = readCachedProducts();
      const preferCachedProducts = cachedProducts !== null && Boolean(cachedDynamic?.updatedAt) && cachedDynamic?.updatedAt === loadedSettings.updatedAt;
      const hydratedSettings = {
        ...loadedSettings,
        customTexts: hydratedTexts,
        productColorImages: hydratedProductColorImages,
        testimonials: mergedReviews
      };
      const customProductsFromSettings = parseCustomProducts(
        hydratedTexts["catalog.customProducts"]
      );
      setDynamicSettings(hydratedSettings);
      setStoreState((prev) => {
        const baseProducts = preferCachedProducts ? cachedProducts : prev.products;
        const existingIds = new Set(baseProducts.map((p) => p.id));
        const mergedSource = [
          ...baseProducts,
          ...customProductsFromSettings.filter((cp) => !existingIds.has(cp.id))
        ];
        if (!deletedSet.has("shawl-crystal-royal-1") && !mergedSource.some((p) => p.id === "shawl-crystal-royal-1")) {
          const crystalDefault = DEFAULT_PRODUCTS.find((p) => p.id === "shawl-crystal-royal-1");
          if (crystalDefault) {
            const backIdx = mergedSource.findIndex((p) => p.id === "shawl-back-1");
            const americanIdx = mergedSource.findIndex((p) => p.id === "shawl-american-1");
            const insertIdx = backIdx >= 0 ? backIdx + 1 : americanIdx >= 0 ? americanIdx : mergedSource.length;
            mergedSource.splice(insertIdx, 0, { ...crystalDefault });
          }
        }
        const nextProducts = mergedSource.filter((p) => !deletedSet.has(p.id)).map((p) => {
          const override = priceOverrides[p.id];
          const sc = hydratedProductColorImages[p.id];
          const nextColorImages = hasSettingsColorMap ? sc ? sc : void 0 : p.colorImages;
          const customName = hydratedTexts[`product.${p.id}.name`];
          const customBranch = hydratedTexts[`product.${p.id}.branch`];
          const customDesc = hydratedTexts[`product.${p.id}.desc`];
          const hasCustomImageUrl = Object.prototype.hasOwnProperty.call(hydratedTexts, `product.${p.id}.imageUrl`);
          const customImageUrl = normalizeLegacyAssetPath(hydratedTexts[`product.${p.id}.imageUrl`]);
          const normalizedProductImage = normalizeLegacyAssetPath(p.imageUrl);
          const explicitAutoColorize = hydratedTexts[`product.${p.id}.autoColorize`];
          const disableAutoColorize = explicitAutoColorize === "1" ? false : explicitAutoColorize === "0" ? true : disabledColorizeSet.size > 0 && p.id !== "shawl-crystal-royal-1" ? disabledColorizeSet.has(p.id) : Boolean(p.disableAutoColorize);
          return {
            ...p,
            imageUrl: normalizedProductImage,
            ...customName ? { name: customName } : {},
            ...customBranch ? { branch: customBranch } : {},
            ...customDesc ? { description: customDesc } : {},
            ...hasCustomImageUrl ? { imageUrl: customImageUrl } : {},
            ...disableAutoColorize ? { disableAutoColorize: true } : { disableAutoColorize: false },
            ...override ? {
              basePrice: override.basePrice,
              ...override.options ? { options: override.options } : {},
              ...override.secondaryOptions ? { secondaryOptions: override.secondaryOptions } : {},
              ...override.secondaryOptionPrices ? { secondaryOptionPrices: override.secondaryOptionPrices } : {},
              ...override.noCapDeduction !== void 0 ? { noCapDeduction: override.noCapDeduction } : {}
            } : {},
            colorImages: nextColorImages
          };
        });
        const hydratedBrandName = (hydratedTexts["header.brandName"] || "").trim();
        return {
          ...prev,
          products: nextProducts,
          copy: hydratedBrandName ? { ...prev.copy, brandName: hydratedBrandName } : prev.copy,
          customTexts: hydratedTexts,
          dynamicSettings: hydratedSettings
        };
      });
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const authed = Boolean(session);
        setIsAdminAuthenticated(authed);
        setIsAdminMode(authed);
        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordRecoveryMode(true);
          openAppModal("login");
        }
      }
    );
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [openAppModal]);
  const triggerIncomingOrderAlert = useCallback(
    (orderNumber, orderId) => {
      if (orderId && lastNotifiedOrderIdRef.current === orderId) return;
      if (typeof orderNumber === "number" && lastKnownOrderNumberRef.current !== null && orderNumber <= lastKnownOrderNumberRef.current) {
        return;
      }
      if (orderId) lastNotifiedOrderIdRef.current = orderId;
      if (typeof orderNumber === "number") {
        lastKnownOrderNumberRef.current = Math.max(
          lastKnownOrderNumberRef.current ?? 0,
          orderNumber
        );
      }
      playOrderNotificationChime();
      setNewOrdersCount((prev) => prev + 1);
      setOrderSignalNonce((prev) => prev + 1);
      notify(
        "info",
        orderNumber ? `\u{1F514} \u0648\u0635\u0644 \u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0631\u0642\u0645 #${orderNumber}!` : "\u{1F514} \u0648\u0635\u0644 \u0637\u0644\u0628 \u062C\u062F\u064A\u062F!"
      );
    },
    [notify]
  );
  useEffect(() => {
    if (!isAdminMode) {
      setNewOrdersCount(0);
      lastKnownOrderNumberRef.current = null;
      lastNotifiedOrderIdRef.current = null;
      return;
    }
    let cancelled = false;
    const seedLatestOrderNumber = async () => {
      const { data } = await supabase.from("orders").select("id, order_number").order("order_number", { ascending: false }).limit(1).maybeSingle();
      if (!cancelled && data && typeof data.order_number === "number") {
        lastKnownOrderNumberRef.current = data.order_number;
        lastNotifiedOrderIdRef.current = String(data.id || "");
      } else if (!cancelled && lastKnownOrderNumberRef.current === null) {
        lastKnownOrderNumberRef.current = 0;
      }
    };
    void seedLatestOrderNumber();
    const channel = supabase.channel("admin-orders-notify").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      (payload) => {
        if (cancelled) return;
        const record = payload.new;
        triggerIncomingOrderAlert(
          typeof record.order_number === "number" ? record.order_number : null,
          record.id ? String(record.id) : null
        );
      }
    ).subscribe();
    const pollInterval = window.setInterval(async () => {
      if (cancelled) return;
      const { data } = await supabase.from("orders").select("id, order_number").order("order_number", { ascending: false }).limit(1).maybeSingle();
      if (!cancelled && data && typeof data.order_number === "number" && lastKnownOrderNumberRef.current !== null && data.order_number > lastKnownOrderNumberRef.current) {
        triggerIncomingOrderAlert(data.order_number, String(data.id || ""));
      }
    }, 18e3);
    return () => {
      cancelled = true;
      window.clearInterval(pollInterval);
      void supabase.removeChannel(channel);
    };
  }, [isAdminMode, triggerIncomingOrderAlert]);
  const handleAddToCart = (item) => {
    trackMeta("AddToCart", { content_name: item.title, value: item.unitPrice, currency: "DZD" });
    const nextTotal = cart.reduce((sum, entry) => sum + entry.quantity, 0) + 1;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (p) => p.title === item.title && (p.details || "") === (item.details || "") && p.unitPrice === item.unitPrice && (p.customModelImage || "") === (item.customModelImage || "") && (p.universityLogo || "") === (item.universityLogo || "") && (p.customNotes || "") === (item.customNotes || "")
      );
      if (existingIdx >= 0) {
        return prev.map(
          (entry, idx) => idx === existingIdx ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      return [...prev, { ...item, id, quantity: 1 }];
    });
    setAddedCartAlert({ title: item.title, totalItems: nextTotal });
    setCartPulseActive(true);
    if (addedCartTimerRef.current !== null) {
      window.clearTimeout(addedCartTimerRef.current);
    }
    addedCartTimerRef.current = window.setTimeout(() => {
      setAddedCartAlert(null);
      addedCartTimerRef.current = null;
    }, 1e4);
    if (cartPulseTimerRef.current !== null) {
      window.clearTimeout(cartPulseTimerRef.current);
    }
    cartPulseTimerRef.current = window.setTimeout(() => {
      setCartPulseActive(false);
      cartPulseTimerRef.current = null;
    }, 2800);
  };
  const handleUpdateQuantity = (id, delta) => {
    setCart(
      (prev) => prev.map(
        (item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter((item) => item.quantity > 0)
    );
  };
  const handleRemoveCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const handleClearCart = () => {
    setCart([]);
    notify("info", "\u062A\u0645 \u062A\u0641\u0631\u064A\u063A \u0627\u0644\u062D\u0642\u064A\u0628\u0629.");
  };
  const handleUnlockAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminMode((prev) => !prev);
      return;
    }
    openAppModal("login");
  };
  const handleAdminLogin = async (email, password) => {
    await signInAdmin(email, password);
    setIsAdminAuthenticated(true);
    setIsAdminMode(true);
    notify("success", "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.");
  };
  const handleAdminLogout = async () => {
    try {
      await signOutAdmin();
      setIsAdminAuthenticated(false);
      setIsAdminMode(false);
      closeAppModal("dashboard");
      notify("info", "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.");
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C."
      );
    }
  };
  const handlePublishToCloud = async () => {
    setIsSavingCloud(true);
    let timeoutId;
    try {
      const syncedProductColorImages = {};
      for (const prod of storeState.products) {
        if (prod.colorImages && Object.keys(prod.colorImages).length > 0) {
          syncedProductColorImages[prod.id] = prod.colorImages;
        }
      }
      const syncedTexts = {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
      };
      if (Object.keys(syncedProductColorImages).length > 0) {
        syncedTexts["product.colorImages"] = JSON.stringify(
          syncedProductColorImages
        );
      } else {
        delete syncedTexts["product.colorImages"];
      }
      const syncedDeletedIds = dynamicSettings.deletedProductIds || [];
      if (syncedDeletedIds.length > 0) {
        syncedTexts["catalog.deletedIds"] = JSON.stringify(syncedDeletedIds);
      } else {
        delete syncedTexts["catalog.deletedIds"];
      }
      const syncedDisabledColorizeIds = storeState.products.filter((p) => Boolean(p.disableAutoColorize)).map((p) => p.id);
      if (syncedDisabledColorizeIds.length > 0) {
        syncedTexts["catalog.disabledColorizeIds"] = JSON.stringify(
          syncedDisabledColorizeIds
        );
      } else {
        delete syncedTexts["catalog.disabledColorizeIds"];
      }
      const syncedPriceOverrides = dynamicSettings.productPriceOverrides || {};
      if (Object.keys(syncedPriceOverrides).length > 0) {
        syncedTexts["catalog.priceOverrides"] = JSON.stringify(syncedPriceOverrides);
      } else {
        delete syncedTexts["catalog.priceOverrides"];
      }
      if (dynamicSettings.capOptionPrices) {
        syncedTexts["catalog.capOptionPrices"] = JSON.stringify(
          dynamicSettings.capOptionPrices
        );
      }
      if (dynamicSettings.regularShawlBaseImage) {
        syncedTexts["regularShawl.baseImage"] = dynamicSettings.regularShawlBaseImage;
      } else {
        delete syncedTexts["regularShawl.baseImage"];
      }
      const syncedTextsWithCustomProducts = syncCustomProductsToTexts(
        storeState.products,
        syncedTexts
      );
      const syncedDynamic = {
        ...dynamicSettings,
        customTexts: syncedTextsWithCustomProducts,
        productColorImages: syncedProductColorImages,
        deletedProductIds: syncedDeletedIds,
        disabledColorizeProductIds: syncedDisabledColorizeIds,
        productPriceOverrides: syncedPriceOverrides
      };
      const syncedState = {
        ...storeState,
        customTexts: syncedTextsWithCustomProducts,
        dynamicSettings: syncedDynamic
      };
      writeCachedDynamicSettings(syncedDynamic);
      writeCachedProducts(syncedState.products);
      const timeoutGuard = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(
            new Error(
              "\u0627\u0646\u062A\u0647\u062A \u0645\u0647\u0644\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 (25 \u062B\u0627\u0646\u064A\u0629). \u062A\u0645 \u062D\u0641\u0638 \u062A\u063A\u064A\u064A\u0631\u0627\u062A\u0643 \u0645\u062D\u0644\u064A\u0627\u064B\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0648\u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629."
            )
          );
        }, 25500);
      });
      const result = await Promise.race([
        saveDynamicSettings(syncedDynamic, syncedState),
        timeoutGuard
      ]);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
        setStoreState((prev) => ({
          ...prev,
          customTexts: result.normalizedSettings?.customTexts ?? prev.customTexts,
          dynamicSettings: result.normalizedSettings
        }));
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u2705 \u062A\u0645 \u0627\u0644\u062D\u0641\u0638 \u0648\u0627\u0644\u0646\u0634\u0631 \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify(
          "error",
          result.errorMessage || "\u26A0\uFE0F \u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645. \u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0648\u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629."
        );
      }
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? `\u26A0\uFE0F ${err.message}` : "\u26A0\uFE0F \u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645. \u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B."
      );
    } finally {
      if (timeoutId !== void 0) {
        window.clearTimeout(timeoutId);
      }
      setIsSavingCloud(false);
    }
  };
  const handleUpdateDynamicSettings = async (next) => {
    setDynamicSettings(next);
    const nextBrandName = (next.customTexts?.["header.brandName"] || "").trim();
    const updatedStoreState = {
      ...storeState,
      copy: nextBrandName ? { ...storeState.copy, brandName: nextBrandName } : storeState.copy,
      customTexts: next.customTexts ?? storeState.customTexts,
      dynamicSettings: next
    };
    setStoreState(updatedStoreState);
    try {
      const result = await saveDynamicSettings(next, updatedStoreState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (!result.savedToStoreSettings && !result.savedToBackup) {
        const msg = result.errorMessage || "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u0627\u062F\u0645.";
        notify("error", `\u26A0\uFE0F ${msg}`);
        throw new Error(msg);
      }
    } catch (err) {
      if (!(err instanceof Error && err.message)) {
        notify("error", "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631.");
      }
      throw err;
    }
  };
  const applyCustomTextsUpdate = (updater, changedKey, changedValue) => {
    const currentTexts = dynamicSettings.customTexts ?? storeState.customTexts ?? {};
    const nextTexts = updater(currentTexts);
    const copyPatch = {};
    const dynamicPatch = {};
    if (changedKey && changedValue !== void 0) {
      if (changedKey === "hero.title" && changedValue) {
        copyPatch.heroTitle = changedValue;
        dynamicPatch.heroTitle = changedValue;
      } else if (changedKey === "hero.subtitle" && changedValue) {
        copyPatch.heroSubtitle = changedValue;
        dynamicPatch.heroSubtitle = changedValue;
      } else if (changedKey === "hero.eyebrow" && changedValue) {
        copyPatch.heroEyebrow = changedValue;
      } else if (changedKey === "studio.title" && changedValue) {
        copyPatch.studioTitle = changedValue;
      } else if (changedKey === "studio.subtitle" && changedValue) {
        copyPatch.studioSubtitle = changedValue;
      } else if (changedKey === "pricing.title" && changedValue) {
        copyPatch.pricesTitle = changedValue;
      } else if (changedKey === "pricing.subtitle" && changedValue) {
        copyPatch.pricesSubtitle = changedValue;
      } else if ((changedKey === "header.brandName" || changedKey === "footer.brandName") && changedValue) {
        copyPatch.brandName = changedValue;
      }
    }
    let nextProducts = storeState.products;
    let productsChanged = false;
    if (changedKey && changedValue !== void 0) {
      const prodMatch = /^product\.([^.]+)\.(name|branch|desc)$/.exec(changedKey);
      if (prodMatch) {
        const [, prodId, fieldKey] = prodMatch;
        nextProducts = storeState.products.map((p) => {
          if (p.id !== prodId) return p;
          productsChanged = true;
          if (fieldKey === "name") return { ...p, name: changedValue };
          if (fieldKey === "branch") return { ...p, branch: changedValue };
          return { ...p, description: changedValue };
        });
      }
    }
    const syncedTexts = productsChanged ? syncCustomProductsToTexts(nextProducts, nextTexts) : nextTexts;
    const nextDynamic = {
      ...dynamicSettings,
      ...dynamicPatch,
      customTexts: syncedTexts,
      ...productsChanged ? { updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : {}
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    if (productsChanged) {
      writeCachedProducts(nextProducts);
    }
    setStoreState((prev) => ({
      ...prev,
      ...productsChanged ? { products: nextProducts } : {},
      copy: { ...prev.copy, ...copyPatch },
      customTexts: syncedTexts,
      dynamicSettings: nextDynamic
    }));
    return { productsChanged, nextDynamic, nextProducts, syncedTexts };
  };
  const handleUpdateCustomText = (key, nextValue) => {
    const res = applyCustomTextsUpdate(
      (prev) => ({ ...prev, [key]: nextValue }),
      key,
      nextValue
    );
    if (res.productsChanged) {
      const nextState = {
        ...storeState,
        products: res.nextProducts,
        customTexts: res.syncedTexts,
        dynamicSettings: res.nextDynamic
      };
      void saveDynamicSettings(res.nextDynamic, nextState).then((saveRes) => {
        if (saveRes.savedToStoreSettings || saveRes.savedToBackup) {
          notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u0646\u062C\u0627\u062D!");
        } else {
          notify("info", '\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0644\u0644\u0632\u0628\u0627\u0626\u0646.');
        }
      }).catch(() => {
        notify("info", '\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0644\u0644\u0632\u0628\u0627\u0626\u0646.');
      });
      return;
    }
    notify("info", '\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0635. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0644\u0644\u0632\u0628\u0627\u0626\u0646.');
  };
  const handleClearCustomText = (key) => {
    applyCustomTextsUpdate((prev) => ({ ...prev, [key]: "" }));
    notify("info", '\u062A\u0645 \u0645\u0633\u062D \u0648\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0646\u0635. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u063A\u064A\u064A\u0631.');
  };
  const handleRestoreCustomText = (key) => {
    applyCustomTextsUpdate((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    notify("success", "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0646\u0635 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A.");
  };
  const handleToggleSectionHidden = (sectionKey, hidden) => {
    const nextHidden = { ...dynamicSettings.hiddenSections || {} };
    if (hidden) {
      nextHidden[sectionKey] = true;
    } else {
      delete nextHidden[sectionKey];
    }
    const nextDynamic = {
      ...dynamicSettings,
      hiddenSections: nextHidden
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    setStoreState((prev) => ({
      ...prev,
      dynamicSettings: nextDynamic
    }));
    notify(
      "info",
      hidden ? '\u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0642\u0633\u0645 \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647.' : '\u062A\u0645 \u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0642\u0633\u0645. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647.'
    );
  };
  const handleUpdateCategoryBranches = (category, nextBranches, renamedBranch) => {
    const nextCategoryBranches = {
      ...dynamicSettings.categoryBranches || {},
      [category]: nextBranches
    };
    const nextDynamic = {
      ...dynamicSettings,
      categoryBranches: nextCategoryBranches
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    setStoreState((prev) => ({
      ...prev,
      products: renamedBranch ? prev.products.map(
        (p) => p.category === category && p.branch === renamedBranch.from ? { ...p, branch: renamedBranch.to } : p
      ) : prev.products,
      dynamicSettings: nextDynamic
    }));
    notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0641\u0644\u062A\u0631\u0629. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
  };
  const handleUploadLogo = async (file) => {
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 500, 0.8);
      } catch {
        url = await compressReceiptImage(file, 500, 0.8);
      }
      setStoreState((prev) => ({ ...prev, logoUrl: url }));
      notify("success", '\u062A\u0645 \u0631\u0641\u0639 \u0627\u0644\u0634\u0639\u0627\u0631. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647.');
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0627\u0644\u0634\u0639\u0627\u0631."
      );
    }
  };
  const handleUploadHeroImage = async (file) => {
    setIsUploadingHeroImage(true);
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 1200, 0.82);
      } catch {
        url = await compressReceiptImage(file, 1200, 0.82);
      }
      const nextTexts = {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        "hero.coverImage": url
      };
      const nextDynamic = {
        ...dynamicSettings,
        heroImageUrl: url,
        customTexts: nextTexts
      };
      setDynamicSettings(nextDynamic);
      writeCachedDynamicSettings(nextDynamic);
      setStoreState((prev) => ({
        ...prev,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      }));
      notify("success", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0644\u0644\u062C\u0645\u064A\u0639.');
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641."
      );
    } finally {
      setIsUploadingHeroImage(false);
    }
  };
  const handleResetHeroImage = () => {
    const nextTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
    };
    delete nextTexts["hero.coverImage"];
    const nextDynamic = {
      ...dynamicSettings,
      heroImageUrl: void 0,
      customTexts: nextTexts
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    setStoreState((prev) => ({
      ...prev,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    }));
    notify("info", '\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
  };
  const handleUploadStoryImage = async (file) => {
    setIsUploadingStoryImage(true);
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 800, 0.8);
      } catch {
        url = await compressReceiptImage(file, 800, 0.8);
      }
      const nextTexts = {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        "story.imageUrl": url
      };
      const nextDynamic = {
        ...dynamicSettings,
        customTexts: nextTexts
      };
      setDynamicSettings(nextDynamic);
      writeCachedDynamicSettings(nextDynamic);
      setStoreState((prev) => ({
        ...prev,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      }));
      notify("success", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0635\u0629. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0644\u0644\u062C\u0645\u064A\u0639.');
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0635\u0629."
      );
    } finally {
      setIsUploadingStoryImage(false);
    }
  };
  const handleResetStoryImage = () => {
    const nextTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
    };
    delete nextTexts["story.imageUrl"];
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    setStoreState((prev) => ({
      ...prev,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    }));
    notify("info", '\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0631\u0633\u0645\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0644\u0644\u0642\u0635\u0629. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
  };
  const handleUploadStudioBg = async (file) => {
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 800, 0.8);
      } catch {
        url = await compressReceiptImage(file, 800, 0.8);
      }
      setStoreState((prev) => ({ ...prev, studioBgUrl: url }));
      notify("success", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629."
      );
    }
  };
  const handleReplaceProductImage = async (productId, file) => {
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 800, 0.8);
      } catch {
        url = await compressReceiptImage(file, 800, 0.8);
      }
      const nextProducts = storeState.products.map(
        (p) => p.id === productId ? { ...p, imageUrl: url } : p
      );
      const nextTexts = syncCustomProductsToTexts(nextProducts, {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        [`product.${productId}.imageUrl`]: url
      });
      const nextDynamic = {
        ...dynamicSettings,
        customTexts: nextTexts,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const nextState = {
        ...storeState,
        products: nextProducts,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      };
      writeCachedProducts(nextProducts);
      writeCachedDynamicSettings(nextDynamic);
      setDynamicSettings(nextDynamic);
      setStoreState(nextState);
      try {
        const res = await saveDynamicSettings(nextDynamic, nextState);
        if (res.normalizedSettings) {
          setDynamicSettings(res.normalizedSettings);
        }
        if (res.savedToStoreSettings || res.savedToBackup) {
          notify("success", "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u062D\u0641\u0638\u0647\u0627 \u0628\u0646\u062C\u0627\u062D!");
        } else {
          notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
        }
      } catch {
        notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
      }
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C."
      );
    }
  };
  const handleUpdateCategoryImageBgColor = (category, color) => {
    const cleanColor = color.trim().toUpperCase();
    const nextBgColors = {
      ...dynamicSettings.categoryImageBgColors || {},
      [category]: cleanColor
    };
    const nextDynamic = {
      ...dynamicSettings,
      categoryImageBgColors: nextBgColors
    };
    const nextStoreState = {
      ...storeState,
      dynamicSettings: nextDynamic
    };
    setDynamicSettings(nextDynamic);
    writeCachedDynamicSettings(nextDynamic);
    setStoreState(nextStoreState);
    if (bgColorSaveTimerRef.current !== null) {
      window.clearTimeout(bgColorSaveTimerRef.current);
    }
    bgColorSaveTimerRef.current = window.setTimeout(() => {
      bgColorSaveTimerRef.current = null;
      void saveDynamicSettings(nextDynamic, nextStoreState).catch(() => {
      });
    }, 350);
  };
  const handleReplaceCategoryCoverImage = async (category, file) => {
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 800, 0.8);
      } catch {
        url = await compressReceiptImage(file, 800, 0.8);
      }
      const nextCoverImages = {
        ...dynamicSettings.categoryCoverImages || {},
        [category]: url
      };
      const nextDynamic = {
        ...dynamicSettings,
        categoryCoverImages: nextCoverImages
      };
      const nextStoreState = {
        ...storeState,
        dynamicSettings: nextDynamic
      };
      setDynamicSettings(nextDynamic);
      writeCachedDynamicSettings(nextDynamic);
      setStoreState(nextStoreState);
      try {
        await saveDynamicSettings(nextDynamic, nextStoreState);
        notify(
          "success",
          '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0633\u0645 \u0648\u062D\u0641\u0638\u0647\u0627. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u0644\u0644\u062C\u0645\u064A\u0639.'
        );
      } catch {
        notify(
          "info",
          '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0633\u0645 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.'
        );
      }
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0633\u0645."
      );
    }
  };
  const handleReplaceAmericanShawlImage = async (side, file) => {
    try {
      let url;
      try {
        url = await uploadStoreImage(file, 900, 0.82);
      } catch {
        url = await compressReceiptImage(file, 900, 0.82);
      }
      const customKey = side === "front" ? "americanShawl.frontImage" : "americanShawl.backImage";
      const nextTexts = {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        [customKey]: url
      };
      const nextDynamic = {
        ...dynamicSettings,
        ...side === "front" ? { americanShawlFrontImage: url } : { americanShawlBackImage: url },
        customTexts: nextTexts
      };
      const nextProducts = side === "front" ? storeState.products.map(
        (p) => p.name.includes("\u0627\u0645\u0631\u064A\u0643\u064A") || p.branch.includes("\u0627\u0645\u0631\u064A\u0643\u064A") || p.name.includes("\u0623\u0645\u0631\u064A\u0643\u064A") || p.branch.includes("\u0623\u0645\u0631\u064A\u0643\u064A") ? { ...p, imageUrl: url } : p
      ) : storeState.products;
      const nextStoreState = {
        ...storeState,
        products: nextProducts,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      };
      setDynamicSettings(nextDynamic);
      writeCachedDynamicSettings(nextDynamic);
      setStoreState(nextStoreState);
      const label = side === "front" ? "\u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629" : "\u0627\u0644\u062E\u0644\u0641\u064A\u0629";
      try {
        await saveDynamicSettings(nextDynamic, nextStoreState);
        notify(
          "success",
          `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0635\u0648\u0631\u0629 ${label} \u0644\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u0644\u0644\u062C\u0645\u064A\u0639.`
        );
      } catch {
        notify(
          "info",
          `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0635\u0648\u0631\u0629 ${label} \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.`
        );
      }
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A."
      );
    }
  };
  const handleReplaceRegularShawlBaseImage = async (file) => {
    try {
      let url;
      if (file) {
        try {
          url = await uploadStoreImage(file, 1200, 0.82);
        } catch {
          url = await compressReceiptImage(file, 1200, 0.82);
        }
      }
      const nextTexts = {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
      };
      if (url) {
        nextTexts["regularShawl.baseImage"] = url;
      } else {
        delete nextTexts["regularShawl.baseImage"];
      }
      const nextDynamic = {
        ...dynamicSettings,
        regularShawlBaseImage: url,
        customTexts: nextTexts
      };
      const nextStoreState = {
        ...storeState,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      };
      setDynamicSettings(nextDynamic);
      writeCachedDynamicSettings(nextDynamic);
      setStoreState(nextStoreState);
      try {
        const res = await saveDynamicSettings(nextDynamic, nextStoreState);
        if (res.normalizedSettings) {
          setDynamicSettings(res.normalizedSettings);
          setStoreState((prev) => ({
            ...prev,
            customTexts: res.normalizedSettings?.customTexts ?? prev.customTexts,
            dynamicSettings: res.normalizedSettings
          }));
        }
        if (res.savedToStoreSettings || res.savedToBackup) {
          notify(
            "success",
            url ? "\u062A\u0645 \u062D\u0641\u0638 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0644\u0644\u062A\u0644\u0648\u064A\u0646 \u0641\u064A \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D." : "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0628\u0646\u062C\u0627\u062D."
          );
        } else {
          notify(
            "info",
            '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.'
          );
        }
      } catch {
        notify(
          "info",
          '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.'
        );
      }
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0633\u0648\u062F \u0627\u0644\u0633\u0627\u062F\u0629."
      );
    }
  };
  const handleSaveProduct = async (payload) => {
    const defaultCategoryImage = payload.category === "robe" ? ROBE_IMAGE_PATH : payload.category === "cap" ? CAP_IMAGE_PATH : payload.category === "accessories" ? BOUQUET_IMAGE_PATH : SHAWL_IMAGE_PATH;
    let imageUrl = payload.existingImageUrl || defaultCategoryImage;
    if (payload.imageFile) {
      try {
        imageUrl = await uploadStoreImage(payload.imageFile, 800, 0.8);
      } catch {
        imageUrl = await compressReceiptImage(payload.imageFile, 800, 0.8);
      }
    }
    if (payload.id) {
      const nextProducts = storeState.products.map(
        (p) => p.id === payload.id ? {
          ...p,
          category: payload.category,
          branch: payload.branch,
          name: payload.name,
          description: payload.description,
          basePrice: payload.basePrice,
          noCapDeduction: payload.noCapDeduction,
          options: payload.options,
          secondaryLabel: payload.secondaryLabel !== void 0 ? payload.secondaryLabel : p.secondaryLabel,
          secondaryOptions: payload.secondaryOptions !== void 0 ? payload.secondaryOptions : p.secondaryOptions,
          imageUrl
        } : p
      );
      const existingOverride = (dynamicSettings.productPriceOverrides || {})[payload.id];
      const nextOverrides = {
        ...dynamicSettings.productPriceOverrides || {},
        [payload.id]: {
          ...existingOverride,
          basePrice: payload.basePrice,
          ...payload.options.length > 0 ? { options: payload.options } : {},
          ...payload.secondaryOptions !== void 0 ? { secondaryOptions: payload.secondaryOptions } : {},
          ...payload.noCapDeduction !== void 0 ? { noCapDeduction: payload.noCapDeduction } : {}
        }
      };
      const nextTexts = syncCustomProductsToTexts(nextProducts, {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        "catalog.priceOverrides": JSON.stringify(nextOverrides),
        [`product.${payload.id}.name`]: payload.name,
        [`product.${payload.id}.branch`]: payload.branch,
        [`product.${payload.id}.desc`]: payload.description,
        [`product.${payload.id}.imageUrl`]: imageUrl
      });
      const nextDynamic = {
        ...dynamicSettings,
        customTexts: nextTexts,
        productPriceOverrides: nextOverrides,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const nextState = {
        ...storeState,
        products: nextProducts,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      };
      writeCachedProducts(nextProducts);
      writeCachedDynamicSettings(nextDynamic);
      setDynamicSettings(nextDynamic);
      setStoreState(nextState);
      try {
        const res = await saveDynamicSettings(nextDynamic, nextState);
        if (res.normalizedSettings) {
          setDynamicSettings(res.normalizedSettings);
        }
        if (res.savedToStoreSettings || res.savedToBackup) {
          notify("success", "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0648\u062D\u0641\u0638\u0647 \u0628\u0646\u062C\u0627\u062D!");
        } else {
          notify("success", '\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0648\u062F\u064A\u0644. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u0627\u0639\u062A\u0645\u0627\u062F\u0647.');
        }
      } catch {
        notify("success", '\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0648\u062F\u064A\u0644. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u0627\u0639\u062A\u0645\u0627\u062F\u0647.');
      }
    } else {
      const newProduct = {
        id: `prod-${Date.now()}`,
        category: payload.category,
        branch: payload.branch,
        name: payload.name,
        description: payload.description,
        basePrice: payload.basePrice,
        noCapDeduction: payload.noCapDeduction,
        imageUrl,
        options: payload.options,
        secondaryLabel: payload.secondaryLabel ?? (payload.category === "robe" ? "\u0627\u0644\u0645\u0642\u0627\u0633 \u0627\u0644\u0642\u064A\u0627\u0633\u064A" : void 0),
        secondaryOptions: payload.secondaryOptions && payload.secondaryOptions.length > 0 ? payload.secondaryOptions : payload.category === "robe" ? ["S", "M", "L", "XL", "XXL", "\u0645\u0642\u0627\u0633 \u062E\u0627\u0635"] : payload.secondaryOptions
      };
      const nextProducts = [...storeState.products, newProduct];
      const nextOverrides = {
        ...dynamicSettings.productPriceOverrides || {},
        [newProduct.id]: {
          basePrice: newProduct.basePrice,
          ...newProduct.options.length > 0 ? { options: newProduct.options } : {},
          ...newProduct.secondaryOptions !== void 0 ? { secondaryOptions: newProduct.secondaryOptions } : {},
          ...newProduct.noCapDeduction !== void 0 ? { noCapDeduction: newProduct.noCapDeduction } : {}
        }
      };
      const nextTexts = syncCustomProductsToTexts(nextProducts, {
        ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
        "catalog.priceOverrides": JSON.stringify(nextOverrides)
      });
      const nextDynamic = {
        ...dynamicSettings,
        customTexts: nextTexts,
        productPriceOverrides: nextOverrides,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const nextState = {
        ...storeState,
        products: nextProducts,
        customTexts: nextTexts,
        dynamicSettings: nextDynamic
      };
      writeCachedProducts(nextProducts);
      writeCachedDynamicSettings(nextDynamic);
      setDynamicSettings(nextDynamic);
      setStoreState(nextState);
      try {
        const res = await saveDynamicSettings(nextDynamic, nextState);
        if (res.normalizedSettings) {
          setDynamicSettings(res.normalizedSettings);
        }
        if (res.savedToStoreSettings || res.savedToBackup) {
          notify("success", "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u062C\u062F\u064A\u062F \u0648\u062D\u0641\u0638\u0647 \u0628\u0646\u062C\u0627\u062D!");
        } else {
          notify("success", '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u062C\u062F\u064A\u062F. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
        }
      } catch {
        notify("success", '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u062C\u062F\u064A\u062F. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    }
  };
  const handleQuickAddRobe = () => {
    const newId = `robe-${Date.now()}`;
    const newGown = {
      id: newId,
      category: "robe",
      branch: "\u0631\u0648\u0628 \u0645\u0644\u0643\u064A",
      name: "\u0631\u0648\u0628 \u062A\u062E\u0631\u062C \u0645\u0644\u0643\u064A \u062C\u062F\u064A\u062F",
      description: "\u0631\u0648\u0628 \u062A\u062E\u0631\u062C \u0641\u0627\u062E\u0631 \u0628\u062A\u0641\u0635\u064A\u0644 \u0645\u062A\u0642\u0646 \u0648\u062E\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u062E\u0631\u062C.",
      basePrice: 2800,
      imageUrl: ROBE_IMAGE_PATH,
      options: [{ label: "\u0631\u0648\u0628 \u0645\u0644\u0643\u064A", price: 2800 }],
      secondaryLabel: "\u0627\u0644\u0645\u0642\u0627\u0633 \u0627\u0644\u0642\u064A\u0627\u0633\u064A",
      secondaryOptions: ["S", "M", "L", "XL", "XXL", "\u0645\u0642\u0627\u0633 \u062E\u0627\u0635"]
    };
    const nextProducts = [...storeState.products, newGown];
    const nextTexts = syncCustomProductsToTexts(
      nextProducts,
      dynamicSettings.customTexts ?? storeState.customTexts ?? {}
    );
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    writeCachedProducts(nextProducts);
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState((prev) => ({
      ...prev,
      products: nextProducts,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    }));
    notify(
      "success",
      '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0646\u0648\u0639 \u0631\u0648\u0628 \u062C\u062F\u064A\u062F! \u064A\u0645\u0643\u0646\u0643 \u062A\u0639\u062F\u064A\u0644 \u0627\u0633\u0645\u0647 \u0648\u0633\u0639\u0631\u0647 \u0648\u0635\u0648\u0631\u062A\u0647 \u062B\u0645 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631".'
    );
  };
  const handleDeleteProduct = (productId) => {
    const nextProducts = storeState.products.filter((p) => p.id !== productId);
    const nextDeletedIds = Array.from(
      /* @__PURE__ */ new Set([...dynamicSettings.deletedProductIds || [], productId])
    );
    const nextOverrides = { ...dynamicSettings.productPriceOverrides || {} };
    delete nextOverrides[productId];
    const nextColorImages = { ...dynamicSettings.productColorImages || {} };
    delete nextColorImages[productId];
    const nextDisabledColorizeIds = (dynamicSettings.disabledColorizeProductIds || []).filter((id) => id !== productId);
    const nextTexts = syncCustomProductsToTexts(nextProducts, {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      "catalog.deletedIds": JSON.stringify(nextDeletedIds)
    });
    delete nextTexts[`product.${productId}.name`];
    delete nextTexts[`product.${productId}.branch`];
    delete nextTexts[`product.${productId}.desc`];
    delete nextTexts[`product.${productId}.imageUrl`];
    delete nextTexts[`product.${productId}.autoColorize`];
    if (nextDisabledColorizeIds.length > 0) {
      nextTexts["catalog.deletedIds"] = JSON.stringify(nextDeletedIds);
      nextTexts["catalog.disabledColorizeIds"] = JSON.stringify(
        nextDisabledColorizeIds
      );
    } else {
      delete nextTexts["catalog.disabledColorizeIds"];
    }
    if (Object.keys(nextOverrides).length > 0) {
      nextTexts["catalog.priceOverrides"] = JSON.stringify(nextOverrides);
    } else {
      delete nextTexts["catalog.priceOverrides"];
    }
    if (Object.keys(nextColorImages).length > 0) {
      nextTexts["product.colorImages"] = JSON.stringify(nextColorImages);
    } else {
      delete nextTexts["product.colorImages"];
    }
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      deletedProductIds: nextDeletedIds,
      disabledColorizeProductIds: nextDisabledColorizeIds,
      productPriceOverrides: nextOverrides,
      productColorImages: nextColorImages,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      products: nextProducts,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedProducts(nextProducts);
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    void saveDynamicSettings(nextDynamic, nextState).then((res) => {
      if (res.normalizedSettings) {
        setDynamicSettings(res.normalizedSettings);
      }
      if (res.savedToStoreSettings || res.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 \u0648\u062D\u0641\u0638 \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    }).catch(() => {
      notify("info", '\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0646\u0648\u0639 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    });
  };
  const handleUpdateProductPrice = async (productId, nextPrice, optionIdx) => {
    const safePrice = Math.max(0, Math.round(nextPrice));
    let updatedProduct = null;
    const nextProducts = storeState.products.map((p) => {
      if (p.id !== productId) return p;
      const hasOptions = Array.isArray(p.options) && p.options.length > 0;
      const targetIdx = optionIdx !== void 0 && optionIdx >= 0 && optionIdx < p.options.length ? optionIdx : 0;
      const nextOptions = hasOptions ? p.options.map(
        (opt, idx) => idx === targetIdx ? { ...opt, price: safePrice } : opt
      ) : p.options;
      const nextBasePrice = targetIdx === 0 ? safePrice : p.basePrice;
      updatedProduct = {
        ...p,
        basePrice: nextBasePrice,
        options: nextOptions
      };
      return updatedProduct;
    });
    if (!updatedProduct) return;
    const resolvedProd = updatedProduct;
    const existingOverride = (dynamicSettings.productPriceOverrides || {})[productId];
    const nextOverrides = {
      ...dynamicSettings.productPriceOverrides || {},
      [productId]: {
        ...existingOverride,
        basePrice: resolvedProd.basePrice,
        ...resolvedProd.options.length > 0 ? { options: resolvedProd.options } : {}
      }
    };
    const nextTexts = syncCustomProductsToTexts(nextProducts, {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      "catalog.priceOverrides": JSON.stringify(nextOverrides)
    });
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      productPriceOverrides: nextOverrides,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      products: nextProducts,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedProducts(nextProducts);
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    } catch {
      notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    }
  };
  const handleUpdateProductDescription = async (productId, nextDescription) => {
    const cleanDesc = nextDescription.trim();
    if (!cleanDesc) return;
    let updated = false;
    const nextProducts = storeState.products.map((p) => {
      if (p.id !== productId) return p;
      updated = true;
      return { ...p, description: cleanDesc };
    });
    if (!updated) return;
    const nextTexts = syncCustomProductsToTexts(nextProducts, {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      [`product.${productId}.desc`]: cleanDesc
    });
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      products: nextProducts,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedProducts(nextProducts);
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u062C\u062F\u064A\u062F \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0648\u0635\u0641 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    } catch {
      notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0648\u0635\u0641 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    }
  };
  const handleToggleAutoColorize = async (productId) => {
    let nextDisabledState = false;
    const nextProducts = storeState.products.map((p) => {
      if (p.id !== productId) return p;
      nextDisabledState = !Boolean(p.disableAutoColorize);
      return { ...p, disableAutoColorize: nextDisabledState };
    });
    const nextDisabledIds = nextProducts.filter((p) => Boolean(p.disableAutoColorize)).map((p) => p.id);
    const nextTexts = syncCustomProductsToTexts(nextProducts, {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      [`product.${productId}.autoColorize`]: nextDisabledState ? "0" : "1"
    });
    if (nextDisabledIds.length > 0) {
      nextTexts["catalog.disabledColorizeIds"] = JSON.stringify(nextDisabledIds);
    } else {
      delete nextTexts["catalog.disabledColorizeIds"];
    }
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      disabledColorizeProductIds: nextDisabledIds,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      products: nextProducts,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedProducts(nextProducts);
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify(
          "success",
          nextDisabledState ? "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u062D\u0641\u0638\u0647 \u0641\u064A \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A." : "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u062D\u0641\u0638\u0647 \u0641\u064A \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A."
        );
      } else {
        notify(
          "info",
          nextDisabledState ? '\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647.' : '\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647.'
        );
      }
    } catch {
      notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.');
    }
  };
  const handleUpdateCapOptionPrice = async (capId, nextPrice) => {
    const safePrice = Math.round(nextPrice);
    const nextCapPrices = {
      ...DEFAULT_CAP_OPTION_PRICES,
      ...dynamicSettings.capOptionPrices || {},
      [capId]: safePrice
    };
    const nextTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      "catalog.capOptionPrices": JSON.stringify(nextCapPrices)
    };
    const nextDynamic = {
      ...dynamicSettings,
      capOptionPrices: nextCapPrices,
      customTexts: nextTexts,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0633\u0639\u0631 \u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u062C\u062F\u064A\u062F \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0633\u0639\u0631 \u0627\u0644\u0642\u0628\u0639\u0629 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    } catch {
      notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0633\u0639\u0631 \u0627\u0644\u0642\u0628\u0639\u0629 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    }
  };
  const handleUpdateCustomModelPrice = async (nextPrice) => {
    const safePrice = Math.max(0, Math.round(nextPrice));
    const nextTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      "customModel.basePrice": String(safePrice)
    };
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0633\u0639\u0631 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u062E\u0627\u0635 \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    } catch {
      notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    }
  };
  const handleUpdateCrystalRoyalColors = async (nextColors) => {
    const cleaned = sanitizeCrystalRoyalColors(nextColors);
    const nextTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
      "catalog.crystalRoyalColors": JSON.stringify(cleaned)
    };
    const nextDynamic = {
      ...dynamicSettings,
      customTexts: nextTexts,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const nextState = {
      ...storeState,
      customTexts: nextTexts,
      dynamicSettings: nextDynamic
    };
    writeCachedDynamicSettings(nextDynamic);
    setDynamicSettings(nextDynamic);
    setStoreState(nextState);
    try {
      const result = await saveDynamicSettings(nextDynamic, nextState);
      if (result.normalizedSettings) {
        setDynamicSettings(result.normalizedSettings);
      }
      if (result.savedToStoreSettings || result.savedToBackup) {
        notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0633\u062A\u0629 \u0644\u0634\u0627\u0644 \u0627\u0644\u0643\u0631\u064A\u0633\u062A\u0627\u0644 \u0627\u0644\u0645\u0644\u0643\u064A \u0628\u0646\u062C\u0627\u062D!");
      } else {
        notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
      }
    } catch {
      notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
    }
  };
  const handleSaveCopy = (nextCopy) => {
    const syncedTexts = {
      ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
    };
    delete syncedTexts["header.brandName"];
    delete syncedTexts["footer.brandName"];
    delete syncedTexts["hero.eyebrow"];
    delete syncedTexts["hero.title"];
    delete syncedTexts["hero.subtitle"];
    delete syncedTexts["studio.title"];
    delete syncedTexts["studio.subtitle"];
    delete syncedTexts["pricing.title"];
    delete syncedTexts["pricing.subtitle"];
    setStoreState((prev) => ({
      ...prev,
      copy: nextCopy,
      customTexts: syncedTexts
    }));
    void handleUpdateDynamicSettings({
      ...dynamicSettings,
      heroTitle: nextCopy.heroTitle,
      heroSubtitle: nextCopy.heroSubtitle,
      customTexts: syncedTexts
    }).catch(() => {
    });
    notify("success", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0646\u0635\u0648\u0635. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062D\u0641\u0638\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
  };
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".section-reveal"));
    if (els.length === 0) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "80px 0px 80px 0px" }
    );
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.15) {
        el.classList.add("in-view");
      } else {
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [sectionOrder, isAdminMode]);
  useEffect(() => {
    let rafId = 0;
    const updateScrollIndicators = () => {
      rafId = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleX(${progress})`;
      }
      const nextShow = scrollTop > 400;
      setShowBackToTop((prev) => prev === nextShow ? prev : nextShow);
    };
    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollIndicators);
      }
    };
    updateScrollIndicators();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const storewideDiscountPercent = dynamicSettings.promoSettings?.storewideDiscountPercent || 0;
  const activeCustomTexts = dynamicSettings.customTexts ?? storeState.customTexts ?? {};
  const activeHiddenSections = dynamicSettings.hiddenSections || {};
  const storeWhatsappNumber = formatWhatsAppNumber(dynamicSettings.whatsappNumber) || WHATSAPP_NUMBER;
  return /* @__PURE__ */ jsx(
    StoreEditProvider,
    {
      isAdminMode,
      customTexts: activeCustomTexts,
      hiddenSections: activeHiddenSections,
      onUpdateText: handleUpdateCustomText,
      onClearText: handleClearCustomText,
      onRestoreText: handleRestoreCustomText,
      onToggleSectionHidden: handleToggleSectionHidden,
      children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1617] relative overflow-x-hidden", children: [
        /* @__PURE__ */ jsx(MetaPixelConsent, { pixelId: dynamicSettings.customTexts?.[META_PIXEL_SETTING_KEY] || "" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "fixed top-0 inset-x-0 z-50 h-[2px] pointer-events-none bg-transparent",
            children: /* @__PURE__ */ jsx(
              "div",
              {
                ref: scrollProgressRef,
                className: "h-full w-full origin-right bg-[#C6A355] will-change-transform",
                style: { transform: "scaleX(0)" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Header,
          {
            brandName: storeState.copy.brandName,
            logoUrl: storeState.logoUrl,
            cartCount: totalCartItems,
            cartPulseActive,
            isAdminMode,
            isSaving: isSavingCloud,
            storewideDiscountPercent,
            seasonBannerEnabled: dynamicSettings.seasonBannerEnabled ?? true,
            seasonBannerText: dynamicSettings.seasonBannerText,
            showTestimonialsLink: true,
            onOpenCart: () => openAppModal("cart"),
            onOpenOrderTracking: () => openAppModal("tracking"),
            onPublish: handlePublishToCloud,
            onLogout: handleAdminLogout,
            onOpenCopyEditor: () => openAppModal("copy"),
            onOpenAddProduct: () => {
              setProductModalState({
                isOpen: true,
                category: "shawl",
                editing: null
              });
              openAppModal("productEditor");
            },
            onUploadLogo: handleUploadLogo,
            onUploadHeroImage: handleUploadHeroImage,
            isUploadingHeroImage,
            onSelectCategory: (category) => setRequestedCatalogSection({ category, nonce: Date.now() })
          }
        ),
        dynamicSettings.ordersPaused && /* @__PURE__ */ jsx(
          "div",
          {
            role: "status",
            className: "relative z-20 bg-gradient-to-l from-[#FFF1F3] via-[#FAF8F5] to-[#FFF1F3] border-b border-[#C6A355]/35 px-4 py-3 text-center",
            children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-[#9F1239]", children: [
              /* @__PURE__ */ jsx(PauseCircle, { className: "w-4 h-4 shrink-0 text-[#BE123C]" }),
              /* @__PURE__ */ jsx("span", { children: dynamicSettings.pauseMessage || DEFAULT_PAUSE_MESSAGE })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("main", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "pointer-events-none select-none fixed inset-0 z-0 overflow-hidden mix-blend-multiply opacity-[0.045]",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full isolate bg-white", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-full h-full",
                    style: {
                      backgroundImage: `url("${BRAND_LOGO_PATH}")`,
                      backgroundRepeat: "repeat",
                      backgroundSize: "340px 340px",
                      backgroundPosition: "center"
                    }
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#5E1734] mix-blend-screen" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx(
              HeroSection,
              {
                copy: storeState.copy,
                heroTitleOverride: dynamicSettings.heroTitle,
                heroSubtitleOverride: dynamicSettings.heroSubtitle,
                heroImageUrl: dynamicSettings.heroImageUrl,
                galleryImages: dynamicSettings.showcasePhotos ?? DEFAULT_SHOWCASE_PHOTOS,
                isUploadingHeroImage,
                isSavingCloud,
                storewideDiscountPercent,
                isAdminMode,
                onUploadHeroImage: handleUploadHeroImage,
                onResetHeroImage: handleResetHeroImage,
                onUpdateGalleryImages: (nextPhotos) => {
                  const nextDynamic = {
                    ...dynamicSettings,
                    showcasePhotos: nextPhotos
                  };
                  setDynamicSettings(nextDynamic);
                  writeCachedDynamicSettings(nextDynamic);
                  setStoreState((prev) => ({
                    ...prev,
                    dynamicSettings: nextDynamic
                  }));
                },
                onDeletePrimarySlide: (nextHeroUrl, nextPhotos) => {
                  const nextTexts = {
                    ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
                  };
                  if (nextHeroUrl) {
                    nextTexts["hero.coverImage"] = nextHeroUrl;
                  } else {
                    delete nextTexts["hero.coverImage"];
                  }
                  const nextDynamic = {
                    ...dynamicSettings,
                    heroImageUrl: nextHeroUrl,
                    showcasePhotos: nextPhotos,
                    customTexts: nextTexts
                  };
                  setDynamicSettings(nextDynamic);
                  writeCachedDynamicSettings(nextDynamic);
                  setStoreState((prev) => ({
                    ...prev,
                    customTexts: nextTexts,
                    dynamicSettings: nextDynamic
                  }));
                },
                onPublish: handlePublishToCloud,
                onSaveHeroText: async (nextTitle, nextSubtitle) => {
                  const nextCopy = {
                    ...storeState.copy,
                    heroTitle: nextTitle,
                    heroSubtitle: nextSubtitle
                  };
                  const nextDynamic = {
                    ...dynamicSettings,
                    heroTitle: nextTitle,
                    heroSubtitle: nextSubtitle
                  };
                  setStoreState((prev) => ({
                    ...prev,
                    copy: nextCopy,
                    dynamicSettings: nextDynamic
                  }));
                  await handleUpdateDynamicSettings(nextDynamic);
                },
                onNotify: notify
              }
            ),
            /* @__PURE__ */ jsx(
              OurStorySection,
              {
                isAdminMode,
                storyImageUrl: dynamicSettings.customTexts?.["story.imageUrl"] || storeState.customTexts?.["story.imageUrl"],
                isUploadingStoryImage,
                onUploadStoryImage: handleUploadStoryImage,
                onResetStoryImage: handleResetStoryImage
              }
            ),
            sectionOrder.map((secId, index) => {
              const sectionTitle = secId === "catalog" ? "\u0623\u0642\u0633\u0627\u0645 \u062F\u0627\u0631 \u0627\u0644\u0623\u0632\u064A\u0627\u0621 (\u0627\u0644\u0648\u0634\u0627\u062D \u0648\u0627\u0644\u0631\u0648\u0628 \u0648\u0627\u0644\u0642\u0628\u0639\u0629)" : secId === "studio" ? "\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u0634\u0627\u062D" : secId === "howToOrder" ? "\u0643\u064A\u0641 \u062A\u0637\u0644\u0628 \u0637\u0642\u0645 \u062A\u062E\u0631\u062C\u0643" : "\u062C\u062F\u0648\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629";
              const sectionKey = secId;
              const isSectionHidden = Boolean(activeHiddenSections[sectionKey]);
              if (isSectionHidden && !isAdminMode) {
                return null;
              }
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `relative ${secId === "catalog" ? "" : "section-reveal"}`,
                  children: [
                    isAdminMode && /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734] bg-white px-3 py-1.5 rounded-full border border-[#C6A355]/45 shadow-xs", children: isSectionHidden ? `\u0642\u0633\u0645 \u0645\u062E\u0641\u064A \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646: ${sectionTitle}` : `\u0642\u0633\u0645: ${sectionTitle}` }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(
                          SectionHideButton,
                          {
                            sectionKey,
                            label: sectionTitle
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: index === 0,
                            onClick: () => moveSection(secId, -1),
                            className: "px-3 py-1.5 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#1A1617] disabled:opacity-40 cursor-pointer hover:border-[#5E1734] shadow-xs",
                            children: "\u2191 \u0646\u0642\u0644 \u0644\u0644\u0623\u0639\u0644\u0649"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: index === sectionOrder.length - 1,
                            onClick: () => moveSection(secId, 1),
                            className: "px-3 py-1.5 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#1A1617] disabled:opacity-40 cursor-pointer hover:border-[#5E1734] shadow-xs",
                            children: "\u2193 \u0646\u0642\u0644 \u0644\u0644\u0623\u0633\u0641\u0644"
                          }
                        )
                      ] })
                    ] }),
                    !isSectionHidden && secId === "catalog" && /* @__PURE__ */ jsx(
                      ProductCatalog,
                      {
                        products: storeState.products,
                        requestedSection: requestedCatalogSection,
                        pausedCategories: dynamicSettings.pausedCategories,
                        categoryPauseBadge: dynamicSettings.categoryPauseBadge,
                        storewideDiscountPercent,
                        whatsappNumber: storeWhatsappNumber,
                        onExpressCheckout: () => openAppModal("cart"),
                        stoleColors: dynamicSettings.stoleColors,
                        crepeStoleColors: dynamicSettings.crepeStoleColors ?? CREPE_STOLE_COLORS,
                        crystalRoyalColors: sanitizeCrystalRoyalColors(
                          dynamicSettings.customTexts?.["catalog.crystalRoyalColors"] ?? storeState.customTexts?.["catalog.crystalRoyalColors"]
                        ),
                        onUpdateCrystalRoyalColors: handleUpdateCrystalRoyalColors,
                        gownColors: dynamicSettings.gownColors,
                        threadColors: dynamicSettings.threadColors,
                        capColors: dynamicSettings.capColors,
                        categoryBranches: dynamicSettings.categoryBranches,
                        categoryImageBgColors: dynamicSettings.categoryImageBgColors,
                        categoryCoverImages: dynamicSettings.categoryCoverImages,
                        americanShawlFrontImage: dynamicSettings.americanShawlFrontImage || dynamicSettings.customTexts?.["americanShawl.frontImage"],
                        americanShawlBackImage: dynamicSettings.americanShawlBackImage || dynamicSettings.customTexts?.["americanShawl.backImage"],
                        regularShawlBaseImage: dynamicSettings.regularShawlBaseImage || dynamicSettings.customTexts?.["regularShawl.baseImage"],
                        onUpdateCategoryImageBgColor: handleUpdateCategoryImageBgColor,
                        onReplaceCategoryCoverImage: handleReplaceCategoryCoverImage,
                        onReplaceAmericanShawlImage: handleReplaceAmericanShawlImage,
                        onReplaceRegularShawlBaseImage: handleReplaceRegularShawlBaseImage,
                        onUpdateCategoryBranches: handleUpdateCategoryBranches,
                        onNotify: notify,
                        onToggleProductField: (id, field) => {
                          setStoreState((prev) => ({
                            ...prev,
                            products: prev.products.map(
                              (p) => p.id === id ? { ...p, [field]: !p[field] } : p
                            )
                          }));
                          notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0638\u0647\u0648\u0631 \u0627\u0644\u0642\u0633\u0645. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u063A\u064A\u064A\u0631.');
                        },
                        onUpdateProductOptions: async (id, nextOptions) => {
                          let resolvedProduct = null;
                          const nextProducts = storeState.products.map((p) => {
                            if (p.id !== id) return p;
                            resolvedProduct = {
                              ...p,
                              options: nextOptions,
                              basePrice: nextOptions[0]?.price ?? p.basePrice
                            };
                            return resolvedProduct;
                          });
                          const existingOverride = (dynamicSettings.productPriceOverrides || {})[id];
                          const nextOverrides = {
                            ...dynamicSettings.productPriceOverrides || {},
                            [id]: {
                              ...existingOverride,
                              basePrice: resolvedProduct ? resolvedProduct.basePrice : nextOptions[0]?.price ?? 0,
                              options: nextOptions
                            }
                          };
                          const nextTexts = syncCustomProductsToTexts(nextProducts, {
                            ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
                            "catalog.priceOverrides": JSON.stringify(nextOverrides)
                          });
                          const nextDynamic = {
                            ...dynamicSettings,
                            customTexts: nextTexts,
                            productPriceOverrides: nextOverrides,
                            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                          };
                          const nextState = {
                            ...storeState,
                            products: nextProducts,
                            customTexts: nextTexts,
                            dynamicSettings: nextDynamic
                          };
                          writeCachedProducts(nextProducts);
                          writeCachedDynamicSettings(nextDynamic);
                          setDynamicSettings(nextDynamic);
                          setStoreState(nextState);
                          try {
                            const result = await saveDynamicSettings(nextDynamic, nextState);
                            if (result.normalizedSettings) {
                              setDynamicSettings(result.normalizedSettings);
                            }
                            if (result.savedToStoreSettings || result.savedToBackup) {
                              notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0642\u0645\u0627\u0634 \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0646\u062C\u0627\u062D!");
                            } else {
                              notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
                            }
                          } catch {
                            notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062A\u0646\u0633\u064A\u0642\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
                          }
                        },
                        onUpdateSecondaryOptions: async (id, nextOptions, nextPrices) => {
                          let resolvedProduct = null;
                          const nextProducts = storeState.products.map((p) => {
                            if (p.id !== id) return p;
                            resolvedProduct = {
                              ...p,
                              secondaryOptions: nextOptions,
                              secondaryOptionPrices: nextPrices !== void 0 ? nextPrices : p.secondaryOptionPrices
                            };
                            return resolvedProduct;
                          });
                          const targetProd = resolvedProduct;
                          const existingOverride = (dynamicSettings.productPriceOverrides || {})[id];
                          const nextOverrides = {
                            ...dynamicSettings.productPriceOverrides || {},
                            [id]: {
                              ...existingOverride,
                              basePrice: targetProd?.basePrice ?? existingOverride?.basePrice ?? 0,
                              secondaryOptions: nextOptions,
                              ...targetProd?.secondaryOptionPrices ? { secondaryOptionPrices: targetProd.secondaryOptionPrices } : {}
                            }
                          };
                          const nextTexts = syncCustomProductsToTexts(nextProducts, {
                            ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
                            "catalog.priceOverrides": JSON.stringify(nextOverrides)
                          });
                          const nextDynamic = {
                            ...dynamicSettings,
                            customTexts: nextTexts,
                            productPriceOverrides: nextOverrides,
                            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                          };
                          const nextState = {
                            ...storeState,
                            products: nextProducts,
                            customTexts: nextTexts,
                            dynamicSettings: nextDynamic
                          };
                          writeCachedProducts(nextProducts);
                          writeCachedDynamicSettings(nextDynamic);
                          setDynamicSettings(nextDynamic);
                          setStoreState(nextState);
                          try {
                            const result = await saveDynamicSettings(nextDynamic, nextState);
                            if (result.normalizedSettings) {
                              setDynamicSettings(result.normalizedSettings);
                            }
                            if (result.savedToStoreSettings || result.savedToBackup) {
                              notify("success", "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0646\u062C\u0627\u062D.");
                            } else {
                              notify("info", '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
                            }
                          } catch {
                            notify("info", '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B.');
                          }
                        },
                        isAdminMode,
                        onAddToCart: handleAddToCart,
                        onOpenAddProduct: (defaultCat) => {
                          setProductModalState({
                            isOpen: true,
                            category: defaultCat || "shawl",
                            editing: null
                          });
                          openAppModal("productEditor");
                        },
                        onEditProduct: (product) => {
                          setProductModalState({
                            isOpen: true,
                            category: product.category,
                            editing: product
                          });
                          openAppModal("productEditor");
                        },
                        onDeleteProduct: handleDeleteProduct,
                        onUpdateProductPrice: handleUpdateProductPrice,
                        onUpdateProductDescription: handleUpdateProductDescription,
                        onToggleAutoColorize: handleToggleAutoColorize,
                        capOptionPrices: dynamicSettings.capOptionPrices,
                        onUpdateCapOptionPrice: handleUpdateCapOptionPrice,
                        customModelBasePrice: Number(
                          dynamicSettings.customTexts?.["customModel.basePrice"] ?? storeState.customTexts?.["customModel.basePrice"] ?? 4e3
                        ) || 4e3,
                        onUpdateCustomModelPrice: handleUpdateCustomModelPrice,
                        overriddenOptionProductIds: Object.keys(
                          dynamicSettings.productPriceOverrides || {}
                        ).filter(
                          (pid) => Array.isArray(dynamicSettings.productPriceOverrides?.[pid]?.options)
                        ),
                        onQuickAddRobe: handleQuickAddRobe,
                        onReplaceProductImage: handleReplaceProductImage,
                        onRemoveProductImage: (id) => {
                          const nextProducts = storeState.products.map(
                            (p) => p.id === id ? { ...p, imageUrl: "" } : p
                          );
                          const nextTexts = syncCustomProductsToTexts(nextProducts, {
                            ...dynamicSettings.customTexts ?? storeState.customTexts ?? {},
                            [`product.${id}.imageUrl`]: ""
                          });
                          const nextDynamic = {
                            ...dynamicSettings,
                            customTexts: nextTexts,
                            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                          };
                          const nextState = {
                            ...storeState,
                            products: nextProducts,
                            customTexts: nextTexts,
                            dynamicSettings: nextDynamic
                          };
                          writeCachedProducts(nextProducts);
                          writeCachedDynamicSettings(nextDynamic);
                          setDynamicSettings(nextDynamic);
                          setStoreState(nextState);
                          void saveDynamicSettings(nextDynamic, nextState).catch(() => {
                          });
                          notify("info", '\u062A\u0645\u062A \u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0635\u0648\u0631\u0629. \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u063A\u064A\u064A\u0631.');
                        },
                        onSetProductColorImage: async (id, colorName, file) => {
                          try {
                            let optimizedUrl = "";
                            if (file) {
                              try {
                                optimizedUrl = await uploadStoreImage(file, 800, 0.8);
                              } catch {
                                optimizedUrl = await compressReceiptImage(file, 800, 0.8);
                              }
                            }
                            const dataUrl = optimizedUrl;
                            const nextProducts = storeState.products.map((p) => {
                              if (p.id !== id) return p;
                              const updatedColors = { ...p.colorImages || {} };
                              if (dataUrl) {
                                updatedColors[colorName] = dataUrl;
                              } else {
                                delete updatedColors[colorName];
                              }
                              return {
                                ...p,
                                colorImages: Object.keys(updatedColors).length > 0 ? updatedColors : void 0
                              };
                            });
                            const nextProductColorImages = {
                              ...dynamicSettings.productColorImages || {}
                            };
                            for (const prod of nextProducts) {
                              if (prod.colorImages && Object.keys(prod.colorImages).length > 0) {
                                nextProductColorImages[prod.id] = prod.colorImages;
                              } else {
                                delete nextProductColorImages[prod.id];
                              }
                            }
                            const nextTexts = {
                              ...dynamicSettings.customTexts ?? storeState.customTexts ?? {}
                            };
                            if (Object.keys(nextProductColorImages).length > 0) {
                              nextTexts["product.colorImages"] = JSON.stringify(
                                nextProductColorImages
                              );
                            } else {
                              delete nextTexts["product.colorImages"];
                            }
                            const nextDynamic = {
                              ...dynamicSettings,
                              customTexts: nextTexts,
                              productColorImages: nextProductColorImages
                            };
                            writeCachedDynamicSettings(nextDynamic);
                            setDynamicSettings(nextDynamic);
                            setStoreState((prev) => ({
                              ...prev,
                              products: nextProducts,
                              customTexts: nextTexts,
                              dynamicSettings: nextDynamic
                            }));
                            notify(
                              "info",
                              file ? `\u062A\u0645 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0644\u0648\u0646 "${colorName}". \u0627\u0636\u063A\u0637\u064A "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627.` : `\u062A\u0645 \u062D\u0630\u0641 \u0635\u0648\u0631\u0629 \u0644\u0648\u0646 "${colorName}".`
                            );
                          } catch {
                            notify("error", "\u062A\u0639\u0630\u0631 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0635\u0648\u0631\u0629. \u062C\u0631\u0628\u064A \u0635\u0648\u0631\u0629 \u0623\u062E\u0631\u0649.");
                          }
                        }
                      }
                    ),
                    !isSectionHidden && secId === "studio" && /* @__PURE__ */ jsx(
                      StoleStudio,
                      {
                        title: storeState.copy.studioTitle,
                        subtitle: storeState.copy.studioSubtitle,
                        studioBgUrl: storeState.studioBgUrl,
                        isAdminMode,
                        stoleColors: dynamicSettings.stoleColors,
                        threadColors: dynamicSettings.threadColors,
                        onUploadStudioBg: handleUploadStudioBg,
                        onNotify: notify
                      }
                    ),
                    !isSectionHidden && secId === "howToOrder" && /* @__PURE__ */ jsx(HowToOrderSection, {}),
                    !isSectionHidden && secId === "pricing" && /* @__PURE__ */ jsx(
                      PricingAndFaq,
                      {
                        pricesTitle: storeState.copy.pricesTitle,
                        pricesSubtitle: storeState.copy.pricesSubtitle
                      }
                    )
                  ]
                },
                secId
              );
            }),
            /* @__PURE__ */ jsx("div", { className: "section-reveal", children: /* @__PURE__ */ jsx(
              TestimonialsSection,
              {
                testimonials: dynamicSettings.testimonials ?? [],
                isAdminMode,
                onSubmitReview: async (review) => {
                  const nextReviews = await submitCustomerReview(
                    review,
                    dynamicSettings.testimonials ?? []
                  );
                  const nextSettings = {
                    ...dynamicSettings,
                    testimonials: nextReviews
                  };
                  setDynamicSettings(nextSettings);
                  setStoreState((prev) => ({
                    ...prev,
                    dynamicSettings: nextSettings
                  }));
                },
                onDeleteReview: async (id) => {
                  const nextReviews = await deleteCustomerReview(
                    id,
                    dynamicSettings.testimonials ?? []
                  );
                  const nextSettings = {
                    ...dynamicSettings,
                    testimonials: nextReviews
                  };
                  setDynamicSettings(nextSettings);
                  setStoreState((prev) => ({
                    ...prev,
                    dynamicSettings: nextSettings
                  }));
                },
                onNotify: notify
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Footer,
          {
            brandName: storeState.copy.brandName,
            whatsappNumber: storeWhatsappNumber,
            isAdminAuthenticated,
            instagramUrl: dynamicSettings.instagramUrl,
            facebookUrl: dynamicSettings.facebookUrl,
            tiktokUrl: dynamicSettings.tiktokUrl,
            onOpenTracking: () => openAppModal("tracking"),
            onUnlockAdmin: handleUnlockAdmin
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "fixed bottom-20 md:bottom-5 left-4 sm:left-5 z-30 group flex items-center", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "whatsapp-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-[#147A53]/45"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `https://wa.me/${storeWhatsappNumber}`,
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "\u062A\u062D\u062A\u0627\u062C \u0645\u0633\u0627\u0639\u062F\u0629\u061F \u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628",
              className: "relative w-12 h-12 rounded-full bg-[#147A53] hover:bg-[#0F5E40] text-white shadow-xl ring-2 ring-white/85 flex items-center justify-center transition-transform duration-200 touch-manipulation active:scale-95 hover:scale-105",
              children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              role: "tooltip",
              className: "pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-2xl bg-[#1A1617] text-white text-xs font-bold shadow-lg border border-[#C6A355]/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200",
              children: "\u062A\u062D\u062A\u0627\u062C \u0645\u0633\u0627\u0639\u062F\u0629\u061F \u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            "aria-label": "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0639\u0644\u0649",
            title: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0639\u0644\u0649",
            className: `fixed z-30 inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-full bg-white/95 backdrop-blur-md border border-[#C6A355]/70 text-[#5E1734] hover:bg-[#FAF8F5] hover:border-[#C6A355] shadow-lg transition-all duration-200 ease-out touch-manipulation active:scale-95 cursor-pointer ${isAdminMode ? "bottom-56 md:bottom-48 right-4 sm:right-5" : "bottom-20 md:bottom-5 right-4 sm:right-5"} ${showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"}`,
            children: [
              /* @__PURE__ */ jsx(ArrowUp, { className: "w-4 h-4 text-[#C6A355]" }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold leading-none", children: "\u0644\u0644\u0623\u0639\u0644\u0649" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "nav",
          {
            "aria-label": "\u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0644\u0644\u0647\u0627\u062A\u0641",
            className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/92 backdrop-blur-md border-t border-[#C6A355]/35 shadow-[0_-8px_24px_rgba(36,19,27,0.08)] pb-[env(safe-area-inset-bottom)]",
            children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 h-16 px-1.5", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  className: "flex flex-col items-center justify-center gap-1 text-[#1A1617] hover:text-[#5E1734] active:scale-95 transition-all cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Home, { className: "w-5 h-5 text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold leading-none", children: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const el = document.getElementById("catalog-sec");
                    if (el) {
                      const top = Math.max(
                        0,
                        el.getBoundingClientRect().top + window.scrollY - 84
                      );
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  },
                  className: "flex flex-col items-center justify-center gap-1 text-[#1A1617] hover:text-[#5E1734] active:scale-95 transition-all cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(LayoutGrid, { className: "w-5 h-5 text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold leading-none", children: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openAppModal("tracking"),
                  className: "flex flex-col items-center justify-center gap-1 text-[#1A1617] hover:text-[#5E1734] active:scale-95 transition-all cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(PackageSearch, { className: "w-5 h-5 text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold leading-none", children: "\u062A\u062A\u0628\u0651\u0639 \u0637\u0644\u0628\u064A" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openAppModal("cart"),
                  className: `relative flex flex-col items-center justify-center gap-1 rounded-xl mx-1 my-1 transition-all cursor-pointer active:scale-95 ${cartPulseActive ? "bg-[#FFF9EE] text-[#5E1734] ring-2 ring-[#C6A355] shadow-[0_0_16px_rgba(198,163,85,0.55)] animate-bounce" : "text-[#1A1617] hover:text-[#5E1734]"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      cartPulseActive && /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "pointer-events-none -inset-1.5 absolute rounded-full ring-2 ring-[#C6A355] animate-ping opacity-80"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        ShoppingBag,
                        {
                          className: `w-5 h-5 text-[#5E1734] ${cartPulseActive ? "cart-attention-shake" : ""}`
                        }
                      ),
                      totalCartItems > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `absolute -top-1.5 -left-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#5E1734] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-xs border border-white ${cartPulseActive ? "ring-2 ring-[#C6A355] scale-110" : ""}`,
                          children: totalCartItems
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold leading-none", children: "\u0627\u0644\u062D\u0642\u064A\u0628\u0629" })
                  ]
                }
              )
            ] })
          }
        ),
        addedCartAlert && !isCartOpen && /* @__PURE__ */ jsxs(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: "cart-confirm-pop fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-50 bg-white border-2 border-[#C6A355] rounded-2xl shadow-2xl p-4 text-[#1A1617]",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-1 text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base font-extrabold text-[#147A53] leading-snug", children: "\u2705 \u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0625\u0644\u0649 \u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0628\u0646\u062C\u0627\u062D!" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-bold text-[#1A1617] truncate", children: addedCartAlert.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-[#65525A] tabular-nums", children: [
                    "\u0644\u062F\u064A\u0643 \u0627\u0644\u0622\u0646",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-extrabold text-[#5E1734]", children: addedCartAlert.totalItems }),
                    " ",
                    "\u0645\u0646\u062A\u062C \u0641\u064A \u0627\u0644\u062D\u0642\u064A\u0628\u0629"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAddedCartAlert(null),
                    "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u062D\u0642\u064A\u0628\u0629",
                    className: "p-1 rounded-lg text-[#65525A] hover:text-[#1A1617] hover:bg-[#FAF8F5] transition-colors shrink-0 cursor-pointer",
                    children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => openAppModal("cart"),
                    className: "w-full py-3 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer",
                    children: "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0622\u0646 \u2190"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAddedCartAlert(null),
                    className: "w-full py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/50 text-[#1A1617] text-xs sm:text-sm font-bold transition-all active:scale-[0.98] cursor-pointer",
                    children: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062A\u0633\u0648\u0642"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-center text-[11px] font-bold text-[#5E1734]", children: "\u{1F447} \u0623\u0648 \u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0623\u064A\u0642\u0648\u0646\u0629 \u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0641\u064A \u0623\u0633\u0641\u0644 \u0627\u0644\u064A\u0633\u0627\u0631 \u0641\u064A \u0623\u064A \u0648\u0642\u062A" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          CartDrawer,
          {
            isOpen: isCartOpen,
            items: cart,
            ordersPaused: dynamicSettings.ordersPaused,
            pauseMessage: dynamicSettings.pauseMessage,
            paymentInfo: dynamicSettings.paymentInfo,
            whatsappNumber: storeWhatsappNumber,
            promoSettings: dynamicSettings.promoSettings,
            deliveryPricing: dynamicSettings.deliveryPricing,
            telegramEnabled: Boolean(dynamicSettings.telegramEnabled),
            telegramBotToken: dynamicSettings.telegramBotToken || "",
            telegramChatId: dynamicSettings.telegramChatId || "",
            onOrderSubmitted: (orderNumber) => {
              if (isAdminMode) {
                triggerIncomingOrderAlert(orderNumber, null);
              }
            },
            onClose: () => closeAppModal("cart"),
            onOpenOrderTracking: () => openAppModal("tracking"),
            onUpdateQuantity: handleUpdateQuantity,
            onRemoveItem: handleRemoveCartItem,
            onClearCart: handleClearCart,
            onNotify: notify
          }
        ),
        /* @__PURE__ */ jsx(
          OrderTrackingModal,
          {
            isOpen: isTrackingOpen,
            whatsappNumber: storeWhatsappNumber,
            onClose: () => closeAppModal("tracking")
          }
        ),
        /* @__PURE__ */ jsx(
          AdminLoginModal,
          {
            isOpen: isLoginOpen,
            onClose: () => {
              setIsPasswordRecoveryMode(false);
              closeAppModal("login");
            },
            onLogin: handleAdminLogin,
            whatsappNumber: storeWhatsappNumber,
            brandName: storeState.copy.brandName,
            forcePasswordRecovery: isPasswordRecoveryMode,
            onPasswordRecoveryComplete: () => {
              setIsPasswordRecoveryMode(false);
              if (typeof window !== "undefined" && (window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery"))) {
                const cleanUrl = `${window.location.pathname}${window.location.search.replace(/([?&])type=recovery(&|$)/, "$1").replace(/[?&]$/, "")}`;
                window.history.replaceState(window.history.state || {}, "", cleanUrl);
              }
            },
            onNotify: notify
          }
        ),
        /* @__PURE__ */ jsx(
          ProductEditorModal,
          {
            isOpen: productModalState.isOpen,
            initialCategory: productModalState.category,
            editingProduct: productModalState.editing,
            onClose: () => closeAppModal("productEditor"),
            onSave: handleSaveProduct
          }
        ),
        /* @__PURE__ */ jsx(
          CopyEditorModal,
          {
            isOpen: isCopyModalOpen,
            copy: storeState.copy,
            onClose: () => closeAppModal("copy"),
            onSaveCopy: handleSaveCopy
          }
        ),
        /* @__PURE__ */ jsx(
          AdminDashboardModal,
          {
            isOpen: isDashboardOpen,
            storeName: storeState.copy.brandName,
            dynamicSettings,
            newOrdersCount,
            orderSignalNonce,
            onAcknowledgeNewOrders: () => setNewOrdersCount(0),
            onUpdateDynamicSettings: handleUpdateDynamicSettings,
            onClose: () => closeAppModal("dashboard"),
            onNotify: notify
          }
        ),
        isAdminMode && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-20 md:bottom-5 right-3 sm:right-5 z-40 flex flex-col gap-2 bg-white/95 backdrop-blur-md border border-[#C6A355]/45 rounded-2xl shadow-2xl p-3 max-w-[230px]", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-[#5E1734] text-center pb-1.5 border-b border-[#C6A355]/30", children: "\u270F\uFE0F \u0648\u0636\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0645\u0641\u0639\u0651\u0644" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setNewOrdersCount(0);
                openAppModal("dashboard");
              },
              className: "relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] text-white text-xs font-bold transition-all touch-manipulation active:scale-95 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("span", { children: "\u{1F4CA} \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u0623\u0631\u0628\u0627\u062D" }),
                newOrdersCount > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold leading-none shadow-sm animate-pulse", children: [
                  "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F (",
                  newOrdersCount,
                  ")"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handlePublishToCloud,
              disabled: isSavingCloud,
              className: "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold transition-all touch-manipulation active:scale-95 disabled:opacity-70 cursor-pointer",
              children: isSavingCloud ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 text-[#C6A355] animate-spin shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0633\u0631\u064A\u0639..." })
              ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4BE} \u062D\u0641\u0638 \u0648\u0646\u0634\u0631" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleAdminLogout,
              className: "px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/35 text-[#1A1617] text-xs font-bold transition-all touch-manipulation active:scale-95 cursor-pointer",
              children: "\u{1F6AA} \u062E\u0631\u0648\u062C"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(ToastContainer, { toasts, onDismiss: dismissToast })
      ] })
    }
  );
}
export {
  App as default
};
