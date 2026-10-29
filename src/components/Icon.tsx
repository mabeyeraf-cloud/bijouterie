const paths: Record<string, React.ReactNode> = {
  bagues: <><circle cx="12" cy="15" r="6" /><path d="M9 5h6l2 3-5 3-5-3z" /></>,
  colliers: <><path d="M4 4c0 8 3 12 8 12s8-4 8-12" /><path d="m12 16-2.5 3 2.5 2 2.5-2z" /></>,
  bracelets: <><ellipse cx="12" cy="9" rx="9" ry="4" /><path d="M3 9v6c0 2.2 4 4 9 4s9-1.8 9-4V9" /></>,
  boucles: <><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><path d="M12 11c-3 0-4 3-4 5a4 4 0 0 0 8 0c0-2-1-5-4-5z" /></>,
  alliances: <><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /></>,
  parures: <><path d="M6 4h12l4 6-10 11L2 10z" /><path d="M2 10h20M9 4l-2 6 5 11 5-11-2-6" /></>,
  taille: <><circle cx="12" cy="12" r="5" /><path d="M2 12h3M19 12h3M4 9l-2 3 2 3M20 9l2 3-2 3" /></>,
  gravure: <><path d="M4 20l1-4L17 4l3 3L8 19z" /><path d="M14 7l3 3" /></>,
  surmesure: <><path d="M3 17 17 3l4 4L7 21z" /><path d="M7 13l2 2M10 10l2 2M13 7l2 2" /></>,
  reparation: <><path d="M14 6a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3z" /><path d="M14 6l-1-3 3-1 1 3" /></>,
  entretien: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9 15a3 3 0 0 0 3 3" /></>,
  or: <><path d="M6 4h12l4 6-10 11L2 10z" /></>,
  conseil: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  paiement: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  boutique: <><path d="M4 9l1-5h14l1 5" /><path d="M4 9v11h16V9M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0" /></>,
};

export default function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] ?? paths.parures}
    </svg>
  );
}
