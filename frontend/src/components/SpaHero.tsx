import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, Star } from "lucide-react";

export function SpaHero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24">
      <div className="blob absolute -top-32 -right-24 -z-10 size-[34rem] bg-blush/80 blur-3xl" aria-hidden />
      <div className="blob absolute bottom-0 -left-40 -z-10 size-96 bg-sage/30 blur-3xl" aria-hidden />
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">Haare · Nägel · Haut · Massage</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="mt-6 text-5xl leading-[1.02] sm:text-7xl lg:text-[5.5rem]">
            Durchatmen.<br /><span className="accent">Aufblühen.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="lead mt-7 max-w-lg">
            Ein lichtdurchflutetes Refugium für schönes Haar, makellose Nägel, strahlende Haut und tief regenerierende Massagen. Buchen Sie Ihre Auszeit in weniger als einer Minute.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/book" className="btn-primary">Termin buchen <ArrowRight className="size-4" aria-hidden /></Link>
            <Link to="/services" className="btn-outline">Behandlungen entdecken</Link>
          </motion.div>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[2, 3, 4, 5].map((n) => <img key={n} src={"/images/staff-" + n + ".jpg"} alt="" className="size-11 rounded-full border-2 border-cream object-cover" />)}
            </div>
            <div className="text-sm">
              <p className="flex items-center gap-1 font-medium"><Star className="size-4 fill-rose text-rose" aria-hidden /> 4,9 · über 1.200 Bewertungen</p>
              <p className="text-taupe">Ausgezeichnet als bestes Boutique-Spa 2026</p>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9 }} className="relative mx-auto w-full max-w-md">
          <img src="/images/hero.jpg" alt="Frau mit glänzendem, frisch gestyltem Haar" className="arch aspect-[4/5] w-full object-cover shadow-2xl shadow-cocoa/25" fetchPriority="high" />
          <div className="card animate-float absolute -bottom-6 -left-4 flex items-center gap-3 px-5 py-4 sm:-left-12">
            <span className="grid size-11 place-items-center rounded-full bg-blush text-rose"><CalendarHeart className="size-5" aria-hidden /></span>
            <div>
              <p className="text-xs text-taupe">Nächster freier Termin</p>
              <p className="font-medium">Morgen · 10:30 Uhr</p>
            </div>
          </div>
          <div className="card absolute top-10 -right-3 px-5 py-4 text-center sm:-right-10">
            <p className="font-display text-3xl italic text-rose">12</p>
            <p className="text-xs text-taupe">Jahre Erfahrung</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
