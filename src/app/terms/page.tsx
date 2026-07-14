import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}. Rules for using our free image converter, advertising, and liability limitations.`,
  path: "/terms",
  keywords: [
    "CS Image Converter terms",
    "image converter terms of service",
    "free image converter terms",
  ],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ])}
      />
    <LegalPage title="Terms of Service" updated="July 14, 2026">
      <p>
        These Terms of Service (“Terms”) govern your use of {SITE_NAME} at {SITE_URL}, operated by{" "}
        {OPERATOR_NAME} (“we”, “us”). By using the Service, you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        {SITE_NAME} provides free tools to convert, resize, and edit images. Advertising (including
        Google AdSense) may appear to support the Service. For help, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>2. Acceptable use</h2>
      <ul>
        <li>Use the Service only for lawful purposes.</li>
        <li>
          Do not attempt to disrupt, reverse engineer, or abuse the Service, ads, or underlying
          infrastructure.
        </li>
        <li>
          You are solely responsible for the images you process and for having the rights to use
          them.
        </li>
        <li>
          Do not use the Service to process illegal, harmful, or infringing content.
        </li>
      </ul>

      <h2>3. No account required</h2>
      <p>
        The core converter does not require registration. Features may change or be limited without
        notice.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The {SITE_NAME} name, branding, and site design are owned by us or our licensors. You retain
        ownership of your images. We do not claim rights to files you process locally.
      </p>

      <h2>5. Disclaimer of warranties</h2>
      <p>
        The Service is provided “as is” and “as available” without warranties of any kind, express
        or implied, including merchantability, fitness for a particular purpose, and
        non-infringement. We do not guarantee uninterrupted availability, error-free conversion, or
        compatibility with every file or browser.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {OPERATOR_NAME} and {SITE_NAME} are not liable for
        any indirect, incidental, special, consequential, or exemplary damages, or any loss of
        data, profits, or goodwill arising from your use of the Service. Our total liability for any
        claim relating to the Service shall not exceed USD $0, as the Service is provided free of
        charge.
      </p>

      <h2>7. Advertising</h2>
      <p>
        Third-party ads may appear on the site. We are not responsible for advertisers’ content,
        products, or privacy practices. See our{" "}
        <Link href="/privacy">Privacy Policy</Link> for more on cookies and AdSense.
      </p>

      <h2>8. Privacy</h2>
      <p>
        Your use of the Service is also governed by our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may modify these Terms at any time. The “Last updated” date will be revised when changes
        are posted. Continued use constitutes acceptance of the updated Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        <br />
        <Link href="/contact">Contact page</Link>
      </p>
    </LegalPage>
    </>
  );
}
