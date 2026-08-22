"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    num: "01",
    title: "EVIDENCIA SOBRE OPINIÓN.",
    text: "No optimizamos por lo que «se siente». Observamos, probamos y medimos.",
  },
  {
    num: "02",
    title: "SISTEMA SOBRE IMPROVISACIÓN.",
    text: "Cada activo debe tener una función dentro del recorrido. Nada existe por azar.",
  },
  {
    num: "03",
    title: "CLARIDAD SOBRE VOLUMEN.",
    text: "Más contenido no corrige una propuesta que nadie entiende.",
  },
  {
    num: "04",
    title: "ITERACIÓN SOBRE EGO.",
    text: "Si el mercado contradice una hipótesis, cambiamos la hipótesis.",
  },
];

const phrases = [
  { text: "NO VENDEMOS PIEZAS SUELTAS.", filled: false },
  { text: "CONSTRUIMOS SISTEMAS.", filled: false },
  { text: "NO ES SUERTE. ES SISTEMA.", filled: true },
];

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tier = getMotionTier();
    const usePins = tier !== "lite" && tier !== "reduced";

    // Kinetic text
    const kineticCtx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      const words = gsap.utils.toArray<HTMLElement>(".kinetic-word");

      if (!usePins) {
        // Simple fade-in for lite/reduced
        gsap.fromTo(
          words,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.6, stagger: 0.2, ease: "power2.out",
            scrollTrigger: { trigger: kineticRef.current, start: "top 80%" },
          }
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: kineticRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      words.forEach((word, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        gsap.set(word, { x: direction * (window.innerWidth * 0.4), opacity: 0 });
        tl.to(word, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, i * 0.8);

        if (i === words.length - 1) {
          tl.to(word, {
            duration: 0.5,
            onStart: () => word.classList.add("filled"),
          }, (i + 0.5) * 0.8);
        }
      });
    }, kineticRef);

    // Manifesto pillars
    const pillarsCtx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".principle-pillar",
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".principles-grid", start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".principles-big-text",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".principles-big-text", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => {
      kineticCtx.revert();
      pillarsCtx.revert();
    };
  }, []);

  return (
    <>
      {/* Kinetic Typography */}
      <section
        ref={kineticRef}
        className="kinetic-section"
        aria-label="Manifiesto SCALEVO"
        style={{ height: "100dvh" }}
      >
        <div className="kinetic-pin-container">
          {phrases.map((phrase, i) => (
            <div
              key={i}
              className="kinetic-word"
              style={{
                top: `${30 + i * 28}%`,
                left: i % 2 === 0 ? "5%" : undefined,
                right: i % 2 !== 0 ? "5%" : undefined,
              }}
              aria-label={phrase.text}
            >
              {phrase.text}
            </div>
          ))}
        </div>
      </section>

      {/* Principles / Philosophy */}
      <section
        ref={sectionRef}
        className="principles-section"
        id="method"
        aria-label="Principios SCALEVO"
      >
        <div className="principles-grid">
          <div>
            <p className="section-label">// NUESTRA FILOSOFÍA</p>
            <h2 className="principles-big-text">
              NO BUSCAMOS
              <br />
              VOLUMEN.
              <br />
              <em>BUSCAMOS FIT.</em>
            </h2>
          </div>

          <div className="principles-pillars">
            {principles.map((p) => (
              <div key={p.num} className="principle-pillar">
                <span className="pillar-number">{p.num}</span>
                <div className="pillar-content">
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-text">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}



