import { prisma } from "@/lib/prisma";
import {
  QUIZ_DEFAULTS,
  QUIZ_DEFAULT_BLURBS,
  SCENT_FAMILIES,
  quizBlurbKey,
  quizOptionKey,
  quizProductKey,
  quizQuestionKey,
} from "@/lib/quiz";

// Textos editables desde /admin/textos. Cada entrada define su valor por
// defecto: si la fila no existe en la DB se usa este texto, asi que sumar
// una key nueva no requiere migracion ni rompe el sitio.

export type ContentField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  /** Si es true, dejar el campo vacio lo guarda vacio en vez de volver al
   *  texto original. Sirve para renglones que el cliente quiere poder sacar. */
  allowEmpty?: boolean;
  default: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  // ---- Barra superior ----
  {
    key: "announcement_1",
    label: "Aviso 1",
    group: "Barra de avisos",
    default: "Envío gratis en compras +$50.000",
  },
  {
    key: "announcement_2",
    label: "Aviso 2",
    group: "Barra de avisos",
    default: "3 y 6 cuotas sin interés",
  },
  {
    key: "announcement_3",
    label: "Aviso 3",
    group: "Barra de avisos",
    default: "Descuento especial pagando por transferencia",
  },
  {
    key: "announcement_4",
    label: "Aviso 4",
    group: "Barra de avisos",
    default: "Perfumeros y muestras disponibles",
  },

  // ---- Hero ----
  { key: "hero_badge", label: "Etiqueta chica", group: "Portada (hero)", default: "Perfumería de catálogo" },
  { key: "hero_title_1", label: "Título — línea 1", group: "Portada (hero)", default: "¿Ya sabés cuál es" },
  {
    key: "hero_title_2",
    label: "Título — línea 2 (dorada)",
    group: "Portada (hero)",
    default: "tu próximo perfume?",
  },
  {
    key: "hero_subtitle",
    label: "Texto debajo del título",
    group: "Portada (hero)",
    multiline: true,
    default:
      "Perfumes árabes y de diseñador, body splash y tubitos de muestra. Envío a domicilio y coordinación directa por WhatsApp.",
  },
  {
    key: "hero_cta_primary",
    label: "Botón principal",
    group: "Portada (hero)",
    default: "Ver catálogo completo",
  },
  {
    key: "hero_cta_secondary",
    label: "Botón secundario (abre el quiz)",
    group: "Portada (hero)",
    default: "Encontrá tu perfume ideal",
  },
  { key: "hero_benefit_1", label: "Beneficio 1", group: "Portada (hero)", default: "Envío a domicilio" },
  {
    key: "hero_benefit_2",
    label: "Beneficio 2",
    group: "Portada (hero)",
    default: "3 y 6 cuotas sin interés",
  },
  {
    key: "hero_benefit_3",
    label: "Beneficio 3",
    group: "Portada (hero)",
    default: "Coordinación por WhatsApp",
  },

  // ---- Carrusel ----
  {
    key: "trending_title",
    label: "Título de la sección",
    group: "Los más buscados",
    default: "Los más buscados",
  },

  // ---- Quiz ----
  { key: "quiz_eyebrow", label: "Texto chico de arriba", group: "Sección del quiz", default: "¿No sabés cuál elegir?" },
  { key: "quiz_title_1", label: "Título — línea 1", group: "Sección del quiz", default: "Hacé el quiz de notas" },
  { key: "quiz_title_2", label: "Título — línea 2", group: "Sección del quiz", default: "y encontrá tu fragancia" },
  {
    key: "quiz_subtitle",
    label: "Texto descriptivo",
    group: "Sección del quiz",
    multiline: true,
    default:
      "4 preguntas rápidas y te recomendamos una fragancia del catálogo — antes de comprar el frasco completo, probá un tubito de 5ml.",
  },

  // ---- Cierre ----
  {
    key: "cta_title_1",
    label: "Título — línea 1",
    group: "Cierre de la página",
    default: "Perfumes, body splash y perfumeros.",
  },
  {
    key: "cta_title_2",
    label: "Título — línea 2 (dorada)",
    group: "Cierre de la página",
    default: "Todo en un mismo catálogo.",
  },
  {
    key: "cta_button",
    label: "Botón",
    group: "Cierre de la página",
    default: "Ver catálogo completo",
  },

  // ---- Checkout ----
  {
    key: "checkout_shipping_notice",
    label: "Cartel de envío (cuando se coordina por WhatsApp)",
    group: "Checkout",
    multiline: true,
    default: "Envío a coordinar por WhatsApp",
  },

  // ---- Tarjeta minorista / mayorista de la portada ----
  // Se pueden vaciar: el renglon desaparece de la tarjeta. Pensado para
  // cosas que todavia no se ofrecen, como las cuotas.
  {
    key: "buyer_retail_feature_1",
    label: "Minorista — renglón 1",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "Todas las categorías",
  },
  {
    key: "buyer_retail_feature_2",
    label: "Minorista — renglón 2",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "3 y 6 cuotas sin interés",
  },
  {
    key: "buyer_retail_feature_3",
    label: "Minorista — renglón 3",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "Coordinación por WhatsApp",
  },
  {
    key: "buyer_wholesale_feature_1",
    label: "Mayorista — renglón 1",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "Precios especiales por volumen",
  },
  {
    key: "buyer_wholesale_feature_2",
    label: "Mayorista — renglón 2",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "Sin mínimo por artículo",
  },
  {
    key: "buyer_wholesale_feature_3",
    label: "Mayorista — renglón 3",
    group: "Tarjeta minorista / mayorista",
    allowEmpty: true,
    default: "Coordinación por WhatsApp",
  },
];

/**
 * Campos del quiz. Viven aparte de CONTENT_FIELDS para que la pantalla de
 * "Textos" no se llene con las 24 filas del quiz: se editan en /admin/quiz.
 */
export const QUIZ_TEXT_FIELDS: ContentField[] = [
  ...QUIZ_DEFAULTS.flatMap((q, i) => [
    {
      key: quizQuestionKey(i),
      label: `Pregunta ${i + 1}`,
      group: `Pregunta ${i + 1}`,
      default: q.question,
    },
    ...SCENT_FAMILIES.map((f) => ({
      key: quizOptionKey(i, f.value),
      label: `Opción — perfil ${f.label}`,
      group: `Pregunta ${i + 1}`,
      default: q.options[f.value],
    })),
  ]),
  ...SCENT_FAMILIES.map((f) => ({
    key: quizBlurbKey(f.value),
    label: `Descripción del perfil ${f.label}`,
    group: "Resultados",
    multiline: true,
    default: QUIZ_DEFAULT_BLURBS[f.value],
  })),
];

/** Producto recomendado por perfil. Vacio = todavia sin elegir. */
export const QUIZ_PRODUCT_FIELDS: ContentField[] = SCENT_FAMILIES.map((f) => ({
  key: quizProductKey(f.value),
  label: `Perfume para el perfil ${f.label}`,
  group: "Resultados",
  default: "",
}));

export type SiteContent = Record<string, string>;

const DEFAULTS: SiteContent = Object.fromEntries(
  [...CONTENT_FIELDS, ...QUIZ_TEXT_FIELDS, ...QUIZ_PRODUCT_FIELDS].map((f) => [
    f.key,
    f.default,
  ])
);

/** Lee los textos de la DB y completa con los defaults los que falten. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const rows = await prisma.siteContent.findMany();
    const fromDb = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULTS, ...fromDb };
  } catch {
    // Si la DB no responde, la landing igual se muestra con los textos base.
    return DEFAULTS;
  }
}

export const contentDefaults = DEFAULTS;
