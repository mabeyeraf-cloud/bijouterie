const icons: Record<string, React.ReactNode> = {
  // Création sur mesure : compas de dessin
  compas: <><circle cx="12" cy="4.5" r="1.6" /><path d="M11.2 6 5.5 20.5M12.8 6l5.7 14.5M8 14h8" /></>,
  // Gravure : lettre gravée sur une ligne
  gravure: <><path d="M7.5 16 11 6.5h2L16.5 16M8.9 12.5h6.2" /><path d="M4.5 19.5h15" /></>,
  // Entretien : éclat
  eclat: <path d="M12 3.5 13.7 10.3 20.5 12 13.7 13.7 12 20.5 10.3 13.7 3.5 12 10.3 10.3Z" />,
  // Écrin
  ecrin: <><path d="M4 10h16v9.5H4zM3 6.5h18V10H3zM12 6.5v13" /><path d="M12 6.5C10.5 3.5 7.5 3.8 8 5.6c.3 1 2.4.9 4 .9M12 6.5c1.5-3 4.5-2.7 4-.9-.3 1-2.4.9-4 .9" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chat: <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2a8.5 8.5 0 1 1 15.8-4.3z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
};

export default function Icon({ name, size = 20, className }: { name: keyof typeof icons | string; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false"
    >
      {icons[name]}
    </svg>
  );
}
