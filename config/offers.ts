export const PRICING_POLICY = {
  currency: "MXN",
  domesticIvaTreatment: "open",
  internationalIvaTreatment: "per_case_only",
  publicMode: "base_before_iva",
  safeDisclosure:
    "El impuesto aplicable y el total se confirmarán antes de contratar.",
  publicTaxRate: null,
} as const;

export function formatMxnAmount(value: number): string {
  return `$${value.toLocaleString("es-MX")}`;
}

export function formatMxn(value: number): string {
  return `${formatMxnAmount(value)} MXN`;
}

const SCALE_BASIC_PRICE = 7_500;
const PHANTOM_30_PRICE = 9_000;
const PHANTOM_30_FIRST_INSTALLMENT = 4_500;
const SCALE_FULL_MONTHLY_FROM = 72_000;
const SCALE_FULL_ONBOARDING = 15_000;

export function calculateFoundingAvailability(total: number, used: number) {
  if (!Number.isInteger(total) || total < 1) {
    throw new RangeError("FOUNDING_TOTAL must be a positive integer");
  }

  if (!Number.isInteger(used) || used < 0 || used > total) {
    throw new RangeError("FOUNDING_USED must be an integer between 0 and total");
  }

  const remaining = total - used;
  return {
    total,
    used,
    remaining,
    closed: remaining === 0,
  } as const;
}

export const FOUNDING_TOTAL = 4;

/**
 * Owner-controlled inventory. Increase only after the corresponding SOW is
 * accepted and the first installment has been received. Leads, diagnostics,
 * proposals and verbal commitments do not consume a slot.
 */
export const FOUNDING_USED = 0;

const foundingAvailability = calculateFoundingAvailability(
  FOUNDING_TOTAL,
  FOUNDING_USED,
);

export const FOUNDING_REMAINING = foundingAvailability.remaining;
export const FOUNDING_CLOSED = foundingAvailability.closed;

const foundingCountLabel = `${FOUNDING_REMAINING} ${
  FOUNDING_REMAINING === 1 ? "CUPO" : "CUPOS"
}`;
const foundingAvailabilityLabel = `${foundingCountLabel} FOUNDING ${
  FOUNDING_REMAINING === 1 ? "DISPONIBLE" : "DISPONIBLES"
}`;
const foundingStatusLabel = `${foundingCountLabel} ${
  FOUNDING_REMAINING === 1 ? "DISPONIBLE" : "DISPONIBLES"
}`;

export const PHANTOM_30_FOUNDING = {
  ...foundingAvailability,
  availabilityLabel: FOUNDING_CLOSED
    ? "FASE FOUNDING CERRADA"
    : foundingAvailabilityLabel,
  statusLabel: FOUNDING_CLOSED
    ? "FASE FOUNDING · CERRADA"
    : `FASE FOUNDING · SOLO ${foundingStatusLabel}`,
  principle: "Founding cambia la tarifa, no el alcance.",
  phaseCopy: `Durante los primeros cuatro proyectos Founding, PHANTOM 30 mantiene una tarifa de ${formatMxn(PHANTOM_30_PRICE)} antes de IVA.`,
  evidenceCopy:
    "Cada implementación se ejecutará y documentará para convertir la experiencia real en evidencia del sistema. Al cerrar esta fase, la tarifa Founding termina.",
  futureRateCopy:
    "La tarifa estándar posterior se definirá con datos reales de ejecución, capacidad y costos.",
  closedCopy:
    "La fase Founding ha finalizado. La disponibilidad y tarifa actual se confirman en diagnóstico.",
} as const;

export const CLAIMS_DISCLOSURE =
  "Scalevo presta servicios y entrega los activos definidos por escrito. Los resultados comerciales dependen también del mercado, la oferta, la ejecución del cliente, el presupuesto, las plataformas y otros factores fuera de control. No se garantizan ventas, leads, vistas, viralidad, ROI, rankings ni aprobación de terceros.";

export const SCALE_BASIC = {
  id: "scale-basic",
  index: "01",
  name: "SCALE BASIC",
  job: "ACLARAR LO ESENCIAL",
  durationBusinessDays: 5,
  priceBase: SCALE_BASIC_PRICE,
  question: "¿Tu oferta todavía cuesta trabajo explicar?",
  description:
    "En 5 días hábiles aclaramos posicionamiento, oferta y siguiente paso. Es una asesoría estratégica, sin producción.",
  ladderSummary:
    "Aclaramos posicionamiento, oferta y siguiente paso en 5 días. Asesoría estratégica, sin producción.",
  terms: `5 días hábiles · ${formatMxn(SCALE_BASIC_PRICE)} antes de IVA · asesoría estratégica, sin producción`,
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
    "Un sprint de diagnóstico e implementación que mejora cómo te presentas y entrega cuatro videos terminados conectados a un siguiente paso comercial.",
  ladderSummary:
    "Reestructuramos cómo te presentas y construimos 4 videos terminados conectados a un siguiente paso comercial.",
  valueStatement:
    "No estás comprando contenido por contenido. Estás invirtiendo en mejorar cómo te descubren, te entienden y llegan a una conversación contigo.",
  price: {
    base: PHANTOM_30_PRICE,
    currency: PRICING_POLICY.currency,
    firstInstallment: PHANTOM_30_FIRST_INSTALLMENT,
    baseBalance: PHANTOM_30_PRICE - PHANTOM_30_FIRST_INSTALLMENT,
    label: "TARIFA FOUNDING DE IMPLEMENTACIÓN · ANTES DE IVA",
    installmentLabel: `PRIMERA PARCIALIDAD BASE · INCLUIDA EN LOS ${formatMxnAmount(PHANTOM_30_PRICE)} · ANTES DE IVA`,
    terms: `30 días · ${formatMxn(PHANTOM_30_PRICE)} antes de IVA · primera parcialidad de ${formatMxn(PHANTOM_30_FIRST_INSTALLMENT)} antes de IVA incluida dentro de esos ${formatMxnAmount(PHANTOM_30_PRICE)}`,
    note: `La tarifa Founding de implementación es ${formatMxn(PHANTOM_30_PRICE)} antes de IVA. La primera parcialidad base de ${formatMxn(PHANTOM_30_FIRST_INSTALLMENT)} antes de IVA forma parte de esa tarifa; no se suma. El saldo base es ${formatMxn(PHANTOM_30_PRICE - PHANTOM_30_FIRST_INSTALLMENT)} antes de IVA conforme al hito o fecha acordados por escrito.`,
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
        "Concepto, hook y guion/estructura",
        "Dirección creativa, preproducción y grabación ligera acordada",
        "Edición, audio y captions/gráficos básicos cuando corresponda",
        "Color/acabado, export y entrega final",
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
  videoScopeSummary:
    "Concepto, hook, guion o estructura, dirección creativa, preproducción, grabación ligera acordada, edición, audio, captions o gráficos básicos cuando corresponda, color o acabado, export y entrega final.",
  exclusionsSummary:
    "No incluye automáticamente archivos raw, tomas descartadas, project files, talento costoso, locaciones extraordinarias, viajes, licencias, pauta, equipo especial ni producción extraordinaria.",
  scopeNote:
    "Incluye cuatro videos terminados conforme al formato, duración, grabación, revisión y especificaciones pactadas. No incluye automáticamente archivos raw, tomas descartadas, project files, talento costoso, locaciones extraordinarias, viajes, licencias, pauta, equipo especial ni producción extraordinaria. Cualquier extra requiere Change Order escrito.",
  claimsDisclosure: CLAIMS_DISCLOSURE,
} as const;

export const SCALE_FULL = {
  id: "scale-full",
  index: "03",
  name: "SCALE FULL",
  job: "OPERAR Y MEJORAR DE FORMA CONTINUA",
  monthlyFrom: SCALE_FULL_MONTHLY_FROM,
  onboarding: SCALE_FULL_ONBOARDING,
  proposedInitialCycleDays: 90,
  question:
    "¿Ya tienes una base clara y necesitas un equipo que opere y mejore el sistema contigo?",
  description:
    "Trabajamos contigo de forma continua en mensaje, contenido, conversión, seguimiento comercial y medición. La puesta en marcha (onboarding) prepara prioridades, responsables, accesos, medición y el plan de ejecución.",
  ladderSummary:
    "Operamos contigo contenido, conversión, seguimiento y medición de forma continua.",
  cycleReason:
    "Trabajamos en un ciclo inicial propuesto de 90 días: tiempo suficiente para instalar, operar, medir y optimizar.",
  terms: `Ciclo inicial propuesto de 90 días · desde ${formatMxn(SCALE_FULL_MONTHLY_FROM)}/mes antes de IVA · puesta en marcha (onboarding) ${formatMxn(SCALE_FULL_ONBOARDING)} una sola vez antes de IVA`,
  ladderNote:
    "Un ciclo inicial suficiente para instalar, operar, medir y optimizar. Sujeto al alcance exacto y validación comercial.",
  scopeDisclosure:
    "“Desde” no fija el precio final. El alcance, la mensualidad exacta, la puesta en marcha, la capacidad, los límites, el calendario y la terminación se confirman por escrito antes de comenzar. El modelo sigue sujeto a validación comercial.",
  disclosure: PRICING_POLICY.safeDisclosure,
} as const;

export const PRODUCT_ROUTES = [
  SCALE_BASIC,
  {
    ...PHANTOM_30,
    featured: true,
    founding: PHANTOM_30_FOUNDING,
    terms: FOUNDING_CLOSED
      ? PHANTOM_30_FOUNDING.closedCopy
      : PHANTOM_30.price.terms,
    ladderNote: FOUNDING_CLOSED
      ? PHANTOM_30_FOUNDING.closedCopy
      : PHANTOM_30_FOUNDING.principle,
    disclosure: PHANTOM_30.price.disclosure,
  },
  SCALE_FULL,
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
