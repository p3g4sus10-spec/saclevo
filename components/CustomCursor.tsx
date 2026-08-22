"use client";

import { useEffect, useRef } from "react";
import { getMotionTier } from "@/lib/motion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tier = getMotionTier();

    // Don't render cursor on touch or reduced-motion
    if (tier === "reduced" || tier === "lite") return;
    if ("ontouchstart" in window) return;

    const isFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (!isFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-enabled");
    dot.style.display = "block";
    ring.style.display = "block";

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      animId = requestAnimationFrame(loop);
    };

    const onEnter = () => ring.classList.add("hovering");
    const onLeave = () => ring.classList.remove("hovering");

    document.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    animId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cancelAnimationFrame(animId);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" style={{ display: "none" }} />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ display: "none" }} />
    </>
  );
}


