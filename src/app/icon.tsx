import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #14201c 0%, #1f6f5b 100%)",
          borderRadius: 8,
          color: "#f4f8f5",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 0.5,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        CS
      </div>
    ),
    { ...size }
  );
}
