"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CALENDLY_URL =
  "https://calendly.com/scalevo-mx/30min?utm_source=g&utm_medium=social&utm_content=link_in_bio";

export default function CalendlySection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const widgetRef   = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Load Calendly widget script once and lazily
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loaded) {
          setLoaded(true);
          observer.disconnect();

          // Inline Calendly widget script (no external async attribute issues)
          const link = document.createElement("link");
          link.rel  = "stylesheet";
          link.href = "https://assets.calendly.com/assets/external/widget.css";
          document.head.appendChild(link);

          const script = document.createElement("script");
          script.src   = "https://assets.calendly.com/assets/external/widget.js";
          script.async = true;
          script.onload = () => {
            if (widgetRef.current && (window as unknown as Record<string, unknown>).Calendly) {
              const CalendlyLib = (window as unknown as Record<string, { initInlineWidget: (opts: Record<string, unknown>) => void }>).Calendly;
              CalendlyLib.initInlineWidget({
                url:            CALENDLY_URL,
                parentElement:  widgetRef.current,
                prefill:        {},
                utm:            {
                  utmSource:  "g",
                  utmMedium:  "social",
                  utmContent: "link_in_bio",
                },
              });
            }
          };
          document.head.appendChild(script);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [loaded]);

  // GSAP entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".calendly-headline", {
        opacity: 0, y: 48,
        duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".calendly-headline", start: "top 80%" },
      });
      gsap.from(".calendly-benefit", {
        opacity: 0, y: 32,
        duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".calendly-benefits", start: "top 80%" },
      });
      gsap.from(".calendly-cta-link", {
        opacity: 0, scale: 0.9,
        duration: 0.7, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".calendly-cta-link", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="calendly-section"
      id="diagnostic"
      aria-label="Agenda tu sesión estratégica — SCALEVO"
    >
      {/* Background glow */}
      <div className="calendly-bg-glow" aria-hidden="true" />
      <div className="calendly-bg-grid"  aria-hidden="true" />

      <div className="calendly-inner">
        {/* Left column — copy */}
        <div className="calendly-copy">
          <p className="section-label">// SIGUIENTE PASO</p>

          <h2 className="section-title calendly-headline">
            30 minutos que pueden{" "}
            <em style={{ fontStyle: "normal", color: "var(--brand-blue)" }}>
              cambiar tu negocio
            </em>
          </h2>

          <p className="calendly-sub">
            Sin formularios. Sin esperas. Una sesión directa donde
            analizamos tu situación y te entregamos el mapa exacto para
            escalar tu negocio — sin costo.
          </p>

          {/* Benefits */}
          <ul className="calendly-benefits" aria-label="Beneficios de la sesión">
            {[
              { icon: "⚡", text: "Diagnóstico personalizado en tiempo real" },
              { icon: "🎯", text: "Estrategia específica para tu modelo de negocio" },
              { icon: "🔒", text: "Sin compromiso. 100% gratuito." },
              { icon: "⏱", text: "30 minutos de alto impacto" },
            ].map((b, i) => (
              <li key={i} className="calendly-benefit">
                <span className="benefit-icon">{b.icon}</span>
                <span className="benefit-text">{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Primary CTA */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="calendly-cta-link"
            id="calendly-main-cta"
            aria-label="Abrir Calendly para agendar sesión SCALEVO"
          >
            <span className="cta-dot" aria-hidden="true" />
            AGENDA TU SESIÓN GRATUITA
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>

          <p className="calendly-disclaimer">
            Disponibilidad limitada · Sin spam · Elige tu horario
          </p>
        </div>

        {/* Right column — Calendly embed */}
        <div className="calendly-widget-wrap">
          <div className="calendly-widget-card">
            <div className="widget-card-header">
              <div className="widget-dot green" />
              <div className="widget-dot yellow" />
              <div className="widget-dot red" />
              <span className="widget-card-title">calendly.com/scalevo-mx</span>
            </div>

            {/* Inline widget mount point */}
            <div
              ref={widgetRef}
              className="calendly-inline-widget"
              id="calendly-widget-container"
              aria-label="Widget de agendamiento Calendly"
            />

            {/* Fallback button if widget doesn't load */}
            {!loaded && (
              <div className="widget-placeholder">
                <div className="widget-placeholder-icon">📅</div>
                <p className="widget-placeholder-text">
                  Elige tu horario ideal
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-fallback-btn"
                  id="calendly-fallback-btn"
                >
                  ABRIR CALENDLY →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
