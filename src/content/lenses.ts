export interface Lens {
  slug: string;
  name: { en: string; pt: string };
}

/**
 * The two starting lenses for Writing and Tools (writing-hub-spec.md, 2026-07-09).
 * Kept as an open list, not a hardcoded 2-item page structure — adding a third
 * lens later is a data change here, not a rebuild of the pages that read it.
 */
export const lenses: Lens[] = [
  { slug: 'personal-creative', name: { en: 'Personal & Creative', pt: 'Pessoal e Criativo' } },
  { slug: 'professional', name: { en: 'Professional', pt: 'Profissional' } },
];
