"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    title: "SISTEMA SOBRE EMOCIÓN",
    text: "Las decisiones se toman con datos y estrategia. No con entusiasmo pasajero.",
  },
  {
    num: "02",
    title: "RESULTADOS O SILENCIO",
    text: "No hablamos de lo que haremos. Mostramos lo que hicimos.",
  },
  {
    num: "03",
    title: "CLARIDAD RADICAL",
    text: "Sin jerga. Sin humo. Sin promesas vacías. Solo el camino.",
  },
  {
    num: "04",
    title: "CRECIMIENTO COMO OBSESIÓN",
    text: "No descansamos hasta que los números suban. Punto.",
  },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".manifesto-big-text",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".manifesto-big-text",
            start: "top 85%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".manifesto-pillar").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="manifesto-section"
      aria-label="Valores y filosofía SCALEVO"
    >
      <div className="manifesto-grid">
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "var(--brand-blue)",
              marginBottom: "32px",
              textTransform: "uppercase",
            }}
          >
            // NUESTRA FILOSOFÍA
          </p>
          <h2 className="manifesto-big-text">
            No pedimos
            <br />
            clientes.
            <br />
            <em>Los seleccionamos.</em>
          </h2>
        </div>

        <div className="manifesto-pillars">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="manifesto-pillar">
              <span className="pillar-number">{pillar.num}</span>
              <div className="pillar-content">
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-text">{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
