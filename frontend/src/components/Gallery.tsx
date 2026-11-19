import { Heart } from "lucide-react";
import { Reveal } from "./Reveal";

const POSTS = [
  { src: "/images/makeup.jpg", alt: "Sanftes Glam-Make-up", likes: 412 },
  { src: "/images/nails-2.jpg", alt: "Glänzende schwarze Nail-Art", likes: 298 },
  { src: "/images/skin-2.jpg", alt: "Gesichtsbehandlung mit Tonerde-Maske", likes: 351 },
  { src: "/images/oil.jpg", alt: "Aromatisches Massageöl", likes: 187 },
  { src: "/images/wash.jpg", alt: "Entspannende Haarwäsche", likes: 240 },
  { src: "/images/cosmetics.jpg", alt: "Beauty-Essentials von oben fotografiert", likes: 509 },
];

export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      {POSTS.map((p, i) => (
        <Reveal key={p.src} delay={i * 0.05}>
          <a href="#" onClick={(e) => e.preventDefault()} className="group relative block aspect-square overflow-hidden rounded-[1.75rem]" aria-label={p.alt + " auf Instagram"}>
            <img src={p.src} alt={p.alt} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-cocoa/0 text-cream opacity-0 transition group-hover:bg-cocoa/40 group-hover:opacity-100 group-focus-visible:bg-cocoa/40 group-focus-visible:opacity-100">
              <span className="flex items-center gap-1.5 text-sm"><Heart className="size-4 fill-cream" aria-hidden />{p.likes}</span>
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
