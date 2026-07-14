import type { Metadata } from "next";
import {
  OPERATOR_NAME,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

export const SITE_DESCRIPTION =
  "Free online image converter by Code Splitters. Convert PNG, JPEG, WebP, GIF, BMP, AVIF & ICO in your browser. Resize, rotate, compress, and edit privately—no upload required.";

export const SITE_KEYWORDS = [
  "CS Image Converter",
  "free image converter",
  "png to jpeg",
  "jpeg to png",
  "png to webp",
  "webp to png",
  "gif converter",
  "bmp converter",
  "avif converter",
  "ico converter",
  "convert image online",
  "resize image online",
  "compress image",
  "image editor online",
  "private image converter",
  "browser image converter",
  "no upload image converter",
];

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = SITE_KEYWORDS,
  type = "website",
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} · ${SITE_NAME}`;

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    keywords,
    authors: [{ name: OPERATOR_NAME, url: SITE_URL }],
    creator: OPERATOR_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: "utilities",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: path,
      languages: {
        "en-US": path,
        en: path,
      },
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — free private image converter`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/twitter-image"],
      creator: "@thecodesplitter",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    other: {
      "msapplication-TileColor": "#14201c",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: OPERATOR_NAME,
    url: SITE_URL,
    email: SUPPORT_EMAIL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SUPPORT_EMAIL,
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function webAppJsonLd() {
  return {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "ImageConverter",
    operatingSystem: "Any",
    browserRequirements: "Requires HTML5 Canvas and JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: SITE_DESCRIPTION,
    featureList: [
      "Convert between PNG, JPEG, WebP, GIF, BMP, AVIF, ICO",
      "Resize with presets and custom dimensions",
      "Rotate and flip",
      "Brightness, contrast, saturation, hue, blur",
      "Grayscale, sepia, invert filters",
      "Batch convert multiple images",
      "Client-side private processing",
    ],
    provider: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };
}

export function faqJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${SITE_NAME} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${SITE_NAME} is completely free to use with no account and no file uploads.`,
        },
      },
      {
        "@type": "Question",
        name: "Are my images uploaded to a server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. All conversion and editing happens locally in your browser. Your images never leave your device.",
        },
      },
      {
        "@type": "Question",
        name: "Which image formats can I convert?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can convert between PNG, JPEG, WebP, GIF, BMP, AVIF, and ICO. The tool can open most formats browsers can decode, including SVG.",
        },
      },
      {
        "@type": "Question",
        name: "Can I resize images as well as convert them?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can set custom width and height, lock aspect ratio, or use presets for Instagram, YouTube, HD, favicons, and more.",
        },
      },
      {
        "@type": "Question",
        name: "Does CS Image Converter work on mobile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The converter is fully responsive and works on phones, tablets, and desktop browsers.",
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function howToJsonLd() {
  return {
    "@type": "HowTo",
    name: `How to convert an image with ${SITE_NAME}`,
    description:
      "Convert any image format in your browser privately with CS Image Converter.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        name: "Upload an image",
        text: "Drop an image into the upload area or click to browse your files.",
      },
      {
        "@type": "HowToStep",
        name: "Choose output format and options",
        text: "Select PNG, JPEG, WebP, GIF, BMP, AVIF, or ICO. Optionally resize, rotate, or adjust the image.",
      },
      {
        "@type": "HowToStep",
        name: "Convert and download",
        text: "Click Convert, preview the result, then download your file.",
      },
    ],
  };
}
