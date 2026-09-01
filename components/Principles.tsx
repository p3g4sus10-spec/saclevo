"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion";
import { useSectionView } from "@/lib/useSectionView";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    num: "01",
    title: "MIRAR ANTES DE SUPONER.",
    text: "Primero entendemos qué está pasando. Después decidimos qué cambiar.",
  },
  {
    num: "02",
    title: "CADA PIEZA TIENE UN PROPÓSITO.",
    text: "Nada se publica solo para llenar un calendario.",
  },
  {
    num: "03",
    title: "CLARIDAD ANTES QUE CANTIDAD.",
    text: "Más contenido no ayuda si tu oferta sigue siendo difícil de entender.",
  },
  {
    num: "04",
    title: "MEJORAR SIN AFERRARNOS.",
    text: "Si la respuesta del mercado contradice una idea, ajustamos la idea.",
  },
];

const phrases = [
  { text: "NO HACEMOS CONTENIDO POR HACERLO.", filled: false },
  { text: "CADA PIEZA TIENE UN PROPÓSITO.", filled: false },
  { text: "NO ES SUERTE. ES SISTEMA.", filled: true },
];

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "principles");

  useEffect(() => {
    const tier = getMotionTier();

    // Kinetic text reveals once; it never pins or takes over scrolling.
    const kineticCtx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".kinetic-word");

      if (tier === "reduced") {
        gsap.set(words, { opacity: 1, x: 0, y: 0 });
        return;
      }

      const lateralDistance = () => {
        if (window.innerWidth <= 480) return 28;
        if (window.innerWidth < 1440) return 48;
        return 64;
      };

      words.forEach((word, index) => {
        const direction = index === 1 ? 1 : -1;
        const isClosingPhrase = word.classList.contains("filled");

        gsap.fromTo(
          word,
          {
            opacity: 0,
            x: () => direction * lateralDistance(),
            ...(isClosingPhrase
              ? { textShadow: "0 0 0 rgba(26, 26, 255, 0)" }
              : {}),
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            ...(isClosingPhrase
              ? { textShadow: "0 0 28px rgba(26, 26, 255, 0.28)" }
              : {}),
            scrollTrigger: {
              trigger: word,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, kineticRef);

    // Manifesto pillars
    const pillarsCtx = gsap.context(() => {
      if (tier === "reduced") {
        gsap.set([
          ".principles-section .section-label",
          ".principle-pillar",
          ".principles-big-text",
        ], {
          opacity: 1,
          x: 0,
          y: 0,
        });
        return;
      }
      gsap.fromTo(
        ".principles-section .section-label",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".principles-section .section-label",
            start: "top 88%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".principle-pillar",
        { opacity: 0, x: 18 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".principles-grid",
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".principles-big-text",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
          scrollTrigger: {
            trigger: ".principles-big-text",
            start: "top 85%",
            once: true,
          },
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
      >
        <div className="kinetic-pin-container">
          {phrases.map((phrase, i) => (
            <div
              key={i}
              className={`kinetic-word${phrase.filled ? " filled" : ""}`}
              style={{
                top: `${22 + i * 28}%`,
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
        id="principles"
        aria-label="Principios SCALEVO"
      >
        <div className="principles-grid">
          <div>
            <p className="section-label">// CÓMO TRABAJAMOS</p>
            <h2 className="principles-big-text">
              MENOS
              <br />
              RUIDO.
              <br />
              <em>MÁS CLARIDAD.</em>
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



