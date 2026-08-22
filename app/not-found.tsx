import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-pure)",
        fontFamily: "var(--font-primary)",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(64px, 15vw, 120px)",
          fontWeight: 700,
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "var(--brand-blue)",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 500,
          margin: "16px 0 24px",
          letterSpacing: "-0.02em",
        }}
      >
        Esta parte del sistema no existe.
      </h2>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "16px",
          marginBottom: "40px",
          fontFamily: "var(--font-secondary)",
        }}
      >
        La página que buscas no está disponible o ha sido movida.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--brand-blue)",
          borderBottom: "1px solid var(--brand-blue)",
          paddingBottom: "8px",
          textDecoration: "none",
        }}
      >
        ← VOLVER AL INICIO
      </Link>
    </div>
  );
}
