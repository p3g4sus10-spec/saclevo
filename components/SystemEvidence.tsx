"use client";

import { useEffect, useRef } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionView } from "@/lib/useSectionView";

gsap.registerPlugin(ScrollTrigger);

const evidenceCells = [
  {
    cls: "ev-1",
    type: "concept",
    label: "ENTENDER EL PROBLEMA",
    desc: "Encontramos dónde se pierde claridad, confianza o intención antes de producir.",
    tag: "ENTENDER",
  },
  {
    cls: "ev-2",
    type: "concept",
    label: "PROBAR LA DIRECCIÓN",
    desc: "Hacemos visible la idea antes de escalarla, para detectar ajustes a tiempo.",
    tag: "PROBAR",
  },
  {
    cls: "ev-3",
    type: "concept",
    label: "DAR UN SIGUIENTE PASO",
    desc: "Cada pieza ayuda a la persona adecuada a saber qué hacer después.",
    tag: "CONECTAR",
  },
  {
    cls: "ev-4",
    type: "concept",
    label: "MEDIR LO POSIBLE",
    desc: "Revisamos señales reales, aprendemos y ajustamos.",
    tag: "APRENDER",
  },
  {
    cls: "ev-5",
    type: "principle",
    label: "MANTENER COHERENCIA",
    desc: "El mensaje, el contenido y la forma de contacto deben contar la misma historia.",
    tag: "ALINEAR",
  },
  {
    cls: "ev-6",
    type: "principle",
    label: "LLEGAR A CONVERSACIÓN",
    desc: "La atención solo importa si puede convertirse en interés claro y una conversación comercial.",
    tag: "AVANZAR",
  },
];

export default function SystemEvidence() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "method");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".ev-cell",
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out",
          stagger: { amount: 0.5, from: "start" },
          scrollTrigger: { trigger: ".ev-grid", start: "top 82%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="evidence-section"
      id="method"
      aria-label="Cómo pensamos — System Evidence"
    >
      <div className="section-header">
        <p className="section-label">// ASÍ CONVERTIMOS CLARIDAD EN ACCIÓN</p>
        <h2 className="section-title">
          De una buena oferta
          <br />
          <span style={{ color: "var(--text-muted)" }}>
            a una conversación más fácil.
          </span>
        </h2>
      </div>

      <div className="ev-grid bento-grid">
        {evidenceCells.map((cell, i) => (
          <div key={i} className={`ev-cell bento-cell ${cell.cls}`} role="article">
            <div className="bento-glow" aria-hidden="true" />

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "var(--brand-blue-text)",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              {cell.tag}
            </p>

            <h3
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 700,
                color: "var(--text-pure)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              {cell.label}
            </h3>

            <p className="bento-text">{cell.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



