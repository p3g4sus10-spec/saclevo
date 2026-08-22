"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import HeroSection from "@/components/HeroSection";
import PerceptionGap from "@/components/PerceptionGap";
import PhantomSystem from "@/components/PhantomSystem";
import Phantom30 from "@/components/Phantom30";
import Principles from "@/components/Principles";
import SystemEvidence from "@/components/SystemEvidence";
import Qualification from "@/components/Qualification";
import FAQ from "@/components/FAQ";
import DiagnosticSection from "@/components/DiagnosticSection";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { CALENDLY_URL } from "@/config/site";
import { captureEntryUTMs, track } from "@/lib/analytics";

export default function HomePage() {
  // Capture entry UTMs once on mount — must happen before any Calendly interaction
  useEffect(() => {
    captureEntryUTMs();
    track("page_view");
  }, []);

  return (
    <>
      {/* Skip link — keyboard accessibility */}
      <SkipLink />

      {/* Custom Cursor — desktop only, respects reduced-motion */}
      <CustomCursor />

      {/* Floating CTA — always visible, tracks placement */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-float"
        id="floating-cta"
        aria-label="Agendar diagnóstico gratuito con SCALEVO"
        onClick={() => track("floating_cta_click", { placement: "floating_cta" })}
      >
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            marginRight: "6px",
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        AGENDA GRATIS
      </a>

      <SmoothScrollProvider>
        <Navbar />

        <main id="main-content">
          {/* 01 · CINEMATIC HERO */}
          <HeroSection />

          {/* 02 · THE PERCEPTION GAP */}
          <PerceptionGap />

          {/* 03 · PHANTOM SYSTEM */}
          <PhantomSystem />

          {/* 04 · PHANTOM 30 */}
          <Phantom30 />

          {/* 05 · SCALEVO PRINCIPLES (kinetic + philosophy) */}
          <Principles />

          {/* 06 · SYSTEM EVIDENCE */}
          <SystemEvidence />

          {/* 07 · WHO IT IS / IS NOT FOR */}
          <Qualification />

          {/* 08 · FAQ */}
          <FAQ />

          {/* 09 · DIAGNOSTIC / CALENDLY */}
          <DiagnosticSection />
        </main>

        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
