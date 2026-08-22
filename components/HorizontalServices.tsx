"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "SCALE\nIDENTITY",
    desc: "Tu marca que genera respeto automático. Branding completo con sistema visual neurológico, logo, paleta, tipografía y guía de marca.",
    metric: "+280% Reconocimiento de Marca",
    tags: ["Branding", "Logo", "Sistema Visual"],
  },
  {
    num: "02",
    title: "SCALE\nWEB",
    desc: "Tu vendedor 24/7 que nunca duerme. Páginas web de conversión máxima con copywriting neurológico y diseño élite.",
    metric: "+340% Tasa de Conversión",
    tags: ["Web Design", "Copywriting", "CRO"],
  },
  {
    num: "03",
    title: "SCALE\nCONTENT",
    desc: "Contenido que trabaja mientras tú duermes. Sistema de videos virales y presencia digital que magnetiza clientes ideales.",
    metric: "+520% Alcance Orgánico",
    tags: ["Video", "Redes Sociales", "Viral"],
  },
  {
    num: "04",
    title: "SCALE\nFULL",
    desc: "El sistema completo. Diagnóstico + Identidad + Web + Contenido. Tu ecosistema de crecimiento totalmente diseñado.",
    metric: "+890% ROI Promedio",
    tags: ["Sistema Completo", "Growth", "Dominancia"],
    highlight: true,
  },
];

export default function HorizontalServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return; // Vertical on mobile

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getScrollAmount = () => {
        const trackW = track.scrollWidth;
        return -(trackW - window.innerWidth + 160);
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount()) + window.innerHeight}`,
        pin: stickyRef.current,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          const amount = getScrollAmount();
          gsap.set(track, {
            x: amount * self.progress,
          });
        },
        invalidateOnRefresh: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Bento reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.08,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="services-section"
      id="services"
      aria-label="Servicios SCALEVO"
      style={{ height: isMobile ? "auto" : `${(services.length + 1) * 100}vh` }}
    >
      <div ref={stickyRef} className="services-sticky">
        <div className="services-header">
          <p className="services-label">// SISTEMA SCALEVO</p>
          <h2 className="services-title">
            Cuatro armas.<br />Un objetivo.
          </h2>
        </div>

        <div ref={trackRef} className="services-track">
          {services.map((svc, i) => (
            <article
              key={i}
              className="service-card"
              style={
                svc.highlight
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(26,26,255,0.08) 0%, rgba(255,107,0,0.04) 100%)",
                      borderColor: "rgba(26,26,255,0.3)",
                    }
                  : {}
              }
              data-cursor-hover
            >
              <p className="service-card-number">{svc.num} /</p>

              {/* Icon SVG */}
              <div className="service-card-icon">
                {i === 0 && (
                  <svg viewBox="0 0 48 48" fill="none">
                    <path
                      d="M8 40 L24 8 L40 40"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 32 L36 32"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {i === 1 && (
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect
                      x="4"
                      y="8"
                      width="40"
                      height="32"
                      rx="2"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 20 L44 20"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                    />
                    <circle cx="24" cy="38" r="2" fill="#1A1AFF" />
                  </svg>
                )}
                {i === 2 && (
                  <svg viewBox="0 0 48 48" fill="none">
                    <polygon
                      points="20,8 40,24 20,40"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 24 L20 24"
                      stroke="#1A1AFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {i === 3 && (
                  <svg viewBox="0 0 48 48" fill="none">
                    <path
                      d="M8 36 L16 24 L24 30 L32 16 L40 12"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="40" cy="12" r="3" fill="#FF6B00" />
                  </svg>
                )}
              </div>

              <h3 className="service-card-title">{svc.title}</h3>
              <p className="service-card-desc">{svc.desc}</p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      color: "var(--text-subtle)",
                      padding: "4px 10px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="service-card-metric">{svc.metric}</span>

              <div className="service-card-arrow" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 12 L12 2 M6 2 L12 2 L12 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
