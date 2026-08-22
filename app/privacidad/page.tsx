import { SITE } from "@/config/site";
import Link from "next/link";

export const metadata = {
  title: "Privacidad",
};

export default function PrivacyPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "120px 20px",
        fontFamily: "var(--font-secondary)",
        color: "var(--text-pure)",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "32px", fontFamily: "var(--font-primary)" }}>
        Aviso de Privacidad
      </h1>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
        En <strong>{SITE.name}</strong>, el respeto a la privacidad y el uso medido de los datos es un principio fundamental.
      </p>
      
      <h2 style={{ fontSize: "1.25rem", marginTop: "32px", marginBottom: "16px", color: "var(--brand-blue)" }}>
        1. Recolección de Datos
      </h2>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
        Esta página web está diseñada como un sistema de posicionamiento estático. No solicitamos datos personales de manera directa en nuestro sitio ni utilizamos bases de datos para almacenar tu información de navegación de forma identificable.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "32px", marginBottom: "16px", color: "var(--brand-blue)" }}>
        2. Servicios de Terceros
      </h2>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
        Para el agendamiento de diagnósticos, utilizamos <strong>Calendly</strong>. Al interactuar con el widget de agendamiento, la información proporcionada (nombre, correo, respuestas) está sujeta a las políticas de privacidad y términos de Calendly. SCALEVO únicamente recibe una notificación de la reserva para poder contactarte y proveer el servicio solicitado.
      </p>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
        Adicionalmente, podemos utilizar servicios de analítica web (como Google Analytics 4) de manera anonimizada para entender el rendimiento de nuestra arquitectura. Esta medición tiene un fin exclusivamente estadístico y técnico para mejorar la accesibilidad y velocidad del sistema.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "32px", marginBottom: "16px", color: "var(--brand-blue)" }}>
        3. Contacto
      </h2>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
        Si tienes preguntas sobre el tratamiento de información en nuestras interacciones comerciales, puedes comunicarte con nosotros a través del correo: <a href={`mailto:${SITE.email}`} style={{ color: "var(--text-pure)", textDecoration: "underline" }}>{SITE.email}</a>.
      </p>

      <Link
        href="/"
        style={{
          marginTop: "60px",
          display: "inline-block",
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
