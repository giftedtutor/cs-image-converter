import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME } from "@/lib/site";
import {
  SITE_DESCRIPTION,
  createPageMetadata,
  faqJsonLd,
  howToJsonLd,
  webAppJsonLd,
} from "@/lib/seo";

const FeaturesSection = dynamic(
  () =>
    import("@/components/MarketingSections").then((m) => m.FeaturesSection),
  { loading: () => null }
);

const FormatsSection = dynamic(
  () =>
    import("@/components/MarketingSections").then((m) => m.FormatsSection),
  { loading: () => null }
);

const PrivacySection = dynamic(
  () =>
    import("@/components/MarketingSections").then((m) => m.PrivacySection),
  { loading: () => null }
);

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
