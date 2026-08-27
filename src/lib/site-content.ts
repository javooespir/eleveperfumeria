import { prisma } from "@/lib/prisma";

// Textos editables desde /admin/textos. Cada entrada define su valor por
// defecto: si la fila no existe en la DB se usa este texto, asi que sumar
// una key nueva no requiere migracion ni rompe el sitio.

export type ContentField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
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
];

export type SiteContent = Record<string, string>;

const DEFAULTS: SiteContent = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default])
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
