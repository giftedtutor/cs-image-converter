import type { Metadata } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { OPERATOR_NAME, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Free Online Image Converter & Editor`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Convert PNG, JPEG, WebP, GIF, BMP, AVIF and more in your browser with CS Image Converter. Resize, rotate, flip, compress, and adjust images privately—free, no upload required.",
  keywords: [
    "CS Image Converter",
    "image converter",
    "png to jpeg",
    "jpeg to png",
    "webp converter",
    "gif converter",
    "resize image",
    "compress image",
    "free image editor",
    "convert image online",
    "private image converter",
  ],
  authors: [{ name: OPERATOR_NAME }],
  creator: OPERATOR_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "utilities",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free Online Image Converter & Editor`,
    description:
      "Convert any image format, resize for social and screens, and polish with adjustments—entirely in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Image Converter & Editor`,
    description:
      "PNG, JPEG, WebP, GIF and more. Convert, resize, and edit privately in the browser.",
  },
  robots: {
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
  verification: {},
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#14201c",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: siteUrl,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and HTML5 Canvas",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free browser-based image converter with resize, rotate, flip, compression, and color adjustments.",
      featureList: [
        "Convert between PNG, JPEG, WebP, GIF, BMP, AVIF, ICO",
        "Resize with presets and custom dimensions",
        "Rotate and flip",
        "Brightness, contrast, saturation, hue, blur",
        "Grayscale, sepia, invert filters",
        "Batch convert multiple images",
        "Client-side private processing",
      ],
      provider: {
        "@type": "Organization",
        name: OPERATOR_NAME,
        email: SUPPORT_EMAIL,
        url: siteUrl,
      },
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/#converter`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Is ${SITE_NAME} free?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes. ${SITE_NAME} is free to use with no account and no uploads.`,
          },
        },
        {
          "@type": "Question",
          name: "Are my images uploaded?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All conversion and editing happens locally in your browser.",
          },
        },
        {
          "@type": "Question",
          name: "Which formats can I convert?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can convert between PNG, JPEG, WebP, GIF, BMP, AVIF, and ICO, and open most formats browsers can decode including SVG.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${instrument.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
