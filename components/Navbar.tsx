"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { NAV_LINKS, SOCIAL, CALENDLY_URL } from "@/config/site";
import { track } from "@/lib/analytics";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape key + focus trap
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      // Focus trap within mobile menu
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Move focus into menu on open
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  const handleNavCTA = () => {
    track("nav_cta_click", { placement: "navbar" }); track("calendly_open", { placement: "navbar" });
  };

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link href="/" className="nav-logo" aria-label="SCALEVO — Inicio">
          SCALEVO
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA — hidden on mobile via CSS */}
        <div className="nav-right">
          <div className="nav-social" aria-label="Redes sociales" role="list">
            <a
              id="nav-ig"
              href={SOCIAL.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL.instagram.label}
              className="nav-social-link"
              role="listitem"
              onClick={() => track("instagram_click", { placement: "navbar" })}
            >
              IG
            </a>
            <a
              id="nav-tt"
              href={SOCIAL.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL.tiktok.label}
              className="nav-social-link"
              role="listitem"
              onClick={() => track("tiktok_click", { placement: "navbar" })}
            >
              TK
            </a>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta btn-neon-sm"
            id="nav-cta-btn"
            onClick={handleNavCTA}
          >
            Agendar →
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={toggleRef}
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          id="mobile-menu-toggle"
        >
          <span style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}

        <div className="mobile-menu-social">
          <a
            href={SOCIAL.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-social-link"
            aria-label={SOCIAL.instagram.label}
            onClick={() => {
              track("instagram_click", { placement: "mobile_menu" });
              closeMenu();
            }}
          >
            Instagram
          </a>
          <a
            href={SOCIAL.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-social-link"
            aria-label={SOCIAL.tiktok.label}
            onClick={() => {
              track("tiktok_click", { placement: "mobile_menu" });
              closeMenu();
            }}
          >
            TikTok
          </a>
        </div>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon"
          onClick={() => {
            track("nav_cta_click", { placement: "mobile_menu" }); track("calendly_open", { placement: "mobile_menu" });
            closeMenu();
          }}
          style={{ marginTop: "16px", fontSize: "13px" }}
          id="mobile-calendly-cta"
        >
          <span className="btn-neon-dot" aria-hidden="true" />
          Agendar Diagnóstico →
        </a>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {menuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}


