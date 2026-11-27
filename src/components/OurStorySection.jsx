import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, Loader2, RotateCcw } from "lucide-react";
import { EditableText } from "./EditableText";
const DEFAULT_STORY_TITLE = "\u0642\u0635\u062A\u0646\u0627";
const DEFAULT_STORY_BODY = "\u0628\u062F\u0623\u062A \u062D\u0643\u0627\u064A\u062A\u0646\u0627 \u0628\u0634\u063A\u0641 \u062D\u0642\u064A\u0642\u064A \u0644\u062A\u0648\u062B\u064A\u0642 \u0623\u062C\u0645\u0644 \u0644\u062D\u0638\u0629 \u0641\u064A \u0645\u0633\u064A\u0631\u062A\u0643\u0645 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629.. \u0644\u0646\u0635\u0646\u0639 \u0644\u0643\u0645 \u0641\u064A DG by Douaa \u0648\u0634\u0627\u062D\u0627\u062A \u0648\u0623\u0631\u0648\u0627\u0628 \u062A\u062E\u0631\u062C \u062A\u064F\u0641\u0635\u0651\u0644 \u0648\u062A\u064F\u0637\u0631\u0651\u0632 \u0628\u0643\u0644 \u062D\u0628 \u0648\u0625\u062A\u0642\u0627\u0646. \u0646\u0647\u062A\u0645 \u0628\u0623\u062F\u0642 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644\u060C \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0641\u062E\u0645 \u0627\u0644\u0623\u0642\u0645\u0634\u0629 \u0625\u0644\u0649 \u062A\u0637\u0631\u064A\u0632 \u0623\u0633\u0645\u0627\u0626\u0643\u0645 \u0648\u0634\u0639\u0627\u0631\u0627\u062A \u062C\u0627\u0645\u0639\u0627\u062A\u0643\u0645\u060C \u0644\u062A\u0643\u0648\u0646 \u0630\u0643\u0631\u0649 \u062A\u062E\u0631\u062C\u0643\u0645 \u062E\u0627\u0644\u062F\u0629 \u0641\u064A \u0627\u0644\u0635\u0648\u0631 \u0648\u0627\u0644\u0642\u0644\u0648\u0628.";
function OurStorySection({
  isAdminMode = false,
  storyImageUrl,
  isUploadingStoryImage = false,
  onUploadStoryImage,
  onResetStoryImage
}) {
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const resolvedImageUrl = storyImageUrl?.trim() || "";
  useEffect(() => {
    setImgError(false);
  }, [resolvedImageUrl]);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadStoryImage) {
      onUploadStoryImage(file);
      e.target.value = "";
    }
  };
  const showCustomImage = Boolean(resolvedImageUrl) && !imgError;
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "our-story-sec",
      "aria-labelledby": "our-story-heading",
      className: "relative bg-[#FAF8F5] border-b border-[#C6A355]/20 overflow-hidden",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto text-center px-5 py-10", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onContextMenu: (e) => e.preventDefault(),
            className: `relative w-full max-w-md mx-auto mb-5 bg-transparent border-0 shadow-none p-0 select-none ${showCustomImage ? "protected-media" : ""}`,
            children: [
              isAdminMode && onUploadStoryImage && /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: (e) => e.stopPropagation(),
                  className: "absolute top-2 left-2 z-20 flex flex-wrap items-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: handleFileChange
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        disabled: isUploadingStoryImage,
                        onClick: () => fileInputRef.current?.click(),
                        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#5E1734] border border-[#C6A355]/60 text-[11px] font-extrabold shadow-md backdrop-blur-sm transition-all touch-manipulation active:scale-95 disabled:opacity-70 cursor-pointer",
                        children: isUploadingStoryImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin text-[#5E1734]" }),
                          /* @__PURE__ */ jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u0641\u0639..." })
                        ] }) : /* @__PURE__ */ jsx("span", { children: "\u{1F4F7} \u062A\u063A\u064A\u064A\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0642\u0635\u0629" })
                      }
                    ),
                    resolvedImageUrl && onResetStoryImage && /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: onResetStoryImage,
                        title: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0631\u0633\u0645\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629",
                        className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1A1617]/85 hover:bg-[#1A1617] text-white border border-[#C6A355]/50 text-[11px] font-bold shadow-md backdrop-blur-sm transition-all touch-manipulation active:scale-95 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3 text-[#D4AF37]" }),
                          /* @__PURE__ */ jsx("span", { children: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0631\u0633\u0645\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629" })
                        ]
                      }
                    )
                  ]
                }
              ),
              showCustomImage ? /* @__PURE__ */ jsx("div", { className: "relative bg-transparent border-0 shadow-none p-0", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: resolvedImageUrl,
                  alt: "\u0642\u0635\u0629 DG by Douaa",
                  referrerPolicy: "no-referrer",
                  loading: "lazy",
                  decoding: "async",
                  draggable: false,
                  onContextMenu: (e) => e.preventDefault(),
                  onError: () => setImgError(true),
                  className: "w-full h-auto max-h-[440px] object-contain mx-auto block mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none select-none"
                }
              ) }) : /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 360 210",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "w-full h-auto mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)] pointer-events-none",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxs("defs", { children: [
                      /* @__PURE__ */ jsxs("radialGradient", { id: "atelierGlow", cx: "50%", cy: "46%", r: "50%", children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#EFE4D2", stopOpacity: "0.85" }),
                        /* @__PURE__ */ jsx("stop", { offset: "68%", stopColor: "#F5EFE6", stopOpacity: "0.4" }),
                        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FAF8F5", stopOpacity: "0" })
                      ] }),
                      /* @__PURE__ */ jsxs("linearGradient", { id: "goldTrim", x1: "0", y1: "0", x2: "1", y2: "1", children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#DFBF78" }),
                        /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#C6A355" }),
                        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#A98237" })
                      ] }),
                      /* @__PURE__ */ jsxs("linearGradient", { id: "burgundySilk", x1: "0", y1: "0", x2: "0.4", y2: "1", children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#721D40" }),
                        /* @__PURE__ */ jsx("stop", { offset: "55%", stopColor: "#5E1734" }),
                        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#420E24" })
                      ] }),
                      /* @__PURE__ */ jsxs("linearGradient", { id: "deskTop", x1: "0", y1: "0", x2: "1", y2: "0", children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#EFE6D8" }),
                        /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#F8F2E8" }),
                        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#EADEC9" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("ellipse", { cx: "180", cy: "108", rx: "160", ry: "88", fill: "url(#atelierGlow)" }),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M96 164 V86 C96 39 133 14 180 14 C227 14 264 39 264 86 V164",
                        stroke: "#C6A355",
                        strokeOpacity: "0.24",
                        strokeWidth: "1.2",
                        strokeDasharray: "3 4"
                      }
                    ),
                    /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M52 169 L50 194 M308 169 L310 194 M68 169 L68 189 M292 169 L292 189",
                          stroke: "#C6A355",
                          strokeWidth: "2.2",
                          strokeLinecap: "round",
                          opacity: "0.72"
                        }
                      ),
                      /* @__PURE__ */ jsx("ellipse", { cx: "180", cy: "195", rx: "134", ry: "5", fill: "#1A1617", fillOpacity: "0.06" }),
                      /* @__PURE__ */ jsx(
                        "rect",
                        {
                          x: "44",
                          y: "163",
                          width: "272",
                          height: "13",
                          rx: "3",
                          fill: "#F2E9DB",
                          stroke: "#C6A355",
                          strokeWidth: "1.2"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "line",
                        {
                          x1: "150",
                          y1: "169.5",
                          x2: "210",
                          y2: "169.5",
                          stroke: "#C6A355",
                          strokeWidth: "1.4",
                          strokeLinecap: "round",
                          opacity: "0.6"
                        }
                      ),
                      /* @__PURE__ */ jsx("circle", { cx: "180", cy: "169.5", r: "2.1", fill: "#C6A355" }),
                      /* @__PURE__ */ jsx(
                        "rect",
                        {
                          x: "34",
                          y: "156",
                          width: "292",
                          height: "8",
                          rx: "4",
                          fill: "url(#deskTop)",
                          stroke: "#C6A355",
                          strokeWidth: "1.3"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx(
                        "rect",
                        {
                          x: "212",
                          y: "128",
                          width: "76",
                          height: "28",
                          rx: "3.5",
                          fill: "#FFFDF9",
                          stroke: "#C6A355",
                          strokeWidth: "1.25"
                        }
                      ),
                      /* @__PURE__ */ jsx("rect", { x: "209", y: "124", width: "82", height: "7", rx: "2.5", fill: "#F4ECDE", stroke: "#C6A355", strokeWidth: "1.2" }),
                      /* @__PURE__ */ jsx("rect", { x: "245", y: "124", width: "10", height: "32", fill: "#5E1734", opacity: "0.92" }),
                      /* @__PURE__ */ jsx("line", { x1: "245", y1: "124", x2: "245", y2: "156", stroke: "#C6A355", strokeWidth: "0.7" }),
                      /* @__PURE__ */ jsx("line", { x1: "255", y1: "124", x2: "255", y2: "156", stroke: "#C6A355", strokeWidth: "0.7" }),
                      /* @__PURE__ */ jsx(
                        "rect",
                        {
                          x: "224",
                          y: "104",
                          width: "52",
                          height: "20",
                          rx: "3",
                          fill: "#5E1734",
                          stroke: "#C6A355",
                          strokeWidth: "1.15"
                        }
                      ),
                      /* @__PURE__ */ jsx("rect", { x: "221", y: "100", width: "58", height: "6", rx: "2", fill: "#6D1C3D", stroke: "#D4AF37", strokeWidth: "1.1" }),
                      /* @__PURE__ */ jsx("rect", { x: "247", y: "100", width: "6", height: "24", fill: "url(#goldTrim)" }),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M250 100 C244 92 236 94 239 99 C241 101 247 100 250 100 Z M250 100 C256 92 264 94 261 99 C259 101 253 100 250 100 Z",
                          fill: "#D4AF37"
                        }
                      ),
                      /* @__PURE__ */ jsx("circle", { cx: "250", cy: "100", r: "2.2", fill: "#FAF8F5", stroke: "#C6A355", strokeWidth: "1" })
                    ] }),
                    /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M140 144 C140 149 152 153 167 153 C182 153 194 149 194 144 L192 135 L142 135 Z",
                          fill: "#1A1617",
                          stroke: "#C6A355",
                          strokeWidth: "1.1"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "polygon",
                        {
                          points: "167,121 204,132 167,143 130,132",
                          fill: "#261E21",
                          stroke: "#D4AF37",
                          strokeWidth: "1.25",
                          strokeLinejoin: "round"
                        }
                      ),
                      /* @__PURE__ */ jsx("circle", { cx: "167", cy: "132", r: "2.3", fill: "#D4AF37" }),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M167 132 Q184 134 196 141 L197 152",
                          stroke: "#D4AF37",
                          strokeWidth: "1.4",
                          strokeLinecap: "round",
                          fill: "none"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M195 151 L199 151 L200.5 156 L193.5 156 Z",
                          fill: "#D4AF37"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx("ellipse", { cx: "100", cy: "154", rx: "18", ry: "3.2", fill: "url(#goldTrim)" }),
                      /* @__PURE__ */ jsx("line", { x1: "100", y1: "126", x2: "100", y2: "153", stroke: "#C6A355", strokeWidth: "2.6" }),
                      /* @__PURE__ */ jsx("circle", { cx: "100", cy: "142", r: "2.4", fill: "#FAF8F5", stroke: "#C6A355", strokeWidth: "1.1" }),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M93 42 L107 42 L109 53 C119 56 125 63 124 72 C123 80 116 88 115 95 C114 102 121 112 120 121 C119 125 111 127 100 127 C89 127 81 125 80 121 C79 112 86 102 85 95 C84 88 77 80 76 72 C75 63 81 56 91 53 Z",
                          fill: "#F6EFE4",
                          stroke: "#C6A355",
                          strokeWidth: "1.25"
                        }
                      ),
                      /* @__PURE__ */ jsx("line", { x1: "100", y1: "53", x2: "100", y2: "126", stroke: "#C6A355", strokeOpacity: "0.32", strokeWidth: "0.9" }),
                      /* @__PURE__ */ jsx("rect", { x: "91", y: "38", width: "18", height: "4.5", rx: "2.2", fill: "url(#goldTrim)" }),
                      /* @__PURE__ */ jsx("circle", { cx: "100", cy: "35.5", r: "2.6", fill: "#D4AF37" }),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M89 53 C84 55 81 58 81 62 L85 117 L94 123 L96 76 C96 65 95 57 93 53 Z",
                          fill: "url(#burgundySilk)",
                          stroke: "#D4AF37",
                          strokeWidth: "0.95"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M111 53 C116 55 119 58 119 62 L115 117 L106 123 L104 76 C104 65 105 57 107 53 Z",
                          fill: "url(#burgundySilk)",
                          stroke: "#D4AF37",
                          strokeWidth: "0.95"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M89.5 76 V108 M110.5 76 V108",
                          stroke: "#E5C576",
                          strokeWidth: "1.35",
                          strokeLinecap: "round",
                          strokeDasharray: "2.5 2.5"
                        }
                      ),
                      /* @__PURE__ */ jsx("circle", { cx: "89.5", cy: "69", r: "1.4", fill: "#E5C576" }),
                      /* @__PURE__ */ jsx("circle", { cx: "110.5", cy: "69", r: "1.4", fill: "#E5C576" })
                    ] }),
                    /* @__PURE__ */ jsxs("g", { opacity: "0.92", children: [
                      /* @__PURE__ */ jsx("rect", { x: "294", y: "141", width: "12", height: "14", rx: "2", fill: "#D4AF37", fillOpacity: "0.88", stroke: "#A98237", strokeWidth: "0.9" }),
                      /* @__PURE__ */ jsx("rect", { x: "292", y: "139", width: "16", height: "3", rx: "1.2", fill: "#FAF8F5", stroke: "#C6A355", strokeWidth: "0.9" }),
                      /* @__PURE__ */ jsx("rect", { x: "292", y: "153", width: "16", height: "3", rx: "1.2", fill: "#FAF8F5", stroke: "#C6A355", strokeWidth: "0.9" }),
                      /* @__PURE__ */ jsx("path", { d: "M58 64 L60 69 L65 71 L60 73 L58 78 L56 73 L51 71 L56 69 Z", fill: "#D4AF37", fillOpacity: "0.65" }),
                      /* @__PURE__ */ jsx("path", { d: "M298 62 L299.5 66 L303.5 67.5 L299.5 69 L298 73 L296.5 69 L292.5 67.5 L296.5 66 Z", fill: "#D4AF37", fillOpacity: "0.55" })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "aria-hidden": "true",
            className: "flex items-center justify-center gap-3 max-w-[200px] mx-auto mb-4",
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-gradient-to-l from-[#C6A355]/70 to-transparent" }),
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#C6A355]/45 shadow-2xs text-[#5E1734]", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-[#5E1734]" }) }),
              /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-gradient-to-r from-[#C6A355]/70 to-transparent" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            textKey: "story.title",
            defaultText: DEFAULT_STORY_TITLE,
            as: "h2",
            className: "font-editorial text-2xl font-bold text-[#1A1617] mb-3"
          }
        ),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            textKey: "story.body",
            defaultText: DEFAULT_STORY_BODY,
            as: "p",
            multiline: true,
            className: "text-sm sm:text-[15px] text-[#4A3B40] leading-[1.95] max-w-xl mx-auto"
          }
        )
      ] })
    }
  );
}
export {
  OurStorySection
};
