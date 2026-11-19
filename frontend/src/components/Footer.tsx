import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV_LINKS } from "./Navbar";
import { CONTACT, HOURS } from "../data/demo";

export function Footer() {
  return (
    <footer className="bg-linen">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed font-light text-taupe">
            Ein ruhiges, lichtdurchflutetes Studio für Haare, Nägel, Haut und Massage. Schönheit mit Zeit und Hingabe.
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-moss uppercase">Entdecken</h2>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-rose">{l.label}</Link></li>
            ))}
            <li><Link to="/book" className="hover:text-rose">Online buchen</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-moss uppercase">Besuchen Sie uns</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden />{CONTACT.address}</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden /><a href={"tel:" + CONTACT.phone} className="hover:text-rose">{CONTACT.phone}</a></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden /><a href={"mailto:" + CONTACT.email} className="hover:text-rose">{CONTACT.email}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-sans text-xs font-medium tracking-[0.3em] text-moss uppercase"><Clock className="size-3.5" aria-hidden /> Öffnungszeiten</h2>
          <dl className="space-y-2 text-sm">
            {HOURS.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 border-b border-petal/50 pb-2">
                <dt>{h.days}</dt>
                <dd className="text-taupe">{h.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="border-t border-petal/60 py-6 text-center text-xs text-taupe">
        © {new Date().getFullYear()} Lumière Spa & Salon. Demo-Website – alle Namen, Personen und Zahlen sind fiktiv.
      </p>
    </footer>
  );
}
