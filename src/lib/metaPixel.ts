// Optional Meta Pixel. Loads only when an ID is configured AND the visitor accepts cookies.
export const META_PIXEL_SETTING_KEY = 'meta.pixelId';
const CONSENT_KEY = 'dg_meta_pixel_consent_v1';

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

export function isValidPixelId(id: string | undefined | null): id is string {
  return !!id && /^\d{10,20}$/.test(id.trim());
}

export function getConsent(): 'granted' | 'denied' | null {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === 'granted' || v === 'denied' ? v : null; } catch { return null; }
}
export function setConsent(v: 'granted' | 'denied') {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* ignore */ }
}

let loadedId: string | null = null;
export function loadMetaPixel(id: string) {
  if (typeof window === 'undefined' || !isValidPixelId(id) || getConsent() !== 'granted' || loadedId === id) return;
  if (!window.fbq) {
    const n: Fbq = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue?.push(args);
    } as Fbq;
    n.queue = []; n.loaded = true; n.version = '2.0'; n.push = n;
    window.fbq = n; window._fbq = n;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }
  window.fbq('init', id);
  window.fbq('track', 'PageView');
  loadedId = id;
}

export function trackMeta(event: 'AddToCart' | 'Purchase', params: Record<string, unknown>) {
  if (typeof window !== 'undefined' && loadedId && getConsent() === 'granted' && window.fbq) window.fbq('track', event, params);
}
