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

    const ctx = gsap.context(() => {
      if (tier === "reduced") return;
      // Header
      gsap.fromTo(
        ".phantom-system-header",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
          scrollTrigger: {
            trigger: ".phantom-system-header",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Stage cards stagger
      const stagesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".phantom-stages",
          start: "top 80%",
          once: true,
        },
      });
      stagesTimeline.fromTo(
        ".phantom-stage",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        }
      );

      stagesTimeline.fromTo(
        ".phantom-stage-id",
        {
          opacity: 0.45,
          textShadow: "0 0 0 rgba(116, 135, 255, 0)",
        },
        {
          opacity: 1,
          textShadow: "0 0 14px rgba(116, 135, 255, 0.3)",
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        },
        "<",
      );
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



