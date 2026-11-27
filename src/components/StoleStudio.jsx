import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Download, ImagePlus, Loader2, Share2, Sparkles, X } from "lucide-react";
import { STOLE_COLORS, THREAD_COLORS } from "../data/defaultStore";
import { compressReceiptImage } from "../lib/supabase";
import { EditableText } from "./EditableText";
function StoleStudio({
  title,
  subtitle,
  studioBgUrl,
  isAdminMode,
  stoleColors = STOLE_COLORS,
  threadColors = THREAD_COLORS,
  onUploadStudioBg,
  onNotify
}) {
  const activeStoleColors = stoleColors.length > 0 ? stoleColors : STOLE_COLORS;
  const activeThreadColors = threadColors.length > 0 ? threadColors : THREAD_COLORS;
  const STUDIO_DRAFT_KEY = "dg_stole_studio_draft_v1";
  const readSavedStudioDraft = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STUDIO_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };
  const hasStudioUrlParams = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("studio") === "1";
  const [rightText, setRightText] = useState(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const val = sp.get("sr");
      if (sp.get("studio") === "1" && val !== null) return val;
    }
    if (!hasStudioUrlParams) {
      const saved = readSavedStudioDraft();
      if (typeof saved?.rightText === "string") return saved.rightText;
    }
    return "";
  });
  const [leftText, setLeftText] = useState(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const val = sp.get("sl");
      if (sp.get("studio") === "1" && val !== null) return val;
    }
    if (!hasStudioUrlParams) {
      const saved = readSavedStudioDraft();
      if (typeof saved?.leftText === "string") return saved.leftText;
    }
    return "";
  });
  const [stoleColor, setStoleColor] = useState(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const sc = sp.get("sc");
      if (sp.get("studio") === "1" && sc) {
        const match = activeStoleColors.find((c) => c.name === sc);
        if (match) return match;
      }
    }
    if (!hasStudioUrlParams) {
      const saved = readSavedStudioDraft();
      if (saved?.stoleColorName) {
        const match = activeStoleColors.find((c) => c.name === saved.stoleColorName);
        if (match) return match;
      }
    }
    return activeStoleColors[0];
  });
  const [threadColor, setThreadColor] = useState(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const st = sp.get("st");
      if (sp.get("studio") === "1" && st) {
        const match = activeThreadColors.find((t) => t.name === st);
        if (match) return match;
      }
    }
    if (!hasStudioUrlParams) {
      const saved = readSavedStudioDraft();
      if (saved?.threadColorName) {
        const match = activeThreadColors.find((t) => t.name === saved.threadColorName);
        if (match) return match;
      }
    }
    return activeThreadColors[0];
  });
  const [universityLogo, setUniversityLogo] = useState(null);
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [justShared, setJustShared] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STUDIO_DRAFT_KEY,
        JSON.stringify({
          rightText,
          leftText,
          stoleColorName: stoleColor.name,
          threadColorName: threadColor.name,
          updatedAt: Date.now()
        })
      );
    } catch {
    }
  }, [rightText, leftText, stoleColor.name, threadColor.name]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("studio") === "1") {
      setTimeout(() => {
        const el = document.getElementById("studio-sec");
        if (el) {
          const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90);
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 150);
    }
  }, []);
  useEffect(() => {
    const foundStole = activeStoleColors.find(
      (c) => c.name === stoleColor.name && c.hex === stoleColor.hex
    );
    if (foundStole) {
      if (foundStole.extraPrice !== stoleColor.extraPrice) {
        setStoleColor(foundStole);
      }
    } else if (activeStoleColors[0]) {
      setStoleColor(activeStoleColors[0]);
    }
  }, [activeStoleColors, stoleColor.name, stoleColor.hex, stoleColor.extraPrice]);
  useEffect(() => {
    const foundThread = activeThreadColors.find(
      (t) => t.name === threadColor.name && t.hex === threadColor.hex
    );
    if (foundThread) {
      if (foundThread.extraPrice !== threadColor.extraPrice) {
        setThreadColor(foundThread);
      }
    } else if (activeThreadColors[0]) {
      setThreadColor(activeThreadColors[0]);
    }
  }, [activeThreadColors, threadColor.name, threadColor.hex, threadColor.extraPrice]);
  const bgInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const handleSelectStoleColor = (color) => {
    setStoleColor(color);
    if (color.defaultThreadHex) {
      const matchingThread = activeThreadColors.find(
        (t) => t.hex === color.defaultThreadHex
      );
      if (matchingThread) {
        setThreadColor(matchingThread);
      }
    }
  };
  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadStudioBg(file);
      e.target.value = "";
    }
  };
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError("");
    setIsCompressingLogo(true);
    try {
      const compressed = await compressReceiptImage(file, 360, 0.82);
      setUniversityLogo(compressed);
    } catch (err) {
      setLogoError(
        err instanceof Error ? err.message : "\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629."
      );
    } finally {
      setIsCompressingLogo(false);
      e.target.value = "";
    }
  };
  const handleShareDesign = async () => {
    try {
      const url = new URL(window.location.href);
      url.search = "";
      url.searchParams.set("studio", "1");
      if (rightText.trim()) url.searchParams.set("sr", rightText.trim());
      if (leftText.trim()) url.searchParams.set("sl", leftText.trim());
      url.searchParams.set("sc", stoleColor.name);
      url.searchParams.set("st", threadColor.name);
      const shareUrl = url.toString();
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0634\u0627\u062D\u064A \u0645\u0646 DG by Douaa",
            text: `\u0634\u0627\u0647\u062F \u062A\u0635\u0645\u064A\u0645 \u0648\u0634\u0627\u062D \u0627\u0644\u062A\u062E\u0631\u062C \u0627\u0644\u062E\u0627\u0635 \u0628\u064A (${stoleColor.name} \xB7 \u062A\u0637\u0631\u064A\u0632 ${threadColor.name})`,
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
          "\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u062A\u0635\u0645\u064A\u0645\u0643! \u064A\u0645\u0643\u0646\u0643 \u0645\u0634\u0627\u0631\u0643\u062A\u0647 \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0648\u0627\u062A\u0633\u0627\u0628 \u0623\u0648 \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645."
        );
      } else {
        onNotify?.("info", `\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0635\u0645\u064A\u0645: ${shareUrl}`);
      }
    } catch {
      onNotify?.("error", "\u062A\u0639\u0630\u0631 \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0631\u0627\u0628\u0637 \u062D\u0627\u0644\u064A\u0627\u064B.");
    }
  };
  const [isSavingImage, setIsSavingImage] = useState(false);
  const handleSaveDesignImage = async () => {
    setIsSavingImage(true);
    try {
      const width = 720;
      const height = 920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.55)";
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, width - 48, height - 48);
      ctx.fillStyle = "#5E1734";
      ctx.font = 'bold 22px "Cairo", "Amiri", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DG by Douaa \xB7 \u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u0634\u0627\u062D", width / 2, 72);
      const sx = 150;
      const sy = 130;
      const sw = 420;
      const sh = 590;
      const pts = [
        [sx, sy],
        [sx + sw * 0.35, sy],
        [sx + sw * 0.5, sy + sh * 0.38],
        [sx + sw * 0.65, sy],
        [sx + sw, sy],
        [sx + sw * 0.86, sy + sh],
        [sx + sw * 0.5, sy + sh * 0.76],
        [sx + sw * 0.14, sy + sh]
      ];
      ctx.save();
      ctx.shadowColor = "rgba(36, 19, 27, 0.18)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
      ctx.beginPath();
      pts.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = stoleColor.hex;
      ctx.fill();
      ctx.restore();
      const lightHex = stoleColor.hex.toLowerCase() === "#ede6d8" || stoleColor.hex.toLowerCase() === "#f4efe6" || stoleColor.hex.toLowerCase() === "#ffffff";
      if (lightHex) {
        ctx.beginPath();
        pts.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = "rgba(212, 175, 55, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.save();
      ctx.beginPath();
      pts.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = threadColor.hex;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx + 14, sy);
      ctx.lineTo(sx + sw * 0.14 + 14, sy + sh);
      ctx.moveTo(sx + sw - 14, sy);
      ctx.lineTo(sx + sw * 0.86 - 14, sy + sh);
      ctx.stroke();
      ctx.restore();
      const rightSashX = sx + sw * 0.81;
      let rightTextStartY = sy + 280;
      if (universityLogo) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const r = 38;
            const cx = rightSashX - 6;
            const cy = sy + 95;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = threadColor.hex;
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
            ctx.restore();
            rightTextStartY = sy + 335;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = universityLogo;
        });
      }
      const displayRight = rightText.trim();
      const displayLeft = leftText.trim();
      ctx.fillStyle = threadColor.hex;
      ctx.font = 'bold 34px "Amiri", "Cairo", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (displayRight) {
        ctx.save();
        ctx.translate(rightSashX - 8, rightTextStartY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(displayRight, 0, 0, 290);
        ctx.restore();
      }
      if (displayLeft) {
        ctx.save();
        ctx.translate(sx + sw * 0.19 + 8, sy + 290);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(displayLeft, 0, 0, 320);
        ctx.restore();
      }
      ctx.fillStyle = "#1A1617";
      ctx.font = 'bold 24px "Cairo", sans-serif';
      ctx.fillText(
        `${stoleColor.name}  \xB7  \u062A\u0637\u0631\u064A\u0632 ${threadColor.name}`,
        width / 2,
        height - 110
      );
      ctx.fillStyle = "#65525A";
      ctx.font = '600 18px "Cairo", sans-serif';
      ctx.fillText("\u062A\u0635\u0645\u064A\u0645 \u062A\u062C\u0631\u064A\u0628\u064A \u0645\u062C\u0627\u0646\u064A \u2014 DG by Douaa Algeria", width / 2, height - 68);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "dg-by-douaa-stole-design.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      onNotify?.("success", "\u062A\u0645 \u062D\u0641\u0638 \u0635\u0648\u0631\u0629 \u062A\u0635\u0645\u064A\u0645\u0643 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643 \u0628\u0646\u062C\u0627\u062D.");
    } catch {
      onNotify?.("error", "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0635\u0648\u0631\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u062D\u0627\u0644\u064A\u0627\u064B.");
    } finally {
      setIsSavingImage(false);
    }
  };
  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalog-sec");
    if (el) {
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 84);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  const isLightStole = stoleColor.hex.toLowerCase() === "#ede6d8" || stoleColor.hex.toLowerCase() === "#f4efe6" || stoleColor.hex.toLowerCase() === "#ffffff";
  return /* @__PURE__ */ jsx("section", { id: "studio-sec", className: "py-12 sm:py-16 border-b border-[#C6A355]/25", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#C6A355]/45 text-xs font-bold text-[#5E1734] mb-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            textKey: "studio.badge",
            defaultText: "\u0635\u0645\u0651\u0645 \u0648\u062C\u0631\u0651\u0628 \u0623\u0644\u0648\u0627\u0646 \u0648\u0634\u0627\u062D\u0643 \u0645\u062C\u0627\u0646\u0627\u064B",
            compact: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "studio.title",
          defaultText: "\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u0634\u0627\u062D",
          valueOverride: title,
          as: "h2",
          className: "font-editorial text-2xl sm:text-3xl font-bold text-[#1A1617]"
        }
      ),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          textKey: "studio.subtitle",
          defaultText: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645\u0643 \u0623\u0648 \u062F\u0641\u0639\u062A\u0643 \u0628\u062E\u0637 \u0627\u0644\u062B\u0644\u062B\u060C \u0648\u0627\u062E\u062A\u0631 \u0644\u0648\u0646 \u0627\u0644\u0642\u0645\u0627\u0634 \u0648\u0627\u0644\u062A\u0637\u0631\u064A\u0632 \u0644\u062A\u0634\u0627\u0647\u062F \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0642\u0628\u0644 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628.",
          valueOverride: subtitle,
          as: "p",
          multiline: true,
          className: "text-sm text-[#65525A] mt-1.5 max-w-xl mx-auto"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "lg:col-span-6 w-full rounded-2xl bg-white border border-[#C6A355]/35 flex flex-col items-center justify-center p-6 sm:p-10 min-h-[380px] relative overflow-hidden shadow-sm",
          style: studioBgUrl ? {
            backgroundImage: `linear-gradient(rgba(250,248,245,0.84), rgba(250,248,245,0.92)), url("${studioBgUrl}")`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          } : void 0,
          children: [
            isAdminMode && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 z-20", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: bgInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleBgUpload
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => bgInputRef.current?.click(),
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C6A355]/45 text-xs font-bold text-[#1A1617] shadow-sm hover:bg-[#FAF8F5] cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5 text-[#5E1734]" }),
                    /* @__PURE__ */ jsx("span", { children: "\u0627\u0644\u062E\u0644\u0641\u064A\u0629" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative w-48 sm:w-56 h-72 sm:h-80 transition-colors duration-200 flex justify-between px-4 sm:px-5 pt-7 pb-10 shadow-xl",
                  style: {
                    backgroundColor: stoleColor.hex,
                    color: threadColor.hex,
                    clipPath: "polygon(0 0, 35% 0, 50% 38%, 65% 0, 100% 0, 86% 100%, 50% 76%, 14% 100%)",
                    border: isLightStole ? "1px solid rgba(212, 175, 55, 0.55)" : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "pointer-events-none absolute inset-1.5 opacity-60",
                        style: {
                          borderInline: `1.5px solid ${threadColor.hex}`
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "w-[38%] flex flex-col items-center justify-start pt-2 gap-2 z-10", children: [
                      universityLogo && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-sm overflow-hidden shrink-0",
                          style: { border: `2px solid ${threadColor.hex}` },
                          children: /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: universityLogo,
                              alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                              className: "w-full h-full object-cover rounded-full"
                            }
                          )
                        }
                      ),
                      rightText.trim() && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "text-center font-bold leading-snug overflow-hidden select-none font-editorial text-lg sm:text-xl",
                          style: {
                            writingMode: "vertical-rl",
                            maxHeight: universityLogo ? "128px" : "176px"
                          },
                          children: rightText
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-[38%] flex flex-col items-center justify-start pt-2 z-10", children: leftText.trim() && /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "text-center font-bold leading-snug max-h-44 overflow-hidden select-none font-editorial text-lg sm:text-xl",
                        style: { writingMode: "vertical-rl" },
                        children: leftText
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center flex flex-col items-center gap-2.5 w-full", children: [
                /* @__PURE__ */ jsxs("p", { className: "inline-block px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C6A355]/40 text-xs font-bold text-[#1A1617]", children: [
                  stoleColor.name,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[#5E1734] mx-1", children: "\xB7" }),
                  " \u062A\u0637\u0631\u064A\u0632",
                  " ",
                  threadColor.name
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleSaveDesignImage,
                      disabled: isSavingImage,
                      className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-60",
                      children: [
                        isSavingImage ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin text-[#C6A355]" }) : /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                        /* @__PURE__ */ jsx("span", { children: "\u062D\u0641\u0638 \u0635\u0648\u0631\u0629 \u062A\u0635\u0645\u064A\u0645\u064A" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleShareDesign,
                      className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#C6A355]/45 hover:border-[#5E1734]/50 text-xs font-bold text-[#5E1734] shadow-2xs transition-all cursor-pointer active:scale-95",
                      children: justShared ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-[#147A53]" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[#147A53]", children: "\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u2713" })
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5 text-[#C6A355]" }),
                        /* @__PURE__ */ jsx("span", { children: "\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645" })
                      ] })
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 w-full bg-white border border-[#C6A355]/35 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649 \u0644\u0644\u0648\u0634\u0627\u062D:" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                maxLength: 32,
                value: rightText,
                onChange: (e) => setRightText(e.target.value),
                placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0645\u0646\u0649 (\u0645\u062B\u0627\u0644: \u062F\u0639\u0627\u0621)",
                className: "w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5] text-sm text-[#1A1617] placeholder:text-[#96838A] focus:outline-none focus:border-[#5E1734]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 \u0644\u0644\u0648\u0634\u0627\u062D:" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                maxLength: 32,
                value: leftText,
                onChange: (e) => setLeftText(e.target.value),
                placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062C\u0647\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 (\u0645\u062B\u0627\u0644: \u062A\u062E\u0635\u0635 \u0635\u064A\u062F\u0644\u0629 / 2026)",
                className: "w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5] text-sm text-[#1A1617] placeholder:text-[#96838A] focus:outline-none focus:border-[#5E1734]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[#1A1617] mb-1.5", children: "\u0625\u0636\u0627\u0641\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 (\u0645\u062C\u0627\u0646\u0627\u064B):" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: logoInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: handleLogoUpload
            }
          ),
          universityLogo ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[#C6A355]/40 bg-[#FAF8F5]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: universityLogo,
                  alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0642",
                  className: "w-10 h-10 rounded-full object-cover border-2 border-[#5E1734] bg-white shrink-0"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#1A1617] truncate", children: "\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => logoInputRef.current?.click(),
                  className: "px-2.5 py-1 rounded-lg bg-white border border-[#C6A355]/40 hover:bg-[#FAF8F5] text-xs font-bold text-[#5E1734] cursor-pointer",
                  children: "\u062A\u063A\u064A\u064A\u0631"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setUniversityLogo(null),
                  "aria-label": "\u062D\u0630\u0641 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                  className: "p-1 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] hover:bg-[#FFE4E6] text-[#BE123C] cursor-pointer",
                  children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: isCompressingLogo,
              onClick: () => logoInputRef.current?.click(),
              className: "w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-[#C6A355]/55 bg-[#FAF8F5] hover:border-[#5E1734] hover:bg-[#F4EFE6]/60 text-xs font-bold text-[#65525A] hover:text-[#5E1734] transition-colors cursor-pointer disabled:opacity-60",
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
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "block text-xs font-bold text-[#1A1617] mb-2.5", children: [
            "\u0644\u0648\u0646 \u0642\u0645\u0627\u0634 \u0627\u0644\u0648\u0634\u0627\u062D:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-[#5E1734]", children: [
              stoleColor.name,
              stoleColor.extraPrice && stoleColor.extraPrice > 0 ? ` (+${stoleColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2.5", children: activeStoleColors.map((c) => {
            const active = c.name === stoleColor.name && c.hex === stoleColor.hex;
            return /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleSelectStoleColor(c),
                title: c.extraPrice && c.extraPrice > 0 ? `${c.name} (+${c.extraPrice} \u062F\u062C)` : c.name,
                className: `w-9 h-9 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${active ? "ring-2 ring-[#5E1734] ring-offset-2 ring-offset-white scale-110 border-[#5E1734]" : "border-[#C6A355]/40 hover:scale-105"}`,
                style: { backgroundColor: c.hex },
                children: active && /* @__PURE__ */ jsx(
                  Check,
                  {
                    className: `w-4 h-4 ${c.hex.toLowerCase() === "#ede6d8" || c.hex.toLowerCase() === "#f4efe6" || c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#f5f5f4" ? "text-[#5E1734]" : "text-white"}`
                  }
                )
              },
              `${c.name}-${c.hex}`
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "block text-xs font-bold text-[#1A1617] mb-2.5", children: [
            "\u0644\u0648\u0646 \u062E\u064A\u0637 \u0627\u0644\u062A\u0637\u0631\u064A\u0632:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-[#5E1734]", children: [
              threadColor.name,
              threadColor.extraPrice && threadColor.extraPrice > 0 ? ` (+${threadColor.extraPrice.toLocaleString("en-US")} \u062F\u062C)` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2.5", children: activeThreadColors.map((t) => {
            const active = t.name === threadColor.name && t.hex === threadColor.hex;
            return /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setThreadColor(t),
                title: t.extraPrice && t.extraPrice > 0 ? `${t.name} (+${t.extraPrice} \u062F\u062C)` : t.name,
                className: `w-9 h-9 rounded-full border transition-transform flex items-center justify-center cursor-pointer ${active ? "ring-2 ring-[#5E1734] ring-offset-2 ring-offset-white scale-110 border-[#5E1734]" : "border-[#C6A355]/40 hover:scale-105"}`,
                style: { backgroundColor: t.hex },
                children: active && /* @__PURE__ */ jsx(
                  Check,
                  {
                    className: `w-4 h-4 ${t.hex === "#ffffff" || t.hex === "#e2e8f0" || t.hex === "#f5f5f4" ? "text-[#1A1617]" : "text-white"}`
                  }
                )
              },
              `${t.name}-${t.hex}`
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-[#C6A355]/25 space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#FAF8F5] border border-[#C6A355]/35 px-4 py-3 text-center space-y-2.5", children: [
          /* @__PURE__ */ jsx(
            EditableText,
            {
              textKey: "studio.ctaNote",
              defaultText: "\u0623\u0639\u062C\u0628\u0643 \u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0623\u0644\u0648\u0627\u0646\u061F \u0627\u0646\u062A\u0642\u0644 \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0644\u0643 (\u0634\u0627\u0644 \u0639\u0627\u062F\u064A \xB7 \u0634\u0627\u0644 \u0645\u064A\u0633 \xB7 \u0627\u0644\u0634\u0627\u0644 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A) \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628.",
              as: "p",
              multiline: true,
              compact: true,
              className: "text-xs font-semibold text-[#65525A]"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: handleScrollToCatalog,
              className: "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-[#5E1734] text-[#5E1734] hover:text-white border border-[#C6A355]/50 hover:border-[#5E1734] text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95",
              children: [
                /* @__PURE__ */ jsx(ArrowUp, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx(
                  EditableText,
                  {
                    textKey: "studio.ctaBtn",
                    defaultText: "\u0627\u0646\u062A\u0642\u0644 \u0644\u0637\u0644\u0628 \u0645\u0648\u062F\u064A\u0644\u0643 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u2191",
                    compact: true
                  }
                )
              ]
            }
          )
        ] }) })
      ] })
    ] })
  ] }) });
}
export {
  StoleStudio
};
