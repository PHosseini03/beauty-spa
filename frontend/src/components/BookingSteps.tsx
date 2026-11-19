import { useEffect, useState } from "react";
import { Check, Clock, Loader2 } from "lucide-react";
import { api } from "../api/client";
import { CATEGORIES, type Service, type Staff } from "../data/demo";
import { formatDay, formatDuration, formatPrice, localSlots, nextOpenDays } from "../lib/booking";

const DAYS_SHOWN = 12;

export function StepService({ services, value, onSelect }: { services: Service[]; value: number | null; onSelect: (id: number) => void }) {
  return (
    <div className="space-y-8">
      {CATEGORIES.map((c) => (
        <fieldset key={c.id}>
          <legend className="mb-3 font-display text-2xl italic">{c.label}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.filter((s) => s.category === c.id).map((s) => {
              const on = value === s.id;
              return (
                <button key={s.id} type="button" onClick={() => onSelect(s.id)} aria-pressed={on} className={"flex items-start justify-between gap-3 rounded-3xl border p-5 text-left transition " + (on ? "border-cocoa bg-cocoa text-cream" : "border-cocoa/10 bg-white hover:border-cocoa/40")}>
                  <span>
                    <span className="block font-medium">{s.name}</span>
                    <span className={"mt-1 flex items-center gap-1 text-xs " + (on ? "text-blush" : "text-taupe")}><Clock className="size-3" aria-hidden />{formatDuration(s.duration_min)}</span>
                  </span>
                  <span className="font-display text-xl">{formatPrice(s.price)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function StepStaff({ staff, value, onSelect }: { staff: Staff[]; value: number | null; onSelect: (id: number) => void }) {
  if (staff.length === 0) return <p className="text-taupe">Für diese Behandlung ist derzeit niemand verfügbar. Bitte wählen Sie eine andere Behandlung.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {staff.map((m) => {
        const on = value === m.id;
        return (
          <button key={m.id} type="button" onClick={() => onSelect(m.id)} aria-pressed={on} className={"flex items-center gap-4 rounded-3xl border p-4 text-left transition " + (on ? "border-cocoa bg-blush/50" : "border-cocoa/10 bg-white hover:border-cocoa/40")}>
            <img src={m.image} alt="" className="size-16 rounded-full object-cover" />
            <span className="flex-1">
              <span className="block font-display text-xl">{m.name}</span>
              <span className="text-xs text-taupe">{m.role}</span>
            </span>
            {on && <Check className="size-5 text-rose" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

interface TimeProps {
  serviceId: number;
  staffId: number;
  duration: number;
  date: string | null;
  time: string | null;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}

export function StepTime({ serviceId, staffId, duration, date, time, onDate, onTime }: TimeProps) {
  const [days] = useState(() => nextOpenDays(DAYS_SHOWN));
  const key = [serviceId, staffId, date].join("|");
  const [remote, setRemote] = useState<{ key: string; slots: string[] } | null>(null);

  useEffect(() => {
    if (!date) return;
    let active = true;
    const query = "/api/availability?staff_id=" + staffId + "&service_id=" + serviceId + "&date=" + date;
    api
      .get<{ slots: string[] }>(query)
      .then((d) => active && setRemote({ key, slots: d.slots }))
      .catch(() => active && setRemote({ key, slots: localSlots(date, duration) }));
    return () => {
      active = false;
    };
  }, [date, staffId, serviceId, duration, key]);

  const slots = remote?.key === key ? remote.slots : null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-sans text-sm font-medium">Tag wählen</h3>
        <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Verfügbare Tage">
          {days.map((d) => {
            const on = d === date;
            return (
              <button key={d} type="button" onClick={() => onDate(d)} aria-pressed={on} className={"flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border px-3 py-3 transition " + (on ? "border-cocoa bg-cocoa text-cream" : "border-cocoa/10 bg-white hover:border-cocoa/40")}>
                <span className="text-xs uppercase">{formatDay(d, { weekday: "short" })}</span>
                <span className="font-display text-2xl">{formatDay(d, { day: "numeric" })}</span>
                <span className="text-xs">{formatDay(d, { month: "short" })}</span>
              </button>
            );
          })}
        </div>
      </div>
      {date && (
        <div>
          <h3 className="mb-3 font-sans text-sm font-medium">Uhrzeit wählen</h3>
          {slots === null ? (
            <p className="flex items-center gap-2 text-sm text-taupe"><Loader2 className="size-4 animate-spin" aria-hidden />Verfügbarkeit wird geprüft…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-taupe">An diesem Tag ist alles ausgebucht. Bitte wählen Sie ein anderes Datum.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="group" aria-label="Verfügbare Uhrzeiten">
              {slots.map((s) => (
                <button key={s} type="button" onClick={() => onTime(s)} aria-pressed={time === s} className={"chip " + (time === s ? "chip-on" : "chip-off")}>{s}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
