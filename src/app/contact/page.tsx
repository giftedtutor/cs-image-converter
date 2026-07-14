import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} support at ${SUPPORT_EMAIL}. Privacy, advertising, and general inquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
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
  );
}
