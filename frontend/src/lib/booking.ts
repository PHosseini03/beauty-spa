// Client-side mirror of backend opening hours, used for the date picker and as an offline fallback.
const SLOT_MIN = 30;
const MAX_DAYS_AHEAD = 90;
// getDay(): 0 = Sunday ... 6 = Saturday
const HOURS: Record<number, [number, number] | null> = {
  0: [10 * 60, 16 * 60],
  1: null,
  2: [9 * 60, 20 * 60],
  3: [9 * 60, 20 * 60],
  4: [9 * 60, 20 * 60],
  5: [9 * 60, 20 * 60],
  6: [9 * 60, 18 * 60],
};

const pad = (n: number) => String(n).padStart(2, "0");

export const toHhmm = (m: number) => pad(Math.floor(m / 60)) + ":" + pad(m % 60);

export function isoDate(d: Date): string {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Next `count` open days, starting tomorrow. */
export function nextOpenDays(count: number, from: Date = new Date()): string[] {
  const days: string[] = [];
  for (let offset = 1; days.length < count && offset <= MAX_DAYS_AHEAD; offset++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
    if (HOURS[d.getDay()]) days.push(isoDate(d));
  }
  return days;
}

export function localSlots(iso: string, duration: number): string[] {
  const window = HOURS[parseIso(iso).getDay()];
  if (!window) return [];
  const slots: string[] = [];
  for (let start = window[0]; start + duration <= window[1]; start += SLOT_MIN) slots.push(toHhmm(start));
  return slots;
}

export function formatDay(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return parseIso(iso).toLocaleDateString("de-DE", opts);
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? h + " Std." : "", m ? m + " Min." : ""].filter(Boolean).join(" ");
}

const EURO = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const formatPrice = (n: number) => EURO.format(n);
