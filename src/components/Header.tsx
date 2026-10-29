"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { site } from "@/lib/site";
import { ease } from "@/lib/motion";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !open);
  });

  return (
    <motion.header className="header" animate={{ y: hidden ? "-100%" : 0 }} transition={{ duration: 0.4, ease }}>
      <div className="container header-in">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>{site.name}</Link>
        <nav aria-label="Navigation principale" className="nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
              <span className="nav-label">{l.label}</span>
              {pathname === l.href && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ duration: 0.4, ease }} />}
            </Link>
          ))}
        </nav>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="Menu mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i + 0.1, duration: 0.5, ease }}>
                <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
