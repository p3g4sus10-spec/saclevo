"use client";

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
  return (
    <>
      <SkipLink />
      <CustomCursor />

      <BookingLink
        placement="floating_cta"
        ctaId="floating_primary"
        className="cta-float"
        id="floating-cta"
        aria-label={CTA_LABELS.primary + " con SCALEVO"}
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
