"use client";

import { useEffect, useRef } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHANTOM_30 } from "@/config/offers";
import { CALENDLY_URL } from "@/config/site";
import { track } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

export default function Phantom30() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".p30-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".p30-header", start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".p30-timeline-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".p30-timeline", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".p30-deliverable",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".p30-deliverables", start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".p30-pricing",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".p30-pricing", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="phantom30-section"
      id="phantom-30"
      aria-label="PHANTOM 30 — Founding Sprint"
    >
      {/* Background glow */}
      <div className="p30-bg-glow" aria-hidden="true" />

      <div className="phantom30-inner">
        {/* Header */}
        <div className="p30-header">
          <p className="section-label">// PHANTOM 30</p>
          <h2 className="section-title">
            {PHANTOM_30.headline}
          </h2>
          <p className="p30-supporting">{PHANTOM_30.supporting}</p>
        </div>

        {/* Two-column layout: timeline + deliverables */}
        <div className="p30-grid">
          {/* Timeline */}
          <div>
            <p className="p30-col-label">EL PROCESO</p>
            <ol className="p30-timeline" aria-label="Proceso PHANTOM 30">
              {PHANTOM_30.timeline.map((step) => (
                <li key={step.marker} className="p30-timeline-item">
                  <span className="p30-timeline-marker">{step.marker}</span>
                  <div className="p30-timeline-content">
                    <h3 className="p30-timeline-title">{step.title}</h3>
                    <p className="p30-timeline-desc">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Deliverables */}
          <div>
            <p className="p30-col-label">QUÉ CONSTRUIMOS</p>
            <div className="p30-deliverables">
              {PHANTOM_30.deliverables.map((d) => (
                <div key={d.area} className="p30-deliverable">
                  <h3 className="p30-deliverable-area">{d.area}</h3>
                  <ul>
                    {d.items.map((item) => (
                      <li key={item} className="p30-deliverable-item">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="p30-scope-note">
                ∗ {PHANTOM_30.scopeNote}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing + CTA */}
        <div className="p30-pricing">
          <div className="p30-price-block">
            <div className="p30-price-item">
              <span className="p30-price-label">{PHANTOM_30.price.label}</span>
              <span className="p30-price-amount">
                ${PHANTOM_30.price.total.toLocaleString("es-MX")}
                <span className="p30-price-currency"> {PHANTOM_30.price.currency}</span>
              </span>
            </div>
            <div className="p30-price-divider" aria-hidden="true" />
            <div className="p30-price-item">
              <span className="p30-price-label">{PHANTOM_30.price.activationLabel}</span>
              <span className="p30-price-amount p30-price-activation">
                ${PHANTOM_30.price.activation.toLocaleString("es-MX")}
                <span className="p30-price-currency"> {PHANTOM_30.price.currency}</span>
              </span>
            </div>
            <div className="p30-price-item">
              <span className="p30-price-label">DURACIÓN</span>
              <span className="p30-price-amount p30-price-duration">30 días</span>
            </div>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon p30-cta"
            onClick={() => { track("phantom30_cta_click", { placement: "phantom30", cta_text: "APLICAR PARA PHANTOM 30" }); track("calendly_open", { placement: "phantom30" }); }}
          >
            <span className="btn-neon-dot" aria-hidden="true" />
            AGENDAR DIAGNÓSTICO
            <span className="btn-neon-arrow" aria-hidden="true">→</span>
          </a>
          <p className="p30-disclaimer">
            Sin compromiso · Gratuito · 30 minutos
          </p>
        </div>
      </div>
    </section>
  );
}



