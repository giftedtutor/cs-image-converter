import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle data, cookies, analytics, and Google AdSense advertising. Images are processed locally and never uploaded.`,
  path: "/privacy",
  keywords: [
    "CS Image Converter privacy policy",
    "image converter privacy",
    "AdSense privacy policy",
    "no upload image converter",
  ],
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
    <LegalPage title="Privacy Policy" updated="July 14, 2026">
      <p>
        This Privacy Policy explains how {SITE_NAME} (“we”, “us”, or “our”), operated by{" "}
        {OPERATOR_NAME}, collects, uses, and protects information when you use {SITE_URL} and
        related pages (the “Service”).
      </p>

      <h2>1. Summary</h2>
      <p>
        When you use the converter, image conversion and editing are handled on your own device.
        We do not ask you to create an account for the core tool, and we do not receive or store
        the picture files you convert. For support, contact{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>2. Information we do not collect from the converter</h2>
      <ul>
        <li>Your original or converted image files</li>
        <li>Image contents or previews from your conversion session</li>
        <li>Accounts, passwords, or payment details for using the core tool</li>
      </ul>

      <h2>3. Information that may be collected</h2>
      <p>Depending on how you use the site and which third parties load, we or partners may process:</p>
      <ul>
        <li>
          <strong>Contact information</strong> you voluntarily send to us (for example, emails to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>).
        </li>
        <li>
          <strong>Technical / usage data</strong> such as IP address, browser type, device type,
          general location (derived from IP), pages visited, and referral URLs — typically via
          hosting logs, analytics, or advertising partners.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> used for essential site function,
          analytics, and advertising (see below).
        </li>
      </ul>

      <h2>4. Google AdSense and advertising</h2>
      <p>
        We may display ads served by Google AdSense or similar networks. Third-party vendors,
        including Google, use cookies to serve ads based on a user’s prior visits to this website
        or other websites. Google’s use of advertising cookies enables it and its partners to serve
        ads based on your visit to this and/or other sites.
      </p>
      <p>
        Users may opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Ads Settings
        </a>
        . You can also learn more about how Google uses data at{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          How Google uses information from sites or apps that use our services
        </a>
        .
      </p>
      <p>
        We do not control these third-party cookies. Their privacy practices are governed by their
        own policies.
      </p>

      <h2>5. Analytics</h2>
      <p>
        We may use privacy-conscious or third-party analytics to understand aggregate traffic (for
        example, page views). Analytics providers may set cookies or similar identifiers subject to
        their own policies.
      </p>

      <h2>6. How we use information</h2>
      <ul>
        <li>Operate, maintain, and improve the Service</li>
        <li>Respond to support requests sent to {SUPPORT_EMAIL}</li>
        <li>Measure performance and diagnose technical issues</li>
        <li>Show advertising that helps keep the Service free</li>
        <li>Comply with applicable law</li>
      </ul>

      <h2>7. Legal bases (EEA/UK users)</h2>
      <p>
        Where applicable, we process personal data based on consent (for non-essential cookies/ads
        where required), legitimate interests (site security, basic analytics, improving the
        Service), and/or performance of a request you make when contacting us.
      </p>

      <h2>8. Children’s privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age in your jurisdiction).
        We do not knowingly collect personal information from children. If you believe a child has
        provided us information, contact {SUPPORT_EMAIL} and we will take appropriate steps.
      </p>

      <h2>9. Data retention</h2>
      <p>
        Picture files you convert are not stored by us. Emails you send to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> (and related replies) may be kept
        as needed to respond and for ordinary business records. Server logs and
        advertising/analytics data retention follow the policies of those providers.
      </p>

      <h2>10. International transfers</h2>
      <p>
        If you access the Service from outside the country where our hosting or partners operate,
        your information may be processed in other countries that may have different data
        protection laws.
      </p>

      <h2>11. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or restrict
        processing of personal data, or to object to certain processing and withdraw consent. To
        exercise rights related to information we hold (for example, emails you sent us), contact{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. For advertising opt-outs, use the
        Google settings linked above.
      </p>

      <h2>12. Third-party links</h2>
      <p>
        The Service may link to third-party websites. We are not responsible for their content or
        privacy practices.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated” date at the top
        will change when we do. Continued use of the Service after changes means you accept the
        updated policy.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about this Privacy Policy or privacy practices:
        <br />
        {OPERATOR_NAME} / {SITE_NAME}
        <br />
        Email:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        <br />
        Also see our <Link href="/contact">Contact</Link> page and{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
    </>
  );
}
