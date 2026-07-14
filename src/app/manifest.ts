import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description:
      "Convert, resize, and edit images privately in your browser. PNG, JPEG, WebP, GIF, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f8f5",
    theme_color: "#14201c",
    categories: ["utilities", "productivity", "photo"],
  };
}
