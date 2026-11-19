import { Link } from "react-router-dom";
import { ArrowRight, Gift, Leaf, Sparkles, Flower2 } from "lucide-react";
import { SpaHero } from "../components/SpaHero";
import { SectionTitle } from "../components/SectionTitle";
import { ServiceMenu } from "../components/ServiceMenu";
import { PackageCards } from "../components/PackageCards";
import { StaffCard } from "../components/StaffCard";
import { Testimonials } from "../components/Testimonials";
import { Gallery } from "../components/Gallery";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, DEMO_STAFF, type Staff } from "../data/demo";

const MARQUEE = ["Balayage", "Gel-Maniküre", "Glow-Facial", "Hot Stone", "Lash Lifting", "Keratin", "Spa-Pediküre", "Tiefengewebe"];
const VALUES = [
  { icon: Leaf, title: "Reine Produkte", text: "Vegane, tierversuchsfreie Rezepturen von kleinen Marken, denen wir vertrauen." },
  { icon: Flower2, title: "Zeit für Sie", text: "Großzügige Termine, nie doppelt vergeben, immer pünktlich." },
  { icon: Sparkles, title: "Echte Expertinnen", text: "Ausgebildete Fachkräfte mit jahrelanger Weiterbildung." },
];

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-petal/60 bg-blush/40 py-5" aria-hidden>
      <div className="animate-marquee flex w-max gap-10">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl whitespace-nowrap italic text-cocoa/80">{m}<span className="text-rose">✦</span></span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: staff } = useApi<Staff[]>("/api/staff", DEMO_STAFF);
  return (
    <>
      <SpaHero />
      <Marquee />

      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="Unsere Welt" title={<>Vier Wege zu <span className="accent">mehr Wohlgefühl</span></>} />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.07}>
                <Link to={"/services?category=" + c.id} className="group block text-center">
                  <div className="arch aspect-[3/4] overflow-hidden">
                    <img src={c.image} alt={"Behandlungen: " + c.label} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-2xl italic group-hover:text-rose">{c.label}</h3>
                  <p className="text-xs text-taupe sm:text-sm">{c.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-linen">
        <div className="container-x">
          <SectionTitle eyebrow="Behandlungen" title={<>Unsere <span className="accent">beliebtesten</span> Behandlungen</>} lead="Transparente Preise. Jede Behandlung beinhaltet eine Beratung und eine wohltuende Tasse Tee." />
          <div className="mt-12"><ServiceMenu /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <img src="/images/spa.jpg" alt="Gerolltes Handtuch, Kerze und Tulpen im Behandlungsraum" loading="lazy" className="blob aspect-square w-full object-cover" />
            <img src="/images/massage-3.jpg" alt="Therapeutin bei einer Rückenmassage" loading="lazy" className="arch absolute -right-2 -bottom-8 w-2/5 border-8 border-cream object-cover sm:-right-6" />
          </Reveal>
          <div>
            <SectionTitle center={false} eyebrow="Die Lumière-Philosophie" title={<>Schönheit, die sich <span className="accent">so gut anfühlt</span>, wie sie aussieht</>} lead="Wir haben Lumière als Gegenentwurf zum hektischen Salonalltag geschaffen: sanftes Licht, leise Musik und die Zeit, alles mit Sorgfalt zu tun." />
            <ul className="mt-10 space-y-6">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage/25 text-moss"><Icon className="size-5" aria-hidden /></span>
                  <div><h3 className="font-sans text-lg font-medium">{title}</h3><p className="mt-1 text-sm font-light text-taupe">{text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="packages" className="section bg-linen">
        <div className="container-x">
          <SectionTitle eyebrow="Pakete" title={<>Ausgewählte <span className="accent">Rituale</span></>} lead="Unsere Lieblingsbehandlungen, liebevoll kombiniert und fair bepreist." />
          <div className="mt-14"><PackageCards /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="Unser Team" title={<>Hände, denen Sie <span className="accent">vertrauen</span></>} />
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {staff.slice(0, 3).map((m, i) => <Reveal key={m.id} delay={i * 0.08}><StaffCard member={m} /></Reveal>)}
          </div>
          <div className="mt-12 text-center"><Link to="/team" className="btn-outline">Das ganze Team kennenlernen <ArrowRight className="size-4" aria-hidden /></Link></div>
        </div>
      </section>

      <section className="section bg-blush/40">
        <div className="container-x">
          <SectionTitle eyebrow="Liebe Worte" title={<>Von unseren <span className="accent">Gästen</span></>} />
          <div className="mt-14"><Testimonials /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionTitle center={false} eyebrow="@lumiere.studio" title={<>Frisch aus dem <span className="accent">Studio</span></>} />
            <a href="#" onClick={(e) => e.preventDefault()} className="btn-outline">Auf Instagram folgen</a>
          </div>
          <Gallery />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[3rem] bg-cocoa px-6 py-16 text-center text-cream sm:px-16">
              <div className="blob absolute -top-20 -left-20 -z-10 size-72 bg-rose/40 blur-3xl" aria-hidden />
              <div className="blob absolute -right-16 -bottom-24 -z-10 size-72 bg-sage/30 blur-3xl" aria-hidden />
              <Gift className="mx-auto size-10 text-blush" aria-hidden />
              <h2 className="mt-5 text-4xl sm:text-5xl">Verschenken Sie <span className="italic text-blush">Strahlen</span></h2>
              <p className="mx-auto mt-4 max-w-lg font-light text-cream/80">Digitale oder edel gedruckte Gutscheine – 12 Monate gültig für alle Behandlungen und Pakete.</p>
              <Link to="/gift-cards" className="btn-soft mt-8">Gutschein verschenken</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
