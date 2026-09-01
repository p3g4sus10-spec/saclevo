"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionView } from "@/lib/useSectionView";

gsap.registerPlugin(ScrollTrigger);

export default function PerceptionGap() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "perception_gap");

  useEffect(() => {
    const tier = getMotionTier();
    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (tier === "reduced") return;
      gsap.fromTo(
        ".perception-section .section-label",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".perception-section .section-label",
            start: "top 88%",
            once: true,
          },
        },
      );

      // Headline entrance
      gsap.fromTo(
        ".pg-headline",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
          scrollTrigger: {
            trigger: ".pg-headline",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Left/right columns stagger
      gsap.fromTo(
        ".pg-col",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
          scrollTrigger: {
            trigger: ".pg-columns",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Divider line
      const dividerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".pg-vs",
          start: "top 88%",
          once: true,
        },
      });
      dividerTimeline.fromTo(
        ".pg-divider-line",
        {
          scaleX: isMobile ? 0 : 1,
          scaleY: isMobile ? 1 : 0,
          transformOrigin: isMobile ? "left center" : "center top",
        },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
      dividerTimeline.fromTo(
        ".pg-vs-text",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "<0.08",
      );
      gsap.fromTo(
        ".pg-col-bar-fill",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pg-columns",
            start: "top 82%",
            once: true,
          },
        },
      );

      // Closing statement
      gsap.fromTo(
        ".pg-close",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: {
            trigger: ".pg-close",
            start: "top 88%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="perception-section"
      id="perception-gap"
      aria-label="La brecha de percepción"
    >
      <div className="perception-inner">
        <p className="section-label">// CUANDO LA PERCEPCIÓN SE QUEDA CORTA</p>

        <h2 className="section-title pg-headline">
          Tu negocio puede ser mejor
          <br />
          <span style={{ color: "var(--text-muted)" }}>de lo que parece.</span>
        </h2>

        <div className="pg-columns">
          {/* Reality column */}
          <div className="pg-col pg-col-reality">
            <div className="pg-col-marker">
              <span className="pg-col-label">LO QUE YA EXISTE</span>
              <div className="pg-col-bar pg-col-bar-full">
                <div className="pg-col-bar-fill" />
                <span className="pg-col-bar-text">Tu operación real</span>
              </div>
            </div>
            <ul className="pg-list" aria-label="Características del negocio real">
              <li>Una oferta valiosa</li>
              <li>Clientes bien atendidos</li>
              <li>Capacidad real para cumplir</li>
              <li>Un precio respaldado por lo que entregas</li>
            </ul>
          </div>

          {/* VS divider */}
          <div className="pg-vs" aria-hidden="true">
            <div className="pg-divider-line" />
            <span className="pg-vs-text">VS</span>
            <div className="pg-divider-line" />
          </div>

          {/* Perception column */}
          <div className="pg-col pg-col-perception">
            <div className="pg-col-marker">
              <span className="pg-col-label" style={{ color: "var(--text-muted)" }}>LO QUE LA GENTE VE</span>
              <div className="pg-col-bar pg-col-bar-partial">
                <div className="pg-col-bar-fill pg-col-bar-fill-partial" />
                <span className="pg-col-bar-text" style={{ color: "var(--text-muted)" }}>Lo que el mercado ve</span>
              </div>
            </div>
            <ul className="pg-list pg-list-muted" aria-label="Problemas de percepción digital">
              <li>Un mensaje difícil de entender</li>
              <li>Contenido que no muestra la diferencia</li>
              <li>Pocas razones visibles para elegirte</li>
              <li>Ningún siguiente paso claro</li>
            </ul>
          </div>
        </div>

        <div className="pg-close">
          <div className="pg-close-divider" aria-hidden="true" />
          <p className="pg-close-text">
            Si tu valor no se entiende rápido, una buena oportunidad puede irse
            <br />
            <em>antes de preguntar.</em>
          </p>
        </div>
      </div>
    </section>
  );
}



