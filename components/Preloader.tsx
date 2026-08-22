"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Count up percent
      const obj = { val: 0 };
      tl.to(
        obj,
        {
          val: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = Math.round(obj.val).toString();
            }
          },
        },
        0
      );

      // Fill bar
      tl.to(
        fillRef.current,
        {
          width: "100%",
          duration: 1.4,
          ease: "power2.inOut",
        },
        0
      );

      // Hold briefly
      tl.to({}, { duration: 0.2 });

      // Split reveal
      tl.to(
        topRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        },
        "-=0.1"
      );
      tl.to(
        bottomRef.current,
        {
          yPercent: 100,
          duration: 0.9,
          ease: "power4.inOut",
        },
        "<"
      );

      tl.to(
        containerRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.1,
        }
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      {/* Split panels */}
      <div ref={topRef} className="preloader-split-top" />
      <div ref={bottomRef} className="preloader-split-bottom" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
        <p className="preloader-text">
          [ SYSTEM BOOT... INITIATING NEURAL PROTOCOLS ]
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "100%" }}>
          <div className="preloader-bar-track">
            <div ref={fillRef} className="preloader-bar-fill" />
          </div>

          <span
            ref={percentRef}
            className="preloader-percent"
            aria-label="Loading progress"
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
