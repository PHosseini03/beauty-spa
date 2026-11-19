import { formatPrice } from "../lib/booking";

interface Props {
  amount: number;
  to: string;
  from: string;
  message: string;
}

export function GiftCardPreview({ amount, to, from, message }: Props) {
  return (
    <div className="relative isolate aspect-[1.6/1] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush via-petal to-rose/70 p-7 text-cocoa shadow-2xl shadow-rose/30" aria-label="Gutschein-Vorschau">
      <div className="blob absolute -top-10 -right-10 -z-10 size-48 bg-cream/50 blur-xl" aria-hidden />
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="leading-none">
            <p className="font-display text-3xl italic">Lumière</p>
            <p className="mt-1 text-[0.6rem] tracking-[0.4em] uppercase">Gutschein</p>
          </div>
          <p className="font-display text-4xl sm:text-5xl">{formatPrice(amount || 0)}</p>
        </div>
        <p className="line-clamp-2 font-display text-lg italic opacity-90">{message || "Ein kleiner Moment der Ruhe – nur für Sie."}</p>
        <div className="flex justify-between text-xs tracking-wider uppercase">
          <span>Für: {to || "Einen besonderen Menschen"}</span>
          <span>Von: {from || "Ihnen"}</span>
        </div>
      </div>
    </div>
  );
}
