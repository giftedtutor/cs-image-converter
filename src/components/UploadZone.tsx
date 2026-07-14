"use client";

import { useCallback, useRef, useState } from "react";
import { ACCEPT_TYPES } from "@/lib/formats";

type UploadZoneProps = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  compact?: boolean;
  variant?: "default" | "hero";
};

export function UploadZone({
  onFiles,
  disabled,
  compact,
  variant = "default",
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | File[] | null) => {
      if (!list || disabled) return;
      const files = Array.from(list).filter((f) => f.type.startsWith("image/") || !f.type);
      if (files.length) onFiles(files);
    },
    [onFiles, disabled]
  );

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images"
      className={`upload-zone ${compact ? "upload-zone--compact" : ""} ${variant === "hero" ? "upload-zone--hero" : ""} ${dragging ? "is-dragging" : ""} ${disabled ? "is-disabled" : ""}`}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES}
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {compact ? (
        <span className="upload-plus" aria-hidden>
          +
        </span>
      ) : variant === "hero" ? (
        <>
          <div className="upload-hero-icon" aria-hidden>
            <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
              <path
                d="M24 34V14M24 14l-7 7M24 14l7 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 36h24a4 4 0 004-4V28"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="upload-title">Drop an image to convert</p>
          <p className="upload-sub">
            PNG · JPEG · WebP · GIF · BMP · AVIF · SVG — or click to browse
          </p>
          <span className="upload-cta">Upload image</span>
          <p className="upload-privacy">Private · stays in your browser</p>
        </>
      ) : (
        <>
          <div className="upload-orb" aria-hidden />
          <p className="upload-title">Drop images here</p>
          <p className="upload-sub">
            or click to browse · PNG, JPEG, WebP, GIF, BMP, AVIF, SVG &amp; more
          </p>
          <span className="upload-cta">Choose files</span>
        </>
      )}
    </div>
  );
}
