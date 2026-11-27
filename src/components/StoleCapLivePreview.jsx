import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X } from "lucide-react";
const LIGHT_HEXES = /* @__PURE__ */ new Set([
  "#ffffff",
  "#ede6d8",
  "#f4efe6",
  "#f5f5f4",
  "#e7d8c9",
  "#e2e8f0",
  "#f5f2eb"
]);
function isLightHex(hex) {
  const normalized = hex.trim().toLowerCase();
  if (LIGHT_HEXES.has(normalized)) return true;
  const match = /^#([0-9a-f]{6})$/i.exec(normalized);
  if (!match) return false;
  const intVal = parseInt(match[1], 16);
  const r = intVal >> 16 & 255;
  const g = intVal >> 8 & 255;
  const b = intVal & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.78;
}
function GraduateSilhouetteSvg({ includeCapOutline }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 340 400",
      className: "w-[292px] sm:w-[328px] h-auto select-none pointer-events-none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "gownSilhouetteGrad", x1: "0.2", y1: "0", x2: "0.8", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1E1117" }),
            /* @__PURE__ */ jsx("stop", { offset: "52%", stopColor: "#2F101E" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#160C11" })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "gownSleeveGrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#2A101C" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#140B10" })
          ] })
        ] }),
        includeCapOutline && /* @__PURE__ */ jsxs("g", { opacity: "0.9", children: [
          /* @__PURE__ */ jsx(
            "polygon",
            {
              points: "170,12 246,35 170,58 94,35",
              fill: "#1D1016",
              stroke: "rgba(212,175,55,0.28)",
              strokeWidth: "1.2"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M126 44 L170 57 L214 44 L210 64 C194 72, 146 72, 130 64 Z",
              fill: "#27121C"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ellipse", { cx: "170", cy: "70", rx: "28", ry: "33", fill: "#291720", opacity: "0.88" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M153 96 L187 96 L193 122 Q170 130 147 122 Z",
            fill: "#24141C",
            opacity: "0.92"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M108 118 C72 126, 42 154, 24 224 L16 336 L68 346 L86 244 Z",
            fill: "url(#gownSleeveGrad)",
            stroke: "rgba(212,175,55,0.18)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M232 118 C268 126, 298 154, 316 224 L324 336 L272 346 L254 244 Z",
            fill: "url(#gownSleeveGrad)",
            stroke: "rgba(212,175,55,0.18)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M146 112 Q170 124 194 112 L242 124 C264 134, 272 162, 276 208 L292 388 Q170 398 48 388 L64 208 C68 162, 76 134, 98 124 Z",
            fill: "url(#gownSilhouetteGrad)",
            stroke: "rgba(212,175,55,0.22)",
            strokeWidth: "1.2"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M104 126 Q170 148 236 126",
            fill: "none",
            stroke: "rgba(212,175,55,0.22)",
            strokeWidth: "1.2"
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: "170",
            y1: "136",
            x2: "170",
            y2: "388",
            stroke: "rgba(212,175,55,0.16)",
            strokeWidth: "1.3"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M126 144 L112 384 M214 144 L228 384",
            fill: "none",
            stroke: "rgba(255,255,255,0.06)",
            strokeWidth: "1.5"
          }
        )
      ]
    }
  );
}
function GraduationCapSvg({
  capHex,
  tasselHex,
  capStyleId,
  capEmbroideryPos
}) {
  const lightCap = isLightHex(capHex);
  const strokeColor = lightCap ? "#C7AEB6" : "rgba(255,255,255,0.22)";
  const showTopEmbroidery = capEmbroideryPos === "\u0633\u0637\u062D \u0627\u0644\u0642\u0628\u0639\u0629";
  const showFrontEmbroidery = capEmbroideryPos === "\u062C\u0628\u0647\u0629 \u0627\u0644\u0642\u0628\u0639\u0629";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 220 116",
      className: "w-40 sm:w-44 h-auto drop-shadow-md select-none",
      role: "img",
      "aria-label": "\u0645\u0639\u0627\u064A\u0646\u0629 \u0642\u0628\u0639\u0629 \u0627\u0644\u062A\u062E\u0631\u062C",
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "capCrownShade", x1: "0", y1: "0", x2: "1", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.14" }),
          /* @__PURE__ */ jsx("stop", { offset: "55%", stopColor: "#000000", stopOpacity: "0.02" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#000000", stopOpacity: "0.22" })
        ] }) }),
        capStyleId === "round" ? /* @__PURE__ */ jsx(
          "path",
          {
            d: "M54 62 C54 50, 166 50, 166 62 L162 92 C142 103, 78 103, 58 92 Z",
            fill: capHex,
            stroke: strokeColor,
            strokeWidth: "1.4"
          }
        ) : /* @__PURE__ */ jsx(
          "path",
          {
            d: "M52 60 L110 74 L168 60 L163 92 C145 103, 75 103, 57 92 Z",
            fill: capHex,
            stroke: strokeColor,
            strokeWidth: "1.4"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M54 62 L110 74 L166 62 L162 92 C144 103, 76 103, 58 92 Z",
            fill: "url(#capCrownShade)"
          }
        ),
        capStyleId === "tuxedo" && /* @__PURE__ */ jsx(
          "path",
          {
            d: "M56 76 C84 87, 136 87, 164 76 L163 85 C136 96, 84 96, 57 85 Z",
            fill: tasselHex,
            fillOpacity: "0.88"
          }
        ),
        capStyleId === "round" ? /* @__PURE__ */ jsx(
          "ellipse",
          {
            cx: "110",
            cy: "44",
            rx: "84",
            ry: "24",
            fill: capHex,
            stroke: strokeColor,
            strokeWidth: "1.5"
          }
        ) : /* @__PURE__ */ jsx(
          "polygon",
          {
            points: "110,14 202,44 110,74 18,44",
            fill: capHex,
            stroke: strokeColor,
            strokeWidth: "1.5",
            strokeLinejoin: "round"
          }
        ),
        capStyleId === "round" ? /* @__PURE__ */ jsx(
          "ellipse",
          {
            cx: "110",
            cy: "44",
            rx: "84",
            ry: "24",
            fill: "url(#capCrownShade)",
            opacity: "0.5"
          }
        ) : /* @__PURE__ */ jsx(
          "polygon",
          {
            points: "110,14 202,44 110,74 18,44",
            fill: "url(#capCrownShade)",
            opacity: "0.55"
          }
        ),
        showTopEmbroidery && /* @__PURE__ */ jsxs("g", { opacity: "0.9", children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M90 36 Q110 29 130 36",
              fill: "none",
              stroke: tasselHex,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeDasharray: "3 2.5"
            }
          ),
          /* @__PURE__ */ jsx("circle", { cx: "110", cy: "27", r: "2.2", fill: tasselHex })
        ] }),
        showFrontEmbroidery && /* @__PURE__ */ jsx(
          "path",
          {
            d: "M84 86 Q110 92 136 86",
            fill: "none",
            stroke: tasselHex,
            strokeWidth: "2.2",
            strokeLinecap: "round",
            strokeDasharray: "3.5 2.5"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M110 43 C144 45, 174 52, 182 66 L183 88",
            fill: "none",
            stroke: tasselHex,
            strokeWidth: "2.4",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "110",
            cy: "43",
            r: "4.2",
            fill: tasselHex,
            stroke: "rgba(42,21,29,0.28)",
            strokeWidth: "0.9"
          }
        ),
        /* @__PURE__ */ jsx("ellipse", { cx: "183", cy: "88", rx: "3.4", ry: "2.8", fill: tasselHex }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M180 90 L177 108 M182 90 L181 110 M184 90 L185 110 M186 90 L189 108",
            stroke: tasselHex,
            strokeWidth: "1.9",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
async function exportStoleDesignCardPng(opts) {
  const width = 760;
  const height = 960;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#FAF8F5";
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.fillStyle = "rgba(92, 22, 53, 0.045)";
  ctx.font = 'bold 26px "Cairo", "Amiri", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let y = 140; y < height - 100; y += 170) {
    for (let x = 130; x < width; x += 260) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.36);
      ctx.fillText("DG by Douaa", 0, 0);
      ctx.restore();
    }
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.58)";
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 22, width - 44, height - 44);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, width - 64, height - 64);
  ctx.fillStyle = "#5E1734";
  ctx.font = 'bold 24px "Cairo", "Amiri", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DG by Douaa", width / 2, 70);
  ctx.fillStyle = "#1A1617";
  ctx.font = 'bold 20px "Cairo", sans-serif';
  ctx.fillText(opts.productName, width / 2, 106, width - 100);
  if (opts.mode === "stole-cap" && opts.showGownSilhouette) {
    ctx.save();
    const gGrad = ctx.createLinearGradient(width / 2 - 120, 180, width / 2 + 120, 800);
    gGrad.addColorStop(0, "#1E1117");
    gGrad.addColorStop(0.55, "#331222");
    gGrad.addColorStop(1, "#160C11");
    ctx.fillStyle = "rgba(41, 23, 32, 0.88)";
    ctx.beginPath();
    ctx.ellipse(width / 2, 232, 40, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 115, 290);
    ctx.quadraticCurveTo(width / 2 - 220, 320, width / 2 - 245, 565);
    ctx.lineTo(width / 2 - 180, 580);
    ctx.lineTo(width / 2 - 195, 768);
    ctx.quadraticCurveTo(width / 2, 788, width / 2 + 195, 768);
    ctx.lineTo(width / 2 + 180, 580);
    ctx.lineTo(width / 2 + 245, 565);
    ctx.quadraticCurveTo(width / 2 + 220, 320, width / 2 + 115, 290);
    ctx.quadraticCurveTo(width / 2, 312, width / 2 - 115, 290);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(212, 175, 55, 0.24)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  const drawCap = (cx, topY, scale = 1) => {
    ctx.save();
    ctx.translate(cx, topY);
    ctx.scale(scale, scale);
    const capHex = opts.capColor.hex;
    const tasselHex = opts.threadColor.hex || "#C6A355";
    const capBorder = isLightHex(capHex) ? "#C7AEB6" : "rgba(255,255,255,0.28)";
    ctx.fillStyle = capHex;
    ctx.strokeStyle = capBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-76, 44);
    ctx.lineTo(0, 62);
    ctx.lineTo(76, 44);
    ctx.lineTo(68, 86);
    ctx.quadraticCurveTo(0, 102, -68, 86);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (opts.capStyleId === "tuxedo") {
      ctx.fillStyle = tasselHex;
      ctx.beginPath();
      ctx.moveTo(-70, 64);
      ctx.quadraticCurveTo(0, 79, 70, 64);
      ctx.lineTo(68, 76);
      ctx.quadraticCurveTo(0, 91, -68, 76);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = capHex;
    ctx.beginPath();
    if (opts.capStyleId === "round") {
      ctx.ellipse(0, 24, 114, 30, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(0, -14);
      ctx.lineTo(122, 24);
      ctx.lineTo(0, 62);
      ctx.lineTo(-122, 24);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = tasselHex;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.quadraticCurveTo(64, 28, 95, 58);
    ctx.lineTo(96, 86);
    ctx.stroke();
    ctx.fillStyle = tasselHex;
    ctx.beginPath();
    ctx.arc(0, 24, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(91, 86);
    ctx.lineTo(86, 110);
    ctx.moveTo(96, 86);
    ctx.lineTo(96, 112);
    ctx.moveTo(101, 86);
    ctx.lineTo(106, 110);
    ctx.stroke();
    ctx.restore();
  };
  if (opts.mode === "cap-only") {
    drawCap(width / 2, 340, 1.55);
  } else {
    const rightText = (opts.rightEmbroideredText || "").trim() || (!(opts.leftEmbroideredText || "").trim() ? (opts.embroideredText || "").trim() : "");
    const leftText = (opts.leftEmbroideredText || "").trim();
    if (!opts.hideCap) {
      drawCap(width / 2, 162, 1.05);
    }
    const stoleTopY = opts.hideCap ? 195 : 275;
    if (opts.isMissSash) {
      const ox = 155;
      const oy = stoleTopY + 10;
      const sc = 1.65;
      ctx.save();
      ctx.shadowColor = "rgba(36, 19, 27, 0.18)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.moveTo(ox + 206 * sc, oy + 24 * sc);
      ctx.lineTo(ox + 26 * sc, oy + 224 * sc);
      ctx.lineTo(ox + 18 * sc, oy + 262 * sc);
      ctx.lineTo(ox + 46 * sc, oy + 250 * sc);
      ctx.lineTo(ox + 62 * sc, oy + 272 * sc);
      ctx.lineTo(ox + 72 * sc, oy + 264 * sc);
      ctx.lineTo(ox + 252 * sc, oy + 64 * sc);
      ctx.closePath();
      ctx.fillStyle = opts.stoleColor.hex;
      ctx.fill();
      if (isLightHex(opts.stoleColor.hex)) {
        ctx.strokeStyle = "#D6BCC5";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = opts.threadColor.hex;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox + 210 * sc, oy + 29 * sc);
      ctx.lineTo(ox + 31 * sc, oy + 228 * sc);
      ctx.moveTo(ox + 247 * sc, oy + 61 * sc);
      ctx.lineTo(ox + 68 * sc, oy + 260 * sc);
      ctx.stroke();
      ctx.restore();
      const centerX = ox + 138 * sc;
      const centerY = oy + 145 * sc;
      if (opts.universityLogoUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.translate(centerX + 82, centerY - 88);
            ctx.beginPath();
            ctx.arc(0, 0, 28, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = opts.threadColor.hex;
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(img, -28, -28, 56, 56);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = opts.universityLogoUrl;
        });
      }
      if (rightText || leftText) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-0.84);
        ctx.fillStyle = opts.threadColor.hex;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = 'bold 28px "Amiri", "Cairo", serif';
        if (rightText && leftText) {
          ctx.fillText(rightText, 0, -16, 290);
          ctx.fillText(leftText, 0, 18, 290);
        } else {
          ctx.fillText(rightText || leftText, 0, 0, 290);
        }
        ctx.restore();
      }
    } else {
      const ox = 156;
      const oy = stoleTopY;
      const sc = 1.6;
      const p = (x, y) => [ox + x * sc, oy + y * sc];
      ctx.save();
      ctx.shadowColor = "rgba(36, 19, 27, 0.2)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.moveTo(...p(78, 14));
      ctx.bezierCurveTo(...p(56, 26), ...p(44, 64), ...p(42, 115));
      ctx.lineTo(...p(36, 284));
      ctx.lineTo(...p(74, 302));
      ctx.lineTo(...p(112, 282));
      ctx.lineTo(...p(118, 118));
      ctx.bezierCurveTo(...p(122, 86), ...p(131, 66), ...p(140, 58));
      ctx.bezierCurveTo(...p(149, 66), ...p(158, 86), ...p(162, 118));
      ctx.lineTo(...p(168, 282));
      ctx.lineTo(...p(206, 302));
      ctx.lineTo(...p(244, 284));
      ctx.lineTo(...p(238, 115));
      ctx.bezierCurveTo(...p(236, 64), ...p(224, 26), ...p(202, 14));
      ctx.bezierCurveTo(...p(182, 22), ...p(158, 34), ...p(140, 46));
      ctx.bezierCurveTo(...p(122, 34), ...p(98, 22), ...p(78, 14));
      ctx.closePath();
      ctx.fillStyle = opts.stoleColor.hex;
      ctx.fill();
      if (isLightHex(opts.stoleColor.hex)) {
        ctx.strokeStyle = "#D6BCC5";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = opts.threadColor.hex;
      ctx.globalAlpha = 0.72;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(...p(52, 72));
      ctx.lineTo(...p(45, 276));
      ctx.lineTo(...p(74, 291));
      ctx.lineTo(...p(104, 276));
      ctx.lineTo(...p(110, 112));
      ctx.moveTo(...p(228, 72));
      ctx.lineTo(...p(235, 276));
      ctx.lineTo(...p(206, 291));
      ctx.lineTo(...p(176, 276));
      ctx.lineTo(...p(170, 112));
      ctx.stroke();
      ctx.restore();
      const rightBandX = ox + 204 * sc;
      let rightTextCenterY = oy + 188 * sc;
      if (opts.universityLogoUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const cx = rightBandX;
            const cy = oy + 96 * sc;
            const r = 32;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = opts.threadColor.hex;
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
            ctx.restore();
            rightTextCenterY = oy + 206 * sc;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = opts.universityLogoUrl;
        });
      }
      ctx.fillStyle = opts.threadColor.hex;
      ctx.font = 'bold 30px "Amiri", "Cairo", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (rightText) {
        ctx.save();
        ctx.translate(rightBandX, rightTextCenterY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(rightText, 0, 0, opts.universityLogoUrl ? 210 : 250);
        ctx.restore();
      }
      if (leftText) {
        ctx.save();
        ctx.translate(ox + 75 * sc, oy + 190 * sc);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(leftText, 0, 0, 250);
        ctx.restore();
      }
    }
  }
  const colorSummary = opts.mode === "cap-only" ? `\u0627\u0644\u0642\u0628\u0639\u0629: ${opts.capColor.name}` : `${opts.isAmericanShawl && opts.customColorText?.trim() ? opts.customColorText.trim() : opts.stoleColor.name}  \xB7  \u062A\u0637\u0631\u064A\u0632 ${opts.threadColor.name}`;
  ctx.fillStyle = "#1A1617";
  ctx.font = 'bold 22px "Cairo", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(colorSummary, width / 2, height - 102, width - 90);
  ctx.fillStyle = "rgba(92, 22, 53, 0.7)";
  ctx.font = 'bold 16px "Cairo", sans-serif';
  ctx.fillText("DG by Douaa \xB7 \u062A\u0635\u0645\u064A\u0645 \u0645\u062E\u0635\u0635", width / 2, height - 62);
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `dg-by-douaa-design-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function StoleCapLivePreview({
  mode,
  stoleColor,
  isMissSash = false,
  isAmericanShawl = false,
  customColorText = "",
  fabricLabel = "",
  threadColor,
  embroideredText = "",
  rightEmbroideredText = "",
  leftEmbroideredText = "",
  universityLogoUrl,
  onRemoveUniversityLogo,
  hideCap,
  capStyleId,
  capStyleLabel,
  capColor,
  capEmbroideryPos,
  showGownSilhouette: controlledShowGown,
  onToggleGownSilhouette
}) {
  const [internalShowGown, setInternalShowGown] = useState(false);
  const showGownSilhouette = controlledShowGown !== void 0 ? controlledShowGown : internalShowGown;
  const handleToggleGown = () => {
    const next = !showGownSilhouette;
    if (controlledShowGown === void 0) {
      setInternalShowGown(next);
    }
    onToggleGownSilhouette?.(next);
  };
  const lightStole = isLightHex(stoleColor.hex);
  const lightThread = isLightHex(threadColor.hex);
  const rightDisplayText = rightEmbroideredText.trim();
  const leftDisplayText = leftEmbroideredText.trim();
  const fallbackDisplayText = !rightDisplayText && !leftDisplayText ? embroideredText.trim() : "";
  const finalRightText = rightDisplayText || fallbackDisplayText;
  const finalLeftText = leftDisplayText;
  const missCombinedLength = Math.max(finalRightText.length, finalLeftText.length);
  const isVelvetDan = fabricLabel.includes("\u062F\u0627\u0646");
  const textEmbroideryShadow = lightThread ? "0 1px 2px rgba(20, 14, 16, 0.55)" : "0 1px 1px rgba(255, 255, 255, 0.25)";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#C6A355]/35 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]/70 overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-[#C6A355]/25 bg-white/95 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-extrabold text-[#5E1734]", children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u062D\u064A\u0629 \u0644\u0644\u062A\u0635\u0645\u064A\u0645 \u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#65525A] mt-0.5", children: mode === "cap-only" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "\u0627\u0644\u0642\u0628\u0639\u0629: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1A1617]", children: capColor.name }),
          capStyleLabel ? /* @__PURE__ */ jsxs(Fragment, { children: [
            " \xB7 ",
            /* @__PURE__ */ jsx("span", { children: capStyleLabel })
          ] }) : null
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "\u0627\u0644\u0648\u0634\u0627\u062D:",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1A1617]", children: isAmericanShawl && customColorText.trim() ? customColorText.trim() : stoleColor.name }),
          " \xB7 ",
          "\u0627\u0644\u062A\u0637\u0631\u064A\u0632: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1A1617]", children: threadColor.name }),
          !hideCap && /* @__PURE__ */ jsxs(Fragment, { children: [
            " \xB7 ",
            "\u0627\u0644\u0642\u0628\u0639\u0629: ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1A1617]", children: capColor.name })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        fabricLabel && mode === "stole-cap" && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#5E1734]", children: [
          "\u0642\u0645\u0627\u0634 ",
          fabricLabel
        ] }),
        mode === "stole-cap" && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleToggleGown,
            "aria-pressed": showGownSilhouette,
            className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer touch-manipulation active:scale-95 ${showGownSilhouette ? "bg-[#5E1734] text-white border-[#5E1734] shadow-xs" : "bg-[#FAF8F5] text-[#5E1734] border-[#C6A355]/45 hover:bg-[#F3EDE2]"}`,
            children: /* @__PURE__ */ jsx("span", { children: "\u{1F464} \u0645\u0639\u0627\u064A\u0646\u0629 \u0645\u0639 \u0627\u0644\u0631\u0648\u0628 (\u062E\u0631\u064A\u062C / \u062E\u0631\u064A\u062C\u0629)" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-5 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[390px] relative overflow-hidden", children: mode === "cap-only" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-6 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "scale-125 sm:scale-135 py-3", children: /* @__PURE__ */ jsx(
        GraduationCapSvg,
        {
          capHex: capColor.hex,
          tasselHex: threadColor.hex || "#C6A355",
          capStyleId,
          capEmbroideryPos
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#65525A] text-center", children: "\u0645\u0639\u0627\u064A\u0646\u0629 \u062D\u064A\u0629 \u0644\u0644\u0648\u0646 \u0648\u0634\u0643\u0644 \u0627\u0644\u0642\u0628\u0639\u0629 \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "relative w-full flex flex-col items-center", children: [
      showGownSilhouette && /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute left-1/2 -translate-x-1/2 z-0 transition-opacity duration-200 ${hideCap ? "-top-5" : "top-5 sm:top-6"}`,
          children: /* @__PURE__ */ jsx(GraduateSilhouetteSvg, { includeCapOutline: hideCap })
        }
      ),
      !hideCap && /* @__PURE__ */ jsx(
        "div",
        {
          className: `${isMissSash ? "-mb-1" : "-mb-3"} relative z-10 transition-all duration-200`,
          children: /* @__PURE__ */ jsx(
            GraduationCapSvg,
            {
              capHex: capColor.hex,
              tasselHex: threadColor.hex,
              capStyleId,
              capEmbroideryPos
            }
          )
        }
      ),
      isMissSash ? (
        /* Diagonal Miss Sash (Single-Shoulder Drape: Top-Right to Bottom-Left) */
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-[248px] sm:w-[276px] h-[258px] sm:h-[286px] mx-auto select-none", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              viewBox: "0 0 280 290",
              className: "w-full h-full drop-shadow-md",
              role: "img",
              "aria-label": "\u0645\u0639\u0627\u064A\u0646\u0629 \u0634\u0627\u0644 \u0645\u064A\u0633 \u0627\u0644\u0645\u0627\u0626\u0644",
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "missSashSheen", x1: "0", y1: "0", x2: "1", y2: "1", children: [
                  /* @__PURE__ */ jsx(
                    "stop",
                    {
                      offset: "0%",
                      stopColor: "#ffffff",
                      stopOpacity: isVelvetDan ? "0.22" : "0.1"
                    }
                  ),
                  /* @__PURE__ */ jsx("stop", { offset: "48%", stopColor: "#000000", stopOpacity: "0" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#000000", stopOpacity: "0.2" })
                ] }) }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M206 24 C218 8, 256 26, 252 64 L242 56 Z",
                    fill: stoleColor.hex,
                    stroke: lightStole ? "#D6BCC5" : "rgba(0,0,0,0.25)",
                    strokeWidth: "1.2"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M206 24 C218 8, 256 26, 252 64 L242 56 Z",
                    fill: "#000000",
                    fillOpacity: "0.18"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M206 24 L26 224 L18 262 L46 250 L62 272 L72 264 L252 64 Z",
                    fill: stoleColor.hex,
                    stroke: lightStole ? "#D6BCC5" : "rgba(255,255,255,0.18)",
                    strokeWidth: "1.4",
                    strokeLinejoin: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M206 24 L26 224 L18 262 L46 250 L62 272 L72 264 L252 64 Z",
                    fill: "url(#missSashSheen)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M32 222 L66 254",
                    stroke: lightStole ? "rgba(42,21,29,0.18)" : "rgba(0,0,0,0.28)",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: "210",
                    y1: "29",
                    x2: "31",
                    y2: "228",
                    stroke: threadColor.hex,
                    strokeWidth: "2",
                    strokeOpacity: "0.82",
                    strokeLinecap: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: "247",
                    y1: "61",
                    x2: "68",
                    y2: "260",
                    stroke: threadColor.hex,
                    strokeWidth: "2",
                    strokeOpacity: "0.82",
                    strokeLinecap: "round"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute left-1/2 top-[50%] flex items-center justify-center gap-2.5 w-[224px] sm:w-[250px] px-2 pointer-events-auto",
              style: { transform: "translate(-50%, -50%) rotate(-48deg)" },
              children: [
                universityLogoUrl && /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shadow-md overflow-hidden flex items-center justify-center",
                      style: { border: `2px solid ${threadColor.hex}` },
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: universityLogoUrl,
                          alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                          referrerPolicy: "no-referrer",
                          loading: "lazy",
                          decoding: "async",
                          className: "w-full h-full object-cover rounded-full"
                        }
                      )
                    }
                  ),
                  onRemoveUniversityLogo && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onRemoveUniversityLogo,
                      title: "\u0625\u0632\u0627\u0644\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                      "aria-label": "\u0625\u0632\u0627\u0644\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                      className: "absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#BE123C] text-white flex items-center justify-center shadow-xs hover:bg-[#9F1239] cursor-pointer",
                      children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
                    }
                  )
                ] }),
                (finalRightText || finalLeftText) && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `font-editorial font-bold text-center leading-tight min-w-0 select-none flex flex-col items-center justify-center gap-0.5 ${missCombinedLength > 24 ? "text-xs sm:text-sm" : missCombinedLength > 14 ? "text-sm sm:text-base" : "text-base sm:text-lg"}`,
                    style: {
                      color: threadColor.hex,
                      textShadow: textEmbroideryShadow
                    },
                    children: [
                      finalRightText && /* @__PURE__ */ jsx("span", { className: "truncate max-w-[175px]", children: finalRightText }),
                      finalLeftText && /* @__PURE__ */ jsx("span", { className: "truncate max-w-[175px] opacity-95", children: finalLeftText })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ) : (
        /* Classic Double-Sided V-Stole (Standard / American / Back-Draped) */
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-[240px] sm:w-[272px] h-[278px] sm:h-[304px] mx-auto select-none", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              viewBox: "0 0 280 310",
              className: "w-full h-full drop-shadow-md",
              role: "img",
              "aria-label": "\u0645\u0639\u0627\u064A\u0646\u0629 \u0648\u0634\u0627\u062D \u0627\u0644\u062A\u062E\u0631\u062C",
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "stoleSheen", x1: "0", y1: "0", x2: "1", y2: "1", children: [
                  /* @__PURE__ */ jsx(
                    "stop",
                    {
                      offset: "0%",
                      stopColor: "#ffffff",
                      stopOpacity: isVelvetDan ? "0.2" : "0.08"
                    }
                  ),
                  /* @__PURE__ */ jsx("stop", { offset: "45%", stopColor: "#000000", stopOpacity: "0" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#000000", stopOpacity: "0.18" })
                ] }) }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M90 12 Q140 2 190 12 L198 46 Q140 34 82 46 Z",
                    fill: stoleColor.hex,
                    stroke: lightStole ? "#D6BCC5" : "rgba(0,0,0,0.25)",
                    strokeWidth: "1.2"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M90 12 Q140 2 190 12 L198 46 Q140 34 82 46 Z",
                    fill: "#000000",
                    fillOpacity: "0.14"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M78 14 C56 26, 44 64, 42 115 L36 284 L74 302 L112 282 L118 118 C122 86, 131 66, 140 58 C149 66, 158 86, 162 118 L168 282 L206 302 L244 284 L238 115 C236 64, 224 26, 202 14 C182 22, 158 34, 140 46 C122 34, 98 22, 78 14 Z",
                    fill: stoleColor.hex,
                    stroke: lightStole ? "#D6BCC5" : "rgba(255,255,255,0.16)",
                    strokeWidth: "1.4",
                    strokeLinejoin: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M78 14 C56 26, 44 64, 42 115 L36 284 L74 302 L112 282 L118 118 C122 86, 131 66, 140 58 C149 66, 158 86, 162 118 L168 282 L206 302 L244 284 L238 115 C236 64, 224 26, 202 14 C182 22, 158 34, 140 46 C122 34, 98 22, 78 14 Z",
                    fill: "url(#stoleSheen)"
                  }
                ),
                isAmericanShawl && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M44 276 L74 292 L104 276 L104 284 L74 300 L44 284 Z",
                      fill: threadColor.hex,
                      fillOpacity: "0.88"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M176 276 L206 292 L236 276 L236 284 L206 300 L176 284 Z",
                      fill: threadColor.hex,
                      fillOpacity: "0.88"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M52 72 L45 276 L74 291 L104 276 L110 112",
                    fill: "none",
                    stroke: threadColor.hex,
                    strokeWidth: "1.6",
                    strokeOpacity: "0.72",
                    strokeLinejoin: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M228 72 L235 276 L206 291 L176 276 L170 112",
                    fill: "none",
                    stroke: threadColor.hex,
                    strokeWidth: "1.6",
                    strokeOpacity: "0.72",
                    strokeLinejoin: "round"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-[22%] bottom-[13%] right-[14.5%] w-[26%] flex flex-col items-center justify-start gap-2.5 px-1", children: [
            universityLogoUrl && /* @__PURE__ */ jsxs("div", { className: "relative group shrink-0", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 shadow-md overflow-hidden flex items-center justify-center",
                  style: {
                    border: `2px solid ${threadColor.hex}`
                  },
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: universityLogoUrl,
                      alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                      referrerPolicy: "no-referrer",
                      loading: "lazy",
                          decoding: "async",
                      className: "w-full h-full object-cover rounded-full"
                    }
                  )
                }
              ),
              onRemoveUniversityLogo && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onRemoveUniversityLogo,
                  title: "\u0625\u0632\u0627\u0644\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                  "aria-label": "\u0625\u0632\u0627\u0644\u0629 \u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629",
                  className: "absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#BE123C] text-white flex items-center justify-center shadow-xs hover:bg-[#9F1239] cursor-pointer",
                  children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
                }
              )
            ] }),
            finalRightText && /* @__PURE__ */ jsx(
              "div",
              {
                className: `font-editorial font-bold text-center leading-tight overflow-hidden select-none opacity-95 ${finalRightText.length > 18 ? "text-xs sm:text-sm" : finalRightText.length > 12 ? "text-sm sm:text-base" : "text-base sm:text-lg"}`,
                style: {
                  writingMode: "vertical-rl",
                  color: threadColor.hex,
                  textShadow: textEmbroideryShadow,
                  maxHeight: universityLogoUrl ? "132px" : "185px"
                },
                children: finalRightText
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-[24%] bottom-[13%] left-[14.5%] w-[26%] flex flex-col items-center justify-start px-1", children: finalLeftText && /* @__PURE__ */ jsx(
            "div",
            {
              className: `font-editorial font-bold text-center leading-tight overflow-hidden select-none opacity-95 ${finalLeftText.length > 18 ? "text-xs sm:text-sm" : finalLeftText.length > 12 ? "text-sm sm:text-base" : "text-base sm:text-lg"}`,
              style: {
                writingMode: "vertical-rl",
                color: threadColor.hex,
                textShadow: textEmbroideryShadow,
                maxHeight: "185px"
              },
              children: finalLeftText
            }
          ) })
        ] })
      )
    ] }) })
  ] });
}
export {
  StoleCapLivePreview,
  exportStoleDesignCardPng
};
