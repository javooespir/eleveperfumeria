export type ScentFamily = "dulce" | "amaderado" | "floral" | "fresco" | "oriental";

/** Los 5 perfiles del quiz. El orden define el de las opciones en pantalla. */
export const SCENT_FAMILIES: { value: ScentFamily; label: string }[] = [
  { value: "dulce", label: "Dulce" },
  { value: "amaderado", label: "Amaderado" },
  { value: "floral", label: "Floral" },
  { value: "fresco", label: "Fresco" },
  { value: "oriental", label: "Oriental" },
];

export const QUIZ_QUESTION_COUNT = 4;

/**
 * Textos por defecto. El cliente los edita desde /admin/quiz; lo que se
 * guarda en la base pisa estos valores, y si falta alguno se usa el de aca.
 */
export const QUIZ_DEFAULTS: {
  question: string;
  options: Record<ScentFamily, string>;
}[] = [
  {
    question: "¿Qué te describe mejor hoy?",
    options: {
      dulce: "Dulce y goloso/a",
      amaderado: "Intenso y misterioso/a",
      floral: "Romántico/a y elegante",
      fresco: "Activo/a y fresco/a",
      oriental: "Magnético/a y lujoso/a",
    },
  },
  {
    question: "Elegí la nota que más te atrae",
    options: {
      dulce: "Vainilla y caramelo",
      amaderado: "Cuero y vetiver",
      floral: "Jazmín y rosa",
      fresco: "Cítricos y bergamota",
      oriental: "Ámbar y azafrán",
    },
  },
  {
    question: "¿Para qué momento lo vas a usar más?",
    options: {
      dulce: "Un mimo para vos",
      amaderado: "Una salida de noche",
      floral: "Una cita especial",
      fresco: "El día a día",
      oriental: "Un evento importante",
    },
  },
  {
    question: "Elegí un color",
    options: {
      dulce: "Rosa pastel",
      amaderado: "Marrón tierra",
      floral: "Blanco cálido",
      fresco: "Celeste",
      oriental: "Dorado",
    },
  },
];

export const QUIZ_DEFAULT_BLURBS: Record<ScentFamily, string> = {
  dulce: "Gourmand y dulce: caramelo, vainilla y praliné sobre un fondo de almizcle.",
  amaderado: "Cálido y especiado: pimienta, cacao y vetiver sobre ámbar y vainilla.",
  floral: "Floral elegante: durazno y bergamota, corazón de rosa y jazmín.",
  fresco: "Fresco y vibrante: cítricos y grosellas con un fondo amaderado.",
  oriental: "Oriental y magnético: azahar, especias y azafrán sobre ámbar y cedro.",
};

// ---- Claves de configuracion (se guardan en SiteContent) ----

export const quizQuestionKey = (i: number) => `quiz_q${i + 1}_title`;
export const quizOptionKey = (i: number, family: ScentFamily) => `quiz_q${i + 1}_${family}`;
export const quizProductKey = (family: ScentFamily) => `quiz_result_${family}_product`;
export const quizBlurbKey = (family: ScentFamily) => `quiz_result_${family}_blurb`;

export type QuizQuestion = {
  question: string;
  options: { label: string; family: ScentFamily }[];
};

/** Arma las preguntas con los textos configurados por el cliente. */
export function buildQuizQuestions(content: Record<string, string>): QuizQuestion[] {
  return QUIZ_DEFAULTS.map((q, i) => ({
    question: content[quizQuestionKey(i)] || q.question,
    options: SCENT_FAMILIES.map(({ value }) => ({
      family: value,
      label: content[quizOptionKey(i, value)] || q.options[value],
    })),
  }));
}

/**
 * Perfil ganador. Siempre devuelve una familia: ante empate gana la que
 * aparece primero en SCENT_FAMILIES, asi que cualquier combinacion de
 * respuestas tiene resultado.
 */
export function scoreQuiz(answers: ScentFamily[]): ScentFamily {
  const tally = Object.fromEntries(SCENT_FAMILIES.map((f) => [f.value, 0])) as Record<
    ScentFamily,
    number
  >;
  for (const a of answers) tally[a]++;

  let winner: ScentFamily = SCENT_FAMILIES[0].value;
  let max = -1;
  for (const { value } of SCENT_FAMILIES) {
    if (tally[value] > max) {
      max = tally[value];
      winner = value;
    }
  }
  return winner;
}
