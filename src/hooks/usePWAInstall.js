import { useEffect, useState } from "react";
let cachedDeferredPrompt = null;
let cachedIsInstalled = false;
const listeners = /* @__PURE__ */ new Set();
function notifyListeners() {
  listeners.forEach((fn) => fn());
}
if (typeof window !== "undefined") {
  const standaloneCheck = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  cachedIsInstalled = standaloneCheck;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    cachedDeferredPrompt = e;
    notifyListeners();
  });
  window.addEventListener("appinstalled", () => {
    cachedIsInstalled = true;
    cachedDeferredPrompt = null;
    notifyListeners();
  });
}
function initSilentPWAInstallSuppression() {
}
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(cachedDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(cachedIsInstalled);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) {
      cachedIsInstalled = true;
    }
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    const sync = () => {
      setDeferredPrompt(cachedDeferredPrompt);
      setIsInstalled(cachedIsInstalled);
    };
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  const install = async () => {
    const targetPrompt = deferredPrompt || cachedDeferredPrompt;
    if (!targetPrompt) return "unavailable";
    await targetPrompt.prompt();
    const { outcome } = await targetPrompt.userChoice;
    if (outcome === "accepted") {
      cachedIsInstalled = true;
      cachedDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      notifyListeners();
      return "accepted";
    }
    return "dismissed";
  };
  return {
    isInstallable: Boolean(deferredPrompt || cachedDeferredPrompt),
    isInstalled,
    isIOS,
    install
  };
}
export {
  initSilentPWAInstallSuppression,
  usePWAInstall
};
