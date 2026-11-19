import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, DEMO_SERVICES, type Category, type Service } from "../data/demo";
import { formatDuration, formatPrice } from "../lib/booking";

export function ServiceMenu({ initial = "hair", showImage = true }: { initial?: Category; showImage?: boolean }) {
  const { data: services, loading } = useApi<Service[]>("/api/services", DEMO_SERVICES);
  const [active, setActive] = useState<Category>(initial);
  const category = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];
  const list = services.filter((s) => s.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Kategorien">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={active === c.id} onClick={() => setActive(c.id)} className={"chip " + (active === c.id ? "chip-on" : "chip-off")}>
            {c.label}
          </button>
        ))}
      </div>
      <div className={"mt-12 grid items-start gap-10 " + (showImage ? "lg:grid-cols-[0.8fr_1.2fr] lg:gap-16" : "")}>
        {showImage && (
          <AnimatePresence mode="wait">
            <motion.figure key={category.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="relative mx-auto w-full max-w-sm">
              <img src={category.image} alt={"Behandlung im Bereich " + category.label + " bei Lumière"} className="arch aspect-[4/5] w-full object-cover" />
              <figcaption className="card absolute -bottom-6 left-1/2 w-max -translate-x-1/2 px-6 py-3 text-center">
                <span className="font-display text-xl italic">{category.label}</span>
                <span className="block text-xs text-taupe">{category.blurb}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        )}
        <ul className="divide-y divide-petal/70" role="tabpanel" aria-busy={loading} aria-label={"Behandlungen: " + category.label}>
          {list.map((s) => (
            <li key={s.id} className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex-1">
                <h3 className="flex flex-wrap items-center gap-2 text-2xl">
                  {s.name}
                  {s.popular && <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-0.5 font-sans text-[0.68rem] tracking-wider text-rose uppercase"><Sparkles className="size-3" aria-hidden />Beliebt</span>}
                </h3>
                <p className="mt-1 text-sm font-light text-taupe">{s.description}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-moss"><Clock className="size-3.5" aria-hidden />{formatDuration(s.duration_min)}</p>
              </div>
              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <span className="font-display text-2xl">{formatPrice(s.price)}</span>
                <Link to={"/book?service=" + s.id} className="btn-outline !px-5 !py-2.5" aria-label={s.name + " buchen"}>Buchen</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
