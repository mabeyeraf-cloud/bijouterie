/* Sujets proposés dans les formulaires de contact et de rendez-vous. */
export const SUJETS = [
  { id: "question", label: "Question sur un bijou" },
  { id: "essayage", label: "Essayage d'une pièce" },
  { id: "mariage", label: "Alliances & mariage" },
  { id: "sur-mesure", label: "Création sur mesure" },
  { id: "entretien", label: "Entretien ou réparation" },
  { id: "autre", label: "Autre" },
] as const;

export const sujetLabel = (id?: string) => SUJETS.find((s) => s.id === id)?.label;
