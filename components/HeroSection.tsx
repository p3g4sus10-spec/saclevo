"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA_LABELS, SOCIAL } from "@/config/site";
import { getMotionTier, PARTICLE_COUNTS, CANVAS_SIZES, MOTION_FEATURES } from "@/lib/motion";
import { track } from "@/lib/analytics";
import BookingLink from "@/components/BookingLink";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Fallback geometric S — used when image load fails or tier=lite
───────────────────────────────────────────────────────────── */
function buildSFallback(count: number, scale: number): Float32Array {
  const pts: [number, number][] = [];
  const R = 0.62 * scale;
  const STEPS = 500;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const a = t * Math.PI;
    pts.push([R * Math.cos(a), R + R * Math.sin(a)]);
  }
  for (let i = 1; i <= 80; i++) {
    const t = i / 80;
    pts.push([-R + 2 * R * t, R - 2 * R * t]);
  }
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS;
    const a = Math.PI + t * Math.PI;
    pts.push([R * Math.cos(a), -R + R * Math.sin(a)]);
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [px, py] = pts[Math.floor(Math.random() * pts.length)];
    out[i * 3] = px + (Math.random() - 0.5) * 0.05 * scale;
    out[i * 3 + 1] = py + (Math.random() - 0.5) * 0.05 * scale;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────
   Load the SCALEVO logo image → sample pixels → 3D positions
───────────────────────────────────────────────────────────── */
async function buildLogoFromImage(count: number, isMobile: boolean, canvasSize: number): Promise<Float32Array> {
  const scale = isMobile ? 1.05 : 1.55;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      // Ensure fonts are ready before sampling
      try { await document.fonts.ready; } catch { /* silent */ }

      const cvs = document.createElement("canvas");
      cvs.width = canvasSize;
      cvs.height = canvasSize;
      const ctx = cvs.getContext("2d", { willReadFrequently: true });
      if (!ctx) { resolve(buildSFallback(count, scale)); return; }

      const pad = canvasSize * 0.08;
      const drawSize = canvasSize - pad * 2;
      const aspect = img.naturalWidth / img.naturalHeight;
      let dw = drawSize, dh = drawSize;
      if (aspect > 1) dh = drawSize / aspect;
      else dw = drawSize * aspect;
      const dx = (canvasSize - dw) / 2;
      const dy = (canvasSize - dh) / 2;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.drawImage(img, dx, dy, dw, dh);

      const { data } = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const pts: [number, number][] = [];

      // step=1 always — rely on canvasSize for perf control
      for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
          const i = (y * canvasSize + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 90) pts.push([x, y]);
        }
      }

      if (pts.length < 300) { resolve(buildSFallback(count, scale)); return; }

      const half = canvasSize / 2;
      const range = (scale * 2.2) / canvasSize;
      const out = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const [px, py] = pts[Math.floor(Math.random() * pts.length)];
        out[i * 3] = (px - half) * range + (Math.random() - 0.5) * 0.025;
        out[i * 3 + 1] = -(py - half) * range + (Math.random() - 0.5) * 0.025;
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      }
      resolve(out);
    };

    img.onerror = () => resolve(buildSFallback(count, scale));
    img.src = "/scalevo-logo-particles.jpg";
  });
}

/* ─────────────────────────────────────────────────────────────
   HeroSection Component
───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const tier = getMotionTier();
    const features = MOTION_FEATURES[tier];
    const PARTICLE_COUNT = PARTICLE_COUNTS[tier];
    const canvasSize = CANVAS_SIZES[tier];
    const isMobile = window.innerWidth < 768;

    // GSAP Entrance Animation
    const textCtx = gsap.context(() => {
      if (tier === "reduced") {
        if (contentRef.current) contentRef.current.style.opacity = "1";
        if (scrollRef.current) scrollRef.current.style.opacity = "1";
        gsap.set([".hero-eyebrow", ".hero-subtitle", ".hero-cta-group", ".hero-microcopy", ".line-inner"], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(contentRef.current, { opacity: 0 });
      gsap.set(scrollRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.to(contentRef.current, { opacity: 1, duration: 0.8 })
        .fromTo(
          ".line-inner",
          { y: 80, rotationZ: 4, opacity: 0 },
          { y: 0, rotationZ: 0, opacity: 1, duration: 1, stagger: 0.15 },
          "-=0.6"
        )
        .fromTo(
          ".hero-eyebrow, .hero-subtitle, .hero-cta-group, .hero-microcopy",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.6"
        )
        .to(scrollRef.current, { opacity: 1, duration: 0.8 }, "-=0.2");
    }, sectionRef);

    if (tier === "reduced") {
      // Return early, don't start Three.js for reduced motion
      return () => textCtx.revert();
    }

    // If no WebGL — just show canvas background color and return
    if (!features.webgl || PARTICLE_COUNT === 0) {
      return () => textCtx.revert();
    }

    let disposed = false;
    let particlesCleanup: (() => void) | undefined;

    void import("@/lib/heroParticles")
      .then(({ startHeroParticles }) => {
        if (disposed) return;
        particlesCleanup = startHeroParticles({
          canvas,
          section,
          tier,
          features,
          particleCount: PARTICLE_COUNT,
          isMobile,
          buildLogo: () =>
            buildLogoFromImage(PARTICLE_COUNT, isMobile, canvasSize),
        });
      })
      .catch(() => {
        if (!disposed) canvas.hidden = true;
      });

    return () => {
      disposed = true;
      particlesCleanup?.();
      textCtx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      id="hero"
      aria-label="Hero — SCALEVO"
    >
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />

      {/* Vignette */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* Left social strip */}
      <div className="hero-social-strip" aria-label="Redes sociales">
        <a
          href={SOCIAL.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-social-link"
          id="hero-instagram-link"
          aria-label={SOCIAL.instagram.label}
          onClick={() =>
            track("social_click", {
              platform: "instagram",
              placement: "hero_strip",
              destination_type: "social",
            })
          }
        >
          <span className="hero-social-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </span>
          <span className="hero-social-label">IG</span>
        </a>

        <div className="hero-social-divider" aria-hidden="true" />

        <a
          href={SOCIAL.tiktok.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-social-link"
          id="hero-tiktok-link"
          aria-label={SOCIAL.tiktok.label}
          onClick={() =>
            track("social_click", {
              platform: "tiktok",
              placement: "hero_strip",
              destination_type: "social",
            })
          }
        >
          <span className="hero-social-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
            </svg>
          </span>
          <span className="hero-social-label">TK</span>
        </a>

        <div className="hero-social-line" aria-hidden="true" />
      </div>

      {/* Content — always visible immediately, no preloader dependency */}
      <div ref={contentRef} className="hero-content">
        <span className="hero-eyebrow">
          SCALEVO · PERCEPCIÓN, CONTENIDO Y CONVERSIÓN
        </span>

        <h1 className="hero-h1">
          <span className="line-mask">
            <span className="line-inner">TU NEGOCIO PUEDE SER MEJOR</span>
          </span>
          <span className="line-mask">
            <span className="line-inner">DE LO QUE PARECE ONLINE.</span>
          </span>
        </h1>

        <p className="hero-subtitle">
          Cuando lo que la gente ve no refleja lo que realmente entregas,
          puedes perder oportunidades antes de que exista una conversación.
          Te ayudamos a cerrar esa brecha.
        </p>

        <div className="hero-cta-group">
          <BookingLink
            placement="hero_primary"
            ctaId="hero_primary"
            className="btn-neon"
            id="hero-cta-primary"
          >
            <span className="btn-neon-dot" aria-hidden="true" />
            {CTA_LABELS.primary}
            <span className="btn-neon-arrow" aria-hidden="true">→</span>
          </BookingLink>
          <a
            href="#phantom-system"
            className="btn-ghost"
            id="hero-cta-secondary"
            onClick={() =>
              track("cta_click", {
                placement: "hero_secondary",
                cta_id: "hero_secondary",
                cta_text: CTA_LABELS.secondary,
                destination_type: "anchor",
              })
            }
          >
            {CTA_LABELS.secondary}
          </a>
        </div>

        <p className="hero-microcopy">
          30 minutos · Revisamos tu caso · Sin compromiso
        </p>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero-scroll-indicator" aria-hidden="true">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-chevrons">
          <span /><span /><span />
        </div>
      </div>
    </section>
  );
}



