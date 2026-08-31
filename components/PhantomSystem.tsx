"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHANTOM_SYSTEM_STAGES } from "@/config/offers";
import { useSectionView } from "@/lib/useSectionView";
import { getMotionTier } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function PhantomSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "phantom_system");

  useEffect(() => {
    const tier = getMotionTier();
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      // Header
      gsap.fromTo(
        ".phantom-system-header",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: ".phantom-system-header", start: "top 82%" },
        }
      );

      // Stage cards stagger
      gsap.fromTo(
        ".phantom-stage",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".phantom-stages", start: "top 80%" },
        }
      );

      // Connector lines (desktop only)
      if (!isMobile && tier !== "lite" && tier !== "reduced") {
        gsap.fromTo(
          ".phantom-connector",
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1, ease: "power2.inOut",
            scrollTrigger: { trigger: ".phantom-stages", start: "top 75%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="phantom-system-section"
      id="phantom-system"
      aria-label="El sistema PHANTOM"
    >
      <div className="phantom-system-inner">
        <div className="phantom-system-header">
          <p className="section-label">// PHANTOM SYSTEM</p>
          <h2 className="section-title">
            No hacemos contenido por hacerlo.
            <br />
            <span style={{ color: "var(--text-muted)" }}>
              Construimos el camino completo.
            </span>
          </h2>
          <p className="phantom-system-sub">
            PHANTOM alinea lo que dices, lo que muestras y el siguiente paso que
            puede dar una persona interesada.
          </p>
        </div>

        <div className="phantom-stages" role="list">
          {PHANTOM_SYSTEM_STAGES.map((stage, i) => (
            <article
              key={stage.id}
              className="phantom-stage"
              role="listitem"
              data-cursor-hover
            >
              <span className="phantom-stage-id">{stage.id}</span>
              <div className="phantom-stage-content">
                <h3 className="phantom-stage-title">{stage.label}</h3>
                <p className="phantom-stage-desc">{stage.desc}</p>
              </div>
              {i < PHANTOM_SYSTEM_STAGES.length - 1 && (
                <div className="phantom-connector" aria-hidden="true" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



