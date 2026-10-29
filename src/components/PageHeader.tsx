import { SplitTitle } from "./Motion";

type Props = { eyebrow: string; title: string; text: string; ghost: string; children?: React.ReactNode };

/* En-tête sombre des pages intérieures : grand mot doré en fond, titre révélé mot par mot. */
export default function PageHeader({ eyebrow, title, text, ghost, children }: Props) {
  return (
    <header className="page-head">
      <div className="page-ghost" aria-hidden="true">{ghost}</div>
      <div className="container">
        {children}
        <p className="eyebrow">{eyebrow}</p>
        <SplitTitle as="h1" immediate delay={0.1} text={title} />
        <p className="lead">{text}</p>
      </div>
    </header>
  );
}
