import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_NAME, SUPPORT_EMAIL, SITE_URL } from "@/lib/site";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Support",
  description: `Contact ${SITE_NAME} at ${SUPPORT_EMAIL}. Get help with conversion, privacy requests, AdSense questions, or report an issue.`,
  path: "/contact",
  keywords: [
    "CS Image Converter contact",
    "image converter support",
    "Code Splitters contact",
    SUPPORT_EMAIL,
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            "@id": absoluteUrl("/contact"),
            name: `Contact ${SITE_NAME}`,
            url: absoluteUrl("/contact"),
            description: `Support and inquiries for ${SITE_NAME}.`,
            mainEntity: {
              "@type": "Organization",
              name: OPERATOR_NAME,
              email: SUPPORT_EMAIL,
              url: SITE_URL,
            },
          },
        ]}
      />
      <LegalPage title="Contact" updated="July 14, 2026">
        <p>
          We’d like to hear from you. For support, privacy requests, advertising / AdSense questions,
          copyright notices, or general feedback, email:
        </p>
        <p className="contact-email">
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${SITE_NAME} support`)}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p>
          Operator: {OPERATOR_NAME}
          <br />
          Product: {SITE_NAME}
        </p>
        <h2>What to include</h2>
        <ul>
          <li>A clear subject line (e.g. “Privacy request”, “AdSense / ads”, “Bug report”)</li>
          <li>Your browser and device if reporting a technical issue</li>
          <li>Screenshots when helpful (do not include private image content unless necessary)</li>
        </ul>
        <p>
          We aim to respond within a few business days. Related policies:{" "}
          <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link>
        </p>
      </LegalPage>
    </>
  );
}
