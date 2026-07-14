import Link from "next/link";
import { OPERATOR_NAME, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";
import { SiteHeader } from "./SiteHeader";

export { SiteHeader };

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <Link href="/" className="footer-logo">
            <span className="brand-mark" aria-hidden>
              CS
            </span>
            <span>{SITE_NAME}</span>
          </Link>
          <p className="footer-copy">
            Professional browser-based image conversion, resize, and editing. Your files stay on
            your device—never uploaded.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h2 className="footer-heading">Product</h2>
            <nav aria-label="Product">
              <Link href="/#converter">Converter</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#formats">Formats</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Legal</h2>
            <nav aria-label="Legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Support</h2>
            <p className="footer-support-label">Email</p>
            <a className="footer-email" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            <p className="footer-operator">Operated by {OPERATOR_NAME}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-legal">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
        <p className="footer-legal footer-legal--quiet">
          Built for creators who value privacy and speed.
        </p>
      </div>
    </footer>
  );
}
