import { jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const maskCache = /* @__PURE__ */ new Map();
const maskPromiseCache = /* @__PURE__ */ new Map();
const recoloredCache = /* @__PURE__ */ new Map();
let sharedOutputCanvas = null;
let sharedOutputCtx = null;
let sharedImageData = null;
let sharedSupportsWebp = null;
function getFastEncodingMime() {
  if (sharedSupportsWebp === null && typeof document !== "undefined") {
    try {
      const test = document.createElement("canvas");
      test.width = 2;
      test.height = 2;
      sharedSupportsWebp = test.toDataURL("image/webp", 0.9).startsWith("data:image/webp");
    } catch {
      sharedSupportsWebp = false;
    }
  }
  return sharedSupportsWebp ? { mime: "image/webp", quality: 0.9 } : { mime: "image/jpeg", quality: 0.9 };
}
function hexToRgb(hex) {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return [20, 18, 18];
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
function isDefaultDarkGownColor(hex, name) {
  const cleanHex = hex.trim().toLowerCase();
  const cleanName = name.trim();
  return cleanHex === "#141414" || cleanHex === "#141212" || cleanHex === "#000000" || cleanHex === "#111111" || cleanHex === "#181514" || cleanName === "\u0623\u0633\u0648\u062F \u0645\u0644\u0643\u064A" || cleanName === "\u0623\u0633\u0648\u062F";
}
function isIvoryWhiteSwatch(hex, name) {
  const cleanHex = hex.trim().toLowerCase();
  const cleanName = name.trim();
  return cleanName.includes("\u0623\u0628\u064A\u0636") || cleanName.includes("\u0639\u0627\u062C\u064A") || cleanHex === "#ede6d8" || cleanHex === "#f4efe6" || cleanHex === "#f5f0e6" || cleanHex === "#f5f5f4" || cleanHex === "#ffffff" || cleanHex === "#faf8f5";
}
async function loadImageForCanvas(src) {
  const tryLoad = (url, useCors) => new Promise((resolve, reject) => {
    const img = new Image();
    if (useCors) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
  try {
    return await tryLoad(src, /^https?:\/\//i.test(src));
  } catch {
    const res = await fetch(src);
    if (!res.ok) throw new Error("Image fetch failed");
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    try {
      return await tryLoad(objUrl, false);
    } finally {
      URL.revokeObjectURL(objUrl);
    }
  }
}
async function computeGarmentMask(src, garmentType) {
  const maskKey = `${garmentType}::${src}`;
  const cached = maskCache.get(maskKey);
  if (cached) return cached;
  const inflight = maskPromiseCache.get(maskKey);
  if (inflight) return inflight;
  const promise = (async () => {
    let img;
    try {
      img = await loadImageForCanvas(src);
    } catch {
      return null;
    }
    const maxSide = 450;
    const nw = img.naturalWidth || img.width || 1;
    const nh = img.naturalHeight || img.height || 1;
    const scale = Math.min(1, maxSide / Math.max(nw, nh));
    const width = Math.max(1, Math.round(nw * scale));
    const height = Math.max(1, Math.round(nh * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);
    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch {
      return null;
    }
    const data = imageData.data;
    const total = width * height;
    const coreWeights = new Float32Array(total);
    const softEdgeWeights = new Float32Array(total);
    const weights = new Float32Array(total);
    const lums = new Float32Array(total);
    const sampleLums = [];
    let chromaSum = 0;
    let chromaCount = 0;
    let hasTransparency = false;
    const isColoredStoleBase = garmentType === "stole" && src.includes("stole_back");
    for (let p = 0; p < total; p++) {
      const idx = p * 4;
      const alpha = data[idx + 3];
      if (alpha < 250) hasTransparency = true;
      if (alpha < 20) continue;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      lums[p] = lum;
      const maxC = r > g ? r > b ? r : b : g > b ? g : b;
      const minC = r < g ? r < b ? r : b : g < b ? g : b;
      const chroma = maxC - minC;
      const sat = maxC > 20 ? chroma / maxC : chroma / 20;
      const warmth = r > g && g >= b ? r - b : 0;
      let coreW = 0;
      let softEdgeW = 0;
      if (isColoredStoleBase) {
        const tanWarmth = g > 48 && r > g && g >= b ? r - b : 0;
        const brassWeight = 1 - smoothstep(18, 32, tanWarmth);
        coreW = (1 - smoothstep(82, 118, lum)) * brassWeight;
        softEdgeW = (1 - smoothstep(70, 135, lum)) * brassWeight;
      } else {
        const coreLumWeight = 1 - smoothstep(70, 108, lum);
        const coreSatWeight = (1 - smoothstep(0.24, 0.42, sat)) * (1 - smoothstep(22, 38, chroma));
        const warmGuard = lum > 34 ? 1 - smoothstep(14, 26, warmth) : 1;
        coreW = coreLumWeight * coreSatWeight * warmGuard;
        const edgeLumWeight = 1 - smoothstep(68, 135, lum);
        const edgeSatWeight = (1 - smoothstep(0.18, 0.36, sat)) * (1 - smoothstep(18, 34, chroma));
        softEdgeW = edgeLumWeight * edgeSatWeight * warmGuard;
      }
      if (coreW > 0.02) {
        coreWeights[p] = coreW;
        if (coreW > 0.65 && (p & 3) === 0) {
          sampleLums.push(lum);
          chromaSum += chroma;
          chromaCount += 1;
        }
      }
      if (softEdgeW > 0.01) {
        softEdgeWeights[p] = softEdgeW;
      }
    }
    const dilated = new Float32Array(total);
    for (let y = 0; y < height; y++) {
      const y0 = y > 0 ? y - 1 : 0;
      const y1 = y < height - 1 ? y + 1 : height - 1;
      for (let x = 0; x < width; x++) {
        const p = y * width + x;
        const core = coreWeights[p];
        if (core >= 0.96) {
          dilated[p] = core;
          continue;
        }
        const x0 = x > 0 ? x - 1 : 0;
        const x1 = x < width - 1 ? x + 1 : width - 1;
        let maxCoreNeighbor = core;
        for (let ny = y0; ny <= y1; ny++) {
          const row = ny * width;
          for (let nx = x0; nx <= x1; nx++) {
            const nw2 = coreWeights[row + nx];
            if (nw2 > maxCoreNeighbor) maxCoreNeighbor = nw2;
          }
        }
        if (maxCoreNeighbor > 0.25 && softEdgeWeights[p] > 0.01) {
          dilated[p] = Math.max(
            core,
            softEdgeWeights[p] * Math.min(1, maxCoreNeighbor * 1.15)
          );
        } else {
          dilated[p] = core;
        }
      }
    }
    let activeCount = 0;
    for (let y = 0; y < height; y++) {
      const y0 = y > 0 ? y - 1 : 0;
      const y1 = y < height - 1 ? y + 1 : height - 1;
      for (let x = 0; x < width; x++) {
        const p = y * width + x;
        const w = dilated[p];
        let finalW = w;
        if (w < 0.96 && w > 0.01) {
          const x0 = x > 0 ? x - 1 : 0;
          const x1 = x < width - 1 ? x + 1 : width - 1;
          let sum = 0;
          let count = 0;
          for (let ny = y0; ny <= y1; ny++) {
            const row = ny * width;
            for (let nx = x0; nx <= x1; nx++) {
              sum += dilated[row + nx];
              count += 1;
            }
          }
          finalW = clamp(w * 0.72 + sum / count * 0.28, 0, 1);
        }
        weights[p] = finalW;
        if (finalW > 0.01) {
          activeCount += 1;
        }
      }
    }
    let minLum = 12;
    let maxLum = 72;
    if (sampleLums.length > 20) {
      sampleLums.sort((a, b) => a - b);
      minLum = sampleLums[Math.floor(sampleLums.length * 0.05)];
      maxLum = Math.max(
        minLum + 24,
        sampleLums[Math.floor(sampleLums.length * 0.95)]
      );
    }
    const lumRange = Math.max(20, maxLum - minLum);
    const activeIndices = new Uint32Array(activeCount);
    const activeWeights = new Float32Array(activeCount);
    const activeIvoryWeights = new Float32Array(activeCount);
    const activeFoldCurves = new Float32Array(activeCount);
    const crystalIdxList = [];
    const crystalLumList = [];
    let ptr = 0;
    for (let y = 0; y < height; y++) {
      const y0 = Math.max(0, y - 3);
      const y1 = Math.min(height - 1, y + 3);
      for (let x = 0; x < width; x++) {
        const p = y * width + x;
        const w = weights[p];
        const lum = lums[p];
        if (w > 0.01) {
          const foldNorm = clamp((lum - minLum) / lumRange, 0, 1);
          activeIndices[ptr] = p * 4;
          activeWeights[ptr] = w;
          activeIvoryWeights[ptr] = lum > maxLum ? clamp(Math.pow(w, 0.58), 0, 1) : w;
          activeFoldCurves[ptr] = Math.pow(foldNorm, 0.8);
          ptr += 1;
        } else if (lum > 135 && lum < 246 && data[p * 4 + 3] >= 20) {
          const x0 = Math.max(0, x - 3);
          const x1 = Math.min(width - 1, x + 3);
          let nearFabric = false;
          for (let ny = y0; ny <= y1 && !nearFabric; ny++) {
            const row = ny * width;
            for (let nx = x0; nx <= x1; nx++) {
              if (coreWeights[row + nx] > 0.35) {
                nearFabric = true;
                break;
              }
            }
          }
          if (nearFabric) {
            crystalIdxList.push(p * 4);
            crystalLumList.push(lum);
          }
        }
      }
    }
    const parsed = {
      width,
      height,
      originalData: new Uint8ClampedArray(data),
      activeIndices,
      activeWeights,
      activeIvoryWeights,
      activeFoldCurves,
      crystalIndices: new Uint32Array(crystalIdxList),
      crystalLums: new Float32Array(crystalLumList),
      hasTransparency,
      avgChroma: chromaCount > 0 ? chromaSum / chromaCount : 0
    };
    maskCache.set(maskKey, parsed);
    return parsed;
  })();
  maskPromiseCache.set(maskKey, promise);
  try {
    return await promise;
  } finally {
    maskPromiseCache.delete(maskKey);
  }
}
function renderRecoloredDataUrl(mask, colorHex, colorName) {
  const [tr, tg, tb] = hexToRgb(colorHex);
  const tLum = (0.299 * tr + 0.587 * tg + 0.114 * tb) / 255;
  const isIvory = isIvoryWhiteSwatch(colorHex, colorName);
  const isLightSwatch = !isIvory && tLum > 0.56;
  const isJewelSwatch = tLum >= 0.12 && tLum <= 0.34;
  if (!sharedOutputCanvas) {
    sharedOutputCanvas = document.createElement("canvas");
    sharedOutputCtx = sharedOutputCanvas.getContext("2d");
  }
  const canvas = sharedOutputCanvas;
  const ctx = sharedOutputCtx;
  if (!ctx) return "";
  if (canvas.width !== mask.width || canvas.height !== mask.height) {
    canvas.width = mask.width;
    canvas.height = mask.height;
    sharedImageData = ctx.createImageData(mask.width, mask.height);
  } else if (!sharedImageData || sharedImageData.width !== mask.width || sharedImageData.height !== mask.height) {
    sharedImageData = ctx.createImageData(mask.width, mask.height);
  }
  const out = sharedImageData;
  const src = mask.originalData;
  const dst = out.data;
  dst.set(src);
  const activeIndices = mask.activeIndices;
  const activeWeights = isIvory ? mask.activeIvoryWeights : mask.activeWeights;
  const activeFoldCurves = mask.activeFoldCurves;
  const activeLen = activeIndices.length;
  if (isIvory) {
    const shadowR = 180;
    const shadowG = 172;
    const shadowB = 158;
    const ivoryR = 237;
    const ivoryG = 230;
    const ivoryB = 216;
    const hiR = 242;
    const hiG = 236;
    const hiB = 224;
    for (let i = 0; i < activeLen; i++) {
      const idx = activeIndices[i];
      const w = activeWeights[i];
      const invW = 1 - w;
      const foldCurve = activeFoldCurves[i];
      let nr;
      let ng;
      let nb;
      if (foldCurve < 0.72) {
        const t = foldCurve / 0.72;
        nr = shadowR + (ivoryR - shadowR) * t;
        ng = shadowG + (ivoryG - shadowG) * t;
        nb = shadowB + (ivoryB - shadowB) * t;
      } else {
        const t = (foldCurve - 0.72) / 0.28;
        nr = ivoryR + (hiR - ivoryR) * t;
        ng = ivoryG + (hiG - ivoryG) * t;
        nb = ivoryB + (hiB - ivoryB) * t;
      }
      dst[idx] = src[idx] * invW + nr * w + 0.5 | 0;
      dst[idx + 1] = src[idx + 1] * invW + ng * w + 0.5 | 0;
      dst[idx + 2] = src[idx + 2] * invW + nb * w + 0.5 | 0;
    }
    const crystalIndices = mask.crystalIndices;
    const crystalLums = mask.crystalLums;
    const crystalLen = crystalIndices.length;
    for (let i = 0; i < crystalLen; i++) {
      const idx = crystalIndices[i];
      const lum = crystalLums[i];
      const sr = src[idx];
      const sg = src[idx + 1];
      const sb = src[idx + 2];
      const warmth = sr > sg && sg >= sb ? sr - sb : 0;
      const factor = warmth > 22 ? 1.24 : 1.46;
      const pivot = 184;
      let cr = pivot + (sr - pivot) * factor;
      let cg = pivot + (sg - pivot) * factor;
      let cb = pivot + (sb - pivot) * factor;
      if (lum > 192 && warmth <= 22) {
        cr += 8;
        cg += 10;
        cb += 16;
      }
      dst[idx] = cr < 0 ? 0 : cr > 255 ? 255 : cr + 0.5 | 0;
      dst[idx + 1] = cg < 0 ? 0 : cg > 255 ? 255 : cg + 0.5 | 0;
      dst[idx + 2] = cb < 0 ? 0 : cb > 255 ? 255 : cb + 0.5 | 0;
    }
  } else {
    const baseShade = isLightSwatch ? 0.62 : isJewelSwatch ? 0.52 : 0.46;
    const foldGain = isLightSwatch ? 0.42 : isJewelSwatch ? 0.96 : 0.92;
    for (let i = 0; i < activeLen; i++) {
      const idx = activeIndices[i];
      const w = activeWeights[i];
      const invW = 1 - w;
      const shade = baseShade + activeFoldCurves[i] * foldGain;
      const nr = tr * shade;
      const ng = tg * shade;
      const nb = tb * shade;
      const r = src[idx] * invW + (nr > 255 ? 255 : nr) * w + 0.5 | 0;
      const g = src[idx + 1] * invW + (ng > 255 ? 255 : ng) * w + 0.5 | 0;
      const b = src[idx + 2] * invW + (nb > 255 ? 255 : nb) * w + 0.5 | 0;
      dst[idx] = r > 255 ? 255 : r;
      dst[idx + 1] = g > 255 ? 255 : g;
      dst[idx + 2] = b > 255 ? 255 : b;
    }
  }
  ctx.putImageData(out, 0, 0);
  if (mask.hasTransparency) {
    const { mime: mime2, quality: quality2 } = getFastEncodingMime();
    return mime2 === "image/webp" ? canvas.toDataURL("image/webp", quality2) : canvas.toDataURL("image/png");
  }
  const { mime, quality } = getFastEncodingMime();
  return canvas.toDataURL(mime, quality);
}
function GownColorPreviewImage({
  src,
  fallbackSrc = "",
  alt,
  colorHex,
  colorName,
  garmentType = "robe",
  isDisabled = false,
  className = "",
  style
}) {
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const activeSrc = (!primaryFailed && src ? src : fallbackSrc) || src || fallbackSrc || "";
  useEffect(() => {
    setPrimaryFailed(false);
    setImgLoaded(false);
  }, [src, fallbackSrc]);
  const isDefaultBlack = isDefaultDarkGownColor(colorHex, colorName);
  const isNonBlackBaseStole = garmentType === "stole" && (activeSrc.includes("stole_back") || activeSrc.includes("stole-back"));
  const shouldColorize = !isDisabled && (!isDefaultBlack || isNonBlackBaseStole) && Boolean(activeSrc);
  const cacheKey = `${garmentType}::${activeSrc}::${colorHex.toLowerCase()}::${colorName}`;
  const localCacheRef = useRef(/* @__PURE__ */ new Map());
  const cachedSync = shouldColorize ? localCacheRef.current.get(cacheKey) || recoloredCache.get(cacheKey) || null : null;
  const [recoloredState, setRecoloredState] = useState(() => cachedSync ? { key: cacheKey, url: cachedSync } : null);
  useEffect(() => {
    if (!shouldColorize || !activeSrc) return;
    const hit = localCacheRef.current.get(cacheKey) || recoloredCache.get(cacheKey);
    if (hit) {
      localCacheRef.current.set(cacheKey, hit);
      setRecoloredState({ key: cacheKey, url: hit });
      return;
    }
    let cancelled = false;
    computeGarmentMask(activeSrc, garmentType).then((mask) => {
      if (cancelled) return;
      if (!mask) {
        if (!primaryFailed && fallbackSrc && activeSrc !== fallbackSrc) {
          setPrimaryFailed(true);
        }
        return;
      }
      if (isDefaultBlack && mask.avgChroma < 22) return;
      const url = renderRecoloredDataUrl(mask, colorHex, colorName);
      if (url) {
        localCacheRef.current.set(cacheKey, url);
        recoloredCache.set(cacheKey, url);
        setRecoloredState({ key: cacheKey, url });
      }
    }).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, [activeSrc, fallbackSrc, primaryFailed, colorHex, colorName, garmentType, cacheKey, shouldColorize, isDefaultBlack]);
  const resolvedUrl = cachedSync || (recoloredState?.key === cacheKey ? recoloredState.url : null);
  if (!shouldColorize || !resolvedUrl) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: activeSrc,
        alt: shouldColorize ? `${alt} - ${colorName}` : alt,
        referrerPolicy: "no-referrer",
        loading: "lazy",
        decoding: "async",
        draggable: false,
        onLoad: () => setImgLoaded(true),
        onError: () => {
          if (!primaryFailed && fallbackSrc && activeSrc !== fallbackSrc) {
            setPrimaryFailed(true);
          }
        },
        onContextMenu: (e) => e.preventDefault(),
        className: `${className} transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-90"}`,
        style
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: resolvedUrl,
      alt: `${alt} - ${colorName}`,
      referrerPolicy: "no-referrer",
      loading: "lazy",
      decoding: "async",
      draggable: false,
      onContextMenu: (e) => e.preventDefault(),
      className,
      style
    }
  );
}
export {
  GownColorPreviewImage
};
