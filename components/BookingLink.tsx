"use client";

import type { ComponentProps } from "react";
import { BOOKING, CTA_LABELS } from "@/config/site";
import { track, trackCalendlyCta } from "@/lib/analytics";

type BookingLinkProps = Omit<
  ComponentProps<"a">,
  "href" | "target" | "rel" | "onClick"
> & {
  placement: string;
  ctaId: string;
  routeInterest?: string;
  ctaText?: string;
  afterClick?: () => void;
};

export default function BookingLink({
  placement,
  ctaId,
  routeInterest,
  ctaText = CTA_LABELS.primary,
  afterClick,
  children,
  ...anchorProps
}: BookingLinkProps) {
  const handleClick = () => {
    if (BOOKING.enabled) {
      trackCalendlyCta(placement, ctaId, routeInterest, ctaText);
      afterClick?.();
      return;
    }

    track("cta_click", {
      placement,
      cta_id: ctaId,
      cta_text: ctaText,
      destination_type: "anchor",
      route_interest: routeInterest,
    });
    afterClick?.();
  };

  return (
    <a
      {...anchorProps}
      href={BOOKING.enabled ? BOOKING.url : "#diagnostic"}
      target={BOOKING.enabled ? "_blank" : undefined}
      rel={BOOKING.enabled ? "noopener noreferrer" : undefined}
      data-booking-enabled={BOOKING.enabled}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
