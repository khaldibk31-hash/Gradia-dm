import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CloudUpload,
  CreditCard,
  Loader2,
  Pencil,
  RotateCcw,
  Sparkles,
  Tag,
  Truck,
  X
} from "lucide-react";
import {
  DEFAULT_SHOWCASE_PHOTOS,
  HERO_BANNER_IMAGE_PATH
} from "../data/defaultStore";
import { compressReceiptImage, uploadStoreImage } from "../lib/supabase";
import { EditableText, SectionHideButton, useStoreEdit } from "./EditableText";
const TRUST_BADGES = [
  {
    key: "badge0",
    icon: Truck,
    title: "\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 58 \u0648\u0644\u0627\u064A\u0629",
    desc: "\u0625\u0644\u0649 \u0627\u0644\u0645\u0646\u0632\u0644 \u0623\u0648 \u0645\u0643\u062A\u0628 \u0627\u0644\u062A\u0648\u0635\u064A\u0644"
  },
  {
    key: "badge1",
    icon: CreditCard,
    title: "\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645",
    desc: "\u0627\u062F\u0641\u0639 \u0646\u0642\u062F\u0627\u064B \u0639\u0646\u062F \u0648\u0635\u0648\u0644 \u0637\u0644\u0628\u0643"
  },
  {
    key: "badge2",
    icon: Pencil,
    title: "\u062A\u062E\u0635\u064A\u0635 \u0628\u0627\u0644\u0627\u0633\u0645",
    desc: "\u062A\u0637\u0631\u064A\u0632 \u0627\u0644\u0627\u0633\u0645 \u0648\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629"
  },
  {
    key: "badge3",
    icon: BadgeCheck,
    title: "\u062C\u0648\u062F\u0629 \u0641\u0627\u062E\u0631\u0629",
    desc: "\u0623\u0642\u0645\u0634\u0629 \u0645\u062E\u062A\u0627\u0631\u0629 \u0648\u062A\u0634\u0637\u064A\u0628 \u062F\u0642\u064A\u0642"
  }
];
const DEFAULT_HERO_TITLE_AR = "\u062A\u062E\u0631\u0651\u062C \u0628\u0623\u0646\u0627\u0642\u0629 \u062A\u0644\u064A\u0642 \u0628\u0625\u0646\u062C\u0627\u0632\u0643";
const DEFAULT_HERO_SUBTITLE_AR = "\u0623\u0631\u0648\u0627\u0628\u060C \u0642\u0628\u0639\u0627\u062A \u0648\u0648\u0634\u0627\u062D\u0627\u062A \u062A\u062E\u0631\u062C \u0641\u0627\u062E\u0631\u0629 \u0645\u0639 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0628\u0627\u0644\u0627\u0633\u0645 \u0648\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629. \u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 58 \u0648\u0644\u0627\u064A\u0629.";
function HeroSection({
  copy,
  heroTitleOverride,
  heroSubtitleOverride,
  heroImageUrl,
  galleryImages = DEFAULT_SHOWCASE_PHOTOS,
  isUploadingHeroImage = false,
  isSavingCloud = false,
  storewideDiscountPercent = 0,
  isAdminMode = false,
  onUploadHeroImage,
  onResetHeroImage,
  onUpdateGalleryImages,
  onDeletePrimarySlide,
  onPublish,
  onNotify
}) {
  const [failedSlideIds, setFailedSlideIds] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSlideManagerOpen, setIsSlideManagerOpen] = useState(false);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [replacingSlideId, setReplacingSlideId] = useState(null);
  const heroImageInputRef = useRef(null);
  const addSlideInputRef = useRef(null);
  const replaceSlideInputRef = useRef(null);
  const pendingReplaceIdRef = useRef(null);
  const touchStartRef = useRef(null);
  const { hiddenSections } = useStoreEdit();
  const isTrustBadgesHidden = Boolean(hiddenSections.trustBadges);
  const resolvedPrimaryCoverUrl = heroImageUrl?.trim() || HERO_BANNER_IMAGE_PATH;
  const heroSlides = useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const list = [];
    const pushUnique = (id, rawUrl, alt, isPrimary) => {
      const clean = typeof rawUrl === "string" ? rawUrl.trim() : "";
      if (!clean || seen.has(clean)) return;
      seen.add(clean);
      list.push({ id, url: clean, alt, isPrimary });
    };
    pushUnique(
      "hero-primary",
      resolvedPrimaryCoverUrl,
      "\u062E\u0631\u064A\u062C\u0648\u0646 \u062C\u0632\u0627\u0626\u0631\u064A\u0648\u0646 \u064A\u062D\u062A\u0641\u0644\u0648\u0646 \u0628\u0627\u0644\u062A\u062E\u0631\u062C \u0628\u0642\u0628\u0639\u0627\u062A \u0648\u0623\u0631\u0648\u0627\u0628 \u0648\u0648\u0634\u0627\u062D\u0627\u062A DG by Douaa \u0627\u0644\u0641\u0627\u062E\u0631\u0629",
      true
    );
    galleryImages.forEach((photo, idx) => {
      pushUnique(
        photo.id || `gallery-slide-${idx + 1}`,
        photo.imageUrl,
        photo.caption?.trim() || "\u0645\u0646 \u0625\u0628\u062F\u0627\u0639\u0627\u062A DG by Douaa \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0644\u0644\u062A\u062E\u0631\u062C",
        false
      );
    });
    return list;
  }, [resolvedPrimaryCoverUrl, galleryImages]);
  const safeActiveSlide = heroSlides.length > 0 ? Math.min(activeSlide, heroSlides.length - 1) : 0;
  useEffect(() => {
    setFailedSlideIds({});
  }, [resolvedPrimaryCoverUrl]);
  useEffect(() => {
    if (!isAdminMode) {
      setIsSlideManagerOpen(false);
    }
  }, [isAdminMode]);
  useEffect(() => {
    if (!isSlideManagerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSlideManagerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSlideManagerOpen]);
  useEffect(() => {
    setActiveSlide(
      (prev) => heroSlides.length === 0 ? 0 : Math.min(prev, heroSlides.length - 1)
    );
  }, [heroSlides.length]);
  const goToNextSlide = useCallback(() => {
    if (heroSlides.length <= 1) return;
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);
  const goToPrevSlide = useCallback(() => {
    if (heroSlides.length <= 1) return;
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);
  const isAutoSlidePaused = isAdminMode || isTouching || isHovered || isSlideManagerOpen || heroSlides.length <= 1;
  useEffect(() => {
    if (isAutoSlidePaused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4e3);
    return () => window.clearInterval(timer);
  }, [isAutoSlidePaused, heroSlides.length]);
  const handleHeroImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadHeroImage) {
      onUploadHeroImage(file);
      setActiveSlide(0);
      e.target.value = "";
    }
  };
  const uploadOrCompressSlide = async (file) => {
    try {
      return await uploadStoreImage(file, 1400, 0.85);
    } catch {
      return await compressReceiptImage(file, 1400, 0.85);
    }
  };
  const handleAddGallerySlide = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onUpdateGalleryImages) return;
    if (!file.type.startsWith("image/")) {
      onNotify?.("error", "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062D.");
      return;
    }
    setIsAddingSlide(true);
    try {
      const url = await uploadOrCompressSlide(file);
      const newSlide = {
        id: `showcase-${Date.now()}`,
        imageUrl: url
      };
      const nextList = [...galleryImages, newSlide];
      onUpdateGalleryImages(nextList);
      setActiveSlide(heroSlides.length);
      onNotify?.(
        "success",
        "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629. \u0627\u0636\u063A\u0637\u064A \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627 \u0644\u0644\u062C\u0645\u064A\u0639."
      );
    } catch (err) {
      onNotify?.(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u064A\u062D\u0629."
      );
    } finally {
      setIsAddingSlide(false);
    }
  };
  const triggerReplaceGallerySlide = (slideId) => {
    pendingReplaceIdRef.current = slideId;
    if (replaceSlideInputRef.current) {
      replaceSlideInputRef.current.value = "";
      replaceSlideInputRef.current.click();
    }
  };
  const handleReplaceGallerySlide = async (e) => {
    const file = e.target.files?.[0];
    const targetId = pendingReplaceIdRef.current;
    e.target.value = "";
    pendingReplaceIdRef.current = null;
    if (!file || !targetId || !onUpdateGalleryImages) return;
    if (!file.type.startsWith("image/")) {
      onNotify?.("error", "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062D.");
      return;
    }
    setReplacingSlideId(targetId);
    try {
      const url = await uploadOrCompressSlide(file);
      const nextList = galleryImages.map(
        (item) => item.id === targetId ? { ...item, imageUrl: url } : item
      );
      setFailedSlideIds((prev) => {
        const copy2 = { ...prev };
        delete copy2[targetId];
        return copy2;
      });
      onUpdateGalleryImages(nextList);
      onNotify?.(
        "success",
        "\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u064A\u062D\u0629. \u0627\u0636\u063A\u0637\u064A \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u063A\u064A\u064A\u0631."
      );
    } catch (err) {
      onNotify?.(
        "error",
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u064A\u062D\u0629."
      );
    } finally {
      setReplacingSlideId(null);
    }
  };
  const handleDeleteGallerySlide = (slideId) => {
    if (!onUpdateGalleryImages) return;
    const nextList = galleryImages.filter((item) => item.id !== slideId);
    onUpdateGalleryImages(nextList);
    onNotify?.(
      "info",
      "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0645\u0646 \u0627\u0644\u063A\u0644\u0627\u0641. \u0627\u0636\u063A\u0637\u064A \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB \u0644\u062D\u0641\u0638 \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A."
    );
  };
  const handleDeletePrimaryCoverSlide = () => {
    if (galleryImages.length > 0 && onDeletePrimarySlide) {
      const [firstGallery, ...restGallery] = galleryImages;
      onDeletePrimarySlide(firstGallery.imageUrl, restGallery);
      setActiveSlide(0);
      onNotify?.(
        "info",
        "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0648\u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0645\u0643\u0627\u0646\u0647\u0627. \u0627\u0636\u063A\u0637\u064A \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB \u0644\u0644\u062A\u062B\u0628\u064A\u062A."
      );
      return;
    }
    if (heroImageUrl?.trim() && onResetHeroImage) {
      onResetHeroImage();
      setActiveSlide(0);
      return;
    }
    onNotify?.(
      "info",
      "\u064A\u062C\u0628 \u0628\u0642\u0627\u0621 \u0635\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u0644\u063A\u0644\u0627\u0641. \u064A\u0645\u0643\u0646\u0643 \u0627\u0633\u062A\u0628\u062F\u0627\u0644\u0647\u0627 \u0628\u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \xAB\u{1F4F7} \u062A\u063A\u064A\u064A\u0631\xBB."
    );
  };
  const handleRestoreDefaultSlides = () => {
    if (!onUpdateGalleryImages) return;
    onUpdateGalleryImages(DEFAULT_SHOWCASE_PHOTOS);
    onNotify?.(
      "info",
      "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0634\u0631\u0627\u0626\u062D \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629. \u0627\u0636\u063A\u0637\u064A \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB \u0644\u062A\u062B\u0628\u064A\u062A\u0647\u0627."
    );
  };
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsTouching(true);
  };
  const handleTouchEnd = (e) => {
    setIsTouching(false);
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || heroSlides.length <= 1) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };
  const resolvedHeroTitle = heroTitleOverride?.trim() || (copy.heroTitle && copy.heroTitle !== "\u0637\u0642\u0645 \u062A\u062E\u0631\u062C\u0643\u060C \u0628\u062A\u0641\u0635\u064A\u0644 \u0648\u062A\u0637\u0631\u064A\u0632 \u064A\u0644\u064A\u0642 \u0628\u064A\u0648\u0645\u0643" ? copy.heroTitle : DEFAULT_HERO_TITLE_AR);
  const resolvedHeroSubtitle = heroSubtitleOverride?.trim() || (copy.heroSubtitle && !copy.heroSubtitle.startsWith("\u0634\u0627\u0644 \u062A\u062E\u0631\u062C \u0645\u0639 \u0627\u0644\u0642\u0628\u0639\u0629 \u064A\u064F\u0637\u0631\u064E\u0651\u0632") ? copy.heroSubtitle : DEFAULT_HERO_SUBTITLE_AR);
  return /* @__PURE__ */ jsxs("section", { id: "top", "data-admin-managed": "true", className: "relative bg-[#FAF8F5]", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: heroImageInputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleHeroImageFileChange
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: addSlideInputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleAddGallerySlide
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: replaceSlideInputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleReplaceGallerySlide
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        onContextMenu: (e) => e.preventDefault(),
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: () => {
          touchStartRef.current = null;
          setIsTouching(false);
        },
        onPointerEnter: (e) => {
          if (e.pointerType === "mouse") setIsHovered(true);
        },
        onPointerLeave: (e) => {
          if (e.pointerType === "mouse") setIsHovered(false);
        },
        className: "relative w-full h-[540px] sm:h-[600px] lg:h-[650px] flex flex-col justify-end overflow-hidden bg-[#1A1617] protected-media select-none",
        children: [
          isAdminMode && onUploadHeroImage && /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: (e) => e.stopPropagation(),
              className: "absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: isUploadingHeroImage,
                    onClick: () => heroImageInputRef.current?.click(),
                    className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-[#5E1734] border border-[#C6A355]/60 text-xs font-extrabold shadow-lg backdrop-blur-sm transition-all touch-manipulation active:scale-95 disabled:opacity-70 cursor-pointer",
                    children: isUploadingHeroImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin text-[#5E1734]" }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0631\u0641\u0639 \u0627\u0644\u063A\u0644\u0627\u0641..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641" })
                  }
                ),
                onUpdateGalleryImages && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsSlideManagerOpen((prev) => !prev),
                    className: `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-extrabold shadow-lg backdrop-blur-sm transition-all touch-manipulation active:scale-95 cursor-pointer ${isSlideManagerOpen ? "bg-[#5E1734] text-white border-[#C6A355]" : "bg-white/95 hover:bg-white text-[#5E1734] border-[#C6A355]/60"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "\u{1F5BC}\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0634\u0631\u0627\u0626\u062D \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0645\u062A\u062D\u0631\u0643" }),
                      /* @__PURE__ */ jsxs("span", { className: "tabular-nums opacity-85", children: [
                        "(",
                        heroSlides.length,
                        ")"
                      ] })
                    ]
                  }
                ),
                heroImageUrl?.trim() && onResetHeroImage && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onResetHeroImage,
                    title: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629",
                    className: "inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#1A1617]/80 hover:bg-[#1A1617] text-white border border-[#C6A355]/45 text-xs font-bold shadow-md backdrop-blur-sm transition-all touch-manipulation active:scale-95 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                      /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              dir: "ltr",
              className: "absolute inset-0 flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
              style: { transform: `translateX(-${safeActiveSlide * 100}%)` },
              children: heroSlides.map((slide, idx) => {
                const hasError = Boolean(failedSlideIds[slide.id]);
                return /* @__PURE__ */ jsx("div", { className: "relative w-full h-full shrink-0", children: !hasError ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: slide.url,
                    alt: slide.alt,
                    referrerPolicy: "no-referrer",
                    loading: idx === 0 ? "eager" : "lazy",
                    draggable: false,
                    onContextMenu: (e) => e.preventDefault(),
                    onError: () => setFailedSlideIds((prev) => ({ ...prev, [slide.id]: true })),
                    className: `w-full h-full object-cover object-center block pointer-events-none select-none ${idx === safeActiveSlide ? "ken-burns" : ""}`
                  }
                ) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "w-full h-full bg-gradient-to-br from-[#5E1734] via-[#1A1617] to-[#170B11]"
                  }
                ) }, slide.id);
              })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1A1617]/85 via-[#1A1617]/35 to-transparent"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-10 sm:pb-12 w-full text-right flex flex-col justify-end", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1A1617]/65 backdrop-blur-sm border border-[#C6A355]/50 text-[#FAF8F5] text-xs sm:text-sm font-bold shadow-sm", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "hero.eyebrow",
                    defaultText: copy.heroEyebrow || "\u0645\u0648\u0633\u0645 \u0627\u0644\u062A\u062E\u0631\u062C 2026",
                    compact: true,
                    darkSurface: true
                  }
                )
              ] }),
              storewideDiscountPercent > 0 && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5E1734]/90 backdrop-blur-sm border border-[#C6A355]/50 text-white text-xs sm:text-sm font-extrabold shadow-sm", children: [
                /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u062A\u062E\u0641\u064A\u0636 \u062A\u0644\u0642\u0627\u0626\u064A -",
                  storewideDiscountPercent,
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "hero.title",
                defaultText: DEFAULT_HERO_TITLE_AR,
                valueOverride: resolvedHeroTitle,
                as: "h1",
                darkSurface: true,
                className: "font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] text-white [text-wrap:balance] [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_1px_3px_rgba(0,0,0,0.95)] mb-3"
              }
            ),
            /* @__PURE__ */ jsx(
              EditableText,
              {
                textKey: "hero.subtitle",
                defaultText: DEFAULT_HERO_SUBTITLE_AR,
                valueOverride: resolvedHeroSubtitle,
                as: "p",
                multiline: true,
                darkSurface: true,
                className: "text-sm sm:text-lg text-[#FAF8F5] leading-relaxed max-w-xl mb-6 [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_1px_3px_rgba(0,0,0,0.95)]"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "#catalog-sec",
                  className: "cta-luxury-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#5E1734]/75 hover:bg-[#5E1734]/90 backdrop-blur-sm border border-[#C6A355]/40 text-white text-sm sm:text-base font-bold transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0 shadow-lg shadow-black/25",
                  children: [
                    /* @__PURE__ */ jsx(
                      EditableText,
                      {
                        textKey: "hero.ctaPrimary",
                        defaultText: "\u062A\u0633\u0648\u0651\u0642 \u0627\u0644\u0622\u0646",
                        compact: true,
                        darkSurface: true
                      }
                    ),
                    /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 text-[#C6A355]" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#studio-sec",
                  className: "inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#1A1617]/45 hover:bg-[#1A1617]/70 backdrop-blur-sm text-white border border-[#C6A355]/50 text-sm sm:text-base font-bold transition-all touch-manipulation active:scale-95 whitespace-nowrap shrink-0",
                  children: /* @__PURE__ */ jsx(
                    EditableText,
                    {
                      textKey: "hero.ctaSecondary",
                      defaultText: "\u0635\u0645\u0651\u0645 \u0648\u0634\u0627\u062D\u0643",
                      compact: true,
                      darkSurface: true
                    }
                  )
                }
              )
            ] })
          ] }) }),
          heroSlides.length > 1 && /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5",
              role: "tablist",
              "aria-label": "\u0645\u0624\u0634\u0631\u0627\u062A \u0634\u0631\u0627\u0626\u062D \u0627\u0644\u063A\u0644\u0627\u0641",
              children: heroSlides.map((slide, idx) => {
                const isActive = idx === safeActiveSlide;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": isActive,
                    "aria-label": `\u0639\u0631\u0636 \u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 ${idx + 1} \u0645\u0646 ${heroSlides.length}`,
                    onClick: () => setActiveSlide(idx),
                    className: `h-1.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${isActive ? "w-6 bg-[#C6A355] shadow-xs" : "w-1.5 bg-[#C6A355]/45 hover:bg-[#C6A355]/85"}`
                  },
                  slide.id
                );
              })
            }
          )
        ]
      }
    ),
    isAdminMode && isSlideManagerOpen && onUpdateGalleryImages && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "\u0625\u062F\u0627\u0631\u0629 \u0634\u0631\u0627\u0626\u062D \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0645\u062A\u062D\u0631\u0643",
        onClick: () => setIsSlideManagerOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full max-w-2xl bg-white border border-[#C6A355]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1A1617]",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-[#FAF8F5] border-b border-[#C6A355]/30 flex items-center justify-between gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-right min-w-0", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-sm sm:text-base font-extrabold text-[#5E1734] truncate", children: "\u{1F5BC}\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0634\u0631\u0627\u0626\u062D \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0645\u062A\u062D\u0631\u0643" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#65525A] mt-0.5", children: [
                    "\u0639\u062F\u062F \u0627\u0644\u0634\u0631\u0627\u0626\u062D \u0627\u0644\u062D\u0627\u0644\u064A\u0629: ",
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[#5E1734] tabular-nums", children: heroSlides.length }),
                    " \xB7 \u064A\u062A\u0645 \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0646\u0647\u0627\u0626\u064A \u0639\u0646\u062F \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \xAB\u062D\u0641\u0638 \u0648\u0646\u0634\u0631\xBB."
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsSlideManagerOpen(false),
                    "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0646\u0627\u0641\u0630\u0629 \u0634\u0631\u0627\u0626\u062D \u0627\u0644\u063A\u0644\u0627\u0641",
                    className: "p-2 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#C6A355]/35 text-[#65525A] hover:text-[#1A1617] transition-colors cursor-pointer shrink-0",
                    children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 overflow-y-auto space-y-4", children: [
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3.5", children: heroSlides.map((slide, idx) => {
                  const isPrimarySlide = slide.isPrimary;
                  const isBusy = isPrimarySlide ? isUploadingHeroImage : replacingSlideId === slide.id;
                  const canDeletePrimary = galleryImages.length > 0 || Boolean(heroImageUrl?.trim());
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] overflow-hidden flex flex-col shadow-2xs",
                      children: [
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            onClick: () => setActiveSlide(idx),
                            className: "relative aspect-[16/10] bg-[#171717] overflow-hidden cursor-pointer",
                            children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: slide.url,
                                  alt: `\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 ${idx + 1}`,
                                  referrerPolicy: "no-referrer",
                                  className: "w-full h-full object-cover object-center block"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums shadow-xs ${isPrimarySlide ? "bg-[#5E1734]/95 text-white" : "bg-black/70 text-white"}`,
                                  children: isPrimarySlide ? `Slide ${idx + 1} \xB7 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629` : `Slide ${idx + 1}`
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "p-2.5 flex items-center gap-2 bg-white border-t border-[#C6A355]/20", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              disabled: isBusy,
                              onClick: () => {
                                if (isPrimarySlide) {
                                  heroImageInputRef.current?.click();
                                } else {
                                  triggerReplaceGallerySlide(slide.id);
                                }
                              },
                              className: "flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/55 text-[#5E1734] text-xs font-bold cursor-pointer disabled:opacity-55 transition-colors",
                              children: isBusy ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u062A\u063A\u064A\u064A\u0631" })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              disabled: isBusy || isPrimarySlide && !canDeletePrimary,
                              onClick: () => {
                                if (isPrimarySlide) {
                                  handleDeletePrimaryCoverSlide();
                                } else {
                                  handleDeleteGallerySlide(slide.id);
                                }
                              },
                              title: isPrimarySlide && !canDeletePrimary ? "\u064A\u062C\u0628 \u0628\u0642\u0627\u0621 \u0634\u0631\u064A\u062D\u0629 \u0648\u0627\u062D\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u0644\u063A\u0644\u0627\u0641" : "\u062D\u0630\u0641 \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u064A\u062D\u0629",
                              className: "flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-bold cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors",
                              children: /* @__PURE__ */ jsx("span", { children: "\u{1F5D1}\uFE0F \u062D\u0630\u0641" })
                            }
                          )
                        ] })
                      ]
                    },
                    slide.id
                  );
                }) }),
                galleryImages.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C6A355]/20 text-xs text-[#65525A]", children: [
                  /* @__PURE__ */ jsx("span", { children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0634\u0631\u0627\u0626\u062D \u0625\u0636\u0627\u0641\u064A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B \u2014 \u062A\u0638\u0647\u0631 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0641\u0642\u0637." }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleRestoreDefaultSlides,
                      className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#C6A355]/50 text-[#5E1734] text-xs font-bold cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0634\u0631\u0627\u0626\u062D \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-5 py-3.5 bg-[#FAF8F5] border-t border-[#C6A355]/30 flex flex-wrap items-center justify-between gap-2.5 shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: isAddingSlide,
                    onClick: () => addSlideInputRef.current?.click(),
                    className: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#C6A355]/65 text-[#5E1734] text-xs sm:text-sm font-extrabold transition-all cursor-pointer disabled:opacity-60 shadow-2xs",
                    children: isAddingSlide ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                      /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631\u0629..." })
                    ] }) : /* @__PURE__ */ jsx("span", { children: "\u2795 \u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629 \u0644\u0644\u063A\u0644\u0627\u0641" })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  onPublish && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      disabled: isSavingCloud,
                      onClick: onPublish,
                      className: "cta-luxury-shimmer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs sm:text-sm font-extrabold transition-all cursor-pointer disabled:opacity-60",
                      children: [
                        isSavingCloud ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 text-[#C6A355] animate-spin" }) : /* @__PURE__ */ jsx(CloudUpload, { className: "w-4 h-4 text-[#C6A355]" }),
                        /* @__PURE__ */ jsx("span", { children: isSavingCloud ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setIsSlideManagerOpen(false),
                      className: "px-4 py-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#C6A355]/45 text-[#1A1617] text-xs sm:text-sm font-bold transition-colors cursor-pointer",
                      children: "\u062A\u0645 / \u0625\u063A\u0644\u0627\u0642"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    ),
    (!isTrustBadgesHidden || isAdminMode) && /* @__PURE__ */ jsxs("div", { className: "bg-white border-b border-[#C6A355]/30", children: [
      isAdminMode && /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#C6A355]/15", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#5E1734]", children: isTrustBadgesHidden ? "\u0634\u0631\u064A\u0637 \u0627\u0644\u0645\u0632\u0627\u064A\u0627 (4 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062B\u0642\u0629) \u0645\u062E\u0641\u064A \u062D\u0627\u0644\u064A\u0627\u064B \u0639\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646" : "\u0642\u0633\u0645: \u0634\u0631\u064A\u0637 \u0627\u0644\u0645\u0632\u0627\u064A\u0627 (4 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062B\u0642\u0629)" }),
        /* @__PURE__ */ jsx(SectionHideButton, { sectionKey: "trustBadges", label: "\u0634\u0631\u064A\u0637 \u0627\u0644\u0645\u0632\u0627\u064A\u0627" })
      ] }),
      !isTrustBadgesHidden && /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2", children: TRUST_BADGES.map((item, idx) => {
        const Icon = item.icon;
        const isTopRow = idx < 2;
        const isRightCol = idx % 2 === 0;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border-[#C6A355]/25 ${isTopRow ? "border-b" : ""} ${isRightCol ? "border-l" : ""}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF8F5] border border-[#C6A355]/45 text-[#5E1734] flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-right flex-1", children: [
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `trust.${item.key}.title`,
                    defaultText: item.title,
                    as: "h2",
                    compact: true,
                    className: "text-xs sm:text-sm font-extrabold text-[#1A1617] leading-snug"
                  }
                ),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: `trust.${item.key}.desc`,
                    defaultText: item.desc,
                    as: "p",
                    compact: true,
                    className: "text-[11px] sm:text-xs text-[#65525A] leading-relaxed mt-0.5"
                  }
                )
              ] })
            ]
          },
          item.key
        );
      }) }) })
    ] })
  ] });
}
export {
  HeroSection
};
