"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { categories, site } from "@/lib/site";

type Sub = { href: string; label: string; section?: string };
type Entry = { label: string; href?: string; section?: string; match?: string; children?: Sub[] };

const entries: Entry[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Collections",
    match: "/collections",
    children: [
      { href: "/collections", label: "Toutes les pièces" },
      ...categories.map((c) => ({ href: `/collections?categorie=${c.id}`, label: c.label })),
    ],
  },
  { label: "Mariage", href: "/#mariage", section: "mariage" },
  { label: "Sur mesure", href: "/#sur-mesure", section: "sur-mesure" },
  { label: "La Maison", href: "/la-maison", match: "/la-maison" },
  { label: "Contact", href: "/#contact", section: "contact" },
];

type Phone = { label: string; href: string } | null;

const ease = [0.22, 1, 0.36, 1] as const;

/* Section de l'accueil affichée à l'écran : la dernière dont le haut a passé le premier tiers de la fenêtre. */
function useHomeSection(enabled: boolean) {
  const [id, setId] = useState("");
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = "";
      document.querySelectorAll<HTMLElement>("main section[id]").forEach((s) => {
        if (s.getBoundingClientRect().top <= line) current = s.id;
      });
      setId(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);
  return id;
}

/* Lien actif : sur l'accueil, la section affichée ; ailleurs, la page en cours. */
function useActive() {
  const pathname = usePathname();
  const home = pathname === "/";
  const section = useHomeSection(home);
  const sub = (s: Sub) =>
    home ? !!section && s.section === section : !s.href.includes("#") && !s.href.includes("?") && pathname === s.href;
  const entry = (e: Entry) => {
    if (e.href === "/") return home && !section;
    if (home && e.section && e.section === section) return true;
    if (e.match && pathname.startsWith(e.match)) return true;
    return !!e.children?.some(sub);
  };
  return { sub, entry };
}

function Chevron() {
  return (
    <svg className="navbar__chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1z" fill="currentColor" />
    </svg>
  );
}

/* Menu déroulant : s'ouvre au survol (souris) et au clic, se ferme avec Échap, au clic à côté ou en quittant le menu. */
function Dropdown({ entry, current, isSub }: { entry: Entry; current: boolean; isSub: (s: Sub) => boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const byHover = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    if (!open) byHover.current = true;
    setOpen(true);
  };
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    timer.current = window.setTimeout(() => setOpen(false), 160);
  };
  /* Un clic juste après l'ouverture au survol garde le menu ouvert au lieu de le refermer. */
  const click = () => {
    if (byHover.current) { byHover.current = false; setOpen(true); }
    else setOpen((o) => !o);
  };

  return (
    <li
      ref={root}
      className="navbar__item"
      onPointerEnter={enter}
      onPointerLeave={leave}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <button
        ref={button}
        type="button"
        className={`navbar__link${current ? " is-current" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={click}
      >
        {entry.label}
        <Chevron />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            className="navbar__panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease }}
          >
            {entry.children!.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={isSub(s) ? "is-current" : undefined}
                  aria-current={isSub(s) ? (s.section ? "location" : "page") : undefined}
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* Panneau plein écran du mobile : liens en cascade, sous-menus dépliables, téléphone et contact en bas. */
function MobilePanel({ id, phone, isEntry, isSub, onClose }: { id: string; phone: Phone; isEntry: (e: Entry) => boolean; isSub: (s: Sub) => boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    /* Le reste de la page devient inerte (focus gardé dans le menu) et ne défile plus. */
    const header = document.querySelector(".header");
    const others = [...document.body.children].filter((el) => el !== header && !el.contains(header));
    others.forEach((el) => el.setAttribute("inert", ""));
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      others.forEach((el) => el.removeAttribute("inert"));
      html.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  };

  return (
    <motion.div
      id={id}
      className="mpanel"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <motion.ul className="mpanel__list" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}>
        {entries.map((e) => {
          const current = isEntry(e);
          if (!e.children) {
            return (
              <motion.li key={e.label} variants={item}>
                <Link href={e.href!} className={`mpanel__link${current ? " is-current" : ""}`} aria-current={current ? "page" : undefined}>
                  {e.label}
                </Link>
              </motion.li>
            );
          }
          const open = expanded === e.label;
          return (
            <motion.li key={e.label} variants={item}>
              <button
                type="button"
                className={`mpanel__link${current ? " is-current" : ""}`}
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : e.label)}
              >
                {e.label}
                <Chevron />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.ul
                    className="mpanel__sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {e.children.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className={isSub(s) ? "is-current" : undefined} aria-current={isSub(s) ? "page" : undefined}>
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </motion.ul>
      <motion.div className="mpanel__foot" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.4 }}>
        {phone && <a href={phone.href} className="navbar__phone"><PhoneIcon />{phone.label}</a>}
        <Link href="/rendez-vous" className="btn btn--gold">Prendre rendez-vous</Link>
      </motion.div>
    </motion.div>
  );
}

export default function Header({ phone }: { phone: Phone }) {
  const active = useActive();
  const [menu, setMenu] = useState(false);
  const panelId = useId();
  const pathname = usePathname();
  const closeMenu = useRef(() => setMenu(false)).current;

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header
      className="header"
      /* Tout lien suivi depuis l'en-tête referme le panneau mobile. */
      onClick={(e) => { if ((e.target as Element).closest("a")) setMenu(false); }}
    >
      <div className="navbar">
        <Link href="/" className="brand" aria-label={`${site.name} — accueil`}>
          <Logo />
        </Link>
        <nav className="navbar__nav" aria-label="Navigation principale">
          <ul className="navbar__list">
            {entries.map((e) =>
              e.children ? (
                <Dropdown key={e.label} entry={e} current={active.entry(e)} isSub={active.sub} />
              ) : (
                <li key={e.label} className="navbar__item">
                  <Link
                    href={e.href!}
                    className={`navbar__link${active.entry(e) ? " is-current" : ""}`}
                    aria-current={active.entry(e) ? (e.href!.includes("#") ? "location" : "page") : undefined}
                  >
                    {e.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="navbar__actions">
          {phone && <a href={phone.href} className="navbar__phone"><PhoneIcon />{phone.label}</a>}
          <Link href="/rendez-vous" className="btn btn--sm btn--gold">Rendez-vous</Link>
        </div>
        <button
          type="button"
          className={`navbar__toggle${menu ? " is-open" : ""}`}
          aria-expanded={menu}
          aria-controls={panelId}
          aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenu((m) => !m)}
        >
          <span /><span /><span />
        </button>
      </div>
      <AnimatePresence>
        {menu && <MobilePanel id={panelId} phone={phone} isEntry={active.entry} isSub={active.sub} onClose={closeMenu} />}
      </AnimatePresence>
    </header>
  );
}
