"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Fallback geometric S in case the image fails to load.
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
    out[i * 3]     = px + (Math.random() - 0.5) * 0.05 * scale;
    out[i * 3 + 1] = py + (Math.random() - 0.5) * 0.05 * scale;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────
   Load the SCALEVO logo image → draw on canvas → sample pixels.
   Returns 3D particle target positions that exactly match the logo.
───────────────────────────────────────────────────────────── */
function buildLogoFromImage(
  count: number,
  isMobile: boolean
): Promise<Float32Array> {
  const scale = isMobile ? 1.05 : 1.55;
  const canvasSize = isMobile ? 480 : 700;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const cvs = document.createElement("canvas");
      cvs.width  = canvasSize;
      cvs.height = canvasSize;
      const ctx = cvs.getContext("2d", { willReadFrequently: true });
      if (!ctx) { resolve(buildSFallback(count, scale)); return; }

      /* Fit the logo centred, with 8% padding on each side */
      const pad = canvasSize * 0.08;
      const drawSize = canvasSize - pad * 2;
      const aspect = img.naturalWidth / img.naturalHeight;
      let dw = drawSize, dh = drawSize;
      if (aspect > 1) dh = drawSize / aspect;
      else            dw = drawSize * aspect;
      const dx = (canvasSize - dw) / 2;
      const dy = (canvasSize - dh) / 2;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.drawImage(img, dx, dy, dw, dh);

      /* Collect every pixel with enough brightness */
      const { data } = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const pts: [number, number][] = [];

      const step = isMobile ? 2 : 1;
      for (let y = 0; y < canvasSize; y += step) {
        for (let x = 0; x < canvasSize; x += step) {
          const i = (y * canvasSize + x) * 4;
          // Brightness threshold – catches white & near-white pixels
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 90) pts.push([x, y]);
        }
      }

      if (pts.length < 300) { resolve(buildSFallback(count, scale)); return; }

      /* Map canvas coordinates → Three.js scene units */
      const half  = canvasSize / 2;
      const range = (scale * 2.2) / canvasSize;
      const out   = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const [px, py] = pts[Math.floor(Math.random() * pts.length)];
        out[i * 3]     = (px - half) * range + (Math.random() - 0.5) * 0.025;
        out[i * 3 + 1] = -(py - half) * range + (Math.random() - 0.5) * 0.025;
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      }
      resolve(out);
    };

    img.onerror = () => resolve(buildSFallback(count, scale));

    /* Asset lives in /public */
    img.src = "/scalevo-logo-particles.png";
  });
}

/* ─────────────────────────────────────────────────────────────
   HeroSection Component
───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const isMobile = window.innerWidth < 768;

    /* ── Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    /* ── Particle count — more = sharper logo */
    const PARTICLE_COUNT = isMobile ? 1800 : 4000;

    /* ── Initial chaos positions (sphere burst) */
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3  = i * 3;
      const r   = 9 + Math.random() * 6;
      const th  = Math.random() * Math.PI * 2;
      const ph  = Math.random() * Math.PI;
      positions[i3]     = r * Math.sin(ph) * Math.cos(th);
      positions[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i3 + 2] = r * Math.cos(ph);

      /* 25% neon blue, 75% white/grey */
      const isNeon = Math.random() < 0.25;
      if (isNeon) {
        colors[i3] = 0.08; colors[i3 + 1] = 0.4; colors[i3 + 2] = 1.0;
      } else {
        const b = 0.35 + Math.random() * 0.45;
        colors[i3] = b; colors[i3 + 1] = b; colors[i3 + 2] = b;
      }
    }

    /* ── Geometry */
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size:            isMobile ? 0.034 : 0.026,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.92,
      sizeAttenuation: true,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* ── Mutable state */
    let targetPositions: Float32Array | null = null;
    let morphProgress  = 0;
    let mouseX = 0, mouseY = 0;
    let rafId: number;
    let cancelled      = false;
    let morphTimerId: ReturnType<typeof setTimeout>;
    let triggerKill: (() => void) | null = null;
    let ctxRevert: (() => void) | null   = null;

    /* ── Mouse parallax */
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Render loop */
    const startTime = performance.now();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      const pos = geometry.attributes.position.array as Float32Array;

      if (targetPositions && morphProgress > 0) {
        /* Ease-out cubic lerp towards logo positions */
        const ease  = 1 - Math.pow(1 - Math.min(morphProgress, 1), 3);
        const speed = 0.07 * ease;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          pos[i3]     += (targetPositions[i3]     - pos[i3])     * speed;
          pos[i3 + 1] += (targetPositions[i3 + 1] - pos[i3 + 1]) * speed;
          pos[i3 + 2] += (targetPositions[i3 + 2] - pos[i3 + 2]) * speed;
        }
        /* Once mostly converged, add subtle breathing */
        if (morphProgress > 0.97) {
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            pos[i3]     += Math.sin(elapsed * 0.4 + i * 0.05) * 0.00025;
            pos[i3 + 1] += Math.cos(elapsed * 0.3 + i * 0.04) * 0.00025;
          }
        }
      } else {
        /* Floating chaos before morph */
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          pos[i3]     += Math.sin(elapsed * 0.2 + i * 0.08) * 0.0006;
          pos[i3 + 1] += Math.cos(elapsed * 0.15 + i * 0.06) * 0.0006;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      /* Camera parallax — desktop only */
      if (!isMobile) {
        camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.15 - camera.position.y) * 0.02;
      }

      /* Rotation: fast during chaos, stops when logo is formed */
      const rot = morphProgress > 0.9 ? 0.001 : 0.018 * (1 - morphProgress);
      points.rotation.y = elapsed * rot;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Async: load logo → then trigger morph */
    async function loadAndSchedule() {
      const logoPos = await buildLogoFromImage(PARTICLE_COUNT, isMobile);
      if (cancelled) return;
      targetPositions = logoPos;

      /* Morph starts 2.5s after mount (after preloader exits ~2.4s) */
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
      }, 2500);
    }
    loadAndSchedule();

    /* ── ScrollTrigger: boost morph if user scrolls early */
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end:   "+=400",
      onUpdate: (self) => {
        const boosted = Math.min(self.progress * 1.3, 1);
        if (boosted > morphProgress) morphProgress = boosted;
      },
    });
    triggerKill = () => st.kill();

    /* ── Text entrance animation */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(contentRef.current,  { opacity: 1, duration: 0.7 });
      tl.to(".line-inner",       { y: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" }, "-=0.3");
      tl.to(".hero-subtitle",    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");
      tl.to(".hero-cta-group",   { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
      tl.to(scrollRef.current,   { opacity: 1, duration: 0.4 }, "-=0.2");
    });
    ctxRevert = () => ctx.revert();

    gsap.set(".hero-subtitle",  { opacity: 0, y: 24 });
    gsap.set(".hero-cta-group", { opacity: 0, y: 16 });

    /* ── Resize */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(morphTimerId);
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      triggerKill?.();
      ctxRevert?.();
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

      {/* Radial vignette */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ── Left social strip */}
      <div className="hero-social-strip" aria-label="Redes sociales">
        <a
          href="https://www.instagram.com/scalevo.gp/"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-social-link"
          id="hero-instagram-link"
          aria-label="Instagram @scalevo.gp"
        >
          <span className="hero-social-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </span>
          <span className="hero-social-label">IG</span>
        </a>

        <div className="hero-social-divider" aria-hidden="true" />

        <a
          href="https://www.tiktok.com/@scalevo.gp"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-social-link"
          id="hero-tiktok-link"
          aria-label="TikTok @scalevo.gp"
        >
          <span className="hero-social-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z"/>
            </svg>
          </span>
          <span className="hero-social-label">TK</span>
        </a>

        <div className="hero-social-line" aria-hidden="true" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="hero-content">
        <span className="hero-eyebrow">Sistema · Crecimiento · Dominancia</span>

        <h1 className="hero-h1">
          <span className="line-mask"><span className="line-inner">TU NEGOCIO</span></span>
          <span className="line-mask"><span className="line-inner">VA A ESCALAR.</span></span>
          <span className="line-mask" style={{ color: "var(--neon-blue)" }}>
            <span className="line-inner">PUNTO.</span>
          </span>
        </h1>

        <p className="hero-subtitle">
          No es marketing genérico. Es ingeniería de crecimiento con
          neuromarketing aplicado. Tu marca, inevitable.
        </p>

        <div className="hero-cta-group">
          <a
            href="https://calendly.com/scalevo-mx/30min?utm_source=g&utm_medium=social&utm_content=link_in_bio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon"
            id="hero-cta-primary"
          >
            <span className="btn-neon-dot" aria-hidden="true" />
            AGENDA TU SESIÓN
            <span className="btn-neon-arrow" aria-hidden="true">→</span>
          </a>
          <a href="#services" className="btn-ghost" id="hero-cta-secondary">
            Ver el sistema ↓
          </a>
        </div>
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
