"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA_LABELS } from "@/config/site";
import {
  CLAIMS_DISCLOSURE,
  PRODUCT_ROUTES,
  SCALE_FULL_PREREQUISITES,
} from "@/config/offers";
import { useSectionView } from "@/lib/useSectionView";
import { getMotionTier } from "@/lib/motion";
import BookingLink from "@/components/BookingLink";

gsap.registerPlugin(ScrollTrigger);

export default function ProductLadder() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "product_ladder");

  useEffect(() => {
    const tier = getMotionTier();

    const ctx = gsap.context(() => {
      if (tier === "reduced") return;

      gsap.fromTo(
        ".product-ladder-header .section-label",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-ladder-header",
            start: "top 86%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".product-ladder-header .section-title, .product-ladder-intro",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".product-ladder-header",
            start: "top 84%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".product-ladder-list",
        { "--ladder-progress": 0 },
        {
          "--ladder-progress": 1,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-ladder-list",
            start: "top 84%",
            once: true,
          },
        },
      );

      const routes = gsap.utils.toArray<HTMLElement>(".product-route");
      routes.forEach((route) => {
        const routeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: route,
            start: "top 88%",
            once: true,
          },
        });

        routeTimeline.fromTo(
          route,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
        );

        const node = route.querySelector<HTMLElement>(".product-route-node");
        if (node) {
          routeTimeline.fromTo(
            node,
            { opacity: 0.6, filter: "brightness(0.75)" },
            {
              opacity: 1,
              filter: "brightness(1)",
              duration: 0.5,
              ease: "power2.out",
            },
            "<",
          );
        }

        const foundingBadge = route.querySelector<HTMLElement>(
          ".product-route-founding",
        );
        if (foundingBadge) {
          routeTimeline.fromTo(
            foundingBadge,
            {
              opacity: 0,
              y: 8,
              boxShadow: "0 0 0 rgba(116, 135, 255, 0)",
            },
            {
              opacity: 1,
              y: 0,
              boxShadow: "0 0 18px rgba(116, 135, 255, 0.12)",
              duration: 0.5,
              ease: "power2.out",
            },
            "<0.12",
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="product-ladder-section"
      id="product-ladder"
      aria-labelledby="product-ladder-heading"
    >
      <div className="product-ladder-inner">
        <div className="product-ladder-header">
          <p className="section-label">
            // TRES RUTAS, SEGÚN LO QUE HOY NECESITAS
          </p>
          <h2 className="section-title" id="product-ladder-heading">
            No todos los negocios necesitan lo mismo.
          </h2>
          <p className="product-ladder-intro">
            El diagnóstico nos ayuda a elegir el punto de partida correcto, sin
            venderte más de lo que necesitas.
          </p>
        </div>

        <ol className="product-ladder-list" aria-label="Rutas de SCALEVO">
          {PRODUCT_ROUTES.map((route) => (
            <li
              key={route.id}
              className={"product-route " + ("featured" in route ? "product-route-featured" : "")}
              data-route-id={route.id}
            >
              <div className="product-route-node" aria-hidden="true">
                <span>{route.index}</span>
              </div>
              <div className="product-route-content">
                <div className="product-route-heading">
                  <p className="product-route-name">
                    {route.index} · {"publicLabel" in route ? route.publicLabel : route.name}
                  </p>
                  <p className="product-route-job">{route.job}</p>
                </div>
                <h3 className="product-route-question">{route.question}</h3>
                <p className="product-route-description">
                  {route.ladderSummary}
                </p>
                {"founding" in route && (
                  <p
                    className="product-route-founding"
                    data-founding-remaining={route.founding.remaining}
                  >
                    {route.founding.availabilityLabel}
                  </p>
                )}
                <p className="product-route-terms">{route.terms}</p>
                <p className="product-route-disclosure">{route.disclosure}</p>
                {"ladderNote" in route && (
                  <p className="product-route-note">
                    {route.ladderNote}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <aside
          className="full-prerequisites"
          aria-labelledby="full-prerequisites-heading"
        >
          <h3 id="full-prerequisites-heading">
            ¿CUÁNDO TIENE SENTIDO SCALE FULL?
          </h3>
          <p>{SCALE_FULL_PREREQUISITES}</p>
        </aside>

        <div className="product-ladder-action">
          <p>
            En el diagnóstico te diremos con honestidad qué ruta tiene sentido,
            si conviene recomendarte otra solución o si aún no es momento de
            avanzar.
          </p>
          <BookingLink
            placement="product_ladder"
            ctaId="product_ladder_primary"
            className="btn-neon"
            id="product-ladder-cta"
          >
            <span className="btn-neon-dot" aria-hidden="true" />
            {CTA_LABELS.primary}
            <span className="btn-neon-arrow" aria-hidden="true">→</span>
          </BookingLink>
        </div>

        <p className="claims-disclosure">{CLAIMS_DISCLOSURE}</p>
      </div>
    </section>
  );
}
