/**
 * SkipLink — Accessibility component
 * Allows keyboard users to skip the nav and jump directly to main content.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="Saltar al contenido principal"
    >
      Saltar al contenido
    </a>
  );
}


