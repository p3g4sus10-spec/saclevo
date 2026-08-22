import Link from "next/link";
import { SOCIAL, SITE, NAV_LINKS } from "@/config/site";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* Social strip */}
      <div className="footer-social-strip">
        <p className="social-strip-label">// SÍGUENOS</p>

        <div className="social-cards-row" role="list">
          {[
            {
              ...SOCIAL.instagram,
              platform: "Instagram",
              icon: <InstagramIcon />,
              gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              color: "#e6683c",
            },
            {
              ...SOCIAL.tiktok,
              platform: "TikTok",
              icon: <TikTokIcon />,
              gradient: "linear-gradient(135deg, #010101 0%, #69C9D0 50%, #EE1D52 100%)",
              color: "#69C9D0",
            },
          ].map((s) => (
            <a
              key={s.id}
              id={`footer-${s.id}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              role="listitem"
              className="social-card"
              style={{ "--social-color": s.color, "--social-gradient": s.gradient } as React.CSSProperties}
            >
              <span className="social-card-glow" aria-hidden="true" />
              <span className="social-card-icon">{s.icon}</span>
              <span className="social-card-info">
                <span className="social-card-platform">{s.platform}</span>
                <span className="social-card-handle">{s.handle}</span>
              </span>
              <span className="social-card-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer top */}
      <div className="footer-top">
        <div>
          <p className="footer-brand-name">{SITE.name}</p>
          <p className="footer-tagline">{SITE.tagline}</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.id} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
          <Link href="/privacidad" className="footer-link">
            Privacidad
          </Link>
          <Link href={`mailto:${SITE.email}`} className="footer-link">
            {SITE.email}
          </Link>
        </nav>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {year} SCALEVO. Todos los derechos reservados.
        </p>
        <p className="footer-copy" style={{ color: "var(--text-subtle)", fontSize: "10px" }}>
          Diseñado para durar.
        </p>
      </div>
    </footer>
  );
}


