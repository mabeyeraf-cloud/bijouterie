/** Illustration de remplacement tant qu'aucune photo n'est ajoutée. */
export default function Gem({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M16 10h32l12 16-28 30L4 26z" />
      <path d="M4 26h56M22 26l10 30 10-30M24 10l-8 16M40 10l8 16M24 10l8 16 8-16" />
    </svg>
  );
}
