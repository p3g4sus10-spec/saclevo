"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SOCIAL = [
  {
    id: "nav-ig",
    href: "https://www.instagram.com/scalevo.gp/",
    label: "Instagram",
    short: "IG",
  },
  {
    id: "nav-tt",
    href: "https://www.tiktok.com/@scalevo.gp",
    label: "TikTok",
    short: "TK",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Sistema",     href: "#services"   },
    { label: "Evidencia",   href: "#evidence"   },
    { label: "Método",      href: "#manifesto"  },
    { label: "Diagnóstico", href: "#diagnostic" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <Link href="/" className="nav-logo" aria-label="SCALEVO — Inicio">
          SCALEVO
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop right: social micro-links + CTA */}
        <div className="nav-right">
          <div className="nav-social" aria-label="Redes sociales" role="list">
            {SOCIAL.map((s) => (
              <a
                key={s.id}
                id={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`SCALEVO en ${s.label}`}
                className="nav-social-link"
                role="listitem"
              >
                {s.short}
              </a>
            ))}
          </div>

          <a
            href="https://calendly.com/scalevo-mx/30min?utm_source=g&utm_medium=social&utm_content=link_in_bio"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta btn-neon-sm"
            id="nav-cta-btn"
          >
            Agendar →
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          id="mobile-menu-toggle"
        >
          <span style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}

        {/* Social in mobile menu */}
        <div className="mobile-menu-social">
          {SOCIAL.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-social-link"
              aria-label={`SCALEVO en ${s.label}`}
              onClick={closeMenu}
            >
              {s.label}
            </a>
          ))}
        </div>

        <a
          href="https://calendly.com/scalevo-mx/30min?utm_source=g&utm_medium=social&utm_content=link_in_bio"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon"
          onClick={closeMenu}
          style={{ marginTop: "16px", fontSize: "13px" }}
          id="mobile-calendly-cta"
        >
          <span className="btn-neon-dot" aria-hidden="true" />
          Agendar Sesión →
        </a>
      </div>
    </>
  );
}
