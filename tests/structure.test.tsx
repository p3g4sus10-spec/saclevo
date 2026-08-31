import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BookingLink from "@/components/BookingLink";
import DiagnosticSection from "@/components/DiagnosticSection";
import Phantom30 from "@/components/Phantom30";
import ProductLadder from "@/components/ProductLadder";
import {
  formatMxn,
  PHANTOM_30_FOUNDING,
  PHANTOM_30,
  PRICING_POLICY,
  SCALE_BASIC,
  SCALE_FULL,
} from "@/config/offers";
import { BOOKING } from "@/config/site";

const root = process.cwd();
const source = (path: string) => readFileSync(resolve(root, path), "utf8");
const readTree = (path: string): string => {
  const absolute = resolve(root, path);
  if (statSync(absolute).isFile()) return readFileSync(absolute, "utf8");
  return readdirSync(absolute)
    .filter((entry) => !entry.endsWith(".map"))
    .map((entry) => readTree(resolve(path, entry)))
    .join("\n");
};

describe("rendered offer and booking contracts", () => {
  it("renders the product ladder from the canonical offer source", () => {
    const html = renderToStaticMarkup(<ProductLadder />);

    expect(html).toContain("<ol");
    expect(html).toContain(SCALE_BASIC.name);
    expect(html).toContain(PHANTOM_30.publicLabel);
    expect(html).toContain(SCALE_FULL.name);
    expect(html).toContain(SCALE_BASIC.terms);
    expect(html).toContain(PHANTOM_30.price.terms);
    expect(html).toContain(SCALE_FULL.terms);
    expect(html).toContain(PHANTOM_30_FOUNDING.availabilityLabel);
    expect(html).toContain(PHANTOM_30_FOUNDING.principle);
    expect(html).toContain(PRICING_POLICY.safeDisclosure);
    expect(html).toContain("¿CUÁNDO TIENE SENTIDO SCALE FULL?");
    expect(html).not.toContain("advisory");
    expect(html).not.toContain("El scope");
    expect(html).not.toContain(BOOKING.url);
  });

  it("renders PHANTOM 30 scope, tax-safe pricing and included installment", () => {
    const html = renderToStaticMarkup(<Phantom30 />);

    expect(html).toContain("4 VIDEOS TERMINADOS");
    expect(html).toContain("Concepto, hook y guion/estructura");
    expect(html).toContain("Color/acabado, export y entrega final");
    expect(html).toContain(PHANTOM_30_FOUNDING.statusLabel);
    expect(html).toContain(PHANTOM_30_FOUNDING.principle);
    expect(html).toContain(PHANTOM_30_FOUNDING.futureRateCopy);
    expect(html).toContain(formatMxn(PHANTOM_30.price.base));
    expect(html).toContain(formatMxn(PHANTOM_30.price.firstInstallment));
    expect(html).toContain("INCLUIDA EN LOS $9,000");
    expect(html).toContain(PRICING_POLICY.safeDisclosure);
    expect(html).toContain("Una ronda consolidada base");
    expect(html).toContain("project files");
    expect(html).not.toContain(BOOKING.url);
  });

  it("keeps every booking CTA local while the privacy gate is closed", () => {
    const link = renderToStaticMarkup(
      <BookingLink placement="test" ctaId="test_primary">
        Conocer el diagnóstico
      </BookingLink>,
    );
    const diagnostic = renderToStaticMarkup(<DiagnosticSection />);

    expect(BOOKING.enabled).toBe(false);
    expect(link).toContain('href="#diagnostic"');
    expect(link).not.toContain('target="_blank"');
    expect(link).not.toContain(BOOKING.url);
    expect(diagnostic).not.toContain(BOOKING.url);
    expect(diagnostic).not.toContain("<iframe");
    expect(
      source("components/DiagnosticSection.tsx").match(
        /if \(!BOOKING\.enabled\) return;/g,
      )?.length,
    ).toBeGreaterThanOrEqual(2);

    const componentSource = readTree("components");
    expect(componentSource).not.toMatch(
      /href\s*=\s*\{\s*CALENDLY_URL\s*\}/,
    );
  });
});

describe("home composition and resilience", () => {
  it("keeps the required section order", () => {
    const home = source("components/HomeExperience.tsx");
    const sections = [
      "<HeroSection />",
      "<PerceptionGap />",
      "<PhantomSystem />",
      "<ProductLadder />",
      "<Phantom30 />",
      "<Principles />",
      "<SystemEvidence />",
      "<Qualification />",
      "<FAQ />",
      "<DiagnosticSection />",
    ];
    const positions = sections.map((section) => home.indexOf(section));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("assigns unique principles and method anchors", () => {
    expect(source("components/Principles.tsx")).toContain('id="principles"');
    expect(source("components/SystemEvidence.tsx")).toContain('id="method"');
    expect(source("components/SystemEvidence.tsx")).not.toContain(
      'id="evidence"',
    );
  });

  it("keeps the home canonical route-specific", () => {
    expect(source("app/page.tsx")).toContain('canonical: absoluteUrl("/")');
    expect(source("app/layout.tsx")).not.toContain('rel="canonical"');
    expect(source("app/layout.tsx")).not.toContain("alternates:");
  });

  it("keeps reduced-motion content visible and skips WebGL", () => {
    const hero = source("components/HeroSection.tsx");
    expect(hero).toContain('contentRef.current.style.opacity = "1"');
    expect(hero).toContain('scrollRef.current.style.opacity = "1"');
    expect(hero).toContain('if (tier === "reduced")');
    expect(hero).toContain("return () => textCtx.revert()");
    expect(hero).not.toContain('className="hero-content" style={{ opacity: 0 }}');
    expect(hero).not.toContain(
      'className="hero-scroll-indicator" aria-hidden="true" style={{ opacity: 0 }}',
    );

    const css = source("app/globals.css");
    expect(css).not.toContain(".hero-scroll-indicator { display: none; }");
    expect(css).toContain(".hero-content {");
    expect(css).toMatch(/\.hero-content\s*\{[\s\S]*?opacity:\s*1;/);

    const principles = source("components/Principles.tsx");
    expect(principles).toContain(
      "gsap.set(words, { opacity: 1, x: 0, y: 0 })",
    );
    expect(principles).not.toContain("pin: true");
    expect(principles).not.toContain("scrub:");
    expect(principles).not.toContain('end: "+=250%"');
  });

  it("keeps discovery files and the floating CTA fail-closed by default", () => {
    expect(source("app/sitemap.ts")).toContain("isIndexableEnvironment()");
    expect(source("next.config.ts")).toContain(
      '{ key: "X-Robots-Tag", value: "noindex, nofollow" }',
    );
    const home = source("components/HomeExperience.tsx");
    expect(home).toContain("IntersectionObserver");
    expect(home).toContain('aria-hidden={!showFloatingCta}');
  });

  it("isolates WebGL initialization and render failures", () => {
    const hero = source("components/HeroSection.tsx");
    const particles = source("lib/heroParticles.ts");
    expect(hero).toContain('void import("@/lib/heroParticles")');
    expect(hero.indexOf('if (tier === "reduced")')).toBeLessThan(
      hero.indexOf('import("@/lib/heroParticles")'),
    );
    expect(particles).toMatch(
      /try\s*\{[\s\S]*?new THREE\.WebGLRenderer[\s\S]*?\}\s*catch\s*\{/,
    );
    expect(particles).toMatch(
      /try\s*\{[\s\S]*?renderer\.render\(scene, camera\)[\s\S]*?\}\s*catch\s*\{/,
    );
    expect(particles).toContain("canvas.hidden = true");
  });

  it("uses repository-local font packages instead of build-time Google fetches", () => {
    const layout = source("app/layout.tsx");
    expect(layout).toContain('from "next/font/local"');
    expect(layout).not.toContain('from "next/font/google"');
    expect(layout).toContain("@fontsource-variable/space-grotesk");
    expect(layout).toContain("@fontsource-variable/inter");
  });

  it("uses a JPEG extension that matches the logo asset bytes", () => {
    const jpgPath = resolve(root, "public/scalevo-logo-particles.jpg");
    expect(existsSync(jpgPath)).toBe(true);
    expect(existsSync(resolve(root, "public/scalevo-logo-particles.png"))).toBe(
      false,
    );
    const bytes = readFileSync(jpgPath);
    expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    expect(source("components/HeroSection.tsx")).toContain(
      "/scalevo-logo-particles.jpg",
    );
  });
});

describe("repository copy guardrails", () => {
  it("does not reintroduce contradictory price, scope, tax or urgency copy", () => {
    const publicSource = [
      "app",
      "components",
      "config",
      "lib",
      "next.config.ts",
    ]
      .map(readTree)
      .join("\n");

    const forbiddenPatterns = [
      /cuatro\s+arquitecturas/i,
      /\b4\s+arquitecturas/i,
      /\b4\s+piezas\b/i,
      /cuatro\s+piezas/i,
      /\$\s*19[.,]900/,
      /\$\s*24[.,]900/,
      /\$\s*59[.,]000/,
      /\$\s*12[.,]000/,
      /\$\s*9[.,]000\s+MXN\s+en\s+total/i,
      /90\s+días\s+mínimo/i,
      /IVA\s+incluido/i,
      /se\s+paga\s+(?:solo|por\s+sí\s+solo)/i,
      /recuper(?:as|a|ará)\s+la\s+inversión/i,
      /últimos\s+lugares|cupo\s+limitado|countdown/i,
      /45\s*(?:min|minutos)/i,
      /(?:ROI|ventas|leads|viralidad)\s+garantizad[oa]s?/i,
      /casos\s+de\s+éxito\s+garantizados/i,
      /\bdescuento\b/i,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(publicSource).not.toMatch(pattern);
    }

    expect(JSON.stringify(PHANTOM_30)).not.toContain(formatMxn(15_000));
    expect(publicSource).not.toContain(formatMxn(19_900));
    expect(publicSource).not.toContain("scalevo.com");
  });
});
