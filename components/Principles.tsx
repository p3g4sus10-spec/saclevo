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
    const usePins = tier !== "lite" && tier !== "reduced";

    // Kinetic text
    const kineticCtx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".kinetic-word");

      if (tier === "reduced") {
        gsap.set(words, { opacity: 1, x: 0 });
        return;
      }

      if (!usePins) {
        // Simple fade-in for the lite tier.
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
      if (tier === "reduced") {
        gsap.set([".principle-pillar", ".principles-big-text"], {
          opacity: 1,
          x: 0,
          y: 0,
        });
        return;
      }
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



