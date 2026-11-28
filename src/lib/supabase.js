import { createClient } from "@supabase/supabase-js";
import {
  ALGERIA_WILAYAS,
  DEFAULT_CAP_OPTION_PRICES,
  DEFAULT_CATEGORY_PAUSE_BADGE,
  DEFAULT_DELIVERY_PRICING,
  DEFAULT_DYNAMIC_SETTINGS,
  DEFAULT_PAUSE_MESSAGE,
  DEFAULT_PAYMENT_INFO,
  DEFAULT_PROMO_SETTINGS,
  DEFAULT_SEASON_BANNER_TEXT,
  DEFAULT_SHOWCASE_PHOTOS,
  DEFAULT_STORE_STATE,
  DEFAULT_TESTIMONIALS,
  SHAWL_AMERICAN_IMAGE_PATH,
  SHAWL_BACK_IMAGE_PATH,
  SHAWL_MISS_IMAGE_PATH,
  SHAWL_REGULAR_IMAGE_PATH,
  createDefaultDeliveryPricing,
  normalizeLegacyAssetPath,
  normalizeWhatsAppInput,
  sanitizeSocialUrl
} from "../data/defaultStore";
const DYNAMIC_SETTINGS_STORAGE_KEY = "dg_by_douaa_store_settings_v1";
const PRODUCTS_STORAGE_KEY = "dg_by_douaa_products_v1";
const SB_URL = "https://gzkllcoypsldbdixeact.supabase.co";
const SB_KEY = "sb_publishable_s2ccw-Z-ipZd3cuxMM-VoQ_8kxW0MRE";
const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
const LEGACY_PINK_STOLE_IMAGE_MAP = {
  "https://gzkllcoypsldbdixeact.supabase.co/storage/v1/object/public/store-images/store/1795111268510-309f6vu.jpg": SHAWL_MISS_IMAGE_PATH,
  "https://gzkllcoypsldbdixeact.supabase.co/storage/v1/object/public/store-images/store/1795112672794-hzxbwr9.jpg": SHAWL_REGULAR_IMAGE_PATH,
  "https://gzkllcoypsldbdixeact.supabase.co/storage/v1/object/public/store-images/store/1795068430085-fa6ifif.jpg": SHAWL_BACK_IMAGE_PATH,
  "https://gzkllcoypsldbdixeact.supabase.co/storage/v1/object/public/store-images/store/1795368961005-nxiodzh.jpg": SHAWL_AMERICAN_IMAGE_PATH
};
function readCachedProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((p) => p && typeof p.imageUrl === "string" ? { ...p, imageUrl: normalizeLegacyAssetPath(p.imageUrl) } : p);
  } catch {
    return null;
  }
}
function writeCachedProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch {
  }
}
async function loadStoreState() {
  try {
    const [{ data: store, error: storeError }, { data: authData }] = await Promise.all([
      supabase.from("store_data").select("html_content, logo_url").eq("id", 1).maybeSingle(),
      supabase.auth.getSession()
    ]);
    let state = structuredClone(DEFAULT_STORE_STATE);
    let loadedFromCloud = false;
    if (store) {
      if (store.logo_url) {
        state.logoUrl = normalizeLegacyAssetPath(store.logo_url);
      }
      if (store.html_content && store.html_content.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(store.html_content);
          if (parsed && parsed.version === 2) {
            const loadedProducts = Array.isArray(parsed.products) ? parsed.products.map(
              (p) => p.imageUrl ? { ...p, imageUrl: normalizeLegacyAssetPath(p.imageUrl) } : p
            ) : DEFAULT_STORE_STATE.products;
            state = {
              ...DEFAULT_STORE_STATE,
              ...parsed,
              copy: { ...DEFAULT_STORE_STATE.copy, ...parsed.copy || {} },
              products: loadedProducts,
              logoUrl: normalizeLegacyAssetPath(store.logo_url || parsed.logoUrl || "")
            };
            loadedFromCloud = true;
          }
        } catch {
        }
      }
    }
    if (!loadedFromCloud) {
      const cachedProducts = readCachedProducts();
      if (cachedProducts !== null) {
        state.products = cachedProducts;
      }
    }
    return {
      state,
      session: authData?.session ?? null,
      error: storeError ? storeError.message : void 0
    };
  } catch (err) {
    const fallbackState = structuredClone(DEFAULT_STORE_STATE);
    const cachedProducts = readCachedProducts();
    if (cachedProducts !== null) {
      fallbackState.products = cachedProducts;
    }
    return {
      state: fallbackState,
      session: null,
      error: err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A."
    };
  }
}
async function saveStoreState(state) {
  const serialized = JSON.stringify(state);
  const { error } = await supabase.from("store_data").upsert(
    {
      id: 1,
      html_content: serialized,
      logo_url: state.logoUrl || "",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "id" }
  );
  if (error) {
    throw new Error(error.message);
  }
}
async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  if (!data?.session) {
    throw new Error("\u0644\u0645 \u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u062C\u0644\u0633\u0629 \u062F\u062E\u0648\u0644.");
  }
  return data.session;
}
async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
async function updateAdminPassword(newPassword) {
  const clean = typeof newPassword === "string" ? newPassword : "";
  if (clean.length < 6) {
    throw new Error("\u064A\u062C\u0628 \u0623\u0646 \u062A\u062A\u0643\u0648\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.");
  }
  const { error } = await supabase.auth.updateUser({ password: clean });
  if (error) {
    throw new Error(error.message);
  }
}
async function updateAdminEmail(newEmail) {
  const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
  if (error) {
    throw new Error(error.message);
  }
}
function normalizeAlgerianPhoneE164(raw) {
  if (typeof raw !== "string") return "";
  let cleaned = raw.trim().replace(/[\s().-]+/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("00")) {
    cleaned = `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith("+")) {
    const digitsAfterPlus = cleaned.slice(1).replace(/\D/g, "");
    if (!digitsAfterPlus) return "";
    if (digitsAfterPlus.startsWith("2130") && digitsAfterPlus.length >= 13) {
      const normalizedDz = `+213${digitsAfterPlus.slice(4)}`;
      return /^\+213[567]\d{8}$/.test(normalizedDz) ? normalizedDz : "";
    }
    if (digitsAfterPlus.startsWith("213")) {
      const normalizedDz = `+${digitsAfterPlus}`;
      return /^\+213[567]\d{8}$/.test(normalizedDz) ? normalizedDz : "";
    }
    return /^\+[1-9]\d{7,14}$/.test(`+${digitsAfterPlus}`) ? `+${digitsAfterPlus}` : "";
  }
  const digits = cleaned.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("2130") && digits.length >= 13) {
    const normalizedDz = `+213${digits.slice(4)}`;
    return /^\+213[567]\d{8}$/.test(normalizedDz) ? normalizedDz : "";
  }
  if (digits.startsWith("213")) {
    const normalizedDz = `+${digits}`;
    return /^\+213[567]\d{8}$/.test(normalizedDz) ? normalizedDz : "";
  }
  if (/^0[567]\d{8}$/.test(digits)) {
    return `+213${digits.slice(1)}`;
  }
  if (/^[567]\d{8}$/.test(digits)) {
    return `+213${digits}`;
  }
  return "";
}
function isSmsGatewayNotConfiguredError(error) {
  const msg = String(error?.message || "").toLowerCase();
  const code = String(error?.code || "").toLowerCase();
  const status = Number(error?.status || 0);
  if (
    code === "phone_provider_disabled" ||
    code === "sms_send_failed" ||
    code === "otp_disabled" ||
    code === "validation_failed" && (msg.includes("phone") || msg.includes("sms"))
  ) {
    return true;
  }
  if (
    msg.includes("phone") && (msg.includes("provider") || msg.includes("disabled") || msg.includes("unsupported") || msg.includes("not configured") || msg.includes("not enabled") || msg.includes("signup")) ||
    msg.includes("sms") && (msg.includes("provider") || msg.includes("disabled") || msg.includes("not configured") || msg.includes("failed") || msg.includes("twilio") || msg.includes("vonage") || msg.includes("messagebird")) ||
    msg.includes("unsupported phone provider")
  ) {
    return true;
  }
  if ((status === 400 || status === 422 || status === 501) && (msg.includes("phone") || msg.includes("sms"))) {
    return true;
  }
  return false;
}
async function requestPasswordResetByEmail(email) {
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0635\u062D\u064A\u062D.");
  }
  const redirectTo = typeof window !== "undefined" ? window.location.origin : void 0;
  const { error } = await supabase.auth.resetPasswordForEmail(
    cleanEmail,
    redirectTo ? { redirectTo } : void 0
  );
  if (error) {
    const msg = String(error.message || "").toLowerCase();
    if (msg.includes("rate limit") || msg.includes("too many") || msg.includes("once every")) {
      throw new Error("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0645\u0633\u0628\u0642\u0627\u064B. \u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0642\u0644\u064A\u0644\u0627\u064B \u0642\u0628\u0644 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629.");
    }
    throw new Error(error.message || "\u062A\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0639\u064A\u064A\u0646.");
  }
}
async function sendPasswordResetSmsOtp(rawPhone) {
  const normalizedPhone = normalizeAlgerianPhoneE164(rawPhone);
  if (!normalizedPhone) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u062C\u0632\u0627\u0626\u0631\u064A \u0635\u062D\u064A\u062D (\u0645\u062B\u0627\u0644: 0550123456 \u0623\u0648 +213550123456).");
  }
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizedPhone
  });
  if (error) {
    if (isSmsGatewayNotConfiguredError(error)) {
      const gatewayError = new Error("\u062E\u062F\u0645\u0629 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0646\u0635\u064A\u0629 (SMS) \u063A\u064A\u0631 \u0645\u0641\u0639\u0651\u0644\u0629 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u0623\u0648 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A.");
      gatewayError.code = "SMS_GATEWAY_NOT_CONFIGURED";
      throw gatewayError;
    }
    throw new Error(error.message || "\u062A\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0639\u0628\u0631 SMS.");
  }
  return normalizedPhone;
}
async function verifyPasswordResetSmsOtp(rawPhone, token) {
  const normalizedPhone = normalizeAlgerianPhoneE164(rawPhone);
  const cleanToken = typeof token === "string" ? token.replace(/\D/g, "") : "";
  if (!normalizedPhone) {
    throw new Error("\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D.");
  }
  if (!/^\d{6}$/.test(cleanToken)) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645.");
  }
  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalizedPhone,
    token: cleanToken,
    type: "sms"
  });
  if (error) {
    throw new Error("\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629. \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.");
  }
  return data?.session ?? null;
}
function sanitizeColorList(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const cleaned = raw.filter(
    (item) => Boolean(item) && typeof item === "object" && typeof item.name === "string" && item.name.trim().length > 0 && typeof item.hex === "string" && item.hex.trim().length > 0
  ).map((item) => {
    const name = item.name.trim();
    let hex = item.hex.trim();
    const lowerHex = hex.toLowerCase();
    if (name === "\u0623\u0632\u0631\u0642 \u0645\u0644\u0643\u064A" && lowerHex === "#2563eb") {
      hex = "#162B5B";
    } else if (name === "\u0623\u0628\u064A\u0636 \u0639\u0627\u062C\u064A" && (lowerHex === "#f4efe6" || lowerHex === "#f5f5f4")) {
      hex = "#EDE6D8";
    }
    return {
      name,
      hex,
      extraPrice: typeof item.extraPrice === "number" && Number.isFinite(item.extraPrice) ? Math.max(0, item.extraPrice) : 0,
      defaultThreadHex: item.defaultThreadHex,
      defaultThreadName: item.defaultThreadName
    };
  });
  return cleaned;
}
const TEMP_FIVE_ROYAL_NAMES = /* @__PURE__ */ new Set([
  "\u0623\u0633\u0648\u062F \u0645\u0644\u0643\u064A",
  "\u0639\u0646\u0627\u0628\u064A \u0645\u0644\u0643\u064A",
  "\u0643\u062D\u0644\u064A \u062F\u0627\u0643\u0646",
  "\u0623\u062E\u0636\u0631 \u0632\u0645\u0631\u062F\u064A",
  "\u0631\u0645\u0627\u062F\u064A \u0641\u062D\u0645\u064A"
]);
const LEGACY_SIX_GOWN_NAMES = /* @__PURE__ */ new Set([
  "\u0623\u0633\u0648\u062F \u0645\u0644\u0643\u064A",
  "\u0628\u0648\u0631\u063A\u0646\u062F\u064A",
  "\u0643\u062D\u0644\u064A \u062F\u0627\u0643\u0646",
  "\u0623\u062E\u0636\u0631 \u0645\u0644\u0643\u064A",
  "\u0631\u0645\u0627\u062F\u064A \u0641\u062D\u0645\u064A",
  "\u0623\u0628\u064A\u0636 \u0639\u0627\u062C\u064A"
]);
function sanitizeStoleOrGownColorList(raw, fallback) {
  const cleaned = sanitizeColorList(raw, fallback);
  const isTempFiveOnly = cleaned.length === 5 && cleaned.every((c) => TEMP_FIVE_ROYAL_NAMES.has(c.name.trim()));
  const isLegacySixOnly = fallback.length > 6 && cleaned.length <= 6 && cleaned.length > 0 && cleaned.every((c) => LEGACY_SIX_GOWN_NAMES.has(c.name.trim()));
  if (isTempFiveOnly || isLegacySixOnly || cleaned.length === 0) {
    return fallback.map((sw) => {
      const prevMatch = cleaned.find((c) => c.name === sw.name);
      return prevMatch ? { ...sw, extraPrice: prevMatch.extraPrice } : sw;
    });
  }
  return cleaned;
}
const VALID_CATEGORY_IDS = ["shawl", "robe", "cap", "accessories"];
const VALID_SECTION_KEYS = [
  "trustBadges",
  "catalog",
  "studio",
  "howToOrder",
  "pricing",
  "showcase",
  "testimonials"
];
function sanitizePausedCategories(raw) {
  if (!raw || typeof raw !== "object") return {};
  const record = raw;
  const cleaned = {};
  for (const cat of VALID_CATEGORY_IDS) {
    if (record[cat] === true) {
      cleaned[cat] = true;
    }
  }
  return cleaned;
}
function sanitizeCustomTexts(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const cleaned = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof key !== "string" || !key.trim()) continue;
    if (typeof value === "string") {
      const cleanKey = key.trim();
      cleaned[cleanKey] = cleanKey.endsWith("imageUrl") || cleanKey.endsWith("Image") || cleanKey === "hero.coverImage" ? normalizeLegacyAssetPath(value) : value;
    }
  }
  return cleaned;
}
function sanitizeHiddenSections(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const record = raw;
  const cleaned = {};
  for (const sec of VALID_SECTION_KEYS) {
    if (record[sec] === true) {
      cleaned[sec] = true;
    }
  }
  return cleaned;
}
function sanitizeCategoryBranches(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const record = raw;
  const cleaned = {};
  for (const cat of VALID_CATEGORY_IDS) {
    const arr = record[cat];
    if (!Array.isArray(arr)) continue;
    const seen = /* @__PURE__ */ new Set();
    const list = [];
    arr.forEach((item) => {
      if (typeof item !== "string") return;
      const clean = item.trim();
      if (!clean || seen.has(clean)) return;
      seen.add(clean);
      list.push(clean);
    });
    if (list.length > 0) {
      if (!list.includes("\u0627\u0644\u0643\u0644")) {
        list.unshift("\u0627\u0644\u0643\u0644");
      } else if (list[0] !== "\u0627\u0644\u0643\u0644") {
        cleaned[cat] = ["\u0627\u0644\u0643\u0644", ...list.filter((b) => b !== "\u0627\u0644\u0643\u0644")];
        continue;
      }
      cleaned[cat] = list;
    }
  }
  return cleaned;
}
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
function sanitizeCategoryImageBgColors(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const record = raw;
  const cleaned = {};
  for (const cat of VALID_CATEGORY_IDS) {
    const val = record[cat];
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (HEX_COLOR_RE.test(trimmed)) {
        cleaned[cat] = trimmed.toUpperCase();
      }
    }
  }
  return cleaned;
}
function sanitizeCategoryCoverImages(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const record = raw;
  const cleaned = {};
  for (const cat of VALID_CATEGORY_IDS) {
    const val = record[cat];
    if (typeof val === "string" && val.trim().length > 0) {
      cleaned[cat] = normalizeLegacyAssetPath(val);
    }
  }
  return cleaned;
}
function sanitizeProductColorImages(raw) {
  let source = raw;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      return {};
    }
  }
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};
  const cleaned = {};
  for (const [productId, colorMap] of Object.entries(
    source
  )) {
    const pid = productId.trim();
    if (!pid || !colorMap || typeof colorMap !== "object" || Array.isArray(colorMap)) {
      continue;
    }
    const perProduct = {};
    for (const [colorName, url] of Object.entries(
      colorMap
    )) {
      const cName = colorName.trim();
      if (cName && typeof url === "string" && url.trim().length > 0) {
        perProduct[cName] = normalizeLegacyAssetPath(url);
      }
    }
    if (Object.keys(perProduct).length > 0) {
      cleaned[pid] = perProduct;
    }
  }
  return cleaned;
}
function sanitizeDeletedProductIds(raw) {
  let source = raw;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(source)) return [];
  const seen = /* @__PURE__ */ new Set();
  const cleaned = [];
  for (const item of source) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    cleaned.push(id);
  }
  return cleaned;
}
function sanitizeCapOptionPrices(raw) {
  const base = { ...DEFAULT_CAP_OPTION_PRICES };
  let source = raw;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      return base;
    }
  }
  if (!source || typeof source !== "object" || Array.isArray(source)) return base;
  for (const [key, val] of Object.entries(source)) {
    const cleanKey = key.trim();
    if (!cleanKey) continue;
    const num = Number(val);
    if (Number.isFinite(num)) {
      base[cleanKey] = Math.round(num);
    }
  }
  return base;
}
function sanitizeProductPriceOverrides(raw) {
  let source = raw;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      return {};
    }
  }
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};
  const cleaned = {};
  for (const [productId, entry] of Object.entries(
    source
  )) {
    const pid = productId.trim();
    if (!pid || !entry || typeof entry !== "object" || Array.isArray(entry)) {
      continue;
    }
    const rec = entry;
    const rawBasePrice = Number(rec.basePrice);
    if (!Number.isFinite(rawBasePrice) || rawBasePrice < 0) continue;
    const basePrice = Math.round(rawBasePrice);
    let options;
    if (Array.isArray(rec.options)) {
      const validOpts = [];
      for (const opt of rec.options) {
        if (!opt || typeof opt !== "object") continue;
        const o = opt;
        const label = typeof o.label === "string" ? o.label.trim() : "";
        const price = Number(o.price);
        if (label && Number.isFinite(price) && price >= 0) {
          validOpts.push({ label, price: Math.round(price) });
        }
      }
      options = validOpts;
    }
    const secondaryOptions = Array.isArray(rec.secondaryOptions) ? rec.secondaryOptions.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean) : void 0;
    let secondaryOptionPrices;
    if (rec.secondaryOptionPrices && typeof rec.secondaryOptionPrices === "object" && !Array.isArray(rec.secondaryOptionPrices)) {
      const prices = {};
      for (const [k, v] of Object.entries(
        rec.secondaryOptionPrices
      )) {
        const cleanK = k.trim();
        const numV = Number(v);
        if (cleanK && Number.isFinite(numV)) {
          prices[cleanK] = Math.round(numV);
        }
      }
      secondaryOptionPrices = prices;
    }
    const rawNoCap = Number(rec.noCapDeduction);
    const noCapDeduction = rec.noCapDeduction !== void 0 && Number.isFinite(rawNoCap) && rawNoCap >= 0 ? Math.round(rawNoCap) : void 0;
    cleaned[pid] = {
      basePrice,
      ...options ? { options } : {},
      ...secondaryOptions !== void 0 ? { secondaryOptions } : {},
      ...secondaryOptionPrices !== void 0 ? { secondaryOptionPrices } : {},
      ...noCapDeduction !== void 0 ? { noCapDeduction } : {}
    };
  }
  return cleaned;
}
function sanitizeCustomDeliveryOffices(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const cleaned = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const record = item;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const notes = typeof record.notes === "string" ? record.notes.trim() : "";
    const id = typeof record.id === "string" && record.id.trim() ? record.id.trim() : `office-${index + 1}`;
    cleaned.push({
      id,
      name,
      ...notes ? { notes } : {}
    });
  });
  return cleaned;
}
function sanitizePriceValue(raw, fallback = 0) {
  const num = Number(raw);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.round(num));
}
function sanitizeDeliveryPricing(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return createDefaultDeliveryPricing(
      DEFAULT_DELIVERY_PRICING.defaultHomePrice,
      DEFAULT_DELIVERY_PRICING.defaultOfficePrice
    );
  }
  const record = raw;
  const freeDelivery = Boolean(record.freeDelivery);
  const deliveryLocked = Boolean(record.deliveryLocked);
  const defaultHomePrice = sanitizePriceValue(record.defaultHomePrice, 0);
  const defaultOfficePrice = sanitizePriceValue(record.defaultOfficePrice, 0);
  const rawWilayas = record.wilayas && typeof record.wilayas === "object" && !Array.isArray(record.wilayas) ? record.wilayas : {};
  const wilayas = {};
  for (const w of ALGERIA_WILAYAS) {
    const entry = rawWilayas[w];
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const rate = entry;
      wilayas[w] = {
        home: sanitizePriceValue(rate.home, defaultHomePrice),
        office: sanitizePriceValue(rate.office, defaultOfficePrice)
      };
    } else {
      wilayas[w] = {
        home: defaultHomePrice,
        office: defaultOfficePrice
      };
    }
  }
  return {
    freeDelivery,
    deliveryLocked,
    defaultHomePrice,
    defaultOfficePrice,
    wilayas
  };
}
function sanitizeShippingCompanies(raw) {
  if (!Array.isArray(raw)) return [];
  const cleaned = [];
  let hasDefault = false;
  for (let i = 0; i < raw.length && cleaned.length < 5; i++) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const rec = item;
    const name = typeof rec.name === "string" ? rec.name.trim() : "";
    if (!name) continue;
    const id = typeof rec.id === "string" && rec.id.trim() ? rec.id.trim() : `courier-${i + 1}`;
    const apiId = typeof rec.apiId === "string" ? rec.apiId.trim() : "";
    const apiToken = typeof rec.apiToken === "string" ? rec.apiToken.trim() : "";
    const isActive = typeof rec.isActive === "boolean" ? rec.isActive : true;
    const wantsDefault = Boolean(rec.isDefault) && isActive;
    const isDefault = wantsDefault && !hasDefault;
    if (isDefault) hasDefault = true;
    cleaned.push({
      id,
      name,
      apiId,
      apiToken,
      isDefault,
      isActive
    });
  }
  if (cleaned.length > 0 && !hasDefault) {
    const firstActiveIdx = cleaned.findIndex((c) => c.isActive);
    const targetIdx = firstActiveIdx >= 0 ? firstActiveIdx : 0;
    cleaned[targetIdx] = { ...cleaned[targetIdx], isDefault: true };
  }
  return cleaned;
}
const LEGACY_SEED_TESTIMONIALS = /* @__PURE__ */ new Map([
  ["test-1", "\u0633\u0627\u0631\u0629 \u0628\u0646 \u0639\u0644\u064A"],
  ["test-2", "\u064A\u0627\u0633\u0645\u064A\u0646 \u0642\u0648\u064A\u062F\u0631\u064A"],
  ["test-3", "\u0623\u0645\u064A\u0631\u0629 \u0628\u0648\u0639\u0644\u0627\u0645"],
  ["test-4", "\u0625\u064A\u0645\u0627\u0646 \u0645\u0646\u0635\u0648\u0631\u064A"]
]);
function sanitizeTestimonials(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const cleaned = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const record = item;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const wilaya = typeof record.wilaya === "string" ? record.wilaya.trim() : "";
    const comment = typeof record.comment === "string" ? record.comment.trim() : "";
    if (!name || !comment) return;
    const id = typeof record.id === "string" && record.id.trim() ? record.id.trim() : `test-custom-${index + 1}`;
    if (LEGACY_SEED_TESTIMONIALS.get(id) === name) {
      return;
    }
    const rawRating = Number(record.rating);
    const rating = Number.isFinite(rawRating) ? Math.min(5, Math.max(1, Math.round(rawRating))) : 5;
    const university = typeof record.university === "string" ? record.university.trim() : "";
    const productTag = typeof record.productTag === "string" ? record.productTag.trim() : "";
    const dateLabel = typeof record.dateLabel === "string" ? record.dateLabel.trim() : "";
    cleaned.push({
      id,
      name,
      wilaya: wilaya || "\u0627\u0644\u062C\u0632\u0627\u0626\u0631",
      ...university ? { university } : {},
      rating,
      comment,
      ...productTag ? { productTag } : {},
      ...dateLabel ? { dateLabel } : {}
    });
  });
  return cleaned;
}
function sanitizeShowcasePhotos(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const cleaned = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const record = item;
    const imageUrl = typeof record.imageUrl === "string" ? normalizeLegacyAssetPath(record.imageUrl) : "";
    if (!imageUrl) return;
    const caption = typeof record.caption === "string" ? record.caption.trim() : "";
    const wilaya = typeof record.wilaya === "string" ? record.wilaya.trim() : "";
    const tag = typeof record.tag === "string" ? record.tag.trim() : "";
    const id = typeof record.id === "string" && record.id.trim() ? record.id.trim() : `showcase-${index + 1}`;
    cleaned.push({
      id,
      imageUrl,
      ...caption ? { caption } : {},
      ...wilaya ? { wilaya } : {},
      ...tag ? { tag } : {}
    });
  });
  return cleaned;
}
function sanitizePromoSettings(raw, fallback = DEFAULT_PROMO_SETTINGS) {
  if (!raw || typeof raw !== "object") {
    return structuredClone(fallback);
  }
  const record = raw;
  const promoCodeInputEnabled = typeof record.promoCodeInputEnabled === "boolean" ? record.promoCodeInputEnabled : Boolean(fallback.promoCodeInputEnabled);
  const rawDiscount = Number(record.storewideDiscountPercent);
  const storewideDiscountPercent = rawDiscount === 10 || rawDiscount === 20 ? rawDiscount : 0;
  let promoCodes = structuredClone(fallback.promoCodes);
  if (Array.isArray(record.promoCodes)) {
    const seen = /* @__PURE__ */ new Set();
    const cleaned = [];
    record.promoCodes.forEach((item, idx) => {
      if (!item || typeof item !== "object") return;
      const entry = item;
      const code = typeof entry.code === "string" ? entry.code.trim().toUpperCase() : "";
      if (!code || seen.has(code)) return;
      seen.add(code);
      const type = entry.type === "fixed" ? "fixed" : "percent";
      const rawVal = Number(entry.value);
      const value = Number.isFinite(rawVal) ? Math.max(1, type === "percent" ? Math.min(90, Math.round(rawVal)) : Math.round(rawVal)) : 10;
      const label = typeof entry.label === "string" ? entry.label.trim() : "";
      const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : `promo-${idx + 1}`;
      cleaned.push({
        id,
        code,
        type,
        value,
        active: Boolean(entry.active),
        ...label ? { label } : {}
      });
    });
    promoCodes = cleaned;
  }
  return {
    promoCodeInputEnabled,
    storewideDiscountPercent,
    promoCodes
  };
}
function readCachedDynamicSettings() {
  try {
    const raw = localStorage.getItem(DYNAMIC_SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      stoleColors: sanitizeStoleOrGownColorList(
        parsed.stoleColors,
        DEFAULT_DYNAMIC_SETTINGS.stoleColors
      ),
      gownColors: sanitizeStoleOrGownColorList(
        parsed.gownColors,
        DEFAULT_DYNAMIC_SETTINGS.gownColors
      ),
      threadColors: sanitizeColorList(
        parsed.threadColors,
        DEFAULT_DYNAMIC_SETTINGS.threadColors
      ),
      capColors: sanitizeColorList(
        parsed.capColors,
        DEFAULT_DYNAMIC_SETTINGS.capColors
      ),
      ordersPaused: Boolean(parsed.ordersPaused),
      pauseMessage: typeof parsed.pauseMessage === "string" && parsed.pauseMessage.trim() ? parsed.pauseMessage : DEFAULT_PAUSE_MESSAGE,
      pausedCategories: sanitizePausedCategories(parsed.pausedCategories),
      categoryPauseBadge: typeof parsed.categoryPauseBadge === "string" && parsed.categoryPauseBadge.trim() ? parsed.categoryPauseBadge : DEFAULT_CATEGORY_PAUSE_BADGE,
      telegramEnabled: Boolean(parsed.telegramEnabled),
      telegramBotToken: typeof parsed.telegramBotToken === "string" ? parsed.telegramBotToken : "",
      telegramChatId: typeof parsed.telegramChatId === "string" ? parsed.telegramChatId : "",
      paymentInfo: typeof parsed.paymentInfo === "string" && parsed.paymentInfo.trim() ? parsed.paymentInfo : DEFAULT_PAYMENT_INFO,
      customDeliveryOffices: sanitizeCustomDeliveryOffices(
        parsed.customDeliveryOffices
      ),
      testimonials: sanitizeTestimonials(
        parsed.testimonials,
        DEFAULT_TESTIMONIALS
      ),
      showcasePhotos: sanitizeShowcasePhotos(
        parsed.showcasePhotos,
        DEFAULT_SHOWCASE_PHOTOS
      ),
      showcaseBadge: typeof parsed.showcaseBadge === "string" ? parsed.showcaseBadge : void 0,
      showcaseTitle: typeof parsed.showcaseTitle === "string" ? parsed.showcaseTitle : void 0,
      showcaseSubtitle: typeof parsed.showcaseSubtitle === "string" ? parsed.showcaseSubtitle : void 0,
      heroTitle: typeof parsed.heroTitle === "string" && parsed.heroTitle.trim() ? parsed.heroTitle.trim() : void 0,
      heroSubtitle: typeof parsed.heroSubtitle === "string" && parsed.heroSubtitle.trim() ? parsed.heroSubtitle.trim() : void 0,
      heroImageUrl: typeof parsed.heroImageUrl === "string" && parsed.heroImageUrl.trim() ? normalizeLegacyAssetPath(parsed.heroImageUrl) : typeof parsed.customTexts?.["hero.coverImage"] === "string" && parsed.customTexts["hero.coverImage"].trim() ? normalizeLegacyAssetPath(parsed.customTexts["hero.coverImage"]) : void 0,
      promoSettings: sanitizePromoSettings(
        parsed.promoSettings,
        DEFAULT_PROMO_SETTINGS
      ),
      customTexts: sanitizeCustomTexts(parsed.customTexts),
      hiddenSections: sanitizeHiddenSections(parsed.hiddenSections),
      categoryBranches: sanitizeCategoryBranches(parsed.categoryBranches),
      seasonBannerEnabled: typeof parsed.seasonBannerEnabled === "boolean" ? parsed.seasonBannerEnabled : true,
      seasonBannerText: typeof parsed.seasonBannerText === "string" && parsed.seasonBannerText.trim() ? parsed.seasonBannerText.trim() : DEFAULT_SEASON_BANNER_TEXT,
      whatsappNumber: typeof parsed.whatsappNumber === "string" ? normalizeWhatsAppInput(parsed.whatsappNumber) : "",
      instagramUrl: sanitizeSocialUrl(parsed.instagramUrl),
      facebookUrl: sanitizeSocialUrl(parsed.facebookUrl),
      tiktokUrl: sanitizeSocialUrl(parsed.tiktokUrl),
      categoryImageBgColors: sanitizeCategoryImageBgColors(
        parsed.categoryImageBgColors
      ),
      categoryCoverImages: sanitizeCategoryCoverImages(
        parsed.categoryCoverImages
      ),
      productColorImages: sanitizeProductColorImages(
        parsed.productColorImages && Object.keys(parsed.productColorImages).length > 0 ? parsed.productColorImages : parsed.customTexts?.["product.colorImages"]
      ),
      americanShawlFrontImage: typeof parsed.americanShawlFrontImage === "string" && parsed.americanShawlFrontImage.trim() ? normalizeLegacyAssetPath(parsed.americanShawlFrontImage) : typeof parsed.customTexts?.["americanShawl.frontImage"] === "string" && parsed.customTexts["americanShawl.frontImage"].trim() ? normalizeLegacyAssetPath(parsed.customTexts["americanShawl.frontImage"]) : void 0,
      americanShawlBackImage: typeof parsed.americanShawlBackImage === "string" && parsed.americanShawlBackImage.trim() ? normalizeLegacyAssetPath(parsed.americanShawlBackImage) : typeof parsed.customTexts?.["americanShawl.backImage"] === "string" && parsed.customTexts["americanShawl.backImage"].trim() ? normalizeLegacyAssetPath(parsed.customTexts["americanShawl.backImage"]) : void 0,
      regularShawlBaseImage: typeof parsed.regularShawlBaseImage === "string" && parsed.regularShawlBaseImage.trim() ? normalizeLegacyAssetPath(parsed.regularShawlBaseImage) : typeof parsed.customTexts?.["regularShawl.baseImage"] === "string" && parsed.customTexts["regularShawl.baseImage"].trim() ? normalizeLegacyAssetPath(parsed.customTexts["regularShawl.baseImage"]) : void 0,
      deletedProductIds: sanitizeDeletedProductIds(
        parsed.deletedProductIds ?? parsed.customTexts?.["catalog.deletedIds"]
      ),
      disabledColorizeProductIds: sanitizeDeletedProductIds(
        parsed.disabledColorizeProductIds ?? parsed.customTexts?.["catalog.disabledColorizeIds"]
      ),
      capOptionPrices: sanitizeCapOptionPrices(
        parsed.capOptionPrices ?? parsed.customTexts?.["catalog.capOptionPrices"]
      ),
      productPriceOverrides: sanitizeProductPriceOverrides(
        parsed.productPriceOverrides ?? parsed.customTexts?.["catalog.priceOverrides"]
      ),
      deliveryPricing: sanitizeDeliveryPricing(parsed.deliveryPricing),
      shippingCompanies: sanitizeShippingCompanies(parsed.shippingCompanies),
      updatedAt: parsed.updatedAt
    };
  } catch {
    return null;
  }
}
function writeCachedDynamicSettings(settings) {
  try {
    localStorage.setItem(DYNAMIC_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
  }
}
async function loadDynamicSettings(storeStateBackup) {
  const cached = readCachedDynamicSettings();
  const backupTime = storeStateBackup?.updatedAt ? new Date(storeStateBackup.updatedAt).getTime() : 0;
  const cachedTime = cached?.updatedAt ? new Date(cached.updatedAt).getTime() : 0;
  const rawBase = cached && (!storeStateBackup || cachedTime >= backupTime) ? cached : storeStateBackup || cached || structuredClone(DEFAULT_DYNAMIC_SETTINGS);
  let result = {
    stoleColors: sanitizeStoleOrGownColorList(
      rawBase.stoleColors,
      DEFAULT_DYNAMIC_SETTINGS.stoleColors
    ),
    gownColors: sanitizeStoleOrGownColorList(
      rawBase.gownColors,
      DEFAULT_DYNAMIC_SETTINGS.gownColors
    ),
    threadColors: sanitizeColorList(
      rawBase.threadColors,
      DEFAULT_DYNAMIC_SETTINGS.threadColors
    ),
    capColors: sanitizeColorList(
      rawBase.capColors,
      DEFAULT_DYNAMIC_SETTINGS.capColors
    ),
    ordersPaused: Boolean(rawBase.ordersPaused),
    pauseMessage: typeof rawBase.pauseMessage === "string" && rawBase.pauseMessage.trim() ? rawBase.pauseMessage : DEFAULT_PAUSE_MESSAGE,
    pausedCategories: sanitizePausedCategories(rawBase.pausedCategories),
    categoryPauseBadge: typeof rawBase.categoryPauseBadge === "string" && rawBase.categoryPauseBadge.trim() ? rawBase.categoryPauseBadge : DEFAULT_CATEGORY_PAUSE_BADGE,
    telegramEnabled: Boolean(rawBase.telegramEnabled),
    telegramBotToken: typeof rawBase.telegramBotToken === "string" ? rawBase.telegramBotToken : "",
    telegramChatId: typeof rawBase.telegramChatId === "string" ? rawBase.telegramChatId : "",
    paymentInfo: typeof rawBase.paymentInfo === "string" && rawBase.paymentInfo.trim() ? rawBase.paymentInfo : DEFAULT_PAYMENT_INFO,
    customDeliveryOffices: sanitizeCustomDeliveryOffices(
      rawBase.customDeliveryOffices
    ),
    testimonials: sanitizeTestimonials(
      rawBase.testimonials,
      DEFAULT_TESTIMONIALS
    ),
    showcasePhotos: sanitizeShowcasePhotos(
      rawBase.showcasePhotos,
      DEFAULT_SHOWCASE_PHOTOS
    ),
    showcaseBadge: typeof rawBase.showcaseBadge === "string" ? rawBase.showcaseBadge : void 0,
    showcaseTitle: typeof rawBase.showcaseTitle === "string" ? rawBase.showcaseTitle : void 0,
    showcaseSubtitle: typeof rawBase.showcaseSubtitle === "string" ? rawBase.showcaseSubtitle : void 0,
    heroTitle: typeof rawBase.heroTitle === "string" && rawBase.heroTitle.trim() ? rawBase.heroTitle.trim() : void 0,
    heroSubtitle: typeof rawBase.heroSubtitle === "string" && rawBase.heroSubtitle.trim() ? rawBase.heroSubtitle.trim() : void 0,
    heroImageUrl: typeof rawBase.heroImageUrl === "string" && rawBase.heroImageUrl.trim() ? normalizeLegacyAssetPath(rawBase.heroImageUrl) : typeof rawBase.customTexts?.["hero.coverImage"] === "string" && rawBase.customTexts["hero.coverImage"].trim() ? normalizeLegacyAssetPath(rawBase.customTexts["hero.coverImage"]) : void 0,
    promoSettings: sanitizePromoSettings(
      rawBase.promoSettings,
      DEFAULT_PROMO_SETTINGS
    ),
    customTexts: sanitizeCustomTexts(rawBase.customTexts),
    hiddenSections: sanitizeHiddenSections(rawBase.hiddenSections),
    categoryBranches: sanitizeCategoryBranches(rawBase.categoryBranches),
    seasonBannerEnabled: typeof rawBase.seasonBannerEnabled === "boolean" ? rawBase.seasonBannerEnabled : true,
    seasonBannerText: typeof rawBase.seasonBannerText === "string" && rawBase.seasonBannerText.trim() ? rawBase.seasonBannerText.trim() : DEFAULT_SEASON_BANNER_TEXT,
    whatsappNumber: typeof rawBase.whatsappNumber === "string" ? normalizeWhatsAppInput(rawBase.whatsappNumber) : "",
    instagramUrl: sanitizeSocialUrl(rawBase.instagramUrl ?? cached?.instagramUrl),
    facebookUrl: sanitizeSocialUrl(rawBase.facebookUrl ?? cached?.facebookUrl),
    tiktokUrl: sanitizeSocialUrl(rawBase.tiktokUrl ?? cached?.tiktokUrl),
    categoryImageBgColors: sanitizeCategoryImageBgColors(
      rawBase.categoryImageBgColors ?? cached?.categoryImageBgColors
    ),
    categoryCoverImages: sanitizeCategoryCoverImages(
      rawBase.categoryCoverImages ?? cached?.categoryCoverImages
    ),
    productColorImages: sanitizeProductColorImages(
      rawBase.productColorImages ?? cached?.productColorImages ?? rawBase.customTexts?.["product.colorImages"] ?? cached?.customTexts?.["product.colorImages"]
    ),
    americanShawlFrontImage: typeof rawBase.americanShawlFrontImage === "string" && rawBase.americanShawlFrontImage.trim() ? normalizeLegacyAssetPath(rawBase.americanShawlFrontImage) : typeof rawBase.customTexts?.["americanShawl.frontImage"] === "string" && rawBase.customTexts["americanShawl.frontImage"].trim() ? normalizeLegacyAssetPath(rawBase.customTexts["americanShawl.frontImage"]) : typeof cached?.americanShawlFrontImage === "string" && cached.americanShawlFrontImage.trim() ? normalizeLegacyAssetPath(cached.americanShawlFrontImage) : void 0,
    americanShawlBackImage: typeof rawBase.americanShawlBackImage === "string" && rawBase.americanShawlBackImage.trim() ? normalizeLegacyAssetPath(rawBase.americanShawlBackImage) : typeof rawBase.customTexts?.["americanShawl.backImage"] === "string" && rawBase.customTexts["americanShawl.backImage"].trim() ? normalizeLegacyAssetPath(rawBase.customTexts["americanShawl.backImage"]) : typeof cached?.americanShawlBackImage === "string" && cached.americanShawlBackImage.trim() ? normalizeLegacyAssetPath(cached.americanShawlBackImage) : void 0,
    regularShawlBaseImage: typeof rawBase.regularShawlBaseImage === "string" && rawBase.regularShawlBaseImage.trim() ? normalizeLegacyAssetPath(rawBase.regularShawlBaseImage) : typeof rawBase.customTexts?.["regularShawl.baseImage"] === "string" && rawBase.customTexts["regularShawl.baseImage"].trim() ? normalizeLegacyAssetPath(rawBase.customTexts["regularShawl.baseImage"]) : typeof cached?.regularShawlBaseImage === "string" && cached.regularShawlBaseImage.trim() ? normalizeLegacyAssetPath(cached.regularShawlBaseImage) : void 0,
    deletedProductIds: sanitizeDeletedProductIds(
      rawBase.deletedProductIds ?? rawBase.customTexts?.["catalog.deletedIds"] ?? cached?.deletedProductIds ?? cached?.customTexts?.["catalog.deletedIds"]
    ),
    disabledColorizeProductIds: sanitizeDeletedProductIds(
      rawBase.disabledColorizeProductIds ?? rawBase.customTexts?.["catalog.disabledColorizeIds"] ?? cached?.disabledColorizeProductIds ?? cached?.customTexts?.["catalog.disabledColorizeIds"]
    ),
    capOptionPrices: sanitizeCapOptionPrices(
      rawBase.capOptionPrices ?? rawBase.customTexts?.["catalog.capOptionPrices"] ?? cached?.capOptionPrices ?? cached?.customTexts?.["catalog.capOptionPrices"]
    ),
    productPriceOverrides: sanitizeProductPriceOverrides(
      rawBase.productPriceOverrides ?? rawBase.customTexts?.["catalog.priceOverrides"] ?? cached?.productPriceOverrides ?? cached?.customTexts?.["catalog.priceOverrides"]
    ),
    deliveryPricing: sanitizeDeliveryPricing(
      rawBase.deliveryPricing ?? cached?.deliveryPricing
    ),
    shippingCompanies: sanitizeShippingCompanies(
      rawBase.shippingCompanies ?? cached?.shippingCompanies
    ),
    updatedAt: rawBase.updatedAt
  };
  try {
    const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
    if (!error && data) {
      const record = data;
      const recordCols = Object.keys(record);
      if (recordCols.length > 0) {
        knownStoreSettingsColumns = new Set(recordCols);
      }
      const hasSettingsColumns = "stole_colors" in record || "gown_colors" in record || "thread_colors" in record || "cap_colors" in record || "orders_paused" in record || "pause_message" in record || "paused_categories" in record || "category_pause_badge" in record || "telegram_enabled" in record || "telegram_bot_token" in record || "telegram_chat_id" in record || "payment_info" in record || "custom_delivery_offices" in record || "testimonials" in record || "showcase_photos" in record || "showcase_badge" in record || "showcase_title" in record || "showcase_subtitle" in record || "hero_title" in record || "hero_subtitle" in record || "hero_image_url" in record || "promo_settings" in record || "custom_texts" in record || "hidden_sections" in record || "category_branches" in record || "season_banner_enabled" in record || "season_banner_text" in record || "whatsapp_number" in record || "instagram_url" in record || "facebook_url" in record || "tiktok_url" in record || "category_image_bg_colors" in record || "category_cover_images" in record || "product_color_images" in record || "delivery_pricing" in record || "shipping_companies" in record;
      if (hasSettingsColumns) {
        const dbUpdatedAt = typeof record.updated_at === "string" ? record.updated_at : void 0;
        const dbTime = dbUpdatedAt ? new Date(dbUpdatedAt).getTime() : 0;
        const localTime = Math.max(backupTime, cachedTime);
        const shouldUseDb = !localTime || !dbTime || dbTime >= localTime;
        if (shouldUseDb) {
          result = {
            stoleColors: sanitizeStoleOrGownColorList(
              record.stole_colors,
              result.stoleColors
            ),
            gownColors: sanitizeStoleOrGownColorList(
              record.gown_colors,
              result.gownColors
            ),
            threadColors: sanitizeColorList(
              record.thread_colors,
              result.threadColors
            ),
            capColors: sanitizeColorList(record.cap_colors, result.capColors),
            ordersPaused: typeof record.orders_paused === "boolean" ? record.orders_paused : result.ordersPaused,
            pauseMessage: typeof record.pause_message === "string" && record.pause_message.trim() ? record.pause_message : result.pauseMessage || DEFAULT_PAUSE_MESSAGE,
            pausedCategories: "paused_categories" in record ? sanitizePausedCategories(record.paused_categories) : result.pausedCategories,
            categoryPauseBadge: typeof record.category_pause_badge === "string" && record.category_pause_badge.trim() ? record.category_pause_badge : result.categoryPauseBadge || DEFAULT_CATEGORY_PAUSE_BADGE,
            telegramEnabled: typeof record.telegram_enabled === "boolean" ? record.telegram_enabled : result.telegramEnabled,
            telegramBotToken: typeof record.telegram_bot_token === "string" ? record.telegram_bot_token : result.telegramBotToken,
            telegramChatId: typeof record.telegram_chat_id === "string" ? record.telegram_chat_id : result.telegramChatId,
            paymentInfo: typeof record.payment_info === "string" && record.payment_info.trim() ? record.payment_info : result.paymentInfo || DEFAULT_PAYMENT_INFO,
            customDeliveryOffices: "custom_delivery_offices" in record ? sanitizeCustomDeliveryOffices(record.custom_delivery_offices) : result.customDeliveryOffices,
            testimonials: "testimonials" in record ? sanitizeTestimonials(record.testimonials, result.testimonials || DEFAULT_TESTIMONIALS) : result.testimonials,
            showcasePhotos: "showcase_photos" in record ? sanitizeShowcasePhotos(record.showcase_photos, result.showcasePhotos || DEFAULT_SHOWCASE_PHOTOS) : result.showcasePhotos,
            showcaseBadge: "showcase_badge" in record ? typeof record.showcase_badge === "string" ? record.showcase_badge : void 0 : result.showcaseBadge,
            showcaseTitle: "showcase_title" in record ? typeof record.showcase_title === "string" ? record.showcase_title : void 0 : result.showcaseTitle,
            showcaseSubtitle: "showcase_subtitle" in record ? typeof record.showcase_subtitle === "string" ? record.showcase_subtitle : void 0 : result.showcaseSubtitle,
            heroTitle: typeof record.hero_title === "string" && record.hero_title.trim() ? record.hero_title.trim() : result.heroTitle,
            heroSubtitle: typeof record.hero_subtitle === "string" && record.hero_subtitle.trim() ? record.hero_subtitle.trim() : result.heroSubtitle,
            heroImageUrl: "hero_image_url" in record && typeof record.hero_image_url === "string" && record.hero_image_url.trim() ? record.hero_image_url.trim() : "custom_texts" in record && record.custom_texts && typeof record.custom_texts["hero.coverImage"] === "string" && String(record.custom_texts["hero.coverImage"]).trim() ? String(record.custom_texts["hero.coverImage"]).trim() : result.heroImageUrl,
            promoSettings: "promo_settings" in record ? sanitizePromoSettings(record.promo_settings, result.promoSettings || DEFAULT_PROMO_SETTINGS) : result.promoSettings,
            customTexts: "custom_texts" in record && record.custom_texts !== null ? sanitizeCustomTexts(record.custom_texts) : result.customTexts,
            hiddenSections: "hidden_sections" in record && record.hidden_sections !== null ? sanitizeHiddenSections(record.hidden_sections) : result.hiddenSections,
            categoryBranches: "category_branches" in record && record.category_branches !== null ? sanitizeCategoryBranches(record.category_branches) : result.categoryBranches,
            seasonBannerEnabled: typeof record.season_banner_enabled === "boolean" ? record.season_banner_enabled : result.seasonBannerEnabled,
            seasonBannerText: typeof record.season_banner_text === "string" && record.season_banner_text.trim() ? record.season_banner_text.trim() : result.seasonBannerText,
            whatsappNumber: "whatsapp_number" in record ? typeof record.whatsapp_number === "string" ? normalizeWhatsAppInput(record.whatsapp_number) : "" : result.whatsappNumber,
            instagramUrl: "instagram_url" in record ? typeof record.instagram_url === "string" ? sanitizeSocialUrl(record.instagram_url) : "" : result.instagramUrl,
            facebookUrl: "facebook_url" in record ? typeof record.facebook_url === "string" ? sanitizeSocialUrl(record.facebook_url) : "" : result.facebookUrl,
            tiktokUrl: "tiktok_url" in record ? typeof record.tiktok_url === "string" ? sanitizeSocialUrl(record.tiktok_url) : "" : result.tiktokUrl,
            categoryImageBgColors: "category_image_bg_colors" in record && record.category_image_bg_colors !== null ? sanitizeCategoryImageBgColors(record.category_image_bg_colors) : result.categoryImageBgColors,
            categoryCoverImages: "category_cover_images" in record && record.category_cover_images !== null ? sanitizeCategoryCoverImages(record.category_cover_images) : result.categoryCoverImages,
            productColorImages: "product_color_images" in record && record.product_color_images !== null ? sanitizeProductColorImages(record.product_color_images) : "custom_texts" in record && record.custom_texts && typeof record.custom_texts["product.colorImages"] === "string" ? sanitizeProductColorImages(
              record.custom_texts["product.colorImages"]
            ) : result.productColorImages,
            americanShawlFrontImage: "american_shawl_front_image" in record && typeof record.american_shawl_front_image === "string" && record.american_shawl_front_image.trim() ? record.american_shawl_front_image.trim() : "custom_texts" in record && record.custom_texts && typeof record.custom_texts["americanShawl.frontImage"] === "string" && String(
              record.custom_texts["americanShawl.frontImage"]
            ).trim() ? String(
              record.custom_texts["americanShawl.frontImage"]
            ).trim() : result.americanShawlFrontImage,
            americanShawlBackImage: "american_shawl_back_image" in record && typeof record.american_shawl_back_image === "string" && record.american_shawl_back_image.trim() ? record.american_shawl_back_image.trim() : "custom_texts" in record && record.custom_texts && typeof record.custom_texts["americanShawl.backImage"] === "string" && String(
              record.custom_texts["americanShawl.backImage"]
            ).trim() ? String(
              record.custom_texts["americanShawl.backImage"]
            ).trim() : result.americanShawlBackImage,
            regularShawlBaseImage: "regular_shawl_base_image" in record && typeof record.regular_shawl_base_image === "string" && record.regular_shawl_base_image.trim() ? record.regular_shawl_base_image.trim() : "custom_texts" in record && record.custom_texts && typeof record.custom_texts["regularShawl.baseImage"] === "string" && String(
              record.custom_texts["regularShawl.baseImage"]
            ).trim() ? String(
              record.custom_texts["regularShawl.baseImage"]
            ).trim() : result.regularShawlBaseImage,
            deletedProductIds: sanitizeDeletedProductIds(
              "deleted_product_ids" in record && record.deleted_product_ids !== null ? record.deleted_product_ids : "custom_texts" in record && record.custom_texts && record.custom_texts["catalog.deletedIds"] !== void 0 ? record.custom_texts["catalog.deletedIds"] : result.deletedProductIds
            ),
            disabledColorizeProductIds: sanitizeDeletedProductIds(
              "custom_texts" in record && record.custom_texts && record.custom_texts["catalog.disabledColorizeIds"] !== void 0 ? record.custom_texts["catalog.disabledColorizeIds"] : result.disabledColorizeProductIds
            ),
            capOptionPrices: sanitizeCapOptionPrices(
              "custom_texts" in record && record.custom_texts && record.custom_texts["catalog.capOptionPrices"] !== void 0 ? record.custom_texts["catalog.capOptionPrices"] : result.capOptionPrices
            ),
            productPriceOverrides: sanitizeProductPriceOverrides(
              "product_price_overrides" in record && record.product_price_overrides !== null ? record.product_price_overrides : "custom_texts" in record && record.custom_texts && record.custom_texts["catalog.priceOverrides"] !== void 0 ? record.custom_texts["catalog.priceOverrides"] : result.productPriceOverrides
            ),
            deliveryPricing: "delivery_pricing" in record && record.delivery_pricing !== null ? sanitizeDeliveryPricing(record.delivery_pricing) : result.deliveryPricing,
            shippingCompanies: "shipping_companies" in record && record.shipping_companies !== null ? sanitizeShippingCompanies(record.shipping_companies) : result.shippingCompanies,
            updatedAt: dbUpdatedAt
          };
          writeCachedDynamicSettings(result);
        }
      }
    }
  } catch {
  }
  return result;
}
let workingStoreSettingsTier = null;
let knownStoreSettingsColumns = null;
const HEAVY_BASE64_THRESHOLD_BYTES = 2e4;
const RECOMPRESS_MAX_DIM = 550;
const RECOMPRESS_QUALITY = 0.7;
const MAX_SETTINGS_PAYLOAD_BYTES = 450 * 1024;
const CLOUD_SAVE_TIMEOUT_MS = 25e3;
const recompressedDataUrlCache = /* @__PURE__ */ new Map();
function withTimeout(promise, ms, timeoutMessage) {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timerId !== void 0) {
      window.clearTimeout(timerId);
    }
  });
}
async function recompressHeavyDataUrl(dataUrl, maxDimension = RECOMPRESS_MAX_DIM, quality = RECOMPRESS_QUALITY, thresholdBytes = HEAVY_BASE64_THRESHOLD_BYTES) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/") || dataUrl.length <= thresholdBytes) {
    return dataUrl;
  }
  const cacheKey = `${maxDimension}:${quality}:${dataUrl.length}:${dataUrl.slice(0, 64)}:${dataUrl.slice(-48)}`;
  const cached = recompressedDataUrlCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const img = await withTimeout(
      new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Image decode failed"));
        el.src = dataUrl;
      }),
      3e3,
      "IMAGE_DECODE_TIMEOUT"
    );
    const nw = img.naturalWidth || img.width || 1;
    const nh = img.naturalHeight || img.height || 1;
    const maxSide = Math.max(nw, nh, 1);
    const ratio = Math.min(1, maxDimension / maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(nw * ratio));
    canvas.height = Math.max(1, Math.round(nh * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    const mimeHeader = dataUrl.slice(5, dataUrl.indexOf(";")).toLowerCase();
    const alphaCapable = mimeHeader === "image/png" || mimeHeader === "image/webp" || mimeHeader === "image/gif" || mimeHeader === "image/svg+xml";
    let hasTransparency = false;
    if (alphaCapable) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] < 250) {
            hasTransparency = true;
            break;
          }
        }
      } catch {
        hasTransparency = false;
      }
      if (!hasTransparency) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    let output = canvas.toDataURL("image/webp", quality);
    if (!output.startsWith("data:image/webp")) {
      output = hasTransparency ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", quality);
    }
    const best = output && output.length < dataUrl.length ? output : dataUrl;
    recompressedDataUrlCache.set(cacheKey, best);
    return best;
  } catch {
    return dataUrl;
  }
}
async function shrinkHeavyImagesInValue(value, maxDimension = RECOMPRESS_MAX_DIM, quality = RECOMPRESS_QUALITY, thresholdBytes = HEAVY_BASE64_THRESHOLD_BYTES) {
  if (typeof value === "string") {
    if (value.startsWith("data:image/") && value.length > thresholdBytes) {
      return await recompressHeavyDataUrl(
        value,
        maxDimension,
        quality,
        thresholdBytes
      );
    }
    return value;
  }
  if (Array.isArray(value)) {
    const mapped = await Promise.all(
      value.map(
        (item) => shrinkHeavyImagesInValue(item, maxDimension, quality, thresholdBytes)
      )
    );
    return mapped;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    const next = {};
    for (const [k, v] of entries) {
      next[k] = await shrinkHeavyImagesInValue(
        v,
        maxDimension,
        quality,
        thresholdBytes
      );
    }
    return next;
  }
  return value;
}
async function saveDynamicSettings(settings, currentStoreState) {
  const mergedCustomTexts = sanitizeCustomTexts(
    settings.customTexts ?? currentStoreState?.customTexts ?? {}
  );
  delete mergedCustomTexts["product.colorImages"];
  const rawHeroImageUrl = typeof settings.heroImageUrl === "string" && settings.heroImageUrl.trim() ? settings.heroImageUrl.trim() : void 0;
  const rawAmericanShawlFrontImage = typeof settings.americanShawlFrontImage === "string" && settings.americanShawlFrontImage.trim() ? settings.americanShawlFrontImage.trim() : typeof mergedCustomTexts["americanShawl.frontImage"] === "string" && mergedCustomTexts["americanShawl.frontImage"].trim() ? mergedCustomTexts["americanShawl.frontImage"].trim() : void 0;
  const rawAmericanShawlBackImage = typeof settings.americanShawlBackImage === "string" && settings.americanShawlBackImage.trim() ? settings.americanShawlBackImage.trim() : typeof mergedCustomTexts["americanShawl.backImage"] === "string" && mergedCustomTexts["americanShawl.backImage"].trim() ? mergedCustomTexts["americanShawl.backImage"].trim() : void 0;
  const rawRegularShawlBaseImage = typeof settings.regularShawlBaseImage === "string" && settings.regularShawlBaseImage.trim() ? settings.regularShawlBaseImage.trim() : typeof mergedCustomTexts["regularShawl.baseImage"] === "string" && mergedCustomTexts["regularShawl.baseImage"].trim() ? mergedCustomTexts["regularShawl.baseImage"].trim() : void 0;
  const productColorMapFromProducts = {};
  if (currentStoreState?.products) {
    for (const prod of currentStoreState.products) {
      if (prod.colorImages && Object.keys(prod.colorImages).length > 0) {
        productColorMapFromProducts[prod.id] = prod.colorImages;
      }
    }
  }
  const rawProductColorImages = sanitizeProductColorImages(
    settings.productColorImages !== void 0 ? settings.productColorImages : productColorMapFromProducts
  );
  let withTimestamp = {
    ...settings,
    pauseMessage: settings.pauseMessage.trim() || DEFAULT_PAUSE_MESSAGE,
    pausedCategories: sanitizePausedCategories(settings.pausedCategories),
    categoryPauseBadge: (settings.categoryPauseBadge || "").trim() || DEFAULT_CATEGORY_PAUSE_BADGE,
    telegramEnabled: Boolean(settings.telegramEnabled),
    telegramBotToken: (settings.telegramBotToken || "").trim(),
    telegramChatId: (settings.telegramChatId || "").trim(),
    paymentInfo: (settings.paymentInfo || "").trim() || DEFAULT_PAYMENT_INFO,
    customDeliveryOffices: sanitizeCustomDeliveryOffices(
      settings.customDeliveryOffices
    ),
    testimonials: sanitizeTestimonials(
      settings.testimonials,
      DEFAULT_TESTIMONIALS
    ),
    showcasePhotos: sanitizeShowcasePhotos(
      settings.showcasePhotos,
      DEFAULT_SHOWCASE_PHOTOS
    ),
    showcaseBadge: typeof settings.showcaseBadge === "string" ? settings.showcaseBadge.trim() : void 0,
    showcaseTitle: typeof settings.showcaseTitle === "string" ? settings.showcaseTitle.trim() : void 0,
    showcaseSubtitle: typeof settings.showcaseSubtitle === "string" ? settings.showcaseSubtitle.trim() : void 0,
    heroTitle: typeof settings.heroTitle === "string" && settings.heroTitle.trim() ? settings.heroTitle.trim() : void 0,
    heroSubtitle: typeof settings.heroSubtitle === "string" && settings.heroSubtitle.trim() ? settings.heroSubtitle.trim() : void 0,
    heroImageUrl: rawHeroImageUrl,
    promoSettings: sanitizePromoSettings(
      settings.promoSettings,
      DEFAULT_PROMO_SETTINGS
    ),
    customTexts: mergedCustomTexts,
    hiddenSections: sanitizeHiddenSections(settings.hiddenSections),
    categoryBranches: sanitizeCategoryBranches(settings.categoryBranches),
    seasonBannerEnabled: typeof settings.seasonBannerEnabled === "boolean" ? settings.seasonBannerEnabled : true,
    seasonBannerText: typeof settings.seasonBannerText === "string" && settings.seasonBannerText.trim() ? settings.seasonBannerText.trim() : DEFAULT_SEASON_BANNER_TEXT,
    whatsappNumber: typeof settings.whatsappNumber === "string" ? normalizeWhatsAppInput(settings.whatsappNumber) : "",
    instagramUrl: sanitizeSocialUrl(settings.instagramUrl),
    facebookUrl: sanitizeSocialUrl(settings.facebookUrl),
    tiktokUrl: sanitizeSocialUrl(settings.tiktokUrl),
    categoryImageBgColors: sanitizeCategoryImageBgColors(
      settings.categoryImageBgColors
    ),
    categoryCoverImages: sanitizeCategoryCoverImages(
      settings.categoryCoverImages
    ),
    productColorImages: rawProductColorImages,
    americanShawlFrontImage: rawAmericanShawlFrontImage,
    americanShawlBackImage: rawAmericanShawlBackImage,
    regularShawlBaseImage: rawRegularShawlBaseImage,
    deletedProductIds: sanitizeDeletedProductIds(
      settings.deletedProductIds ?? mergedCustomTexts["catalog.deletedIds"]
    ),
    disabledColorizeProductIds: sanitizeDeletedProductIds(
      settings.disabledColorizeProductIds ?? mergedCustomTexts["catalog.disabledColorizeIds"]
    ),
    capOptionPrices: sanitizeCapOptionPrices(
      settings.capOptionPrices ?? mergedCustomTexts["catalog.capOptionPrices"]
    ),
    productPriceOverrides: sanitizeProductPriceOverrides(
      settings.productPriceOverrides ?? mergedCustomTexts["catalog.priceOverrides"]
    ),
    deliveryPricing: sanitizeDeliveryPricing(settings.deliveryPricing),
    shippingCompanies: sanitizeShippingCompanies(settings.shippingCompanies),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (withTimestamp.heroImageUrl) {
    mergedCustomTexts["hero.coverImage"] = withTimestamp.heroImageUrl;
  } else {
    delete mergedCustomTexts["hero.coverImage"];
  }
  if (withTimestamp.americanShawlFrontImage) {
    mergedCustomTexts["americanShawl.frontImage"] = withTimestamp.americanShawlFrontImage;
  } else {
    delete mergedCustomTexts["americanShawl.frontImage"];
  }
  if (withTimestamp.americanShawlBackImage) {
    mergedCustomTexts["americanShawl.backImage"] = withTimestamp.americanShawlBackImage;
  } else {
    delete mergedCustomTexts["americanShawl.backImage"];
  }
  if (withTimestamp.regularShawlBaseImage) {
    mergedCustomTexts["regularShawl.baseImage"] = withTimestamp.regularShawlBaseImage;
  } else {
    delete mergedCustomTexts["regularShawl.baseImage"];
  }
  if (Object.keys(rawProductColorImages).length > 0) {
    mergedCustomTexts["product.colorImages"] = JSON.stringify(
      rawProductColorImages
    );
  }
  if (withTimestamp.deletedProductIds && withTimestamp.deletedProductIds.length > 0) {
    mergedCustomTexts["catalog.deletedIds"] = JSON.stringify(
      withTimestamp.deletedProductIds
    );
  } else {
    delete mergedCustomTexts["catalog.deletedIds"];
  }
  if (withTimestamp.disabledColorizeProductIds && withTimestamp.disabledColorizeProductIds.length > 0) {
    mergedCustomTexts["catalog.disabledColorizeIds"] = JSON.stringify(
      withTimestamp.disabledColorizeProductIds
    );
  } else {
    delete mergedCustomTexts["catalog.disabledColorizeIds"];
  }
  if (withTimestamp.capOptionPrices) {
    mergedCustomTexts["catalog.capOptionPrices"] = JSON.stringify(
      withTimestamp.capOptionPrices
    );
  }
  if (withTimestamp.productPriceOverrides && Object.keys(withTimestamp.productPriceOverrides).length > 0) {
    mergedCustomTexts["catalog.priceOverrides"] = JSON.stringify(
      withTimestamp.productPriceOverrides
    );
  } else {
    delete mergedCustomTexts["catalog.priceOverrides"];
  }
  writeCachedDynamicSettings(withTimestamp);
  if (currentStoreState?.products) {
    writeCachedProducts(currentStoreState.products);
  }
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      savedToStoreSettings: false,
      savedToBackup: false,
      offline: true,
      errorMessage: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u062D\u0627\u0644\u064A\u0627\u064B. \u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643.",
      normalizedSettings: withTimestamp
    };
  }
  const cleanCustomTextsForShrink = { ...withTimestamp.customTexts || {} };
  delete cleanCustomTextsForShrink["product.colorImages"];
  delete cleanCustomTextsForShrink["hero.coverImage"];
  delete cleanCustomTextsForShrink["americanShawl.frontImage"];
  delete cleanCustomTextsForShrink["americanShawl.backImage"];
  delete cleanCustomTextsForShrink["regularShawl.baseImage"];
  const [
    shrunkHero,
    shrunkAmericanFront,
    shrunkAmericanBack,
    shrunkRegularShawlBase,
    shrunkColorImages,
    shrunkCustomTexts,
    shrunkCategoryCovers,
    shrunkShowcasePhotos,
    shrunkStoreState
  ] = await Promise.all([
    withTimestamp.heroImageUrl ? shrinkHeavyImagesInValue(
      withTimestamp.heroImageUrl,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ) : Promise.resolve(void 0),
    withTimestamp.americanShawlFrontImage ? shrinkHeavyImagesInValue(
      withTimestamp.americanShawlFrontImage,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ) : Promise.resolve(void 0),
    withTimestamp.americanShawlBackImage ? shrinkHeavyImagesInValue(
      withTimestamp.americanShawlBackImage,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ) : Promise.resolve(void 0),
    withTimestamp.regularShawlBaseImage ? shrinkHeavyImagesInValue(
      withTimestamp.regularShawlBaseImage,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ) : Promise.resolve(void 0),
    shrinkHeavyImagesInValue(
      rawProductColorImages,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ),
    shrinkHeavyImagesInValue(
      cleanCustomTextsForShrink,
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ),
    shrinkHeavyImagesInValue(
      withTimestamp.categoryCoverImages || {},
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ),
    shrinkHeavyImagesInValue(
      withTimestamp.showcasePhotos || [],
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ),
    currentStoreState ? shrinkHeavyImagesInValue(
      {
        ...currentStoreState,
        dynamicSettings: void 0,
        customTexts: void 0
      },
      RECOMPRESS_MAX_DIM,
      RECOMPRESS_QUALITY,
      HEAVY_BASE64_THRESHOLD_BYTES
    ) : Promise.resolve(void 0)
  ]);
  if (shrunkHero) {
    shrunkCustomTexts["hero.coverImage"] = shrunkHero;
  }
  if (shrunkAmericanFront) {
    shrunkCustomTexts["americanShawl.frontImage"] = shrunkAmericanFront;
  }
  if (shrunkAmericanBack) {
    shrunkCustomTexts["americanShawl.backImage"] = shrunkAmericanBack;
  }
  if (shrunkRegularShawlBase) {
    shrunkCustomTexts["regularShawl.baseImage"] = shrunkRegularShawlBase;
  }
  if (Object.keys(shrunkColorImages).length > 0) {
    shrunkCustomTexts["product.colorImages"] = JSON.stringify(shrunkColorImages);
  }
  withTimestamp = {
    ...withTimestamp,
    heroImageUrl: shrunkHero,
    americanShawlFrontImage: shrunkAmericanFront,
    americanShawlBackImage: shrunkAmericanBack,
    regularShawlBaseImage: shrunkRegularShawlBase,
    productColorImages: shrunkColorImages,
    customTexts: shrunkCustomTexts,
    categoryCoverImages: shrunkCategoryCovers,
    showcasePhotos: shrunkShowcasePhotos
  };
  const buildTiers = (target) => {
    const basePayload = {
      id: 1,
      stole_colors: target.stoleColors,
      gown_colors: target.gownColors,
      thread_colors: target.threadColors,
      cap_colors: target.capColors,
      orders_paused: target.ordersPaused,
      pause_message: target.pauseMessage,
      paused_categories: target.pausedCategories,
      category_pause_badge: target.categoryPauseBadge,
      telegram_enabled: target.telegramEnabled,
      telegram_bot_token: target.telegramBotToken,
      telegram_chat_id: target.telegramChatId,
      payment_info: target.paymentInfo,
      custom_delivery_offices: target.customDeliveryOffices,
      testimonials: target.testimonials,
      showcase_photos: target.showcasePhotos,
      showcase_badge: target.showcaseBadge ?? null,
      showcase_title: target.showcaseTitle ?? null,
      showcase_subtitle: target.showcaseSubtitle ?? null,
      hero_title: target.heroTitle ?? null,
      hero_subtitle: target.heroSubtitle ?? null,
      promo_settings: target.promoSettings,
      updated_at: target.updatedAt
    };
    const extendedPayload = {
      ...basePayload,
      custom_texts: target.customTexts,
      hidden_sections: target.hiddenSections,
      category_branches: target.categoryBranches,
      season_banner_enabled: target.seasonBannerEnabled,
      season_banner_text: target.seasonBannerText,
      whatsapp_number: target.whatsappNumber || ""
    };
    const defaultCourier = (target.shippingCompanies || []).find((c) => c.isDefault) || (target.shippingCompanies || [])[0];
    return [
      {
        ...extendedPayload,
        hero_image_url: target.heroImageUrl ?? null,
        american_shawl_front_image: target.americanShawlFrontImage ?? null,
        american_shawl_back_image: target.americanShawlBackImage ?? null,
        ...knownStoreSettingsColumns?.has("regular_shawl_base_image") ? { regular_shawl_base_image: target.regularShawlBaseImage ?? null } : {},
        instagram_url: target.instagramUrl || "",
        facebook_url: target.facebookUrl || "",
        tiktok_url: target.tiktokUrl || "",
        category_image_bg_colors: target.categoryImageBgColors,
        category_cover_images: target.categoryCoverImages,
        product_color_images: target.productColorImages,
        delivery_pricing: target.deliveryPricing,
        shipping_companies: target.shippingCompanies,
        ...defaultCourier ? {
          delivery_company: defaultCourier.name,
          delivery_api_id: defaultCourier.apiId,
          delivery_api_token: defaultCourier.apiToken
        } : {}
      },
      {
        ...extendedPayload,
        category_image_bg_colors: target.categoryImageBgColors,
        category_cover_images: target.categoryCoverImages
      },
      extendedPayload,
      basePayload,
      {
        id: 1,
        stole_colors: target.stoleColors,
        thread_colors: target.threadColors,
        cap_colors: target.capColors,
        orders_paused: target.ordersPaused,
        pause_message: target.pauseMessage,
        updated_at: target.updatedAt
      }
    ];
  };
  let payloadTiers = buildTiers(withTimestamp);
  try {
    const initialSize = JSON.stringify(payloadTiers[0]).length;
    if (initialSize > MAX_SETTINGS_PAYLOAD_BYTES) {
      const textsWithoutColorJson = { ...withTimestamp.customTexts || {} };
      delete textsWithoutColorJson["product.colorImages"];
      delete textsWithoutColorJson["hero.coverImage"];
      delete textsWithoutColorJson["americanShawl.frontImage"];
      delete textsWithoutColorJson["americanShawl.backImage"];
      delete textsWithoutColorJson["regularShawl.baseImage"];
      const [
        sqHero,
        sqAmericanFront,
        sqAmericanBack,
        sqRegularShawlBase,
        sqColorImgs,
        sqTexts,
        sqCovers,
        sqShowcase
      ] = await Promise.all([
        withTimestamp.heroImageUrl ? shrinkHeavyImagesInValue(withTimestamp.heroImageUrl, 480, 0.62, 60 * 1024) : Promise.resolve(void 0),
        withTimestamp.americanShawlFrontImage ? shrinkHeavyImagesInValue(
          withTimestamp.americanShawlFrontImage,
          480,
          0.62,
          60 * 1024
        ) : Promise.resolve(void 0),
        withTimestamp.americanShawlBackImage ? shrinkHeavyImagesInValue(
          withTimestamp.americanShawlBackImage,
          480,
          0.62,
          60 * 1024
        ) : Promise.resolve(void 0),
        withTimestamp.regularShawlBaseImage ? shrinkHeavyImagesInValue(
          withTimestamp.regularShawlBaseImage,
          480,
          0.62,
          60 * 1024
        ) : Promise.resolve(void 0),
        shrinkHeavyImagesInValue(
          withTimestamp.productColorImages || {},
          480,
          0.62,
          60 * 1024
        ),
        shrinkHeavyImagesInValue(textsWithoutColorJson, 480, 0.62, 60 * 1024),
        shrinkHeavyImagesInValue(
          withTimestamp.categoryCoverImages || {},
          480,
          0.62,
          60 * 1024
        ),
        shrinkHeavyImagesInValue(
          withTimestamp.showcasePhotos || [],
          480,
          0.62,
          60 * 1024
        )
      ]);
      if (sqHero) sqTexts["hero.coverImage"] = sqHero;
      if (sqAmericanFront) sqTexts["americanShawl.frontImage"] = sqAmericanFront;
      if (sqAmericanBack) sqTexts["americanShawl.backImage"] = sqAmericanBack;
      if (sqRegularShawlBase) sqTexts["regularShawl.baseImage"] = sqRegularShawlBase;
      if (Object.keys(sqColorImgs).length > 0) {
        sqTexts["product.colorImages"] = JSON.stringify(sqColorImgs);
      }
      withTimestamp = {
        ...withTimestamp,
        heroImageUrl: sqHero,
        americanShawlFrontImage: sqAmericanFront,
        americanShawlBackImage: sqAmericanBack,
        regularShawlBaseImage: sqRegularShawlBase,
        productColorImages: sqColorImgs,
        customTexts: sqTexts,
        categoryCoverImages: sqCovers,
        showcasePhotos: sqShowcase
      };
      payloadTiers = buildTiers(withTimestamp);
    }
  } catch {
  }
  writeCachedDynamicSettings(withTimestamp);
  const isMissingColumnError = (err) => err.code === "PGRST204" || err.code === "42703" || /column|schema cache/i.test(err.message || "");
  let lastErrorMessage = "";
  const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  const buildExactKnownColumnPayload = () => {
    if (!knownStoreSettingsColumns || knownStoreSettingsColumns.size === 0) {
      return null;
    }
    const full = payloadTiers[0];
    const filtered = { id: 1 };
    for (const [k, v] of Object.entries(full)) {
      if (k === "id" || knownStoreSettingsColumns.has(k)) {
        filtered[k] = v;
      }
    }
    return filtered;
  };
  const upsertStoreSettings = (payload) => {
    const query = supabase.from("store_settings").upsert(payload, { onConflict: "id" });
    if (abortController && typeof query.abortSignal === "function") {
      return query.abortSignal(abortController.signal);
    }
    return query;
  };
  const saveStoreSettingsFast = async () => {
    const exactPayload = buildExactKnownColumnPayload();
    if (exactPayload) {
      const { error } = await upsertStoreSettings(exactPayload);
      if (!error) {
        return true;
      }
      lastErrorMessage = error.message || "";
      if (!isMissingColumnError(error)) {
        return false;
      }
      knownStoreSettingsColumns = null;
    }
    const startTier = workingStoreSettingsTier ?? 0;
    for (let tier = startTier; tier < payloadTiers.length; tier += 1) {
      if (abortController?.signal.aborted) return false;
      const { error } = await upsertStoreSettings(payloadTiers[tier]);
      if (!error) {
        workingStoreSettingsTier = tier;
        return true;
      }
      lastErrorMessage = error.message || "";
      if (!isMissingColumnError(error)) {
        return false;
      }
    }
    return false;
  };
  const saveBackupFast = async () => {
    if (!shrunkStoreState) return false;
    try {
      await saveStoreState({
        ...shrunkStoreState,
        customTexts: withTimestamp.customTexts,
        dynamicSettings: withTimestamp
      });
      return true;
    } catch (backupErr) {
      console.warn("store_data backup save note:", backupErr);
      return false;
    }
  };
  try {
    const [storeSettingsOk, backupOk] = await withTimeout(
      Promise.all([saveStoreSettingsFast(), saveBackupFast()]),
      CLOUD_SAVE_TIMEOUT_MS,
      "CLOUD_SAVE_TIMEOUT"
    );
    if (storeSettingsOk || backupOk) {
      return {
        savedToStoreSettings: storeSettingsOk,
        savedToBackup: backupOk,
        normalizedSettings: withTimestamp
      };
    }
    return {
      savedToStoreSettings: false,
      savedToBackup: false,
      errorMessage: lastErrorMessage || "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u062E\u0627\u062F\u0645.",
      normalizedSettings: withTimestamp
    };
  } catch (err) {
    abortController?.abort();
    const isTimeout = err instanceof Error && err.message === "CLOUD_SAVE_TIMEOUT";
    return {
      savedToStoreSettings: false,
      savedToBackup: false,
      timedOut: isTimeout,
      errorMessage: isTimeout ? "\u0627\u0646\u062A\u0647\u062A \u0645\u0647\u0644\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 (25 \u062B\u0627\u0646\u064A\u0629). \u062A\u0645 \u062D\u0641\u0638 \u062A\u063A\u064A\u064A\u0631\u0627\u062A\u0643 \u0645\u062D\u0644\u064A\u0627\u064B\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u062C\u0648\u062F\u0629 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0648\u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629." : "\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 \u062D\u0627\u0644\u064A\u0627\u064B. \u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643.",
      normalizedSettings: withTimestamp
    };
  }
}
async function sendTelegramOrderNotification(params) {
  const token = params.botToken.trim();
  const chatId = params.chatId.trim();
  if (!token || !chatId || !/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
    return false;
  }
  const itemLines = params.items.map((it, idx) => {
    const embroiderySummary = it.rightEmbroideredText || it.leftEmbroideredText ? [
      it.rightEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649: ${it.rightEmbroideredText}` : null,
      it.leftEmbroideredText ? `\u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649: ${it.leftEmbroideredText}` : null
    ].filter(Boolean).join(" | ") : it.embroideredText ? `\u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0631\u0632: ${it.embroideredText}` : null;
    const specs = [
      it.fabricType ? `\u0627\u0644\u0642\u0645\u0627\u0634: ${it.fabricType}` : null,
      it.shawlColor ? `\u0627\u0644\u0644\u0648\u0646: ${it.shawlColor}` : null,
      it.threadColor ? `\u0627\u0644\u062A\u0637\u0631\u064A\u0632: ${it.threadColor}` : null,
      embroiderySummary,
      it.size ? `\u0627\u0644\u0645\u0642\u0627\u0633: ${it.size}` : null,
      it.capStyle ? `\u0627\u0644\u0642\u0628\u0639\u0629: ${it.capStyle}` : null,
      it.capEmbroidery ? `\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0642\u0628\u0639\u0629: ${it.capEmbroidery}` : null,
      it.gownOption ? `\u0627\u0644\u0631\u0648\u0628: ${it.gownOption}` : null,
      it.hasUniversityLogo ? `\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629: \u0645\u0631\u0641\u0642 (\u0645\u062C\u0627\u0646\u0627\u064B)` : null,
      it.hasCustomModelImage ? `\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0635\u0635\u0629: \u0645\u0631\u0641\u0642\u0629 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629` : null,
      it.excludedOptions && it.excludedOptions.length > 0 ? `\u0645\u0633\u062A\u0628\u0639\u062F: ${it.excludedOptions.join("\u060C ")}` : null
    ].filter(Boolean);
    const fullSpecs = it.details || specs.join(" \xB7 ");
    const lineTotal = (it.unitPrice * it.quantity).toLocaleString("en-US");
    return `${idx + 1}. ${it.title} \xD7 ${it.quantity} (${lineTotal} \u062F\u062C)${fullSpecs ? `
   \u21B3 ${fullSpecs}` : ""}`;
  }).join("\n");
  const deposit50 = Math.round(params.subtotal * 0.5);
  const paidAmt = Math.max(0, Math.round(Number(params.paidAmount || 0)));
  const remainingAmt = Math.max(0, params.subtotal - paidAmt);
  const deliveryMethodLabel = params.deliveryType === "home" ? "\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0646\u0632\u0644" : "\u062A\u0648\u0635\u064A\u0644 \u0644\u0645\u0643\u062A\u0628 \u0627\u0644\u0634\u0631\u0643\u0629 (Stop Desk)";
  const message = [
    `\u{1F514} \u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0645\u0646 \u0645\u062A\u062C\u0631 DG by Douaa${params.orderNumber ? ` (#${params.orderNumber})` : ""}`,
    `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
    `\u{1F464} \u0627\u0644\u0632\u0628\u0648\u0646: ${params.customerName}`,
    `\u{1F4F1} \u0627\u0644\u0647\u0627\u062A\u0641: ${params.phone}`,
    `\u{1F4CD} \u0627\u0644\u0639\u0646\u0648\u0627\u0646: ${params.wilaya}${params.commune ? ` - ${params.commune}` : ""}`,
    `\u{1F69A} \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: ${deliveryMethodLabel}`,
    typeof params.deliveryFee === "number" ? `\u{1F4E6} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644: ${params.deliveryFee > 0 ? `${params.deliveryFee.toLocaleString("en-US")} \u062F\u062C` : "\u0645\u062C\u0627\u0646\u064A"}` : null,
    `\u{1F393} \u0645\u0648\u0639\u062F \u0627\u0644\u062A\u062E\u0631\u062C / \u0627\u0644\u062A\u0633\u0644\u064A\u0645: ${params.deliveryDate || "\u0623\u0642\u0631\u0628 \u0645\u0648\u0639\u062F \u0645\u062A\u0627\u062D"}`,
    ``,
    `\u{1F6CD}\uFE0F \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0642\u0637\u0639:`,
    itemLines,
    ``,
    params.discountAmount && params.discountAmount > 0 ? `\u{1F3F7}\uFE0F \u0627\u0644\u062A\u062E\u0641\u064A\u0636${params.promoCode ? ` (${params.promoCode})` : ""}: -${params.discountAmount.toLocaleString("en-US")} \u062F\u062C` : null,
    `\u{1F4B0} \u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064A: ${params.subtotal.toLocaleString("en-US")} \u062F\u062C`,
    paidAmt > 0 ? `\u{1F4B3} \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0648\u0651\u0644 / \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u0645\u062F\u0641\u0648\u0639: ${paidAmt.toLocaleString("en-US")} \u062F\u062C` : `\u{1F4B3} \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u0627\u0644\u0645\u0642\u062A\u0631\u062D (50%): ${deposit50.toLocaleString("en-US")} \u062F\u062C`,
    paidAmt > 0 ? `\u{1F4B5} \u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: ${remainingAmt > 0 ? `${remainingAmt.toLocaleString("en-US")} \u062F\u062C` : "\u062E\u0627\u0644\u0635 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u2713"}` : null,
    params.hasReceipt ? `\u{1F4C4} \u0648\u0635\u0644 \u0627\u0644\u062F\u0641\u0639: \u0645\u0631\u0641\u0642 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629` : null,
    params.notes ? `\u{1F4DD} \u0645\u0644\u0627\u062D\u0638\u0627\u062A: ${params.notes}` : null
  ].filter((line) => line !== null).join("\n");
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
async function sendTelegramTestMessage(botToken, chatId) {
  const token = botToken.trim();
  const cleanChatId = chatId.trim();
  if (!token || !/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
    return {
      ok: false,
      error: "\u0635\u064A\u063A\u0629 Telegram Bot Token \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629."
    };
  }
  if (!cleanChatId) {
    return {
      ok: false,
      error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 Telegram Chat ID."
    };
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: "\u2705 \u062A\u0645 \u0631\u0628\u0637 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u0645\u0639 \u0645\u062A\u062C\u0631 DG by Douaa! \u0633\u062A\u0635\u0644\u0643 \u062A\u0641\u0627\u0635\u064A\u0644 \u0643\u0644 \u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0647\u0646\u0627 \u0641\u0648\u0631\u0627\u064B."
        })
      }
    );
    if (!res.ok) {
      return {
        ok: false,
        error: "\u062A\u0639\u0630\u0631 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0639\u0628\u0631 Telegram. \u062A\u0623\u0643\u062F\u064A \u0645\u0646 \u0635\u062D\u0629 Token \u0648 Chat ID \u0648\u0623\u0646\u0643\u0650 \u0628\u062F\u0623\u062A\u0650 \u0645\u062D\u0627\u062F\u062B\u0629 \u0645\u0639 \u0627\u0644\u0628\u0648\u062A (/start)."
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u062E\u062F\u0645\u0629 Telegram."
    };
  }
}
async function loadOptimizedCanvas(file, maxDimension = 1200) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062D (JPG / PNG / WebP).");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("\u062D\u062C\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B. \u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0635\u0648\u0631\u0629 \u0623\u0642\u0644 \u0645\u0646 15 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A.");
  }
  const effectiveMaxDimension = Math.min(Math.max(1, Number(maxDimension) || 1200), 1200);
  const objectUrl = typeof URL !== "undefined" && typeof URL.createObjectURL === "function" ? URL.createObjectURL(file) : "";
  const img = await new Promise((resolve, reject) => {
    const imageEl = new Image();
    imageEl.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(imageEl);
    };
    imageEl.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("\u062A\u0639\u0630\u0631 \u0642\u0631\u0627\u0621\u0629 \u0645\u0644\u0641 \u0627\u0644\u0635\u0648\u0631\u0629."));
      reader.onload = (ev) => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => reject(new Error("\u0635\u064A\u063A\u0629 \u0627\u0644\u0635\u0648\u0631\u0629 \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645\u0629."));
        fallbackImg.src = String(ev.target?.result || "");
      };
      reader.readAsDataURL(file);
    };
    if (objectUrl) {
      imageEl.src = objectUrl;
    } else {
      imageEl.onerror(new Event("error"));
    }
  });
  const naturalW = img.naturalWidth || img.width || 1;
  const naturalH = img.naturalHeight || img.height || 1;
  const maxSide = Math.max(naturalW, naturalH, 1);
  const ratio = Math.min(1, effectiveMaxDimension / maxSide);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(naturalW * ratio));
  canvas.height = Math.max(1, Math.round(naturalH * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("\u062A\u0639\u0630\u0631 \u0636\u063A\u0637 \u0627\u0644\u0635\u0648\u0631\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632.");
  }
  const alphaCapable = file.type === "image/png" || file.type === "image/webp" || file.type === "image/gif" || file.type === "image/svg+xml";
  if (alphaCapable) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let hasTransparency = false;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) {
          hasTransparency = true;
          break;
        }
      }
    } catch {
      hasTransparency = file.type === "image/png";
    }
    if (!hasTransparency) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    return { canvas, hasTransparency };
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { canvas, hasTransparency: false };
}
async function compressReceiptImage(file, maxDimension = 1200, quality = 0.82) {
  const clampedMax = Math.min(Math.max(1, Number(maxDimension) || 1200), 1200);
  const clampedQuality = Math.min(Math.max(0.4, Number(quality) || 0.82), 0.82);
  const { canvas, hasTransparency } = await loadOptimizedCanvas(file, clampedMax);
  const webpUrl = canvas.toDataURL("image/webp", clampedQuality);
  if (webpUrl.startsWith("data:image/webp")) {
    return webpUrl;
  }
  if (hasTransparency) {
    return canvas.toDataURL("image/png");
  }
  return canvas.toDataURL("image/jpeg", clampedQuality);
}
async function uploadStoreImage(file, maxDimension = 1200, quality = 0.82) {
  const clampedMax = Math.min(Math.max(1, Number(maxDimension) || 1200), 1200);
  const clampedQuality = Math.min(Math.max(0.4, Number(quality) || 0.82), 0.82);
  const { canvas, hasTransparency } = await loadOptimizedCanvas(file, clampedMax);
  const toBlobAsync = (mime, q) => new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, q);
  });
  let blob = await toBlobAsync("image/webp", clampedQuality);
  if (!blob || blob.type !== "image/webp") {
    const fallbackMime = hasTransparency ? "image/png" : "image/jpeg";
    blob = await toBlobAsync(
      fallbackMime,
      fallbackMime === "image/png" ? void 0 : clampedQuality
    );
  }
  if (!blob) {
    throw new Error("\u062A\u0639\u0630\u0631 \u0636\u063A\u0637 \u0627\u0644\u0635\u0648\u0631\u0629.");
  }
  const actualMime = blob.type || (hasTransparency ? "image/png" : "image/jpeg");
  const ext = actualMime === "image/webp" ? "webp" : actualMime === "image/png" ? "png" : "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = `store/${safeName}`;
  const { error } = await supabase.storage.from("store-images").upload(path, blob, { contentType: actualMime, upsert: false });
  if (error) {
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from("store-images").getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("\u062A\u0645 \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u0644\u0643\u0646 \u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0631\u0627\u0628\u0637\u0647\u0627.");
  }
  return data.publicUrl;
}
function normalizePhoneDigits(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("213") && digits.length >= 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.startsWith("00213") && digits.length >= 14) {
    return `0${digits.slice(5)}`;
  }
  return digits;
}
async function lookupCustomerOrdersByPhone(phoneInput, orderNumberInput) {
  const normalizedInput = normalizePhoneDigits(phoneInput);
  if (normalizedInput.length < 9) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0635\u062D\u064A\u062D (9 \u0623\u0631\u0642\u0627\u0645 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644).");
  }
  const last9 = normalizedInput.slice(-9);
  const cleanOrderNumStr = (orderNumberInput || "").replace(/[^\d]/g, "");
  const parsedOrderNum = cleanOrderNumStr ? Number(cleanOrderNumStr) : null;
  const baseFields = "id, order_number, customer_name, phone, wilaya, commune, delivery_type, order_items, product_details, total_sell_price, status, created_at";
  let query = supabase.from("orders").select(`${baseFields}, paid_amount`).ilike("phone", `%${last9}%`).order("order_number", { ascending: false }).limit(10);
  if (parsedOrderNum && Number.isFinite(parsedOrderNum)) {
    query = query.eq("order_number", parsedOrderNum);
  }
  let { data, error } = await query;
  if (error && error.message?.includes("paid_amount")) {
    let fallbackQuery = supabase.from("orders").select(baseFields).ilike("phone", `%${last9}%`).order("order_number", { ascending: false }).limit(10);
    if (parsedOrderNum && Number.isFinite(parsedOrderNum)) {
      fallbackQuery = fallbackQuery.eq("order_number", parsedOrderNum);
    }
    const fallbackRes = await fallbackQuery;
    data = fallbackRes.data;
    error = fallbackRes.error;
  }
  if (error) {
    throw new Error("\u062A\u0639\u0630\u0631 \u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0637\u0644\u0628 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0628\u0639\u062F \u0642\u0644\u064A\u0644.");
  }
  const rows = data || [];
  return rows.filter((row) => {
    const rowDigits = normalizePhoneDigits(row.phone || "");
    return rowDigits.length >= 9 && rowDigits.slice(-9) === last9;
  });
}
const CUSTOMER_REVIEWS_STORAGE_KEY = "dg_by_douaa_customer_reviews_v1";
function readCachedCustomerReviews() {
  try {
    const raw = localStorage.getItem(CUSTOMER_REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return sanitizeTestimonials(parsed, []);
  } catch {
    return [];
  }
}
function writeCachedCustomerReviews(list) {
  try {
    localStorage.setItem(CUSTOMER_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    const settingsCached = readCachedDynamicSettings();
    if (settingsCached) {
      writeCachedDynamicSettings({ ...settingsCached, testimonials: list });
    }
  } catch {
  }
}
function mergeUniqueReviews(...lists) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const list of lists) {
    for (const item of list) {
      if (!item || !item.id || seen.has(item.id)) continue;
      if (LEGACY_SEED_TESTIMONIALS.get(item.id) === item.name) continue;
      seen.add(item.id);
      merged.push(item);
    }
  }
  return merged;
}
async function loadCustomerReviews(storeSettingsTestimonials = []) {
  const cachedReviews = readCachedCustomerReviews();
  const settingsReviews = sanitizeTestimonials(storeSettingsTestimonials, []);
  let dbTableReviews = [];
  try {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(100);
    if (!error && Array.isArray(data)) {
      dbTableReviews = sanitizeTestimonials(
        data.map((row) => ({
          id: typeof row.id === "string" ? row.id : String(row.id || ""),
          name: typeof row.name === "string" ? row.name : typeof row.customer_name === "string" ? row.customer_name : "",
          wilaya: typeof row.wilaya === "string" ? row.wilaya : "",
          university: typeof row.university === "string" ? row.university : void 0,
          rating: Number(row.rating || 5),
          comment: typeof row.comment === "string" ? row.comment : "",
          productTag: typeof row.product_tag === "string" ? row.product_tag : void 0,
          dateLabel: typeof row.date_label === "string" ? row.date_label : void 0
        })),
        []
      );
    }
  } catch {
  }
  const merged = mergeUniqueReviews(dbTableReviews, settingsReviews, cachedReviews);
  writeCachedCustomerReviews(merged);
  return merged;
}
async function submitCustomerReview(input, existingReviews) {
  const cleanName = input.name.trim().slice(0, 80);
  const cleanWilaya = input.wilaya.trim().slice(0, 60);
  const cleanComment = input.comment.trim().slice(0, 600);
  const cleanRating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
  if (!cleanName || !cleanWilaya || !cleanComment) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0648\u0644\u0627\u064A\u0629 \u0648\u0627\u0644\u062A\u0642\u064A\u064A\u0645.");
  }
  const now = /* @__PURE__ */ new Date();
  const entry = {
    id: `rev-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    wilaya: cleanWilaya,
    rating: cleanRating,
    comment: cleanComment,
    dateLabel: now.toLocaleDateString("ar-DZ", { year: "numeric", month: "short" })
  };
  const nextList = mergeUniqueReviews([entry], existingReviews);
  writeCachedCustomerReviews(nextList);
  try {
    await supabase.from("reviews").insert([
      {
        id: entry.id,
        name: entry.name,
        wilaya: entry.wilaya,
        rating: entry.rating,
        comment: entry.comment,
        date_label: entry.dateLabel,
        created_at: now.toISOString()
      }
    ]);
  } catch {
  }
  try {
    await supabase.from("store_settings").update({
      testimonials: nextList,
      updated_at: now.toISOString()
    }).eq("id", 1);
  } catch {
  }
  return nextList;
}
async function deleteCustomerReview(id, existingReviews) {
  const nextList = existingReviews.filter((r) => r.id !== id);
  writeCachedCustomerReviews(nextList);
  try {
    await supabase.from("reviews").delete().eq("id", id);
  } catch {
  }
  try {
    await supabase.from("store_settings").update({
      testimonials: nextList,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", 1);
  } catch {
  }
  return nextList;
}
export {
  compressReceiptImage,
  deleteCustomerReview,
  loadCustomerReviews,
  loadDynamicSettings,
  loadStoreState,
  lookupCustomerOrdersByPhone,
  normalizeAlgerianPhoneE164,
  readCachedDynamicSettings,
  readCachedProducts,
  requestPasswordResetByEmail,
  sanitizeDeliveryPricing,
  sanitizeShippingCompanies,
  saveDynamicSettings,
  saveStoreState,
  sendPasswordResetSmsOtp,
  sendTelegramOrderNotification,
  sendTelegramTestMessage,
  signInAdmin,
  signOutAdmin,
  submitCustomerReview,
  supabase,
  updateAdminEmail,
  updateAdminPassword,
  uploadStoreImage,
  verifyPasswordResetSmsOtp,
  writeCachedDynamicSettings,
  writeCachedProducts
};
