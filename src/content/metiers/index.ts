import type { Pole } from "./types";
import { comptabilite } from "./comptabilite";
import { fiscalite } from "./fiscalite";
import { paieRh } from "./paie-rh";
import { ipm } from "./ipm";
import { informatique } from "./informatique";

export type { Pole };

/** Les 5 métiers, dans l'ordre d'affichage. Textes officiels fournis le 26/10. */
export const poles: Pole[] = [comptabilite, fiscalite, paieRh, ipm, informatique];
