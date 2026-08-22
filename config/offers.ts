/**
 * SCALEVO — Offer Configuration
 * PHANTOM 30 content and structure.
 * Marketing decisions here; engineering implements.
 */

export const PHANTOM_30 = {
  name: "PHANTOM 30",
  subtitle: "Founding Sprint",
  headline: "30 días para construir el sistema.",
  supporting:
    "Un sprint de diagnóstico e implementación diseñado para negocios cuya presencia digital todavía no refleja su verdadero nivel.",

  price: {
    total: 9000,
    currency: "MXN",
    activation: 4500,
    label: "INVERSIÓN",
    activationLabel: "ACTIVACIÓN",
  },

  timeline: [
    {
      marker: "DÍA 0",
      title: "Diagnóstico",
      desc: "Mapeamos el negocio, la audiencia, la competencia y el cuello de botella principal de percepción.",
    },
    {
      marker: "SEMANA 1",
      title: "Posicionamiento y dirección",
      desc: "Definimos el mensaje central, la dirección visual y la oferta comunicada.",
    },
    {
      marker: "SEMANA 2",
      title: "Sistema creativo y activos",
      desc: "Construimos los activos de contenido y la estructura del funnel.",
    },
    {
      marker: "SEMANA 3",
      title: "Contenido y conversión",
      desc: "Producimos las piezas PHANTOM y conectamos la arquitectura de conversión.",
    },
    {
      marker: "SEMANA 4",
      title: "Implementación y handoff",
      desc: "Activamos, medimos y documentamos el sistema para que el negocio pueda iterarlo.",
    },
  ],

  deliverables: [
    {
      area: "DIAGNÓSTICO",
      items: ["Negocio y mercado", "Audiencia y competencia", "Presencia y conversión actual"],
    },
    {
      area: "AUTHORITY RESET",
      items: ["Posicionamiento y mensaje", "Dirección visual", "Oferta comunicada", "Perfil / presentación"],
    },
    {
      area: "CONTENT ENGINE",
      items: ["4 piezas PHANTOM", "Concepto + hook + estructura + CTA", "Dirección creativa"],
    },
    {
      area: "CONVERSIÓN",
      items: ["Funnel principal", "Arquitectura de contacto", "Cualificación y siguiente acción"],
    },
    {
      area: "HANDOFF",
      items: ["Documentación del sistema", "Recomendaciones", "Próximos experimentos"],
    },
  ],

  scopeNote:
    "El alcance exacto se define después del diagnóstico.",
} as const;

export const PHANTOM_SYSTEM_STAGES = [
  { id: "01", label: "DIAGNÓSTICO", desc: "Entendemos el negocio, el mercado y dónde se pierde percepción." },
  { id: "02", label: "POSICIONAMIENTO", desc: "Definimos el mensaje que diferencia y conecta con la audiencia correcta." },
  { id: "03", label: "PERCEPCIÓN", desc: "Construimos los activos visuales y de contenido que comunican el nivel real." },
  { id: "04", label: "CONTENIDO", desc: "Producimos piezas diseñadas para generar atención y calificar prospectos." },
  { id: "05", label: "CONVERSIÓN", desc: "Conectamos la atención con una ruta clara hacia la conversación comercial." },
  { id: "06", label: "MEDICIÓN", desc: "Registramos hipótesis, resultados y aprendizajes para iterar." },
] as const;
