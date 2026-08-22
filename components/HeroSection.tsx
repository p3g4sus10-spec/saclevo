"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CALENDLY_URL, SOCIAL } from "@/config/site";
import { getMotionTier, PARTICLE_COUNTS, CANVAS_SIZES, MOTION_FEATURES } from "@/lib/motion";
import { track } from "@/lib/analytics";

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
    img.src = "/scalevo-logo-particles.png";
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

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === "elite" ? 2 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Initial chaos positions
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const r = 9 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI;
      positions[i3] = r * Math.sin(ph) * Math.cos(th);
      positions[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i3 + 2] = r * Math.cos(ph);

      const isNeon = Math.random() < 0.25;
      if (isNeon) {
        colors[i3] = 0.08; colors[i3 + 1] = 0.4; colors[i3 + 2] = 1.0;
      } else {
        const b = 0.35 + Math.random() * 0.45;
        colors[i3] = b; colors[i3 + 1] = b; colors[i3 + 2] = b;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.034 : 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let targetPositions: Float32Array | null = null;
    let morphProgress = 0;
    let mouseX = 0, mouseY = 0;
    let rafId: number | null = null;
    let cancelled = false;
    let morphTimerId: ReturnType<typeof setTimeout>;
    let isVisible = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!features.cameraParallax) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const startTime = performance.now();

    const animate = () => {
      if (cancelled) return;
      rafId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;
      const pos = geometry.attributes.position.array as Float32Array;

      if (targetPositions && morphProgress > 0) {
        const ease = 1 - Math.pow(1 - Math.min(morphProgress, 1), 3);
        const speed = 0.07 * ease;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          pos[i3] += (targetPositions[i3] - pos[i3]) * speed;
          pos[i3 + 1] += (targetPositions[i3 + 1] - pos[i3 + 1]) * speed;
          pos[i3 + 2] += (targetPositions[i3 + 2] - pos[i3 + 2]) * speed;
        }
        if (features.breathingParticles && morphProgress > 0.97) {
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            pos[i3] += Math.sin(elapsed * 0.4 + i * 0.05) * 0.00025;
            pos[i3 + 1] += Math.cos(elapsed * 0.3 + i * 0.04) * 0.00025;
          }
        }
      } else {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          pos[i3] += Math.sin(elapsed * 0.2 + i * 0.08) * 0.0006;
          pos[i3 + 1] += Math.cos(elapsed * 0.15 + i * 0.06) * 0.0006;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      if (features.cameraParallax) {
        camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.15 - camera.position.y) * 0.02;
      }

      const rot = morphProgress > 0.9 ? 0.001 : 0.018 * (1 - morphProgress);
      points.rotation.y = elapsed * rot;

      renderer.render(scene, camera);
    };

    const handleVisibility = () => {
      const shouldRun = isVisible && document.visibilityState === "visible";
      if (shouldRun && !rafId) {
        animate();
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // ── Visibility-aware render loop (pause when off-screen)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { 
        isVisible = entry.isIntersecting; 
        handleVisibility();
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(canvas);

    document.addEventListener("visibilitychange", handleVisibility);
    animate();

    // ── Load logo → morph (starts 1.2s after mount — no preloader dependency)
    async function loadAndSchedule() {
      if (!features.morph) return;
      const logoPos = await buildLogoFromImage(PARTICLE_COUNT, isMobile, canvasSize);
      if (cancelled) return;
      targetPositions = logoPos;

      morphTimerId = setTimeout(() => {
        if (cancelled) return;
        gsap.to({ v: 0 }, {
          v: 1,
          duration: 4.0,
          ease: "power2.inOut",
          onUpdate: function () {
            morphProgress = (this.targets()[0] as { v: number }).v;
          },
        });
      }, 1200); // Reduced from 2500ms — content is visible immediately now
    }
    loadAndSchedule();

    // ── ScrollTrigger: boost morph on early scroll
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=400",
      onUpdate: (self) => {
        const boosted = Math.min(self.progress * 1.3, 1);
        if (boosted > morphProgress) morphProgress = boosted;
      },
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(morphTimerId);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", onResize);
      visibilityObserver.disconnect();
      st.kill();
      textCtx.revert();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
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
          onClick={() => track("instagram_click", { placement: "hero_strip" })}
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
          onClick={() => track("tiktok_click", { placement: "hero_strip" })}
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
      <div ref={contentRef} className="hero-content" style={{ opacity: 0 }}>
        <span className="hero-eyebrow">SCALEVO · PHANTOM SYSTEM</span>

        <h1 className="hero-h1">
          <span className="line-mask"><span className="line-inner">NO ES SUERTE.</span></span>
          <span className="line-mask"><span className="line-inner">ES SISTEMA.</span></span>
        </h1>

        <p className="hero-subtitle">
          Construimos sistemas de posicionamiento, contenido y conversión
          para negocios que son mejores de lo que parecen digitalmente.
        </p>

        <div className="hero-cta-group">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon"
            id="hero-cta-primary"
            onClick={() => track("hero_primary_cta_click", { placement: "hero_primary", cta_text: "AGENDAR DIAGNÓSTICO" })}
          >
            <span className="btn-neon-dot" aria-hidden="true" />
            AGENDAR DIAGNÓSTICO
            <span className="btn-neon-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href="#phantom-system"
            className="btn-ghost"
            id="hero-cta-secondary"
            onClick={() => track("hero_secondary_cta_click", { placement: "hero_secondary", cta_text: "Ver cómo funciona ↓" })}
          >
            Ver cómo funciona ↓
          </a>
        </div>

        <p className="hero-microcopy">
          PHANTOM 30 · Sprint de implementación · 30 días
        </p>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero-scroll-indicator" aria-hidden="true" style={{ opacity: 0 }}>
        <span className="scroll-text">Scroll</span>
        <div className="scroll-chevrons">
          <span /><span /><span />
        </div>
      </div>
    </section>
  );
}



