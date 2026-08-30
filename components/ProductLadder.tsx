"use client";

import { useRef } from "react";
import { CTA_LABELS } from "@/config/site";
import {
  CLAIMS_DISCLOSURE,
  PRODUCT_ROUTES,
  SCALE_FULL_PREREQUISITES,
} from "@/config/offers";
import { useSectionView } from "@/lib/useSectionView";
import BookingLink from "@/components/BookingLink";

export default function ProductLadder() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "product_ladder");

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
                <p className="product-route-description">{route.description}</p>
                <p className="product-route-terms">{route.terms}</p>
                <p className="product-route-disclosure">{route.disclosure}</p>
                {"scopeDisclosure" in route && (
                  <p className="product-route-disclosure">
                    {route.scopeDisclosure}
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
