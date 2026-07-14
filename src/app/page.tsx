import { ImageWorkspace } from "@/components/ImageWorkspace";
import {
  FeaturesSection,
  FormatsSection,
  PrivacySection,
} from "@/components/MarketingSections";

export default function HomePage() {
  return (
    <>
      <ImageWorkspace />
      <FeaturesSection />
      <FormatsSection />
      <PrivacySection />
    </>
  );
}
