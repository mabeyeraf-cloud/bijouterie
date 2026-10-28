type Props = {
  /** "light" = fond clair (logo vert foncé) ; "dark" = fond vert/sombre (logo crème) */
  variant?: "light" | "dark";
  /** Version agrandie du logo (pages à fort impact) */
  full?: boolean;
  className?: string;
};

/** Symbole seul : les trois barres ascendantes du nouveau logo Groupe SAGFA. */
export function LogoMark({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const big = variant === "light" ? "#0F4D4A" : "#F7F5EE";
  const s = { strokeWidth: 8, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="127 127 394 396" className={className} aria-hidden="true" focusable="false">
      <path d="M139 390 L243 346 L243 466 L139 510Z" fill="#D7C3A5" stroke="#D7C3A5" {...s} />
      <path d="M272 285 L376 241 L376 447 L272 491Z" fill="#8CA896" stroke="#8CA896" {...s} />
      <path d="M405 182 L509 138 L509 430 L405 474Z" fill={big} stroke={big} {...s} />
    </svg>
  );
}

export default function Logo({ variant = "light", full = false, className = "" }: Props) {
  const src = variant === "light" ? "/brand/logo-horizontal-clair.png" : "/brand/logo-horizontal-sombre.png";
  return (
    <span className={`logo logo--${variant} ${full ? "logo--full" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Groupe SAGFA, cabinet de gestion" className="logo__img" width={1200} height={267} />
    </span>
  );
}
