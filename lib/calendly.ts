import { CALENDLY_ORIGIN } from "@/config/site";

export const CALENDLY_EVENT_NAMES = [
  "calendly.profile_page_viewed",
  "calendly.event_type_viewed",
  "calendly.date_and_time_selected",
  "calendly.event_scheduled",
] as const;

export type CalendlyEventName = (typeof CALENDLY_EVENT_NAMES)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isCalendlyEventName(value: unknown): value is CalendlyEventName {
  return (
    typeof value === "string" &&
    (CALENDLY_EVENT_NAMES as readonly string[]).includes(value)
  );
}

/**
 * Return only the allowlisted event name. The Calendly payload is deliberately
 * neither copied nor exposed because it may contain personal information.
 */
export function getValidatedCalendlyEvent(
  event: Pick<MessageEvent, "origin" | "source" | "data">,
  expectedSource: MessageEventSource | null,
): CalendlyEventName | null {
  if (
    event.origin !== CALENDLY_ORIGIN ||
    !expectedSource ||
    event.source !== expectedSource ||
    !isRecord(event.data) ||
    !isCalendlyEventName(event.data.event) ||
    !isRecord(event.data.payload)
  ) {
    return null;
  }

  return event.data.event;
}
