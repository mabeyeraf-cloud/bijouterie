import Link from "next/link";
import type { Piece } from "@/lib/content";
import { categoryLabel, prix } from "@/lib/site";
import { JewelDrawing } from "./Jewel";

/** Visuel d'un bijou : sa photo, sinon son dessin au trait sur fond velours. */
export function PieceVisual({ piece, large = false }: { piece: Piece; large?: boolean }) {
  return (
    <div className={`velours${large ? " velours--large" : ""}`}>
      {piece.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={piece.photoUrl} alt={piece.name} loading={large ? "eager" : "lazy"} />
      ) : (
        <JewelDrawing kind={piece.drawing} className="velours__dessin" />
      )}
    </div>
  );
}

export default function PieceCard({ piece }: { piece: Piece }) {
  const href = `/collections/${piece.slug}`;
  return (
    <article className="piece">
      <Link href={href} className="piece__media" tabIndex={-1} aria-hidden="true">
        <PieceVisual piece={piece} />
      </Link>
      <div className="piece__body">
        <p className="piece__cat">{categoryLabel(piece.category)}</p>
        <h3 className="piece__name"><Link href={href}>{piece.name}</Link></h3>
        {piece.material && <p className="piece__mat">{piece.material}</p>}
        <p className="piece__price">{prix(piece.priceXof)}</p>
      </div>
    </article>
  );
}
