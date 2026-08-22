"use client";

import { useState } from "react";
import { z } from "zod";

const DiagnosticSchema = z.object({
  name: z
    .string()
    .min(2, "Nombre muy corto")
    .max(80, "Nombre muy largo")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Solo letras"),
  email: z.string().email("Email inválido"),
  business: z
    .string()
    .min(2, "Describe tu negocio")
    .max(200, "Descripción muy larga"),
  revenue: z.string().min(1, "Selecciona una opción"),
  challenge: z
    .string()
    .min(10, "Cuéntanos más")
    .max(1000, "Demasiados caracteres"),
});

type DiagnosticData = z.infer<typeof DiagnosticSchema>;
type FormErrors = Partial<Record<keyof DiagnosticData, string>>;

export default function DiagnosticForm() {
  const [formData, setFormData] = useState<Partial<DiagnosticData>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof DiagnosticData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = DiagnosticSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof DiagnosticData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="diagnostic-section" id="diagnostic">
        <div className="diagnostic-inner">
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              border: "1px solid rgba(26,26,255,0.3)",
              background: "rgba(26,26,255,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "var(--brand-blue)",
                marginBottom: "24px",
              }}
            >
              // DIAGNÓSTICO INICIADO
            </p>
            <h3
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: "var(--text-pure)",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Tu diagnóstico está en proceso.
            </h3>
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "16px",
                color: "var(--text-muted)",
                fontWeight: 300,
              }}
            >
              Te contactaremos en menos de 48 horas con tu análisis personalizado.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="diagnostic-section" id="diagnostic">
      <div className="diagnostic-inner">
        <p className="section-label">// DIAGNÓSTICO SCALEVO</p>
        <h2
          className="section-title"
          style={{ margin: "0 auto", textAlign: "center" }}
        >
          ¿Estás listo para el
          <br />
          <em style={{ fontStyle: "normal", color: "var(--brand-blue)" }}>
            siguiente nivel?
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "16px",
            fontWeight: 300,
            color: "var(--text-muted)",
            marginTop: "20px",
            lineHeight: 1.7,
          }}
        >
          Cuéntanos sobre tu negocio. Nuestro sistema analizará tu situación
          actual y te presentaremos un diagnóstico personalizado sin costo.
        </p>

        <form
          className="diagnostic-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de diagnóstico SCALEVO"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diag-name" className="form-label">
                Nombre completo *
              </label>
              <input
                id="diag-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Tu nombre"
                autoComplete="name"
                onChange={handleChange}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span id="name-error" className="form-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="diag-email" className="form-label">
                Email profesional *
              </label>
              <input
                id="diag-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="tu@empresa.com"
                autoComplete="email"
                onChange={handleChange}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span id="email-error" className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="diag-business" className="form-label">
              ¿A qué se dedica tu negocio? *
            </label>
            <input
              id="diag-business"
              name="business"
              type="text"
              className="form-input"
              placeholder="Ej: Consultoría de liderazgo para CEOs"
              onChange={handleChange}
              aria-describedby={errors.business ? "business-error" : undefined}
              aria-invalid={!!errors.business}
            />
            {errors.business && (
              <span id="business-error" className="form-error" role="alert">
                {errors.business}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="diag-revenue" className="form-label">
              Facturación mensual actual *
            </label>
            <select
              id="diag-revenue"
              name="revenue"
              className="form-select"
              defaultValue=""
              onChange={handleChange}
              aria-describedby={errors.revenue ? "revenue-error" : undefined}
              aria-invalid={!!errors.revenue}
            >
              <option value="" disabled>
                Selecciona un rango
              </option>
              <option value="0-1k">$0 — $1,000 USD/mes</option>
              <option value="1k-5k">$1,000 — $5,000 USD/mes</option>
              <option value="5k-20k">$5,000 — $20,000 USD/mes</option>
              <option value="20k-100k">$20,000 — $100,000 USD/mes</option>
              <option value="100k+">$100,000+ USD/mes</option>
            </select>
            {errors.revenue && (
              <span id="revenue-error" className="form-error" role="alert">
                {errors.revenue}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="diag-challenge" className="form-label">
              ¿Cuál es tu mayor obstáculo para escalar? *
            </label>
            <textarea
              id="diag-challenge"
              name="challenge"
              className="form-textarea"
              placeholder="Sé específico. ¿Qué te impide llegar al siguiente nivel?"
              rows={4}
              onChange={handleChange}
              aria-describedby={
                errors.challenge ? "challenge-error" : undefined
              }
              aria-invalid={!!errors.challenge}
            />
            {errors.challenge && (
              <span id="challenge-error" className="form-error" role="alert">
                {errors.challenge}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="form-submit"
            disabled={status === "loading"}
            id="diagnostic-submit-btn"
          >
            {status === "loading"
              ? "[ ANALIZANDO... ]"
              : "INICIAR MI DIAGNÓSTICO GRATUITO →"}
          </button>

          {status === "error" && (
            <p className="form-error" style={{ textAlign: "center" }} role="alert">
              Error al enviar. Inténtalo de nuevo o escríbenos directamente.
            </p>
          )}

          <p className="form-disclaimer">
            Sin spam. Sin compromiso. Solo resultados.
            <br />
            Tu información está cifrada y protegida.
          </p>
        </form>
      </div>
    </section>
  );
}
