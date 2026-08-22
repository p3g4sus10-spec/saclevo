/**
 * SCALEVO — Motion Capability System
 * Central detection of device/user capability to drive
 * ELITE / STANDARD / LITE / REDUCED tiers across all components.
 *
 * No persistent fingerprinting. Detection is per-session only.
 * Components consume the tier via getMotionTier() or useMotionTier().
 */

export type MotionTier = "elite" | "standard" | "lite" | "reduced";

/**
 * Synchronous tier detection — call once on mount.
 * Safe to call server-side (returns "standard" if window is undefined).
 */
export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "standard";

  // REDUCED: always honour user preference first
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }

  // Save-Data: honour if available
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "lite";

  const isMobile = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  // ELITE: desktop, high-end device
  if (!isMobile && cores >= 8 && memory >= 8 && dpr >= 2) return "elite";

  // LITE: low-end or mobile with few cores/RAM
  if (isMobile && (cores < 4 || memory < 3)) return "lite";

  // STANDARD: everything else
  return "standard";
}

/**
 * Particle counts per tier.
 */
export const PARTICLE_COUNTS: Record<MotionTier, number> = {
  elite: 4000,
  standard: 2000,
  lite: 600,
  reduced: 0,
};

/**
 * Canvas sampling size for logo image (HeroSection).
 */
export const CANVAS_SIZES: Record<MotionTier, number> = {
  elite: 700,
  standard: 480,
  lite: 300,
  reduced: 0,
};

/**
 * Feature flags per tier.
 */
export interface MotionFeatures {
  webgl: boolean;
  morph: boolean;
  smoothScroll: boolean;
  cameraParallax: boolean;
  customCursor: boolean;
  pinSections: boolean;
  kineticText: boolean;
  breathingParticles: boolean;
}

export const MOTION_FEATURES: Record<MotionTier, MotionFeatures> = {
  elite: {
    webgl: true,
    morph: true,
    smoothScroll: true,
    cameraParallax: true,
    customCursor: true,
    pinSections: true,
    kineticText: true,
    breathingParticles: true,
  },
  standard: {
    webgl: true,
    morph: true,
    smoothScroll: true,
    cameraParallax: false,
    customCursor: true,
    pinSections: true,
    kineticText: true,
    breathingParticles: false,
  },
  lite: {
    webgl: false,
    morph: false,
    smoothScroll: false,
    cameraParallax: false,
    customCursor: false,
    pinSections: false,
    kineticText: false,
    breathingParticles: false,
  },
  reduced: {
    webgl: false,
    morph: false,
    smoothScroll: false,
    cameraParallax: false,
    customCursor: false,
    pinSections: false,
    kineticText: false,
    breathingParticles: false,
  },
};
