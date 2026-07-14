import { ImageResponse } from "next/og";

export const alt = "CS Image Converter — Free private online image converter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #eef5f0 0%, #f4f8f5 42%, #e8f0ea 100%)",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-60px",
            width: "420px",
            height: "420px",
            borderRadius: "999px",
            background: "rgba(31, 111, 91, 0.18)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-80px",
            bottom: "-100px",
            width: "380px",
            height: "380px",
            borderRadius: "999px",
            background: "rgba(196, 92, 38, 0.14)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(145deg, #14201c 0%, #1f6f5b 100%)",
              color: "#f4f8f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            CS
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#14201c",
              letterSpacing: "-0.02em",
            }}
          >
            CS Image Converter
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#14201c",
              letterSpacing: "-0.04em",
            }}
          >
            Convert any image. Privately. Free.
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#2a3b34",
              lineHeight: 1.35,
              maxWidth: "780px",
            }}
          >
            PNG · JPEG · WebP · GIF · BMP · AVIF · ICO — resize, rotate, and edit in your browser.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#1f6f5b",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          <span>No uploads · Private by design</span>
          <span>image-converter.thecodesplitter.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
