import { RUNTIME_GATES } from "@/config/gates";

export const DEFAULT_SITE_URL = "https://scalevo-mx.vercel.app";

/**
 * Normalize the single canonical origin used by metadata, JSON-LD, robots and
 * sitemap. Invalid or non-HTTPS values fail loudly during build/configuration.
 */
export function normalizeSiteUrl(value = DEFAULT_SITE_URL): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid SITE_URL: ${value}`);
  }

  if (url.protocol !== "https:") {
    throw new Error(`SITE_URL must use HTTPS: ${value}`);
  }

  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error(`SITE_URL must be an origin without path, query or credentials: ${value}`);
  }

  return url.origin;
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL,
  );
}

export const SITE_URL = getSiteUrl();

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function isIndexableEnvironment(): boolean {
  return (
    RUNTIME_GATES.publicDomain.approved &&
    RUNTIME_GATES.publication.productionAuthorized &&
    process.env.VERCEL_ENV === "production"
  );
}

export const SITE = {
  name: "SCALEVO",
  tagline: "No es suerte. Es sistema.",
  url: SITE_URL,
  locale: "es_MX",
  language: "es-MX",
  title: "SCALEVO — No es suerte. Es sistema.",
  description:
    "Ayudamos a negocios sólidos a verse online a la altura de lo que entregan y a hacer más claro el camino del interés a una conversación comercial. Conoce SCALE BASIC, PHANTOM 30 y SCALE FULL.",
  keywords: [
    "SCALEVO",
    "PHANTOM 30",
    "SCALE BASIC",
    "SCALE FULL",
    "posicionamiento digital",
    "videos para negocios",
    "oportunidades comerciales",
    "marketing México",
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

/** Single source for every booking link and postMessage origin check. */
export const CALENDLY_URL = "https://calendly.com/scalevo-mx/30min";
export const CALENDLY_ORIGIN = new URL(CALENDLY_URL).origin;
export const BOOKING = {
  url: CALENDLY_URL,
  durationMinutes: 30,
  enabled: RUNTIME_GATES.calendly.enabled,
  state: RUNTIME_GATES.calendly.state,
} as const;

export const CTA_LABELS = {
  booking: "AGENDAR MI DIAGNÓSTICO",
  primary: RUNTIME_GATES.calendly.enabled
    ? "AGENDAR MI DIAGNÓSTICO"
    : "CONOCER EL DIAGNÓSTICO",
  secondary: "Ver cómo lo resolvemos ↓",
  calendlyFallback: "ABRIR CALENDLY →",
} as const;

export const NAV_LINKS = [
  { label: "Sistema", href: "#phantom-system", id: "nav-sistema" },
  { label: "Rutas", href: "#product-ladder", id: "nav-rutas" },
  { label: "Phantom 30", href: "#phantom-30", id: "nav-phantom30" },
  { label: "Método", href: "#method", id: "nav-metodo" },
  { label: "Diagnóstico", href: "#diagnostic", id: "nav-diagnostico" },
] as const;

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "SCALEVO — No es suerte. Es sistema.",
} as const;
