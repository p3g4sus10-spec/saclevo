import { CTA_LABELS } from "@/config/site";
import { RUNTIME_GATES } from "@/config/gates";

export const ANALYTICS_IMPLEMENTATION_STATUS =
  "NO-OP — provider pendiente de aprobación" as const;

export const SECTION_IDS = [
  "perception_gap",
  "phantom_system",
  "product_ladder",
  "phantom_30",
  "principles",
  "method",
  "qualification",
  "faq",
  "diagnostic",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type Attribution =
  | "pure_organic"
  | "assisted_outbound"
  | "outbound"
  | "referral"
  | "unknown";

export type ScalevoEvent =
  | "page_view"
  | "section_view"
  | "cta_click"
  | "calendly_widget_loaded"
  | "calendly_open"
  | "booking_complete"
  | "faq_open"
  | "social_click"
  | "email_click"
  | "analytics_error";

export interface EventProperties {
  placement?: string;
  cta_id?: string;
  cta_text?: string;
  destination_type?: "anchor" | "calendly" | "email" | "social";
  section_id?: SectionId;
  route_interest?: string;
  faq_id?: string;
  platform?: "instagram" | "tiktok";
  open_mode?: "embedded" | "new_tab";
  source?: string;
  asset_id?: string;
  attribution?: Attribution;
  path?: string;
  hostname?: string;
  referrer_domain?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  release_sha?: string;
  stage?: string;
  error_code?: string;
}

export type AnalyticsPayload = Record<string, string>;
type AnalyticsProvider = (event: ScalevoEvent, payload: AnalyticsPayload) => void;

declare global {
  interface Window {
    __scalevo_analytics?: AnalyticsProvider;
  }
}

const ATTRIBUTION_KEY = "scalevo_first_touch_v1";
const SESSION_EVENT_PREFIX = "scalevo_event_v1:";
const QUERY_PROPERTY_MAP = {
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
} as const satisfies Record<string, keyof EventProperties>;

const DESTINATION_TYPES = ["anchor", "calendly", "email", "social"] as const;
const OPEN_MODES = ["embedded", "new_tab"] as const;
const PLATFORMS = ["instagram", "tiktok"] as const;
const ANALYTICS_ID = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ROUTE_INTEREST = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const ATTRIBUTION_VALUE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i;
const lastAnalyticsErrorAt = new Map<string, number>();
const ANALYTICS_ERROR_WINDOW_MS = 60_000;

const PROPERTY_ALLOWLIST = new Set<keyof EventProperties>([
  "placement",
  "cta_id",
  "cta_text",
  "destination_type",
  "section_id",
  "route_interest",
  "faq_id",
  "platform",
  "open_mode",
  "source",
  "asset_id",
  "attribution",
  "path",
  "hostname",
  "referrer_domain",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "release_sha",
  "stage",
  "error_code",
]);

const REQUIRED_PROPERTIES = {
  page_view: ["path", "hostname", "release_sha"],
  section_view: ["section_id"],
  cta_click: ["cta_id", "placement", "destination_type"],
  calendly_widget_loaded: ["placement"],
  calendly_open: ["placement", "open_mode"],
  booking_complete: ["placement", "source"],
  faq_open: ["faq_id"],
  social_click: ["platform", "placement", "destination_type"],
  email_click: ["placement", "destination_type"],
  analytics_error: ["stage", "error_code"],
} as const satisfies Record<ScalevoEvent, readonly (keyof EventProperties)[]>;

const PROHIBITED_KEY =
  /(^|_)(email|e-mail|phone|telefono|teléfono|name|nombre|answer|respuesta|payload|ip|revenue|message|mensaje)(_|$)/i;
const EMAIL_VALUE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_VALUE = /(?:\+?\d[\s().-]*){8,}/;

function cleanValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (EMAIL_VALUE.test(trimmed) || PHONE_VALUE.test(trimmed)) return undefined;
  return trimmed ? trimmed.slice(0, 160) : undefined;
}

export function referrerDomain(referrer: string): string | undefined {
  if (!referrer) return undefined;
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

export function classifyAttribution(
  values: Record<string, string | undefined>,
): Attribution {
  const medium = values.utm_medium?.toLowerCase();

  if (medium === "outbound") return "outbound";
  if (medium && /^(dm|email|whatsapp|outreach|assisted_outbound)$/.test(medium)) {
    return "assisted_outbound";
  }
  if (medium === "organic") return "pure_organic";
  if (values.referrer_domain) return "referral";
  return "unknown";
}

export function buildEntryAttribution(
  href: string,
  referrer = "",
): AnalyticsPayload {
  const url = new URL(href);
  const values: AnalyticsPayload = {};

  for (const [queryKey, propertyKey] of Object.entries(QUERY_PROPERTY_MAP)) {
    const value = cleanValue(url.searchParams.get(queryKey));
    if (value && value.length <= 64 && ATTRIBUTION_VALUE.test(value)) {
      values[propertyKey] = value;
    }
  }

  const domain = referrerDomain(referrer);
  if (domain && domain !== url.hostname.toLowerCase()) {
    values.referrer_domain = domain;
  }

  values.source =
    values.source ?? values.utm_source ?? values.referrer_domain ?? "direct";
  values.attribution = classifyAttribution(values);

  return values;
}

/** Preserve first touch for the current browser session without arbitrary query data. */
export function captureEntryAttribution(): void {
  if (!RUNTIME_GATES.analytics.enabled || typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    sessionStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify(buildEntryAttribution(window.location.href, document.referrer)),
    );
  } catch {
    // Storage can be unavailable; analytics must never affect the experience.
  }
}

export function getEntryAttribution(): AnalyticsPayload {
  if (!RUNTIME_GATES.analytics.enabled || typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return sanitizeEventProperties(parsed as Record<string, unknown>);
  } catch {
    return {};
  }
}

export function sanitizeEventProperties(
  properties: EventProperties | Record<string, unknown> = {},
): AnalyticsPayload {
  const sanitized: AnalyticsPayload = {};

  for (const [key, rawValue] of Object.entries(properties)) {
    if (
      PROHIBITED_KEY.test(key) ||
      !PROPERTY_ALLOWLIST.has(key as keyof EventProperties)
    ) {
      continue;
    }
    const value = cleanValue(rawValue);
    if (value) sanitized[key] = value;
  }

  return sanitized;
}

export function createAnalyticsPayload(
  properties: EventProperties = {},
  common: EventProperties = {},
): AnalyticsPayload {
  return {
    ...sanitizeEventProperties(common),
    ...sanitizeEventProperties(properties),
  };
}

export function validateAnalyticsEvent(
  event: ScalevoEvent,
  payload: AnalyticsPayload,
): { valid: boolean; errors: string[] } {
  const errors = REQUIRED_PROPERTIES[event]
    .filter((key) => !payload[key])
    .map((key) => `missing:${key}`);

  if (
    event === "section_view" &&
    payload.section_id &&
    !(SECTION_IDS as readonly string[]).includes(payload.section_id)
  ) {
    errors.push("invalid:section_id");
  }

  if (
    payload.destination_type &&
    !(DESTINATION_TYPES as readonly string[]).includes(payload.destination_type)
  ) {
    errors.push("invalid:destination_type");
  }

  if (
    payload.open_mode &&
    !(OPEN_MODES as readonly string[]).includes(payload.open_mode)
  ) {
    errors.push("invalid:open_mode");
  }

  if (
    payload.platform &&
    !(PLATFORMS as readonly string[]).includes(payload.platform)
  ) {
    errors.push("invalid:platform");
  }

  for (const key of ["cta_id", "placement", "stage", "error_code"] as const) {
    if (payload[key] && !ANALYTICS_ID.test(payload[key])) {
      errors.push(`invalid:${key}`);
    }
  }

  if (payload.route_interest && !ROUTE_INTEREST.test(payload.route_interest)) {
    errors.push("invalid:route_interest");
  }

  if (
    event === "page_view" &&
    payload.release_sha !== "local" &&
    !/^[a-f0-9]{7,40}$/i.test(payload.release_sha)
  ) {
    errors.push("invalid:release_sha");
  }

  return { valid: errors.length === 0, errors };
}

export function claimSessionEvent(
  eventKey: string,
  storage?: Pick<Storage, "getItem" | "setItem">,
): boolean {
  if (!storage && !RUNTIME_GATES.analytics.enabled) return false;

  const target =
    storage ??
    (typeof window !== "undefined" ? window.sessionStorage : undefined);
  if (!target) return true;

  try {
    const key = `${SESSION_EVENT_PREFIX}${eventKey}`;
    if (target.getItem(key)) return false;
    target.setItem(key, "1");
    return true;
  } catch {
    // In-memory refs still provide per-mount deduplication when storage is blocked.
    return true;
  }
}

export function track(event: ScalevoEvent, properties: EventProperties = {}): void {
  if (!RUNTIME_GATES.analytics.enabled || typeof window === "undefined") return;

  const common: EventProperties = {
    ...getEntryAttribution(),
    path: window.location.pathname,
    hostname: window.location.hostname,
    release_sha: process.env.NEXT_PUBLIC_RELEASE_SHA?.slice(0, 12) || "local",
  };
  const payload = createAnalyticsPayload(properties, common);
  const validation = validateAnalyticsEvent(event, payload);

  if (!validation.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[SCALEVO analytics invalid]", event, validation.errors);
    }
    return;
  }

  if (event === "analytics_error") {
    const errorKey = `${payload.stage}:${payload.error_code}`;
    const now = Date.now();
    const previous = lastAnalyticsErrorAt.get(errorKey) ?? 0;
    if (now - previous < ANALYTICS_ERROR_WINDOW_MS) return;
    lastAnalyticsErrorAt.set(errorKey, now);
  }

  const provider = window.__scalevo_analytics;
  if (typeof provider === "function") {
    try {
      provider(event, payload);
    } catch {
      // A provider failure is isolated from product behavior.
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[SCALEVO analytics NO-OP]", event, payload);
  }
}

export function trackCalendlyCta(
  placement: string,
  ctaId: string,
  routeInterest?: string,
  ctaText: string = CTA_LABELS.primary,
): void {
  if (!RUNTIME_GATES.calendly.enabled) return;

  const shared: EventProperties = {
    placement,
    cta_id: ctaId,
    cta_text: ctaText,
    destination_type: "calendly",
    route_interest: routeInterest,
  };
  track("cta_click", shared);
  track("calendly_open", {
    placement,
    open_mode: "new_tab",
    route_interest: routeInterest,
  });
}
