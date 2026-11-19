import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { DEMO_PACKAGES, type Package } from "../data/demo";
import { formatPrice } from "../lib/booking";
import { Reveal } from "./Reveal";

export function PackageCards() {
  const { data } = useApi<Package[]>("/api/packages", DEMO_PACKAGES);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {data.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.08}>
          <article className={"relative flex h-full flex-col rounded-[2.5rem] p-8 transition hover:-translate-y-1 " + (p.featured ? "bg-cocoa text-cream shadow-2xl shadow-cocoa/30" : "card")}>
            {p.featured && <span className="absolute top-6 right-6 rounded-full bg-blush px-3 py-1 text-[0.68rem] tracking-wider text-cocoa uppercase">Beliebtestes</span>}
            <h3 className="text-3xl italic">{p.name}</h3>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-5xl">{formatPrice(p.price)}</span>
              <span className={"text-sm " + (p.featured ? "text-blush" : "text-moss")}>Sie sparen {formatPrice(p.save)}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm font-light">
              {p.items.map((item) => (
                <li key={item} className="flex gap-3"><Check className={"mt-0.5 size-4 shrink-0 " + (p.featured ? "text-blush" : "text-moss")} aria-hidden />{item}</li>
              ))}
            </ul>
            <Link to="/book" className={(p.featured ? "btn-soft" : "btn-outline") + " mt-8 w-full"}>Paket reservieren</Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
