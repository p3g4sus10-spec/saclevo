"use client";

import { useEffect, useRef } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PerceptionGap() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      // Headline entrance
      gsap.fromTo(
        ".pg-headline",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".pg-headline", start: "top 80%" },
        }
      );

      // Left/right columns stagger
      gsap.fromTo(
        ".pg-col",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".pg-columns", start: "top 82%" },
        }
      );

      // Divider line
      gsap.fromTo(
        ".pg-divider-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: ".pg-divider-line", start: "top 85%" },
        }
      );

      // Closing statement
      gsap.fromTo(
        ".pg-close",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".pg-close", start: "top 88%" },
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
        <p className="section-label">// LA BRECHA</p>

        <h2 className="section-title pg-headline">
          Tu negocio puede ser mejor
          <br />
          <span style={{ color: "var(--text-muted)" }}>de lo que parece.</span>
        </h2>

        <div className="pg-columns">
          {/* Reality column */}
          <div className="pg-col pg-col-reality">
            <div className="pg-col-marker">
              <span className="pg-col-label">REALIDAD</span>
              <div className="pg-col-bar pg-col-bar-full">
                <div className="pg-col-bar-fill" />
                <span className="pg-col-bar-text">Tu operación real</span>
              </div>
            </div>
            <ul className="pg-list" aria-label="Características del negocio real">
              <li>Gran producto o servicio</li>
              <li>Buena experiencia real</li>
              <li>Capacidad de entrega</li>
              <li>Ticket premium justificado</li>
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
              <span className="pg-col-label" style={{ color: "var(--text-muted)" }}>PERCEPCIÓN DIGITAL</span>
              <div className="pg-col-bar pg-col-bar-partial">
                <div className="pg-col-bar-fill pg-col-bar-fill-partial" />
                <span className="pg-col-bar-text" style={{ color: "var(--text-muted)" }}>Lo que el mercado ve</span>
              </div>
            </div>
            <ul className="pg-list pg-list-muted" aria-label="Problemas de percepción digital">
              <li>Comunicación que no refleja el nivel</li>
              <li>Poca diferenciación visible</li>
              <li>Sin ruta clara hacia la conversación</li>
              <li>Autoridad que no se transmite</li>
            </ul>
          </div>
        </div>

        <div className="pg-close">
          <div className="pg-close-divider" aria-hidden="true" />
          <p className="pg-close-text">
            El problema no siempre es lo que vendes.
            <br />
            A veces es <em>lo que el mercado percibe.</em>
          </p>
        </div>
      </div>
    </section>
  );
}



