"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import {
  OUTPUT_FORMATS,
  RESIZE_PRESETS,
  formatBytes,
  getExtension,
  swapExtension,
  type OutputFormat,
} from "@/lib/formats";
import {
  DEFAULT_ADJUSTMENTS,
  downloadBlob,
  loadImageFromFile,
  processImage,
  type ImageAdjustments,
  type ProcessOptions,
} from "@/lib/image-processor";
import { UploadZone } from "./UploadZone";

type ImageItem = {
  id: string;
  file: File;
  name: string;
  sourceUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  image: HTMLImageElement;
};

type ResultState = {
  url: string;
  blob: Blob;
  width: number;
  height: number;
  name: string;
};

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        <em>
          {value}
          {suffix}
        </em>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function ImageWorkspace() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(0.92);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState<"convert" | "resize" | "transform" | "adjust">("convert");
  const [, startTransition] = useTransition();
  const resultUrlRef = useRef<string | null>(null);

  const active = items.find((i) => i.id === activeId) ?? items[0] ?? null;

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.sourceUrl));
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revokeResult = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResult(null);
  }, []);

  const onFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      const next: ImageItem[] = [];
      for (const file of files) {
        try {
          const image = await loadImageFromFile(file);
          const sourceUrl = URL.createObjectURL(file);
          next.push({
            id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
            file,
            name: file.name,
            sourceUrl,
            naturalWidth: image.naturalWidth || image.width,
            naturalHeight: image.naturalHeight || image.height,
            image,
          });
        } catch {
          setError(`Could not load “${file.name}”. Try another file.`);
        }
      }
      if (!next.length) return;
      startTransition(() => {
        setItems((prev) => [...prev, ...next]);
        setActiveId(next[0].id);
        setWidth(next[0].naturalWidth);
        setHeight(next[0].naturalHeight);
        revokeResult();
      });
      window.setTimeout(() => {
        document.querySelector(".workspace")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    },
    [revokeResult]
  );

  useEffect(() => {
    if (!active) return;
    setWidth(active.naturalWidth);
    setHeight(active.naturalHeight);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    revokeResult();
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAdj = <K extends keyof ImageAdjustments>(key: K, value: ImageAdjustments[K]) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  const onWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && active && active.naturalWidth > 0) {
      setHeight(Math.round((active.naturalHeight / active.naturalWidth) * w));
    }
  };

  const onHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && active && active.naturalHeight > 0) {
      setWidth(Math.round((active.naturalWidth / active.naturalHeight) * h));
    }
  };

  const applyPreset = (pw: number, ph: number) => {
    if (!active) return;
    if (pw === 0 && ph === 0) {
      setWidth(active.naturalWidth);
      setHeight(active.naturalHeight);
      return;
    }
    setWidth(pw);
    setHeight(ph);
  };

  const buildOptions = (): ProcessOptions => ({
    format,
    quality,
    width: width || undefined,
    height: height || undefined,
    maintainAspect: lockAspect,
    rotate,
    flipH,
    flipV,
    crop: null,
    adjustments,
  });

  const runConvert = async () => {
    if (!active) return;
    setBusy(true);
    setError(null);
    try {
      const { blob, width: w, height: h } = await processImage(active.image, buildOptions());
      const meta = OUTPUT_FORMATS.find((f) => f.id === format)!;
      const name = swapExtension(active.name, meta.extension);
      revokeResult();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({ url, blob, width: w, height: h, name });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  const convertAll = async () => {
    if (!items.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const item of items) {
        const { blob } = await processImage(item.image, buildOptions());
        const meta = OUTPUT_FORMATS.find((f) => f.id === format)!;
        downloadBlob(blob, swapExtension(item.name, meta.extension));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch conversion failed");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) URL.revokeObjectURL(found.sourceUrl);
      const next = prev.filter((i) => i.id !== id);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      return next;
    });
    revokeResult();
  };

  const resetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    if (active) {
      setWidth(active.naturalWidth);
      setHeight(active.naturalHeight);
    }
  };

  return (
    <>
      <section
        className={`hero ${items.length ? "hero--active" : ""}`}
        aria-labelledby="hero-brand"
        id="converter"
      >
        <div className="hero-atmosphere" aria-hidden>
          <div className="hero-grid" />
          <div className="hero-glow hero-glow--a" />
          <div className="hero-glow hero-glow--b" />
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Browser-native image studio</p>
            <h1 id="hero-brand" className="hero-brand">
              <span className="hero-brand-cs">CS</span>
              <span className="hero-brand-rest">Image Converter</span>
            </h1>
            <p className="hero-lead">
              Convert any image to any format. Resize, rotate, and refine—privately, instantly,
              free.
            </p>
            <ul className="hero-formats" aria-label="Supported formats">
              {["PNG", "JPEG", "WebP", "GIF", "BMP", "AVIF", "ICO"].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {items.length > 0 && (
              <p className="hero-status">
                {items.length} image{items.length === 1 ? "" : "s"} ready · edit below
              </p>
            )}
          </div>

          <div className="hero-upload">
            <UploadZone onFiles={onFiles} variant="hero" />
          </div>
        </div>
      </section>

      {items.length > 0 && (
        <section className="workspace" aria-labelledby="workspace-heading">
          <div className="workspace-intro">
            <h2 id="workspace-heading">Convert &amp; refine</h2>
            <p>All processing happens in your browser. Your images never leave this device.</p>
          </div>

          <div className="workspace-grid">
            <aside className="filmstrip" aria-label="Uploaded images">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`thumb ${item.id === active?.id ? "is-active" : ""}`}
                  onClick={() => setActiveId(item.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.sourceUrl} alt="" />
                  <span className="thumb-meta">
                    {getExtension(item.name).toUpperCase() || "IMG"}
                  </span>
                  <span
                    className="thumb-remove"
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${item.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        removeItem(item.id);
                      }
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
              <UploadZone onFiles={onFiles} compact />
            </aside>

            <div className="preview-stack">
              <div className="preview-pane">
                <header className="preview-header">
                  <span>Original</span>
                  {active && (
                    <span>
                      {active.naturalWidth}×{active.naturalHeight} · {formatBytes(active.file.size)}
                    </span>
                  )}
                </header>
                <div className="preview-frame">
                  {active && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={active.sourceUrl} alt={`Original ${active.name}`} />
                  )}
                </div>
              </div>

              <div className="preview-pane preview-pane--result">
                <header className="preview-header">
                  <span>Converted</span>
                  {result && (
                    <span>
                      {result.width}×{result.height} · {formatBytes(result.blob.size)}
                    </span>
                  )}
                </header>
                <div className="preview-frame">
                  {result ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result.url} alt={`Converted ${result.name}`} />
                  ) : (
                    <p className="preview-empty">Run convert to preview the result</p>
                  )}
                </div>
                {result && (
                  <div className="preview-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => downloadBlob(result.blob, result.name)}
                    >
                      Download {result.name}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="controls">
              <div className="tabs" role="tablist" aria-label="Editing tools">
                {(
                  [
                    ["convert", "Format"],
                    ["resize", "Resize"],
                    ["transform", "Transform"],
                    ["adjust", "Adjust"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={panel === id}
                    className={panel === id ? "is-active" : ""}
                    onClick={() => setPanel(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="panel" role="tabpanel">
                {panel === "convert" && (
                  <>
                    <p className="panel-hint">
                      Source: <strong>{active?.name}</strong> (
                      {getExtension(active?.name || "").toUpperCase() || "IMAGE"})
                    </p>
                    <div className="format-grid">
                      {OUTPUT_FORMATS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`format-chip ${format === f.id ? "is-active" : ""}`}
                          onClick={() => setFormat(f.id)}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    {(format === "jpeg" || format === "webp" || format === "avif") && (
                      <SliderField
                        label="Quality"
                        value={Math.round(quality * 100)}
                        min={1}
                        max={100}
                        suffix="%"
                        onChange={(v) => setQuality(v / 100)}
                      />
                    )}
                  </>
                )}

                {panel === "resize" && (
                  <>
                    <div className="dim-row">
                      <label className="field">
                        <span className="field-label">Width</span>
                        <input
                          type="number"
                          min={1}
                          value={width || ""}
                          onChange={(e) => onWidthChange(Number(e.target.value) || 0)}
                        />
                      </label>
                      <button
                        type="button"
                        className={`lock-btn ${lockAspect ? "is-active" : ""}`}
                        aria-pressed={lockAspect}
                        aria-label="Lock aspect ratio"
                        onClick={() => setLockAspect((v) => !v)}
                      >
                        {lockAspect ? "Locked" : "Free"}
                      </button>
                      <label className="field">
                        <span className="field-label">Height</span>
                        <input
                          type="number"
                          min={1}
                          value={height || ""}
                          onChange={(e) => onHeightChange(Number(e.target.value) || 0)}
                        />
                      </label>
                    </div>
                    <div className="preset-list">
                      {RESIZE_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          className="preset-chip"
                          onClick={() => applyPreset(p.width, p.height)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {panel === "transform" && (
                  <>
                    <div className="transform-row">
                      <button
                        type="button"
                        className="tool-btn"
                        onClick={() => setRotate((r) => r - 90)}
                      >
                        Rotate −90°
                      </button>
                      <button
                        type="button"
                        className="tool-btn"
                        onClick={() => setRotate((r) => r + 90)}
                      >
                        Rotate +90°
                      </button>
                      <button
                        type="button"
                        className={`tool-btn ${flipH ? "is-active" : ""}`}
                        onClick={() => setFlipH((v) => !v)}
                      >
                        Flip H
                      </button>
                      <button
                        type="button"
                        className={`tool-btn ${flipV ? "is-active" : ""}`}
                        onClick={() => setFlipV((v) => !v)}
                      >
                        Flip V
                      </button>
                    </div>
                    <SliderField
                      label="Fine rotate"
                      value={rotate}
                      min={-180}
                      max={180}
                      suffix="°"
                      onChange={setRotate}
                    />
                  </>
                )}

                {panel === "adjust" && (
                  <>
                    <SliderField
                      label="Brightness"
                      value={adjustments.brightness}
                      min={-100}
                      max={100}
                      onChange={(v) => setAdj("brightness", v)}
                    />
                    <SliderField
                      label="Contrast"
                      value={adjustments.contrast}
                      min={-100}
                      max={100}
                      onChange={(v) => setAdj("contrast", v)}
                    />
                    <SliderField
                      label="Saturation"
                      value={adjustments.saturation}
                      min={-100}
                      max={100}
                      onChange={(v) => setAdj("saturation", v)}
                    />
                    <SliderField
                      label="Hue"
                      value={adjustments.hueRotate}
                      min={0}
                      max={360}
                      suffix="°"
                      onChange={(v) => setAdj("hueRotate", v)}
                    />
                    <SliderField
                      label="Blur"
                      value={adjustments.blur}
                      min={0}
                      max={20}
                      step={0.5}
                      suffix="px"
                      onChange={(v) => setAdj("blur", v)}
                    />
                    <div className="filter-toggles">
                      {(
                        [
                          ["grayscale", "Grayscale"],
                          ["sepia", "Sepia"],
                          ["invert", "Invert"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className={`tool-btn ${adjustments[key] ? "is-active" : ""}`}
                          aria-pressed={adjustments[key]}
                          onClick={() => setAdj(key, !adjustments[key])}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {error && (
                <p className="error-banner" role="alert">
                  {error}
                </p>
              )}

              <div className="action-bar">
                <button type="button" className="btn btn-ghost" onClick={resetAdjustments}>
                  Reset
                </button>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={busy}
                    onClick={convertAll}
                  >
                    Convert all ({items.length})
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy || !active}
                  onClick={runConvert}
                >
                  {busy ? "Working…" : `Convert to ${format.toUpperCase()}`}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
