import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export const NAV_LINKS = [
  { to: "/", label: "Start" },
  { to: "/services", label: "Behandlungen" },
  { to: "/team", label: "Unser Team" },
  { to: "/gift-cards", label: "Gutscheine" },
];

const SCROLL_THRESHOLD = 24;

export function Logo() {
  return (
    <Link to="/" className="flex flex-col leading-none text-cocoa" aria-label="Lumière Spa & Salon – Startseite">
      <span className="font-display text-2xl italic sm:text-[1.7rem]">Lumière</span>
      <span className="mt-0.5 text-[0.6rem] tracking-[0.42em] text-moss uppercase">Spa & Salon</span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "relative px-1 py-2 text-sm tracking-wide transition " + (isActive ? "text-rose" : "text-cocoa/80 hover:text-cocoa");

  return (
    <header className={"fixed inset-x-0 top-0 z-50 transition-all duration-300 " + (scrolled || open ? "bg-cream/90 shadow-[0_8px_30px_-20px_rgba(61,44,41,0.4)] backdrop-blur-lg" : "bg-transparent")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded-full focus:bg-cocoa focus:px-4 focus:py-2 focus:text-cream">
        Zum Inhalt springen
      </a>
      <nav className="container-x flex h-20 items-center justify-between" aria-label="Hauptnavigation">
        <Logo />
        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <Link to="/book" className="btn-primary !py-3">Termin buchen</Link>
        </div>
        <button type="button" className="grid size-11 place-items-center rounded-full border border-cocoa/15 bg-white/70 lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menü schließen" : "Menü öffnen"}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-petal/60 lg:hidden">
            <ul className="container-x flex flex-col gap-1 py-5">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => "block rounded-2xl px-4 py-3 font-display text-2xl " + (isActive ? "bg-blush/60 text-rose italic" : "text-cocoa")}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-3">
                <Link to="/book" className="btn-primary w-full">Termin buchen</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
