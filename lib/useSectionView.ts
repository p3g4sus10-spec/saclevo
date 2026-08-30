"use client";

import { type RefObject, useEffect, useRef } from "react";
import {
  claimSessionEvent,
  track,
  type EventProperties,
  type SectionId,
} from "@/lib/analytics";

type SectionViewProperties = Pick<EventProperties, "route_interest">;

export function useSectionView(
  ref: RefObject<HTMLElement | null>,
  sectionId: SectionId,
  properties?: SectionViewProperties,
): void {
  const emittedRef = useRef(false);
  const routeInterest = properties?.route_interest;

  useEffect(() => {
    const element = ref.current;
    if (
      emittedRef.current ||
      !element ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const visibleThreshold = Math.min(
      0.35,
      (window.innerHeight * 0.35) / Math.max(element.offsetHeight, 1),
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !emittedRef.current &&
          entry.isIntersecting &&
          entry.intersectionRatio >= visibleThreshold
        ) {
          emittedRef.current = true;
          if (claimSessionEvent(`section_view:${sectionId}`)) {
            track("section_view", {
              section_id: sectionId,
              route_interest: routeInterest,
            });
          }
          observer.disconnect();
        }
      },
      // For short sections require 35% of the section. For sections taller than
      // the viewport, require content equal to 35% of the viewport so the event
      // remains reachable on mobile.
      { threshold: visibleThreshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, routeInterest, sectionId]);
}
