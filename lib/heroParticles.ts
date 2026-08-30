import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionFeatures, MotionTier } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface HeroParticleOptions {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  tier: MotionTier;
  features: MotionFeatures;
  particleCount: number;
  isMobile: boolean;
  buildLogo: () => Promise<Float32Array>;
}

export function startHeroParticles({
  canvas,
  section,
  tier,
  features,
  particleCount,
  isMobile,
  buildLogo,
}: HeroParticleOptions): () => void {
  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, tier === "elite" ? 2 : 1.5),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);
  } catch {
    canvas.hidden = true;
    return () => undefined;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 9 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const isNeon = Math.random() < 0.25;
    if (isNeon) {
      colors[i3] = 0.08;
      colors[i3 + 1] = 0.4;
      colors[i3 + 2] = 1;
    } else {
      const brightness = 0.35 + Math.random() * 0.45;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions.slice(), 3),
  );
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
  let mouseX = 0;
  let mouseY = 0;
  let rafId: number | null = null;
  let cancelled = false;
  let morphTimerId: ReturnType<typeof setTimeout> | undefined;
  let isVisible = true;

  const onMouseMove = (event: MouseEvent) => {
    if (!features.cameraParallax) return;
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("mousemove", onMouseMove);

  const startTime = performance.now();

  const animate = () => {
    if (cancelled) return;
    rafId = requestAnimationFrame(animate);

    const elapsed = (performance.now() - startTime) / 1000;
    const positionAttribute = geometry.getAttribute("position");
    const positionArray = positionAttribute.array as Float32Array;

    if (targetPositions && morphProgress > 0) {
      const ease = 1 - Math.pow(1 - Math.min(morphProgress, 1), 3);
      const speed = 0.07 * ease;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionArray[i3] += (targetPositions[i3] - positionArray[i3]) * speed;
        positionArray[i3 + 1] +=
          (targetPositions[i3 + 1] - positionArray[i3 + 1]) * speed;
        positionArray[i3 + 2] +=
          (targetPositions[i3 + 2] - positionArray[i3 + 2]) * speed;
      }
      if (features.breathingParticles && morphProgress > 0.97) {
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positionArray[i3] +=
            Math.sin(elapsed * 0.4 + i * 0.05) * 0.00025;
          positionArray[i3 + 1] +=
            Math.cos(elapsed * 0.3 + i * 0.04) * 0.00025;
        }
      }
    } else {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionArray[i3] += Math.sin(elapsed * 0.2 + i * 0.08) * 0.0006;
        positionArray[i3 + 1] +=
          Math.cos(elapsed * 0.15 + i * 0.06) * 0.0006;
      }
    }
    positionAttribute.needsUpdate = true;

    if (features.cameraParallax) {
      camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.15 - camera.position.y) * 0.02;
    }

    const rotation = morphProgress > 0.9 ? 0.001 : 0.018 * (1 - morphProgress);
    points.rotation.y = elapsed * rotation;

    try {
      renderer.render(scene, camera);
    } catch {
      cancelled = true;
      canvas.hidden = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }
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

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      handleVisibility();
    },
    { threshold: 0.05 },
  );
  visibilityObserver.observe(canvas);

  document.addEventListener("visibilitychange", handleVisibility);
  animate();

  const loadAndSchedule = async () => {
    if (!features.morph) return;
    const logoPositions = await buildLogo();
    if (cancelled) return;
    targetPositions = logoPositions;

    morphTimerId = setTimeout(() => {
      if (cancelled) return;
      gsap.to(
        { value: 0 },
        {
          value: 1,
          duration: 4,
          ease: "power2.inOut",
          onUpdate() {
            morphProgress = (this.targets()[0] as { value: number }).value;
          },
        },
      );
    }, 1200);
  };
  void loadAndSchedule();

  const scrollTrigger = ScrollTrigger.create({
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
    if (morphTimerId) clearTimeout(morphTimerId);
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("resize", onResize);
    visibilityObserver.disconnect();
    scrollTrigger.kill();
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}
