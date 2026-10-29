import type { Drawing } from "@/lib/site";

/* Dessins au trait doré (couleur = currentColor, réglée en CSS). Décoratifs : aria-hidden. */

const trait = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Petite étoile à quatre branches (reflet). */
function Eclat({ x, y, r }: { x: number; y: number; r: number }) {
  const k = r * 0.18;
  const d = `M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`;
  return <path d={d} fill="currentColor" stroke="none" className="eclat" />;
}

const dessins: Record<Drawing, React.ReactNode> = {
  solitaire: (
    <>
      <circle cx="100" cy="130" r="46" strokeWidth="1.5" />
      <circle cx="100" cy="130" r="38" strokeWidth="1" opacity=".55" />
      <path d="M77 51 L87 87 M123 51 L113 87" strokeWidth="1.2" />
      <polygon points="86,38 114,38 126,50 100,78 74,50" strokeWidth="1.4" />
      <path d="M74 50 H126 M86 38 L80 50 L100 78 L120 50 L114 38 M93 38 L90 50 L100 78 L110 50 L107 38 M100 38 V50" strokeWidth=".9" opacity=".7" />
      <Eclat x={142} y={40} r={7} />
      <Eclat x={58} y={66} r={4} />
    </>
  ),
  alliance: (
    <>
      <ellipse cx="100" cy="104" rx="58" ry="62" strokeWidth="1.5" />
      <ellipse cx="100" cy="108" rx="46" ry="50" strokeWidth="1" opacity=".55" />
      <ellipse cx="100" cy="106" rx="52" ry="56" strokeWidth="3.2" strokeDasharray="0.01 7.2" />
      <Eclat x={150} y={50} r={7} />
    </>
  ),
  pendentif: (
    <>
      <path d="M24 26 Q100 150 176 26" strokeWidth="1" opacity=".45" />
      <path d="M24 26 Q100 150 176 26" strokeWidth="2.6" strokeDasharray="0.01 5" />
      <circle cx="100" cy="93" r="4" strokeWidth="1.3" />
      <path d="M100 98 C116 118 118 136 100 152 C82 136 84 118 100 98 Z" strokeWidth="1.5" />
      <path d="M100 111 C109 123 110 135 100 143 C90 135 91 123 100 111 Z" strokeWidth="1" opacity=".55" />
      <Eclat x={128} y={124} r={6} />
    </>
  ),
  collier: (
    <>
      <path d="M30 40 Q100 120 170 40" strokeWidth="1.5" />
      <g strokeWidth="1.1">
        <path d="M58 65.6V75.6" /><path d="M58 75.6C62 80.1 62 84.1 58 86.1C54 84.1 54 80.1 58 75.6Z" />
        <path d="M72 73.6V89.6" /><path d="M72 89.6C76.8 95 76.8 99.8 72 102.2C67.2 99.8 67.2 95 72 89.6Z" />
        <path d="M86 78.4V100.4" /><path d="M86 100.4C91.6 106.7 91.6 112.3 86 115.1C80.4 112.3 80.4 106.7 86 100.4Z" />
        <path d="M100 80V110" /><path d="M100 110C107.2 118.1 107.2 125.3 100 128.9C92.8 125.3 92.8 118.1 100 110Z" />
        <path d="M114 78.4V100.4" /><path d="M114 100.4C119.6 106.7 119.6 112.3 114 115.1C108.4 112.3 108.4 106.7 114 100.4Z" />
        <path d="M128 73.6V89.6" /><path d="M128 89.6C132.8 95 132.8 99.8 128 102.2C123.2 99.8 123.2 95 128 89.6Z" />
        <path d="M142 65.6V75.6" /><path d="M142 75.6C146 80.1 146 84.1 142 86.1C138 84.1 138 80.1 142 75.6Z" />
      </g>
      <Eclat x={150} y={128} r={6} />
    </>
  ),
  creoles: (
    <>
      <ellipse cx="66" cy="112" rx="28" ry="38" strokeWidth="1.5" />
      <ellipse cx="66" cy="114" rx="21" ry="30" strokeWidth="1" opacity=".55" />
      <ellipse cx="134" cy="112" rx="28" ry="38" strokeWidth="1.5" />
      <ellipse cx="134" cy="114" rx="21" ry="30" strokeWidth="1" opacity=".55" />
      <path d="M60 74 L72 74 M128 74 L140 74" strokeWidth="1.3" />
      <path d="M52 92 L56 96 M47 110 L51 112 M50 128 L54 128 M148 92 L144 96 M153 110 L149 112 M150 128 L146 128" strokeWidth="1" opacity=".7" />
      <Eclat x={160} y={56} r={6} />
    </>
  ),
  pendants: (
    <>
      <circle cx="70" cy="44" r="5" strokeWidth="1.4" />
      <path d="M70 49 V66" strokeWidth="1.2" />
      <circle cx="70" cy="70" r="4" strokeWidth="1.2" />
      <path d="M70 76 C83 94 84 108 70 120 C56 108 57 94 70 76 Z" strokeWidth="1.5" />
      <path d="M70 88 C77 98 77 106 70 112 C63 106 63 98 70 88 Z" strokeWidth="1" opacity=".55" />
      <circle cx="130" cy="44" r="5" strokeWidth="1.4" />
      <path d="M130 49 V66" strokeWidth="1.2" />
      <circle cx="130" cy="70" r="4" strokeWidth="1.2" />
      <path d="M130 76 C143 94 144 108 130 120 C116 108 117 94 130 76 Z" strokeWidth="1.5" />
      <path d="M130 88 C137 98 137 106 130 112 C123 106 123 98 130 88 Z" strokeWidth="1" opacity=".55" />
      <Eclat x={152} y={60} r={6} />
    </>
  ),
  jonc: (
    <>
      <ellipse cx="100" cy="100" rx="72" ry="36" strokeWidth="1.5" />
      <ellipse cx="100" cy="94" rx="62" ry="28" strokeWidth="1" opacity=".55" />
      <ellipse cx="100" cy="97" rx="67" ry="32" strokeWidth="3" strokeDasharray="0.01 7" />
      <Eclat x={160} y={56} r={7} />
    </>
  ),
  gourmette: (
    <>
      <g strokeWidth="1.2">
        <ellipse cx="30" cy="96" rx="6.5" ry="3.6" transform="rotate(-90 30 96)" />
        <ellipse cx="32.1" cy="86.3" rx="6.5" ry="3.6" transform="rotate(-66 32.1 86.3)" />
        <ellipse cx="38.2" cy="77.2" rx="6.5" ry="3.6" transform="rotate(-47 38.2 77.2)" />
        <ellipse cx="48" cy="69.2" rx="6.5" ry="3.6" transform="rotate(-32 48 69.2)" />
        <ellipse cx="60.9" cy="62.8" rx="6.5" ry="3.6" transform="rotate(-21 60.9 62.8)" />
        <ellipse cx="76.1" cy="58.4" rx="6.5" ry="3.6" transform="rotate(-12 76.1 58.4)" />
        <ellipse cx="92.7" cy="56.2" rx="6.5" ry="3.6" transform="rotate(-3 92.7 56.2)" />
        <ellipse cx="109.7" cy="56.4" rx="6.5" ry="3.6" transform="rotate(5 109.7 56.4)" />
        <ellipse cx="126.2" cy="58.9" rx="6.5" ry="3.6" transform="rotate(13 126.2 58.9)" />
        <ellipse cx="141.1" cy="63.6" rx="6.5" ry="3.6" transform="rotate(23 141.1 63.6)" />
        <ellipse cx="153.6" cy="70.3" rx="6.5" ry="3.6" transform="rotate(34 153.6 70.3)" />
        <ellipse cx="162.9" cy="78.5" rx="6.5" ry="3.6" transform="rotate(50 162.9 78.5)" />
        <ellipse cx="168.5" cy="87.7" rx="6.5" ry="3.6" transform="rotate(70 168.5 87.7)" />
        <ellipse cx="170" cy="97.4" rx="6.5" ry="3.6" transform="rotate(93 170 97.4)" />
        <ellipse cx="167.3" cy="107" rx="6.5" ry="3.6" transform="rotate(117 167.3 107)" />
        <ellipse cx="160.6" cy="116" rx="6.5" ry="3.6" transform="rotate(135 160.6 116)" />
        <ellipse cx="150.4" cy="123.8" rx="6.5" ry="3.6" transform="rotate(149 150.4 123.8)" />
        <ellipse cx="56.9" cy="127.5" rx="6.5" ry="3.6" transform="rotate(-156 56.9 127.5)" />
        <ellipse cx="44.8" cy="120.6" rx="6.5" ry="3.6" transform="rotate(-144 44.8 120.6)" />
        <ellipse cx="36.1" cy="112.3" rx="6.5" ry="3.6" transform="rotate(-128 36.1 112.3)" />
        <ellipse cx="31.1" cy="102.9" rx="6.5" ry="3.6" transform="rotate(-107 31.1 102.9)" />
      </g>
      <rect x="62" y="122" width="76" height="20" rx="10" strokeWidth="1.5" />
      <path d="M74 132 H126" strokeWidth="1" opacity=".5" strokeDasharray="2 4" />
      <Eclat x={150} y={44} r={7} />
    </>
  ),
};

export function JewelDrawing({ kind, className }: { kind: Drawing; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" {...trait}>
      {dessins[kind]}
    </svg>
  );
}

const petales = Array.from({ length: 24 }, (_, i) => i * 15);
const boucles = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

/** Médaillon en filigrane : motif d'accueil, inspiré des bijoux en fils d'or. */
export function Medallion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false" {...trait}>
      <circle cx="200" cy="200" r="194" strokeWidth=".7" opacity=".35" />
      <circle cx="200" cy="200" r="184" strokeWidth="3" strokeDasharray="0.01 9.6" />
      <circle cx="200" cy="200" r="174" strokeWidth=".9" />
      <g className="medaillon__couronne" strokeWidth="1.1">
        {petales.map((a) => <ellipse key={a} cx="200" cy="74" rx="12" ry="34" transform={`rotate(${a} 200 200)`} />)}
      </g>
      <circle cx="200" cy="200" r="96" strokeWidth="1" />
      <circle cx="200" cy="200" r="100" strokeWidth=".6" opacity=".5" />
      <g strokeWidth="1">
        {boucles.map((a) => <ellipse key={a} cx="200" cy="131" rx="8" ry="19" transform={`rotate(${a} 200 200)`} />)}
      </g>
      <circle cx="200" cy="200" r="46" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="40" strokeWidth="2.6" strokeDasharray="0.01 6.3" />
      <polygon points="224,209.9 209.9,224 190.1,224 176,209.9 176,190.1 190.1,176 209.9,176 224,190.1" strokeWidth="1.3" />
      <polygon points="212,205 205,212 195,212 188,205 188,195 195,188 205,188 212,195" strokeWidth="1" />
      <path d="M212 205L224 209.9M205 212L209.9 224M195 212L190.1 224M188 205L176 209.9M188 195L176 190.1M195 188L190.1 176M205 188L209.9 176M212 195L224 190.1" strokeWidth=".8" opacity=".75" />
      <Eclat x={306} y={92} r={9} />
      <Eclat x={88} y={300} r={6} />
      <Eclat x={330} y={318} r={5} />
    </svg>
  );
}

/** Deux alliances enlacées. */
export function Rings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} aria-hidden="true" focusable="false" {...trait}>
      <g transform="rotate(-18 165 175)">
        <ellipse cx="165" cy="175" rx="82" ry="66" strokeWidth="1.6" />
        <ellipse cx="165" cy="178" rx="70" ry="55" strokeWidth="1" opacity=".55" />
      </g>
      <g transform="rotate(16 240 160)">
        <ellipse cx="240" cy="160" rx="82" ry="66" strokeWidth="1.6" />
        <ellipse cx="240" cy="163" rx="70" ry="55" strokeWidth="1" opacity=".55" />
        <ellipse cx="240" cy="161.5" rx="76" ry="60.5" strokeWidth="3" strokeDasharray="0.01 8" />
      </g>
      <g transform="translate(258 84) rotate(16)">
        <polygon points="-11,-9 11,-9 18,0 0,19 -18,0" strokeWidth="1.3" />
        <path d="M-18 0H18M-11 -9L-6 0L0 19L6 0L11 -9" strokeWidth=".8" opacity=".7" />
      </g>
      <Eclat x={296} y={70} r={8} />
      <Eclat x={110} y={250} r={5} />
      <Eclat x={60} y={60} r={5} />
    </svg>
  );
}

/** Symbole de la marque : un cercle et une pierre taillée. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false" {...trait}>
      <circle cx="24" cy="24" r="22" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="18.5" strokeWidth="1.6" strokeDasharray="0.01 3.6" />
      <polygon points="17,18 31,18 35,23 24,35 13,23" strokeWidth="1.3" />
      <path d="M13 23H35M17 18L20.5 23L24 35L27.5 23L31 18" strokeWidth=".9" />
    </svg>
  );
}
