/** Petite flèche en haut à droite des cartes cliquables (.card--link). */
export default function CardArrow() {
  return (
    <span className="card__arrow" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}
