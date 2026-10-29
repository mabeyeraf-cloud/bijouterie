import { site } from "@/lib/site";
import { LogoMark } from "./Jewel";

export { LogoMark };

/** Logo : symbole + nom de la maison + baseline. Le nom vient de src/lib/site.ts. */
export default function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`logo${compact ? " logo--compact" : ""} ${className}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__words">
        <span className="logo__name">{site.name}</span>
        {!compact && <span className="logo__base">{site.baseline}</span>}
      </span>
    </span>
  );
}
