import type { Service, Staff } from "../data/demo";
import { formatDay, formatDuration, formatPrice } from "../lib/booking";

interface Props {
  service?: Service;
  member?: Staff;
  date: string | null;
  time: string | null;
}

export function BookingSummary({ service, member, date, time }: Props) {
  const rows = [
    { label: "Behandlung", value: service?.name },
    { label: "Dauer", value: service ? formatDuration(service.duration_min) : undefined },
    { label: "Expertin", value: member?.name },
    { label: "Datum", value: date ? formatDay(date, { weekday: "long", day: "numeric", month: "long" }) : undefined },
    { label: "Uhrzeit", value: time ? time + " Uhr" : undefined },
  ];
  return (
    <aside className="card h-fit p-7 lg:sticky lg:top-28" aria-label="Buchungsübersicht">
      <h2 className="text-2xl italic">Ihr Besuch</h2>
      <dl className="mt-5 space-y-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 border-b border-petal/50 pb-3">
            <dt className="text-taupe">{r.label}</dt>
            <dd className="text-right font-medium">{r.value ?? "–"}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 flex items-baseline justify-between">
        <span className="text-sm text-taupe">Gesamt</span>
        <span className="font-display text-3xl">{service ? formatPrice(service.price) : formatPrice(0)}</span>
      </p>
      <p className="mt-4 text-xs text-taupe">Bezahlung vor Ort im Studio. Kostenfreie Stornierung bis 24 Stunden vorher.</p>
    </aside>
  );
}
