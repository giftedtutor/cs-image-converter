export type OutputFormat =
  | "png"
  | "jpeg"
  | "webp"
  | "bmp"
  | "gif"
  | "avif"
  | "ico";

export const OUTPUT_FORMATS: {
  id: OutputFormat;
  label: string;
  mime: string;
  extension: string;
}[] = [
  { id: "png", label: "PNG", mime: "image/png", extension: "png" },
  { id: "jpeg", label: "JPEG", mime: "image/jpeg", extension: "jpg" },
  { id: "webp", label: "WebP", mime: "image/webp", extension: "webp" },
  { id: "bmp", label: "BMP", mime: "image/bmp", extension: "bmp" },
  { id: "gif", label: "GIF", mime: "image/gif", extension: "gif" },
  { id: "avif", label: "AVIF", mime: "image/avif", extension: "avif" },
  { id: "ico", label: "ICO", mime: "image/x-icon", extension: "ico" },
];

export const ACCEPT_TYPES =
  "image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp,.avif,.ico,.svg,.tiff,.tif,.heic,.heif";

export const RESIZE_PRESETS = [
  { label: "Original", width: 0, height: 0 },
  { label: "Instagram Square", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "Twitter / X", width: 1200, height: 675 },
  { label: "Facebook Cover", width: 820, height: 312 },
  { label: "YouTube Thumb", width: 1280, height: 720 },
  { label: "HD 1920×1080", width: 1920, height: 1080 },
  { label: "4K 3840×2160", width: 3840, height: 2160 },
  { label: "Icon 512", width: 512, height: 512 },
  { label: "Icon 256", width: 256, height: 256 },
  { label: "Favicon 32", width: 32, height: 32 },
] as const;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function swapExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^.]+$/, "") || "image";
  return `${base}.${ext}`;
}
