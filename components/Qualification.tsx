"use client";

import { useEffect, useRef } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IS_FOR = [
  "Tu negocio ya entrega valor real",
  "Puedes atender más clientes",
  "Tu ticket soporta inversión en adquisición",
  "Sabes que tu presencia está por debajo de tu realidad",
  "Quieres construir un sistema y medirlo",
];

const NOT_FOR = [
  "Esperas ventas garantizadas",
  "Buscas únicamente seguidores",
  "Tu producto todavía no funciona",
  "No puedes atender nueva demanda",
  "Solo necesitas a alguien que «publique por ti»",
];

export default function Qualification() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".qual-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".qual-header", start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".qual-col",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".qual-grid", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="qualification-section"
      id="qualification"
      aria-label="Para quién es PHANTOM 30"
    >
      <div className="qualification-inner">
        <div className="qual-header">
          <p className="section-label">// ¿ES PARA TI?</p>
          <h2 className="section-title">
            PHANTOM es para ti si...
          </h2>
        </div>

        <div className="qual-grid">
          {/* Is for */}
          <div className="qual-col qual-col-yes" aria-label="PHANTOM es para ti si">
            <div className="qual-col-header">
              <span className="qual-col-indicator qual-yes-indicator" aria-hidden="true" />
              <h3 className="qual-col-title">ES PARA TI</h3>
            </div>
            <ul className="qual-list">
              {IS_FOR.map((item) => (
                <li key={item} className="qual-item qual-item-yes">
                  <span className="qual-check" aria-hidden="true">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Is not for */}
          <div className="qual-col qual-col-no" aria-label="PHANTOM no es para ti si">
            <div className="qual-col-header">
              <span className="qual-col-indicator qual-no-indicator" aria-hidden="true" />
              <h3 className="qual-col-title" style={{ color: "var(--text-muted)" }}>NO ES PARA TI</h3>
            </div>
            <ul className="qual-list">
              {NOT_FOR.map((item) => (
                <li key={item} className="qual-item qual-item-no">
                  <span className="qual-check" aria-hidden="true" style={{ opacity: 0.4 }}>×</span>
                  <span style={{ color: "var(--text-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}



