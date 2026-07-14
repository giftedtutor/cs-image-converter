import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

const FEATURES = [
  {
    title: "Any format to any format",
    body: "Convert PNG, JPEG, WebP, GIF, BMP, AVIF, ICO, and more—side by side with live preview.",
  },
  {
    title: "Resize with intent",
    body: "Exact dimensions, locked aspect ratios, and ready-made presets for social and screen sizes.",
  },
  {
    title: "Transform & polish",
    body: "Rotate, flip, brightness, contrast, saturation, hue, blur, grayscale, sepia, and invert.",
  },
  {
    title: "Private by design",
    body: "Your images stay on your device. Nothing is sent away for conversion—open, convert, and download with peace of mind.",
  },
];

export function FeaturesSection() {
  return (
    <section className="features" id="features" aria-labelledby="features-heading">
      <h2 id="features-heading">Built for the whole workflow</h2>
      <p className="section-lead">
        One simple workspace for conversion, resizing, and finishing—right where you need it.
      </p>
      <ul className="feature-list">
        {FEATURES.map((f) => (
          <li key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FORMAT_ROWS = [
  { from: "PNG", to: "JPEG, WebP, GIF, BMP, AVIF, ICO" },
  { from: "JPEG / JPG", to: "PNG, WebP, GIF, BMP, AVIF, ICO" },
  { from: "WebP", to: "PNG, JPEG, GIF, BMP, AVIF, ICO" },
  { from: "GIF", to: "PNG, JPEG, WebP, BMP, AVIF, ICO" },
  { from: "BMP / AVIF / SVG", to: "PNG, JPEG, WebP, GIF, BMP, ICO" },
];

export function FormatsSection() {
  return (
    <section className="formats" id="formats" aria-labelledby="formats-heading">
      <h2 id="formats-heading">Formats that matter</h2>
      <p className="section-lead">
        Start with nearly any common image type. Export to the format you need in a few clicks.
      </p>
      <div className="format-table" role="table" aria-label="Supported conversions">
        <div className="format-row format-row--head" role="row">
          <span role="columnheader">From</span>
          <span role="columnheader">To</span>
        </div>
        {FORMAT_ROWS.map((row) => (
          <div className="format-row" role="row" key={row.from}>
            <span role="cell">{row.from}</span>
            <span role="cell">{row.to}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section className="privacy" id="privacy" aria-labelledby="privacy-heading">
      <h2 id="privacy-heading">Your images stay yours</h2>
      <p>
        CS Image Converter is built for privacy. Your files are handled on your device for
        conversion and editing—we don’t require an account, and your pictures aren’t stored with
        us. Close the tab when you’re done and you’re finished.
      </p>
      <p>
        For cookies, advertising, and your rights under privacy law, read the full{" "}
        <Link href="/privacy">Privacy Policy</Link>. Need help? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </section>
  );
}
