"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const phrases = [
  { text: "NO VENDEMOS SERVICIOS.", filled: false },
  { text: "CONSTRUIMOS ACTIVOS.", filled: false },
  { text: "NO ES SUERTE. ES SISTEMA.", filled: true },
];

export default function KineticText() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".kinetic-word");

      // Create a scrubbed timeline pinned to the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      words.forEach((word, i) => {
        const direction = i % 2 === 0 ? 1 : -1;

        // Slide in from sides
        gsap.set(word, {
          x: direction * (window.innerWidth * 0.4),
          opacity: 0,
        });

        tl.to(
          word,
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          i * 0.8
        );

        // Add glow/fill to last word
        if (i === words.length - 1) {
          tl.to(
            word,
            {
              duration: 0.5,
              onStart: () => {
                word.classList.add("filled");
              },
            },
            (i + 0.5) * 0.8
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="kinetic-section"
      aria-label="Manifiesto SCALEVO"
      id="manifesto"
      style={{ height: "100vh" }}
    >
      <div className="kinetic-pin-container">
        {phrases.map((phrase, i) => (
          <div
            key={i}
            className={`kinetic-word ${phrase.filled ? "" : ""}`}
            style={{
              top: `${30 + i * 28}%`,
              left: i % 2 === 0 ? "5%" : undefined,
              right: i % 2 !== 0 ? "5%" : undefined,
            }}
            aria-label={phrase.text}
          >
            {phrase.text}
          </div>
        ))}
      </div>
    </section>
  );
}
