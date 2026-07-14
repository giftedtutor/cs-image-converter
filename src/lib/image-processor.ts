import type { OutputFormat } from "./formats";
import { OUTPUT_FORMATS } from "./formats";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageAdjustments = {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  blur: number; // 0 to 20
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  hueRotate: number; // 0 to 360
};

export type ProcessOptions = {
  format: OutputFormat;
  quality: number; // 0.01 to 1
  width?: number;
  height?: number;
  maintainAspect?: boolean;
  rotate: number; // degrees
  flipH: boolean;
  flipV: boolean;
  crop?: CropRect | null;
  adjustments: ImageAdjustments;
};

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grayscale: false,
  sepia: false,
  invert: false,
  hueRotate: 0,
};

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function buildFilter(adj: ImageAdjustments): string {
  const parts: string[] = [];
  if (adj.brightness !== 0) {
    parts.push(`brightness(${100 + adj.brightness}%)`);
  }
  if (adj.contrast !== 0) {
    parts.push(`contrast(${100 + adj.contrast}%)`);
  }
  if (adj.saturation !== 0) {
    parts.push(`saturate(${100 + adj.saturation}%)`);
  }
  if (adj.blur > 0) parts.push(`blur(${adj.blur}px)`);
  if (adj.grayscale) parts.push("grayscale(100%)");
  if (adj.sepia) parts.push("sepia(100%)");
  if (adj.invert) parts.push("invert(100%)");
  if (adj.hueRotate) parts.push(`hue-rotate(${adj.hueRotate}deg)`);
  return parts.join(" ") || "none";
}

export function drawProcessedCanvas(
  source: HTMLImageElement | HTMLCanvasElement,
  options: ProcessOptions
): HTMLCanvasElement {
  const srcW = source.width;
  const srcH = source.height;

  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (options.crop && options.crop.width > 0 && options.crop.height > 0) {
    sx = Math.max(0, Math.round(options.crop.x));
    sy = Math.max(0, Math.round(options.crop.y));
    sw = Math.min(srcW - sx, Math.round(options.crop.width));
    sh = Math.min(srcH - sy, Math.round(options.crop.height));
  }

  const rot = ((options.rotate % 360) + 360) % 360;
  const rad = (rot * Math.PI) / 180;
  const swapDims = rot === 90 || rot === 270;

  let targetW = options.width && options.width > 0 ? options.width : sw;
  let targetH = options.height && options.height > 0 ? options.height : sh;

  if (options.maintainAspect !== false) {
    if (options.width && options.width > 0 && (!options.height || options.height <= 0)) {
      targetH = Math.round((sh / sw) * options.width);
    } else if (options.height && options.height > 0 && (!options.width || options.width <= 0)) {
      targetW = Math.round((sw / sh) * options.height);
    } else if (options.width && options.height && options.width > 0 && options.height > 0) {
      const ratio = Math.min(options.width / sw, options.height / sh);
      targetW = Math.round(sw * ratio);
      targetH = Math.round(sh * ratio);
    }
  }

  const canvasW = swapDims ? targetH : targetW;
  const canvasH = swapDims ? targetW : targetH;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, canvasW);
  canvas.height = Math.max(1, canvasH);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = buildFilter(options.adjustments);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
  ctx.drawImage(source, sx, sy, sw, sh, -targetW / 2, -targetH / 2, targetW, targetH);
  ctx.restore();

  return canvas;
}

function encodeBMP(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelDataSize, true);

  const pixels = imageData.data;
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      view.setUint8(offset++, pixels[i + 2]);
      view.setUint8(offset++, pixels[i + 1]);
      view.setUint8(offset++, pixels[i]);
    }
    offset += rowSize - width * 3;
  }

  return new Blob([buffer], { type: "image/bmp" });
}

/** Minimal single-frame GIF (no animation) via palette quantization. */
function encodeGIF(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);

  const palette: number[] = [];
  const colorMap = new Map<number, number>();

  const quantize = (r: number, g: number, b: number) => {
    const qr = r & 0xe0;
    const qg = g & 0xe0;
    const qb = b & 0xe0;
    return (qr << 16) | (qg << 8) | qb;
  };

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const key = quantize(data[i], data[i + 1], data[i + 2]);
    if (!colorMap.has(key) && palette.length < 256) {
      colorMap.set(key, palette.length);
      palette.push(key);
    }
  }
  if (palette.length === 0) palette.push(0);

  while (palette.length < 256) palette.push(0);

  const indices = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    if (data[i + 3] < 128) {
      indices[p] = 0;
      continue;
    }
    const key = quantize(data[i], data[i + 1], data[i + 2]);
    indices[p] = colorMap.get(key) ?? 0;
  }

  const parts: number[] = [];
  const push = (...bytes: number[]) => parts.push(...bytes);
  const pushStr = (s: string) => {
    for (let i = 0; i < s.length; i++) push(s.charCodeAt(i));
  };

  pushStr("GIF89a");
  push(width & 0xff, (width >> 8) & 0xff, height & 0xff, (height >> 8) & 0xff);
  push(0xf7, 0x00, 0x00);

  for (let i = 0; i < 256; i++) {
    const c = palette[i];
    push((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff);
  }

  // Graphic control — transparency index 0 optional
  push(0x21, 0xf9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00);

  push(0x2c, 0x00, 0x00, 0x00, 0x00);
  push(width & 0xff, (width >> 8) & 0xff, height & 0xff, (height >> 8) & 0xff);
  push(0x00);

  // LZW encode (min code size 8)
  const minCodeSize = 8;
  push(minCodeSize);
  const clear = 1 << minCodeSize;
  const eoi = clear + 1;

  const bitstream: number[] = [];
  let bitBuf = 0;
  let bitCount = 0;
  const writeBits = (code: number, size: number) => {
    bitBuf |= code << bitCount;
    bitCount += size;
    while (bitCount >= 8) {
      bitstream.push(bitBuf & 0xff);
      bitBuf >>= 8;
      bitCount -= 8;
    }
  };

  let codeSize = minCodeSize + 1;
  let nextCode = eoi + 1;
  const table = new Map<string, number>();
  for (let i = 0; i < clear; i++) table.set(String.fromCharCode(i), i);

  writeBits(clear, codeSize);
  let w = String.fromCharCode(indices[0]);
  for (let i = 1; i < indices.length; i++) {
    const k = String.fromCharCode(indices[i]);
    const wk = w + k;
    if (table.has(wk)) {
      w = wk;
    } else {
      writeBits(table.get(w)!, codeSize);
      if (nextCode < 4096) {
        table.set(wk, nextCode++);
        if (nextCode === 1 << codeSize && codeSize < 12) codeSize++;
      } else {
        writeBits(clear, codeSize);
        table.clear();
        for (let c = 0; c < clear; c++) table.set(String.fromCharCode(c), c);
        nextCode = eoi + 1;
        codeSize = minCodeSize + 1;
      }
      w = k;
    }
  }
  writeBits(table.get(w)!, codeSize);
  writeBits(eoi, codeSize);
  if (bitCount > 0) bitstream.push(bitBuf & 0xff);

  for (let i = 0; i < bitstream.length; i += 255) {
    const chunk = bitstream.slice(i, i + 255);
    push(chunk.length, ...chunk);
  }
  push(0x00, 0x3b);

  return new Blob([new Uint8Array(parts)], { type: "image/gif" });
}

function encodeICO(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const size = Math.min(256, Math.max(canvas.width, canvas.height));
    const icoCanvas = document.createElement("canvas");
    icoCanvas.width = size;
    icoCanvas.height = size;
    const ctx = icoCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    const scale = Math.min(size / canvas.width, size / canvas.height);
    const w = Math.round(canvas.width * scale);
    const h = Math.round(canvas.height * scale);
    ctx.drawImage(canvas, (size - w) / 2, (size - h) / 2, w, h);

    icoCanvas.toBlob(async (pngBlob) => {
      if (!pngBlob) {
        reject(new Error("Failed to encode ICO"));
        return;
      }
      const png = new Uint8Array(await pngBlob.arrayBuffer());
      const header = new ArrayBuffer(22);
      const view = new DataView(header);
      view.setUint16(0, 0, true);
      view.setUint16(2, 1, true);
      view.setUint16(4, 1, true);
      view.setUint8(6, size >= 256 ? 0 : size);
      view.setUint8(7, size >= 256 ? 0 : size);
      view.setUint16(8, 0, true);
      view.setUint16(10, 1, true);
      view.setUint16(12, 32, true);
      view.setUint32(14, png.length, true);
      view.setUint32(18, 22, true);
      resolve(
        new Blob([header, png], { type: "image/x-icon" })
      );
    }, "image/png");
  });
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  const meta = OUTPUT_FORMATS.find((f) => f.id === format)!;
  const q = Math.min(1, Math.max(0.01, quality));

  if (format === "bmp") return encodeBMP(canvas);
  if (format === "gif") return encodeGIF(canvas);
  if (format === "ico") return encodeICO(canvas);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback when AVIF unsupported
          if (format === "avif") {
            canvas.toBlob(
              (fallback) =>
                fallback
                  ? resolve(fallback)
                  : reject(new Error("Export failed")),
              "image/webp",
              q
            );
            return;
          }
          reject(new Error(`Export as ${meta.label} failed in this browser`));
          return;
        }
        resolve(blob);
      },
      meta.mime,
      q
    );
  });
}

export async function processImage(
  source: HTMLImageElement | HTMLCanvasElement,
  options: ProcessOptions
): Promise<{ blob: Blob; width: number; height: number; canvas: HTMLCanvasElement }> {
  const canvas = drawProcessedCanvas(source, options);
  const blob = await canvasToBlob(canvas, options.format, options.quality);
  return { blob, width: canvas.width, height: canvas.height, canvas };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
