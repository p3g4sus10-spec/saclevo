export const PRICING_POLICY = {
  currency: "MXN",
  domesticIvaTreatment: "open",
  internationalIvaTreatment: "per_case_only",
  publicMode: "base_before_iva",
  safeDisclosure:
    "El impuesto aplicable y el total se confirmarán antes de contratar.",
  publicTaxRate: null,
} as const;

export function formatMxn(value: number): string {
  return `$${value.toLocaleString("es-MX")} MXN`;
}

export const CLAIMS_DISCLOSURE =
  "Scalevo presta servicios y entrega los activos definidos por escrito. Los resultados comerciales dependen también del mercado, la oferta, la ejecución del cliente, el presupuesto, las plataformas y otros factores fuera de control. No se garantizan ventas, leads, vistas, viralidad, ROI, rankings ni aprobación de terceros.";

export const SCALE_BASIC = {
  id: "scale-basic",
  index: "01",
  name: "SCALE BASIC",
  job: "ACLARAR LO ESENCIAL",
  durationBusinessDays: 5,
  priceBase: 7500,
  question: "¿Tu oferta todavía cuesta trabajo explicar?",
  description:
    "En 5 días hábiles ordenamos qué vendes, para quién, por qué importa y cuál debe ser el siguiente paso. Es una asesoría acotada (advisory): recibes diagnóstico y una ruta clara; no incluye producción.",
  terms: `5 días hábiles · ${formatMxn(7500)} antes de IVA · advisory, sin producción`,
  disclosure: PRICING_POLICY.safeDisclosure,
  includesProduction: false,
} as const;

export const PHANTOM_30 = {
  id: "phantom-30",
  index: "02",
  name: "PHANTOM 30",
  publicLabel: "PHANTOM 30 — FOUNDING",
  programLabel: "FOUNDING",
  job: "MEJORAR CÓMO TE VEN Y CÓMO TE CONTACTAN",
  question:
    "¿Tu negocio cumple, pero en internet no se entiende ni se siente al mismo nivel?",
  headline: "30 días para que tu negocio se vea tan sólido como es.",
  description:
    "Un sprint de diagnóstico e implementación que entrega cuatro videos terminados dentro del alcance escrito: concepto, guion, preproducción, grabación ligera acordada, edición y entrega final.",
  valueStatement:
    "No estás comprando contenido por contenido. Estás invirtiendo en mejorar cómo te descubren, te entienden y llegan a una conversación contigo.",
  price: {
    base: 9000,
    currency: PRICING_POLICY.currency,
    firstInstallment: 4500,
    baseBalance: 4500,
    label: "PRECIO BASE FOUNDING · ANTES DE IVA",
    installmentLabel:
      "PRIMERA PARCIALIDAD BASE · INCLUIDA EN LOS $9,000 · ANTES DE IVA",
    terms: `30 días · ${formatMxn(9000)} antes de IVA · primera parcialidad de ${formatMxn(4500)} antes de IVA incluida dentro de esos $9,000`,
    note:
      "El precio base Founding es $9,000 MXN antes de IVA. La primera parcialidad base de $4,500 MXN antes de IVA forma parte de ese precio; no se suma. El saldo base es $4,500 MXN antes de IVA conforme al hito o fecha acordados por escrito.",
    disclosure: PRICING_POLICY.safeDisclosure,
  },
  duration: "30 días",
  durationCondition:
    "El calendario de 30 días comienza cuando se cumplen las condiciones de activación definidas por escrito.",
  consolidatedRevisionRounds: 1,
  timeline: [
    {
      marker: "DÍA 0",
      title: "Entendemos el punto de partida",
      desc: "Revisamos tu negocio, tu cliente ideal, la competencia y dónde se pierde claridad o contacto.",
    },
    {
      marker: "SEMANA 1",
      title: "Aclaramos el mensaje",
      desc: "Definimos qué debe entender una persona, por qué elegirte y cómo presentar tu oferta.",
    },
    {
      marker: "SEMANA 2",
      title: "Diseñamos los cuatro videos",
      desc: "Creamos los conceptos, guiones, preproducción y dirección de los cuatro videos.",
    },
    {
      marker: "SEMANA 3",
      title: "Producimos y conectamos",
      desc: "Realizamos la grabación ligera acordada, editamos los cuatro videos terminados y conectamos el interés con un siguiente paso claro.",
    },
    {
      marker: "SEMANA 4",
      title: "Entregamos y trazamos la continuidad",
      desc: "Consolidamos una ronda base de revisión, entregamos lo acordado y definimos qué conviene probar después.",
    },
  ],
  deliverables: [
    {
      area: "PUNTO DE PARTIDA",
      items: [
        "Qué vendes y a quién",
        "Qué te diferencia",
        "Dónde se pierde claridad o contacto",
      ],
    },
    {
      area: "MENSAJE Y PRESENCIA",
      items: ["Mensaje principal", "Dirección visual", "Presentación de la oferta"],
    },
    {
      area: "4 VIDEOS TERMINADOS",
      items: [
        "Concepto, guion y preproducción",
        "Grabación ligera acordada y dirección creativa",
        "Edición y entrega final",
      ],
    },
    {
      area: "CAMINO A LA CONVERSACIÓN",
      items: [
        "Siguiente paso principal",
        "Forma de contacto",
        "Criterios para reconocer una buena oportunidad",
      ],
    },
    {
      area: "CIERRE Y CONTINUIDAD",
      items: [
        "Una ronda consolidada base",
        "Documentación y recomendaciones",
        "Próximas pruebas",
      ],
    },
  ],
  scopeNote:
    "Incluye cuatro videos terminados conforme a formato, duración, grabación, revisión y especificaciones pactadas. Raw, tomas descartadas, project files, pauta, talento, locaciones, viajes, música, stock, licencias y otros gastos externos no están incluidos salvo Change Order escrito.",
  claimsDisclosure: CLAIMS_DISCLOSURE,
} as const;

export const SCALE_FULL = {
  id: "scale-full",
  index: "03",
  name: "SCALE FULL",
  job: "OPERAR Y MEJORAR DE FORMA CONTINUA",
  monthlyFrom: 72000,
  onboarding: 15000,
  proposedInitialCycleDays: 90,
  question:
    "¿Ya tienes una base clara y necesitas un equipo que opere y mejore el sistema contigo?",
  description:
    "Trabajamos contigo de forma continua en mensaje, contenido, camino de contacto, seguimiento comercial y medición. El onboarding prepara prioridades, responsables, accesos, medición y plan de ejecución.",
  cycleReason:
    "Trabajamos en un ciclo inicial propuesto de 90 días para tener tiempo de instalar, medir y optimizar.",
  terms: `Ciclo inicial propuesto de 90 días · desde ${formatMxn(72000)}/mes + ${formatMxn(15000)} de onboarding, ambos antes de IVA`,
  scopeDisclosure:
    "“Desde” no fija el precio final. El scope, la mensualidad exacta, el onboarding, la capacidad, los límites, el calendario y la terminación se confirman por escrito antes de comenzar. El modelo sigue sujeto a validación comercial.",
  disclosure: PRICING_POLICY.safeDisclosure,
} as const;

export const PRODUCT_ROUTES = [
  SCALE_BASIC,
  {
    ...PHANTOM_30,
    featured: true,
    terms: PHANTOM_30.price.terms,
    disclosure: PHANTOM_30.price.disclosure,
  },
  {
    ...SCALE_FULL,
    description: `${SCALE_FULL.description} ${SCALE_FULL.cycleReason}`,
  },
] as const;

export const SCALE_FULL_PREREQUISITES =
  "SCALE FULL tiene sentido cuando ya existe una oferta clara, capacidad para atender nuevas oportunidades, una persona responsable dentro del negocio y acceso a la información necesaria para decidir y ejecutar.";

export const PHANTOM_SYSTEM_STAGES = [
  {
    id: "01",
    label: "DIAGNÓSTICO",
    desc: "Vemos qué vendes, a quién y dónde se pierde claridad o confianza.",
  },
  {
    id: "02",
    label: "POSICIONAMIENTO",
    desc: "Aclaramos por qué elegirte y cómo decirlo de forma fácil de entender.",
  },
  {
    id: "03",
    label: "PERCEPCIÓN",
    desc: "Hacemos visible el nivel real de lo que entregas.",
  },
  {
    id: "04",
    label: "CONTENIDO",
    desc: "Creamos piezas con un propósito, no para llenar un calendario.",
  },
  {
    id: "05",
    label: "CONVERSIÓN",
    desc: "Damos a la persona interesada un siguiente paso claro hacia una conversación.",
  },
  {
    id: "06",
    label: "MEDICIÓN",
    desc: "Observamos las señales disponibles y decidimos qué conviene mejorar.",
  },
] as const;
