"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import HeroSection from "@/components/HeroSection";
import KineticText from "@/components/KineticText";
import HorizontalServices from "@/components/HorizontalServices";
import BentoGrid from "@/components/BentoGrid";
import Manifesto from "@/components/Manifesto";
import CalendlySection from "@/components/CalendlySection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* Main Content */}
      <SmoothScrollProvider>
        <div
          style={{
            opacity: preloaderDone ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Floating CTA */}
          <a
            href="https://calendly.com/scalevo-mx/30min?utm_source=g&utm_medium=social&utm_content=link_in_bio"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-float"
            id="floating-cta"
            aria-label="Agendar sesión gratuita con SCALEVO"
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
            />
            AGENDA GRATIS
          </a>

          <Navbar />

          <main id="main-content">
            {/* 1. Hero — WebGL Particles → S shape */}
            <HeroSection />

            {/* 2. Kinetic Typography Manifesto */}
            <KineticText />

            {/* 3. Horizontal Services Gallery */}
            <HorizontalServices />

            {/* 4. Manifesto / Philosophy */}
            <Manifesto />

            {/* 5. Evidence Bento Grid */}
            <BentoGrid />

            {/* 6. Calendly — Agenda tu sesión */}
            <CalendlySection />
          </main>

          <Footer />
        </div>
      </SmoothScrollProvider>
    </>
  );
}
