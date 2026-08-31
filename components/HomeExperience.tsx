"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import HeroSection from "@/components/HeroSection";
import PerceptionGap from "@/components/PerceptionGap";
import PhantomSystem from "@/components/PhantomSystem";
import ProductLadder from "@/components/ProductLadder";
import Phantom30 from "@/components/Phantom30";
import Principles from "@/components/Principles";
import SystemEvidence from "@/components/SystemEvidence";
import Qualification from "@/components/Qualification";
import FAQ from "@/components/FAQ";
import DiagnosticSection from "@/components/DiagnosticSection";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { CTA_LABELS } from "@/config/site";
import BookingLink from "@/components/BookingLink";

export default function HomeExperience() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingCta(!entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SkipLink />
      <CustomCursor />

      <BookingLink
        placement="floating_cta"
        ctaId="floating_primary"
        className={`cta-float${showFloatingCta ? " is-visible" : ""}`}
        id="floating-cta"
        aria-label={CTA_LABELS.primary + " con SCALEVO"}
        aria-hidden={!showFloatingCta}
        tabIndex={showFloatingCta ? undefined : -1}
      >
        <span className="cta-float-dot" aria-hidden="true" />
        {CTA_LABELS.primary}
      </BookingLink>

      <SmoothScrollProvider>
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <PerceptionGap />
          <PhantomSystem />
          <ProductLadder />
          <Phantom30 />
          <Principles />
          <SystemEvidence />
          <Qualification />
          <FAQ />
          <DiagnosticSection />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
