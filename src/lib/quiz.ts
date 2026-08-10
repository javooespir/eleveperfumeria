export type ScentFamily = "dulce" | "amaderado" | "floral" | "fresco" | "oriental";

export type QuizQuestion = {
  question: string;
  options: { label: string; family: ScentFamily }[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "¿Qué te describe mejor hoy?",
    options: [
      { label: "Dulce y goloso/a", family: "dulce" },
      { label: "Intenso y misterioso/a", family: "amaderado" },
      { label: "Romántico/a y elegante", family: "floral" },
      { label: "Activo/a y fresco/a", family: "fresco" },
      { label: "Magnético/a y lujoso/a", family: "oriental" },
    ],
  },
  {
    question: "Elegí la nota que más te atrae",
    options: [
      { label: "Vainilla y caramelo", family: "dulce" },
      { label: "Cuero y vetiver", family: "amaderado" },
      { label: "Jazmín y rosa", family: "floral" },
      { label: "Cítricos y bergamota", family: "fresco" },
      { label: "Ámbar y azafrán", family: "oriental" },
    ],
  },
  {
    question: "¿Para qué momento lo vas a usar más?",
    options: [
      { label: "Un mimo para vos", family: "dulce" },
      { label: "Una salida de noche", family: "amaderado" },
      { label: "Una cita especial", family: "floral" },
      { label: "El día a día", family: "fresco" },
      { label: "Un evento importante", family: "oriental" },
    ],
  },
  {
    question: "Elegí un color",
    options: [
      { label: "Rosa pastel", family: "dulce" },
      { label: "Marrón tierra", family: "amaderado" },
      { label: "Blanco cálido", family: "floral" },
      { label: "Celeste", family: "fresco" },
      { label: "Dorado", family: "oriental" },
    ],
  },
];

// Recomendaciones armadas con las notas reales de las fichas del cliente —
// se eligieron las fragancias mas premium (mayor precio) que mejor calzan
// con cada familia olfativa.
export const QUIZ_RESULTS: Record<
  ScentFamily,
  { productName: string; blurb: string }
> = {
  dulce: {
    productName: "Eclaire",
    blurb: "Gourmand y dulce: caramelo, vainilla y praliné sobre un fondo de almizcle.",
  },
  amaderado: {
    productName: "Asad Bourbon",
    blurb:
      "Cálido y especiado: pimienta rosa, nuez moscada y cacao sobre vetiver, ámbar y vainilla bourbon.",
  },
  floral: {
    productName: "Club de Nuit Woman",
    blurb: "Floral elegante: durazno y bergamota, corazón de rosa y jazmín, fondo de vainilla.",
  },
  fresco: {
    productName: "Club de Nuit Intense Man",
    blurb: "Fresco y vibrante: cítricos y grosellas negras con jazmín y fondo amaderado.",
  },
  oriental: {
    productName: "Club de Nuit Urban Elixir",
    blurb: "Oriental y magnético: azahar y jazmín, especias y azafrán sobre ámbar y cedro.",
  },
};

export function scoreQuiz(answers: ScentFamily[]): ScentFamily {
  const tally: Record<ScentFamily, number> = {
    dulce: 0,
    amaderado: 0,
    floral: 0,
    fresco: 0,
    oriental: 0,
  };
  for (const a of answers) tally[a]++;

  let winner: ScentFamily = "dulce";
  let max = -1;
  for (const family of Object.keys(tally) as ScentFamily[]) {
    if (tally[family] > max) {
      max = tally[family];
      winner = family;
    }
  }
  return winner;
}
