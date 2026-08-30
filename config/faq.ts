import {
  CLAIMS_DISCLOSURE,
  formatMxn,
  PHANTOM_30,
  PRICING_POLICY,
  SCALE_BASIC,
  SCALE_FULL,
} from "@/config/offers";

export const FAQ_ITEMS = [
  {
    id: "que-es-phantom-30",
    q: "¿Qué es PHANTOM 30?",
    a: `${PHANTOM_30.publicLabel} es un sprint de ${PHANTOM_30.duration} para negocios que entregan bien, pero todavía no se ven en internet al mismo nivel. Aclaramos el mensaje, construimos el camino hacia una conversación y entregamos cuatro videos terminados dentro del alcance escrito.`,
  },
  {
    id: "agencia-redes-sociales",
    q: "¿SCALEVO es una agencia de redes sociales?",
    a: "No. El contenido es una parte del trabajo, no el producto completo. También revisamos qué entiende una persona al descubrirte, qué la ayuda a confiar y cómo puede pasar del interés al contacto.",
  },
  {
    id: "duracion-30-dias",
    q: "¿Por qué dura 30 días?",
    a: `Porque necesitamos entender el punto de partida, aclarar el mensaje, producir y entregar los cuatro videos terminados y dejar un siguiente paso claro. ${PHANTOM_30.durationCondition}`,
  },
  {
    id: "que-incluye",
    q: "¿Qué incluye PHANTOM 30?",
    a: "PHANTOM 30 incluye cuatro videos terminados dentro del alcance escrito: concepto, guion, preproducción, grabación ligera acordada, edición y entrega final. Antes de comenzar se fijan formato, duración, calendario, participantes, una ronda consolidada y criterios de aceptación. Raw, project files y gastos externos no están incluidos salvo Change Order escrito.",
  },
  {
    id: "cambio-de-marca",
    q: "¿Van a cambiar toda mi marca?",
    a: "No por defecto. A veces el problema está en el mensaje, en lo que la gente percibe o en el camino hacia el contacto. Solo proponemos un cambio de identidad si el diagnóstico demuestra que hace falta y se acuerda por escrito.",
  },
  {
    id: "garantia-de-resultados",
    q: "¿Garantizan ventas o resultados?",
    a: `No. ${CLAIMS_DISCLOSURE}`,
  },
  {
    id: "despues-de-phantom-30",
    q: "¿Qué pasa después de PHANTOM 30?",
    a: "Recibes los activos acordados, la documentación y las próximas pruebas recomendadas. Si tiene sentido continuar juntos, se evalúa una siguiente etapa; no es automática.",
  },
  {
    id: "equipo-interno",
    q: "¿Necesito equipo interno?",
    a: "No es obligatorio para PHANTOM 30. Sí necesitamos una persona disponible para compartir contexto, consolidar la revisión y tomar decisiones. SCALE FULL requiere más capacidad operativa e información para medir.",
  },
  {
    id: "tipo-de-negocio",
    q: "¿Trabajan con cualquier negocio?",
    a: "No. Trabajamos mejor con negocios que ya tienen una oferta valiosa, capacidad para cumplir y disposición para participar en las decisiones. Si todavía no es el momento adecuado, lo diremos con claridad.",
  },
  {
    id: "precio-phantom-30",
    q: "¿Cuánto cuesta PHANTOM 30?",
    a: `El precio base Founding actual es ${formatMxn(PHANTOM_30.price.base)} antes de IVA. La primera parcialidad base es ${formatMxn(PHANTOM_30.price.firstInstallment)} antes de IVA y está incluida dentro de esos ${formatMxn(PHANTOM_30.price.base)}; no se suma. ${PRICING_POLICY.safeDisclosure}`,
  },
  {
    id: "scale-basic",
    q: "¿Qué es SCALE BASIC?",
    a: `Es una intervención advisory de cinco días hábiles con precio base actual de ${formatMxn(SCALE_BASIC.priceBase)} antes de IVA. Aclara posición, oferta y siguiente ruta; no incluye producción. ${SCALE_BASIC.disclosure}`,
  },
  {
    id: "scale-full",
    q: "¿Qué es SCALE FULL?",
    a: `Es un modelo de operación integrada para equipos que ya tienen una base clara y capacidad de ejecución. El modelo comercial actual parte de ${formatMxn(SCALE_FULL.monthlyFrom)} por mes más ${formatMxn(SCALE_FULL.onboarding)} de onboarding, ambos antes de IVA, en un ciclo inicial propuesto de 90 días. ${SCALE_FULL.scopeDisclosure} ${SCALE_FULL.disclosure}`,
  },
  {
    id: "clientes-internacionales",
    q: "¿Trabajan con clientes internacionales?",
    a: "Se evalúa caso por caso. Residencia, uso del servicio, establecimiento en México, pagador, moneda, retenciones, ruta de pago y evidencia pueden cambiar el tratamiento. Ser extranjero no garantiza IVA a tasa 0%.",
  },
] as const;
