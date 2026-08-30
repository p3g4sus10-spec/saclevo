"use client";

import { useState, useRef, useEffect } from "react";
import { gsap }
from "gsap";
import { getMotionTier } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQ_ITEMS } from "@/config/faq";
import { track } from "@/lib/analytics";
import { useSectionView } from "@/lib/useSectionView";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionView(sectionRef, "faq");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (getMotionTier() === 'reduced') return;
      gsap.fromTo(
        ".faq-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".faq-header", start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: ".faq-list", start: "top 82%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    const newOpen = openIndex === i ? null : i;
    setOpenIndex(newOpen);
    if (newOpen !== null) {
      track("faq_open", { faq_id: FAQ_ITEMS[i].id });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="faq-section"
      id="faq"
      aria-label="Preguntas frecuentes"
    >
      <div className="faq-inner">
        <div className="faq-header">
          <p className="section-label">// FAQ</p>
          <h2 className="section-title">
            Preguntas directas.
            <br />
            <span style={{ color: "var(--text-muted)" }}>Respuestas directas.</span>
          </h2>
        </div>

        <dl className="faq-list" role="list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const answerId = `faq-answer-${item.id}`;
            const questionId = `faq-question-${item.id}`;

            return (
              <div key={item.id} className={`faq-item ${isOpen ? "faq-item-open" : ""}`} role="listitem">
                <dt>
                  <button
                    id={questionId}
                    className="faq-question"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </dt>
                <dd
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className="faq-answer"
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}



