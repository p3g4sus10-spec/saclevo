"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion";
import { useSectionView } from "@/lib/useSectionView";

gsap.registerPlugin(ScrollTrigger);

export default function Qualification() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "qualification");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === "reduced") return;
      gsap.fromTo(
        ".qual-header",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".qual-header", start: "top 82%" },
        },
      );
      gsap.fromTo(
        ".qual-col",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".qual-grid", start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="qualification-section"
      id="qualification"
      aria-labelledby="qualification-heading"
    >
      <div className="qualification-inner">
        <div className="qual-header">
          <p className="section-label">// PARA QUIÉN SÍ / PARA QUIÉN NO</p>
          <h2 className="section-title" id="qualification-heading">
            Trabajamos mejor con negocios que ya tienen algo valioso que
            demostrar.
          </h2>
        </div>

        <div className="qual-grid">
          <article className="qual-col qual-col-yes">
            <div className="qual-col-header">
              <span
                className="qual-col-indicator qual-yes-indicator"
                aria-hidden="true"
              />
              <h3 className="qual-col-title">PUEDE SER PARA TI</h3>
            </div>
            <p className="qual-statement">
              Si entregas bien, puedes atender nuevas oportunidades, estás
              dispuesto a tomar decisiones y quieres construir una presencia más
              clara —no solo publicar más—.
            </p>
          </article>

          <article className="qual-col qual-col-no">
            <div className="qual-col-header">
              <span
                className="qual-col-indicator qual-no-indicator"
                aria-hidden="true"
              />
              <h3 className="qual-col-title">PROBABLEMENTE NO ES PARA TI</h3>
            </div>
            <p className="qual-statement qual-statement-muted">
              Si necesitas que alguien te prometa ventas o viralidad, producción
              ilimitada o una solución que funcione sin tu participación. También
              conviene esperar si hoy no puedes cumplir una mayor demanda.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
