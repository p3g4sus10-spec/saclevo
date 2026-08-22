/**
 * Resolve the dynamic production URL.
 * 1. NEXT_PUBLIC_SITE_URL (Custom Domain)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel Production)
 * 3. localhost (Development)
 */
export const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // No VERCEL_URL fallback para evitar canonicals contaminados en previews
  return "http://localhost:3000";
};

export const SITE = {
  name: "SCALEVO",
  tagline: "No es suerte. Es sistema.",
  url: getSiteUrl(),
  locale: "es_MX",
  email: "scalevo.mx@gmail.com",

  title: "SCALEVO — No es suerte. Es sistema.",
  description:
    "Construimos sistemas de posicionamiento, contenido y conversión para negocios que son mejores de lo que parecen digitalmente. PHANTOM — sprint de implementación de 30 días.",
  keywords: [
    "SCALEVO",
    "PHANTOM",
    "posicionamiento digital",
    "sistema de adquisición",
    "branding estratégico",
    "contenido de conversión",
    "marketing México",
    "agencia de posicionamiento",
  ],
} as const;

export const SOCIAL = {
  instagram: {
    url: "https://www.instagram.com/scalevo.gp/",
    handle: "@scalevo.gp",
    label: "SCALEVO en Instagram — @scalevo.gp",
    id: "instagram",
  },
  tiktok: {
    url: "https://www.tiktok.com/@scalevo.gp",
    handle: "@scalevo.gp",
    label: "SCALEVO en TikTok — @scalevo.gp",
    id: "tiktok",
  },
} as const;

/**
 * Calendly URL — single source.
 * Internal CTAs do NOT carry link_in_bio UTMs.
 * Entry UTMs are captured on page load and stored in sessionStorage.
 * Each CTA passes its placement via event properties, not via URL UTMs.
 */
export const CALENDLY_URL =
  "https://calendly.com/scalevo-mx/30min";

export const NAV_LINKS = [
  { label: "Sistema", href: "#phantom-system", id: "nav-sistema" },
  { label: "Phantom 30", href: "#phantom-30", id: "nav-phantom30" },
  { label: "Evidencia", href: "#evidence", id: "nav-evidencia" },
  { label: "Diagnóstico", href: "#diagnostic", id: "nav-diagnostic" },
] as const;

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "SCALEVO — No es suerte. Es sistema.",
} as const;
