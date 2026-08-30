"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion";
import { BOOKING, CALENDLY_URL, CTA_LABELS } from "@/config/site";
import { getValidatedCalendlyEvent } from "@/lib/calendly";
import {
  claimSessionEvent,
  track,
} from "@/lib/analytics";
import { useSectionView } from "@/lib/useSectionView";
import BookingLink from "@/components/BookingLink";

gsap.registerPlugin(ScrollTrigger);

type CalendlyState = "gated" | "idle" | "loading" | "ready" | "error";
type CalendlyApi = {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement;
    prefill: Record<string, never>;
  }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

const CALENDLY_SCRIPT_ID = "scalevo-calendly-script";
const CALENDLY_STYLE_ID = "scalevo-calendly-style";

export default function DiagnosticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const openTrackedRef = useRef(false);
  const bookingTrackedRef = useRef(false);
  const [calendlyState, setCalendlyState] =
    useState<CalendlyState>(BOOKING.enabled ? "idle" : "gated");
  useSectionView(sectionRef, "diagnostic");

  useEffect(() => {
    if (!BOOKING.enabled) return;

    const handleMessage = (event: MessageEvent) => {
      const iframeWindow =
        widgetRef.current?.querySelector("iframe")?.contentWindow ?? null;
      const eventName = getValidatedCalendlyEvent(event, iframeWindow);

      if (!eventName) {
        return;
      }

      if (!openTrackedRef.current) {
        openTrackedRef.current = true;
        if (claimSessionEvent("calendly_open:diagnostic_widget")) {
          track("calendly_open", {
            placement: "diagnostic_widget",
            open_mode: "embedded",
          });
        }
      }

      if (eventName !== "calendly.event_scheduled" || bookingTrackedRef.current) {
        return;
      }

      bookingTrackedRef.current = true;
      if (claimSessionEvent("booking_complete:diagnostic_widget")) {
        track("booking_complete", {
          placement: "diagnostic_widget",
          source: "calendly_iframe",
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!BOOKING.enabled) return;

    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const failWidget = (reason: string) => {
      setCalendlyState("error");
      track("analytics_error", {
        stage: "calendly_widget",
        error_code: reason,
      });
    };

    const initializeWidget = () => {
      if (initializedRef.current || !widgetRef.current) return;
      if (!window.Calendly) {
        failWidget("library_unavailable");
        return;
      }

      try {
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: widgetRef.current,
          prefill: {},
        });
        initializedRef.current = true;
        setCalendlyState("ready");
        if (claimSessionEvent("calendly_widget_loaded:diagnostic_widget")) {
          track("calendly_widget_loaded", {
            placement: "diagnostic_widget",
          });
        }
      } catch {
        failWidget("initialization_failed");
      }
    };

    const loadWidget = () => {
      if (initializedRef.current) return;
      setCalendlyState("loading");

      if (!document.getElementById(CALENDLY_STYLE_ID)) {
        const stylesheet = document.createElement("link");
        stylesheet.id = CALENDLY_STYLE_ID;
        stylesheet.rel = "stylesheet";
        stylesheet.href =
          "https://assets.calendly.com/assets/external/widget.css";
        document.head.appendChild(stylesheet);
      }

      const existingScript = document.getElementById(
        CALENDLY_SCRIPT_ID,
      ) as HTMLScriptElement | null;

      if (window.Calendly) {
        initializeWidget();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener("load", initializeWidget, {
          once: true,
        });
        existingScript.addEventListener(
          "error",
          () => failWidget("script_load_failed"),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.id = CALENDLY_SCRIPT_ID;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.addEventListener("load", initializeWidget, { once: true });
      script.addEventListener(
        "error",
        () => failWidget("script_load_failed"),
        { once: true },
      );
      document.head.appendChild(script);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadWidget();
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === "reduced") return;
      gsap.fromTo(
        ".diag-headline",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".diag-headline", start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".diag-benefit",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".diag-benefits", start: "top 80%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const isError = calendlyState === "error";

  return (
    <section
      ref={sectionRef}
      className="calendly-section"
      id="diagnostic"
      aria-labelledby="diagnostic-heading"
    >
      <div className="calendly-bg-glow" aria-hidden="true" />
      <div className="calendly-bg-grid" aria-hidden="true" />

      <div className="calendly-inner">
        <div className="calendly-copy">
          <p className="section-label">// HABLEMOS DE TU CASO</p>
          <h2 className="section-title diag-headline" id="diagnostic-heading">
            Descubre qué está frenando
            <br />
            <em>tu presencia digital.</em>
          </h2>

          <p className="calendly-sub">
            En 30 minutos revisamos dónde se pierde claridad, qué oportunidad
            conviene priorizar y cuál es el siguiente paso más sensato para tu
            negocio. Puede ser SCALE BASIC, PHANTOM 30, SCALE FULL, una
            recomendación externa o no avanzar.
          </p>

          <ul
            className="calendly-benefits diag-benefits"
            aria-label="Sobre el diagnóstico"
          >
            {[
              "Una lectura clara de tu situación actual",
              "El principal punto que conviene corregir",
              "Una recomendación concreta de siguiente paso",
              "Honestidad si todavía no conviene avanzar",
            ].map((benefit) => (
              <li key={benefit} className="calendly-benefit diag-benefit">
                <span className="benefit-icon" aria-hidden="true">→</span>
                <span className="benefit-text">{benefit}</span>
              </li>
            ))}
          </ul>

          {BOOKING.enabled ? (
            <BookingLink
              placement="diagnostic_primary"
              ctaId="diagnostic_primary"
              ctaText={CTA_LABELS.booking}
              className="calendly-cta-link"
              id="calendly-main-cta"
            >
              <span className="cta-dot" aria-hidden="true" />
              {CTA_LABELS.booking}
              <span className="cta-arrow" aria-hidden="true">→</span>
            </BookingLink>
          ) : (
            <div className="diagnostic-gate-note" role="note">
              <strong>DIAGNÓSTICO DE 30 MINUTOS</strong>
              <span>
                Una conversación enfocada para entender el problema, priorizar
                lo importante y elegir el siguiente paso.
              </span>
            </div>
          )}

          <p className="calendly-disclaimer">
            30 MINUTOS · SIN COMPROMISO
          </p>
        </div>

        <div className="calendly-widget-wrap">
          <div className="calendly-widget-card">
            <div className="widget-card-header" aria-hidden="true">
              <div className="widget-dot green" />
              <div className="widget-dot yellow" />
              <div className="widget-dot red" />
              <span className="widget-card-title">
                DIAGNÓSTICO SCALEVO · 30 MINUTOS
              </span>
            </div>

            {BOOKING.enabled ? (
              <>
                <div
                  ref={widgetRef}
                  className="scalevo-calendly-widget"
                  id="calendly-widget-container"
                  aria-label="Widget de agendamiento Calendly"
                />

                {calendlyState !== "ready" && (
                  <div className="widget-placeholder" aria-live="polite">
                    <div className="widget-placeholder-icon" aria-hidden="true">
                      📅
                    </div>
                    <p className="widget-placeholder-text">
                      {isError
                        ? "El calendario no cargó aquí. Puedes abrirlo en otra pestaña."
                        : "Cargando el calendario de 30 minutos…"}
                    </p>
                    <BookingLink
                      placement="diagnostic_fallback"
                      ctaId="calendly_fallback"
                      ctaText={CTA_LABELS.calendlyFallback}
                      className="widget-fallback-btn"
                      id="calendly-fallback-btn"
                    >
                      {CTA_LABELS.calendlyFallback}
                    </BookingLink>
                  </div>
                )}

                {calendlyState === "ready" && (
                  <BookingLink
                    placement="diagnostic_alternate"
                    ctaId="calendly_alternate"
                    ctaText={CTA_LABELS.calendlyFallback}
                    className="calendly-alternate-link"
                    id="calendly-alternate-link"
                  >
                    {CTA_LABELS.calendlyFallback}
                  </BookingLink>
                )}
              </>
            ) : (
              <div className="widget-gate-panel">
                <p className="widget-gate-label">UNA CONVERSACIÓN ÚTIL</p>
                <h3>Claridad, incluso si no trabajamos juntos.</h3>
                <p>
                  Revisamos qué entiende hoy una persona al encontrarte, dónde se
                  pierde confianza y qué acción puede mejorar el camino hacia una
                  conversación comercial.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
