"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cells = [
  {
    cls: "bento-1",
    type: "big-stat",
    content: {
      number: "127",
      unit: "+",
      label: "Emprendedores que escalaron con SCALEVO en los últimos 18 meses",
      subtitle: "Negocios transformados",
    },
  },
  {
    cls: "bento-2",
    type: "metric",
    content: {
      number: "340",
      unit: "%",
      label: "Incremento promedio en conversiones",
      title: "Efecto Sistema",
    },
  },
  {
    cls: "bento-3",
    type: "quote",
    content: {
      quote:
        '"En 60 días SCALEVO transformó mi marca. De invisible a referente."',
      author: "— Carlos M., Fundador",
    },
  },
  {
    cls: "bento-4",
    type: "metric",
    content: {
      number: "48",
      unit: "h",
      label: "Tiempo promedio de diagnóstico inicial",
      title: "Velocidad Sistema",
    },
  },
  {
    cls: "bento-5",
    type: "tag",
    content: {
      tag: "NEUROMARKETING",
      desc: "Cada decisión respaldada por ciencia del comportamiento",
    },
  },
  {
    cls: "bento-6",
    type: "metric",
    content: {
      number: "4.9",
      unit: "★",
      label: "Puntuación media de satisfacción de clientes",
      title: "Excelencia",
    },
  },
];

export default function BentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bentoCells = gsap.utils.toArray<HTMLElement>(".bento-cell");

      bentoCells.forEach((cell, i) => {
        gsap.fromTo(
          cell,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cell,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            delay: (i % 3) * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="evidence-section"
      id="evidence"
      aria-label="Evidencia y resultados SCALEVO"
    >
      <div className="section-header">
        <p className="section-label">// RESULTADOS REALES</p>
        <h2 className="section-title">
          Los números no mienten.<br />
          <span style={{ color: "var(--text-muted)" }}>El sistema tampoco.</span>
        </h2>
      </div>

      <div className="bento-grid">
        {cells.map((cell, i) => (
          <div key={i} className={`bento-cell ${cell.cls}`} role="article">
            <div className="bento-glow" aria-hidden="true" />

            {cell.type === "big-stat" && (
              <>
                <div className="bento-big-number">
                  {cell.content.number}
                  <span>{cell.content.unit}</span>
                </div>
                <p className="bento-label">{cell.content.label}</p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "var(--brand-blue)",
                    marginTop: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  {cell.content.subtitle}
                </p>
              </>
            )}

            {cell.type === "metric" && (
              <>
                <p className="bento-title">{cell.content.title}</p>
                <div className="bento-metric-row">
                  <span className="bento-metric-number">
                    {cell.content.number}
                  </span>
                  <span className="bento-metric-unit">{cell.content.unit}</span>
                </div>
                <p className="bento-text">{cell.content.label}</p>
              </>
            )}

            {cell.type === "quote" && (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "clamp(16px, 2vw, 20px)",
                    fontWeight: 300,
                    color: "var(--text-pure)",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {cell.content.quote}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--brand-blue)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {cell.content.author}
                </p>
              </>
            )}

            {cell.type === "tag" && (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "var(--urgency-orange)",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  {cell.content.tag}
                </p>
                <p className="bento-text">{cell.content.desc}</p>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, var(--urgency-orange) 0%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
