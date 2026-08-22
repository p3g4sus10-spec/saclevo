/**
 * SCALEVO — Analytics Event Layer
 * Abstraction over any analytics provider.
 * Currently no tool is installed; this layer is ready to plug in
 * GA4, Plausible, Posthog, etc. without changing call sites.
 *
 * Integration: set window.__scalevo_analytics to your provider's track fn.
 * UTMs from the entry URL are captured once and attached to every event.
 */

export type ScalevoEvent =
  | "page_view"
  | "hero_primary_cta_click"
  | "hero_secondary_cta_click"
  | "floating_cta_click"
  | "nav_cta_click"
  | "perception_gap_view"
  | "phantom_system_view"
  | "phantom30_view"
  | "phantom30_cta_click"
  | "qualification_view"
  | "diagnostic_section_view"
  | "diagnostic_cta_click"
  | "calendly_widget_loaded"
  | "calendly_open"
  | "booking_complete"
  | "instagram_click"
  | "tiktok_click"
  | "email_click"
  | "faq_open";

export interface EventProperties {
  placement?: string;
  cta_text?: string;
  section?: string;
  faq_question?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Capture UTM parameters from the entry URL.
 * Call once on app mount. Stored in sessionStorage.
 */
export function captureEntryUTMs(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
    referrer: document.referrer || undefined,
  };
  // Only store if there's an actual UTM
  if (utm.utm_source) {
    try {
      sessionStorage.setItem("scalevo_entry_utm", JSON.stringify(utm));
    } catch {
      // sessionStorage not available — silent fail
    }
  }
}

/**
 * Read stored entry UTMs. Returns {} if none stored.
 */
export function getEntryUTMs(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("scalevo_entry_utm");
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Track an event. Properties are merged with entry UTMs.
 * Replace the console.info with your provider's track call.
 *
 * Example GA4 integration:
 *   window.__scalevo_analytics = (name, props) => gtag('event', name, props);
 */
export function track(event: ScalevoEvent, properties?: EventProperties): void {
  if (typeof window === "undefined") return;

  const entryUTMs = getEntryUTMs();
  const payload = { ...entryUTMs, ...properties };

  // Plug-in point — replace with real provider
  const provider = (
    window as Window & {
      __scalevo_analytics?: (e: string, p: Record<string, unknown>) => void;
    }
  ).__scalevo_analytics;

  if (typeof provider === "function") {
    provider(event, payload);
  } else {
    // Development: log events to console
    if (process.env.NODE_ENV === "development") {
      console.info("[SCALEVO analytics]", event, payload);
    }
  }
}
