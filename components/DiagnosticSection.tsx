"use client";

import { useEffect, useRef, useState } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CALENDLY_URL } from "@/config/site";
import { track } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

export default function DiagnosticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [calendlyState, setCalendlyState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data && typeof e.data === "object" && e.data.event === "calendly.event_scheduled") {
        track("booking_complete", { placement: "diagnostic_section" });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasViewed) {
          setHasViewed(true);
          track("diagnostic_section_view", { placement: "diagnostic_section" });

          if (calendlyState === "idle") {
            setCalendlyState("loading");

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://assets.calendly.com/assets/external/widget.css";
            document.head.appendChild(link);

            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            script.onload = () => {
              if (widgetRef.current && (window as unknown as Record<string, unknown>).Calendly) {
                const CalendlyLib = (
                  window as unknown as Record<string, { initInlineWidget: (opts: Record<string, unknown>) => void }>
                ).Calendly;
                try {
                  CalendlyLib.initInlineWidget({
                    url: CALENDLY_URL,
                    parentElement: widgetRef.current,
                    prefill: {},
                  });
                  setCalendlyState("ready");
                  track("calendly_widget_loaded", { placement: "diagnostic_section" });
                } catch {
                  setCalendlyState("error");
                }
              } else {
                setCalendlyState("error");
              }
            };
            script.onerror = () => setCalendlyState("error");
            document.head.appendChild(script);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [calendlyState, hasViewed]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".diag-headline",
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".diag-headline", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".diag-benefit",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".diag-benefits", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="calendly-section"
      id="diagnostic"
      aria-label="Agenda tu diagnóstico — SCALEVO"
    >
      <div className="calendly-bg-glow" aria-hidden="true" />
      <div className="calendly-bg-grid" aria-hidden="true" />

      <div className="calendly-inner">
        {/* Left column */}
        <div className="calendly-copy">
          <p className="section-label">// SIGUIENTE PASO</p>

          <h2 className="section-title diag-headline">
            Tu sistema empieza
            <br />
            <em style={{ fontStyle: "normal", color: "var(--brand-blue)" }}>
              con un diagnóstico.
            </em>
          </h2>

          <p className="calendly-sub">
            15–30 minutos para entender el negocio, detectar el cuello
            de botella principal y decidir si PHANTOM tiene sentido.
            Sin compromiso.
          </p>

          <ul className="calendly-benefits diag-benefits" aria-label="Sobre el diagnóstico">
            {[
              { icon: "⚡", text: "Análisis real de tu situación actual" },
              { icon: "🎯", text: "Identificamos el cuello de botella principal" },
              { icon: "🔒", text: "Sin compromiso. 100% gratuito." },
              { icon: "⏱", text: "15–30 minutos de enfoque total" },
            ].map((b, i) => (
              <li key={i} className="calendly-benefit diag-benefit">
                <span className="benefit-icon">{b.icon}</span>
                <span className="benefit-text">{b.text}</span>
              </li>
            ))}
          </ul>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="calendly-cta-link"
            id="calendly-main-cta"
            aria-label="Abrir Calendly para agendar diagnóstico SCALEVO"
            onClick={() => track("diagnostic_cta_click", { placement: "diagnostic_cta", cta_text: "AGENDAR DIAGNÓSTICO GRATUITO" })}
          >
            <span className="cta-dot" aria-hidden="true" />
            AGENDAR DIAGNÓSTICO GRATUITO
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>

          <p className="calendly-disclaimer">
            ELIGE EL HORARIO DISPONIBLE QUE MEJOR TE FUNCIONE.
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

            <div
              ref={widgetRef}
              className="calendly-inline-widget"
              id="calendly-widget-container"
              aria-label="Widget de agendamiento Calendly"
            />

            {calendlyState !== "ready" && (
              <div className="widget-placeholder">
                <div className="widget-placeholder-icon">📅</div>
                <p className="widget-placeholder-text">Elige tu horario ideal</p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-fallback-btn"
                  id="calendly-fallback-btn"
                  onClick={() => track("calendly_open", { placement: "diagnostic_fallback" })}
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



