import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { JsonLd } from "@/components/JsonLd";
import {
  FeaturesSection,
  FormatsSection,
  PrivacySection,
} from "@/components/MarketingSections";
import { SITE_NAME } from "@/lib/site";
import {
  SITE_DESCRIPTION,
  createPageMetadata,
  faqJsonLd,
  howToJsonLd,
  webAppJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_NAME} — Free Online Image Converter, Resize & Editor`,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[webAppJsonLd(), howToJsonLd(), faqJsonLd()]} />
      <ImageWorkspace />
      <FeaturesSection />
      <FormatsSection />
      <PrivacySection />
    </>
  );
}
