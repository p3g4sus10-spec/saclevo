import type { Metadata } from "next";
import { Space_Grotesk, Inter, Space_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// Montserrat loaded specifically for the particle S-shape canvas rendering
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-montserrat",
  display: "block", // block ensures it's ready before JS runs
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scalevo.com"),
  title: "SCALEVO — No es suerte. Es sistema.",
  description:
    "SCALEVO convierte negocios invisibles en marcas inevitables. Sistema de marketing neurológico, identidad de marca y contenido viral para emprendedores que quieren escalar.",
  keywords: [
    "branding",
    "marketing",
    "neuromarketing",
    "escalar negocio",
    "identidad de marca",
    "SCALEVO",
    "growth",
    "emprendedor",
  ],
  authors: [{ name: "SCALEVO" }],
  creator: "SCALEVO",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://scalevo.com",
    siteName: "SCALEVO",
    title: "SCALEVO — No es suerte. Es sistema.",
    description:
      "Convertimos negocios invisibles en marcas inevitables. Sistema de marketing neurológico.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SCALEVO — No es suerte. Es sistema.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCALEVO — No es suerte. Es sistema.",
    description:
      "Convertimos negocios invisibles en marcas inevitables. Sistema de marketing neurológico.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${montserrat.variable}`}
    >
      <body className="bg-dark text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
