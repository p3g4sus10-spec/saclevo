import type { Metadata } from "next";
import { Space_Grotesk, Inter, Space_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE, SOCIAL, OG_IMAGE } from "@/config/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

// Montserrat: only used for canvas sampling — swap prevents render blocking
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-montserrat-css",
  display: "swap", // was "block" — fixed F-008
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: SITE.title,
    template: `%s | SCALEVO`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: "SCALEVO" }],

  // Canonical — explicit per SEO audit recommendation
  alternates: {
    canonical: SITE.url,
  },

  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description:
      "Construimos sistemas de posicionamiento, contenido y conversión para negocios que son mejores de lo que parecen digitalmente. PHANTOM 30 — Sprint de implementación de 30 días.",
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description:
      "Sistema de posicionamiento, contenido y conversión. PHANTOM 30 — Sprint de implementación de 30 días.",
    images: [OG_IMAGE.url], // explicit twitter:image — fixes F-007 audit finding
  },

  robots: {
    index: process.env.VERCEL_ENV === "production",
    follow: process.env.VERCEL_ENV === "production",
    googleBot: {
      index: process.env.VERCEL_ENV === "production",
      follow: process.env.VERCEL_ENV === "production",
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SCALEVO",
  url: SITE.url,
  logo: `${SITE.url}/scalevo-logo-particles.png`,
  description: SITE.description,
  email: SITE.email,
  sameAs: [
    SOCIAL.instagram.url,
    SOCIAL.tiktok.url,
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SCALEVO",
  url: SITE.url,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${montserrat.variable}`}
    >
      <head>
        {/* Explicit canonical */}
        <link rel="canonical" href={SITE.url} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
