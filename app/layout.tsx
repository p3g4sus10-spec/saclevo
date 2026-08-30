import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { isIndexableEnvironment, SITE } from "@/config/site";
import { RUNTIME_GATES } from "@/config/gates";
import { PRODUCT_ROUTES } from "@/config/offers";
import AnalyticsPageView from "@/components/AnalyticsPageView";

const spaceGrotesk = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "300 600",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const spaceMono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/space-mono/files/space-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

const montserrat = localFont({
  src: "../node_modules/@fontsource/montserrat/files/montserrat-latin-900-normal.woff2",
  weight: "900",
  style: "normal",
  variable: "--font-montserrat-css",
  display: "swap",
  preload: false,
});

const isIndexable = isIndexableEnvironment();

export const metadata: Metadata = {
  metadataBase: RUNTIME_GATES.publicDomain.approved ? new URL(SITE.url) : null,
  title: {
    default: SITE.title,
    template: "%s — SCALEVO",
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  robots: {
    index: isIndexable,
    follow: isIndexable,
    googleBot: {
      index: isIndexable,
      follow: isIndexable,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const serviceListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Rutas de trabajo de SCALEVO",
  itemListElement: PRODUCT_ROUTES.map((route, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: "publicLabel" in route ? route.publicLabel : route.name,
      description: route.description,
      serviceType: route.job,
    },
  })),
};

function safeJsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE.language}
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${montserrat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceListSchema) }}
        />
      </head>
      <body>
        {RUNTIME_GATES.analytics.enabled ? <AnalyticsPageView /> : null}
        {children}
      </body>
    </html>
  );
}
