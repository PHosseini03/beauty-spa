import { DEMO_SERVICES, DEMO_STAFF } from "../data/demo";

// Demo-mode responses for the static (GitHub Pages) build, where no backend runs.
// Mirrors the success payloads of backend/app/routers so forms show their real confirmation.
// Nothing is sent or stored anywhere.

type Payload = Readonly<Record<string, unknown>>;
type Handler = (p: Payload) => unknown;

const ID_RANGE = 100_000;

const demoId = (): number => Date.now() % ID_RANGE;
const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (p: Payload, key: string): string => String(p[key] ?? "").trim();
const num = (p: Payload, key: string): number => Number(p[key] ?? 0);

const GIFT_CODE_DIGITS = 5;

const HANDLERS: Readonly<Record<string, Handler>> = {
  "/api/appointments": (p) => {
    const service = DEMO_SERVICES.find((s) => s.id === num(p, "service_id"));
    const staff = DEMO_STAFF.find((s) => s.id === num(p, "staff_id"));
    return {
      id: demoId(),
      service: service?.name ?? "",
      staff: staff?.name ?? "",
      date: text(p, "date"),
      time: text(p, "time"),
      price: service?.price ?? 0,
      message: `Wir freuen uns auf Sie, ${text(p, "name")}! Eine Bestätigung wurde an ${text(p, "email")} gesendet.`,
    };
  },
  "/api/gift-cards": (p) => {
    const id = demoId();
    const amount = num(p, "amount");
    return {
      id,
      code: `LUM-${String(id).padStart(GIFT_CODE_DIGITS, "0").slice(-GIFT_CODE_DIGITS)}`,
      amount,
      message: `Ihr Gutschein über ${amount} € für ${text(p, "recipient_name")} ist reserviert. Die Zahlungsdetails senden wir Ihnen in Kürze per E-Mail.`,
    };
  },
};

const FALLBACK_MESSAGE = "Vielen Dank! Ihre Anfrage ist eingegangen.";

export function demoResponse(path: string, payload: unknown): unknown {
  const handler = HANDLERS[path];
  const body = isPayload(payload) ? payload : {};
  return handler ? handler(body) : { id: demoId(), message: FALLBACK_MESSAGE };
}
