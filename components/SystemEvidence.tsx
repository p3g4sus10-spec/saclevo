"use client";

import { useEffect, useRef } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const evidenceCells = [
  {
    cls: "ev-1",
    type: "concept",
    label: "DIAGNÓSTICO",
    desc: "Detectamos dónde se pierde percepción o intención comercial antes de producir cualquier activo.",
    tag: "PROCESO",
  },
  {
    cls: "ev-2",
    type: "concept",
    label: "PROTOTIPO",
    desc: "Antes de escalar una idea, la hacemos visible. Validamos la dirección antes de ejecutar a escala.",
    tag: "MÉTODO",
  },
  {
    cls: "ev-3",
    type: "concept",
    label: "FUNNEL",
    desc: "Cada pieza de contenido o activo debe conducir a un siguiente paso concreto. Nada existe sin función.",
    tag: "ARQUITECTURA",
  },
  {
    cls: "ev-4",
    type: "concept",
    label: "MEDICIÓN",
    desc: "Hipótesis → ejecución → dato → decisión. No optimizamos lo que no medimos.",
    tag: "ITERACIÓN",
  },
  {
    cls: "ev-5",
    type: "principle",
    label: "SISTEMA",
    desc: "La diferencia entre presencia digital y posicionamiento real es la coherencia entre todos los puntos de contacto.",
    tag: "PRINCIPIO",
  },
  {
    cls: "ev-6",
    type: "principle",
    label: "CONVERSIÓN",
    desc: "Una audiencia sin ruta de conversión es solo vanidad métrica. Construimos el camino desde la atención hasta la conversación.",
    tag: "OBJETIVO",
  },
];

export default function SystemEvidence() {
  const sectionRef = useRef<HTMLElement>(null);

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
      id="evidence"
      aria-label="Cómo pensamos — System Evidence"
    >
      <div className="section-header">
        <p className="section-label">// CÓMO PENSAMOS</p>
        <h2 className="section-title">
          El sistema en acción.
          <br />
          <span style={{ color: "var(--text-muted)" }}>No publicaciones. Arquitectura.</span>
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
                color: "var(--brand-blue)",
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



