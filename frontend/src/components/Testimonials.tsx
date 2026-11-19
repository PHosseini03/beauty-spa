import { Star } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { DEMO_TESTIMONIALS, type Testimonial } from "../data/demo";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { data } = useApi<Testimonial[]>("/api/testimonials", DEMO_TESTIMONIALS);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {data.map((t, i) => (
        <Reveal key={t.id} delay={i * 0.08}>
          <figure className="card flex h-full flex-col p-8">
            <div className="flex gap-0.5" aria-label={t.rating + " von 5 Sternen"}>
              {Array.from({ length: t.rating }, (_, k) => <Star key={k} className="size-4 fill-rose text-rose" aria-hidden />)}
            </div>
            <blockquote className="mt-5 flex-1 font-display text-xl leading-relaxed italic">„{t.text}“</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="block text-xs text-taupe">{t.service}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
