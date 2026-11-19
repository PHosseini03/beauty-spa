import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { formatDay, formatDuration, formatPrice, isoDate, localSlots, nextOpenDays, parseIso, toHhmm } from "../lib/booking";
import { rules, validate } from "../lib/validation";
import { api, ApiError, request } from "../api/client";
import { useCountUp } from "../hooks/useCountUp";

describe("booking helpers", () => {
  it("formats times, durations and prices", () => {
    expect(toHhmm(9 * 60 + 30)).toBe("09:30");
    expect(formatDuration(150)).toBe("2 Std. 30 Min.");
    expect(formatDuration(45)).toBe("45 Min.");
    expect(formatDuration(60)).toBe("1 Std.");
    expect(formatPrice(1240)).toBe("1.240 €");
  });

  it("round-trips ISO dates", () => {
    expect(isoDate(parseIso("2026-11-17"))).toBe("2026-11-17");
    expect(formatDay("2026-11-17", { weekday: "short" })).toBe("Di");
  });

  it("skips Mondays and starts tomorrow", () => {
    const sunday = new Date(2026, 10, 15);
    const days = nextOpenDays(3, sunday);
    expect(days).toEqual(["2026-11-17", "2026-11-18", "2026-11-19"]);
  });

  it("generates slots that end before closing", () => {
    const tue = localSlots("2026-11-17", 60);
    expect(tue[0]).toBe("09:00");
    expect(tue.at(-1)).toBe("19:00");
    expect(localSlots("2026-11-22", 90).at(-1)).toBe("14:30");
    expect(localSlots("2026-11-16", 60)).toEqual([]);
  });
});

describe("validation", () => {
  const schema = { name: [rules.name], email: [rules.email], phone: [rules.phone], amount: [rules.number("Amount", 25, 1000)], note: [rules.safeText] };

  it("accepts valid values", () => {
    expect(validate({ name: "Mia Grün", email: "m@example.com", phone: "030 5550 101", amount: "100", note: "hi" }, schema)).toEqual({});
  });

  it("rejects invalid values", () => {
    const errors = validate({ name: "<i>", email: "x", phone: "y", amount: "5", note: "<b>" }, schema);
    expect(Object.keys(errors).sort()).toEqual(["amount", "email", "name", "note", "phone"]);
    expect(rules.required("Ort")("")).toBe("Ort ist ein Pflichtfeld");
    expect(rules.minLength("Notiz", 3)("ab")).toMatch(/mindestens 3 Zeichen/);
  });
});

describe("api client", () => {
  it("unwraps success and surfaces server errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { ok: 1 }, error: null }))));
    await expect(api.get("/api/x")).resolves.toEqual({ ok: 1 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "Termin vergeben" }), { status: 409 })));
    await expect(api.post("/api/x", {})).rejects.toThrow("Termin vergeben");
  });

  it("flags network and non-JSON failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const err = await request("/api/x").catch((e: unknown) => e);
    expect((err as ApiError).isNetwork).toBe(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 502 })));
    await expect(request("/api/x")).rejects.toThrow("unerwartete Antwort");
  });
});

describe("useCountUp", () => {
  it("starts at zero before scrolling into view", () => {
    const { result } = renderHook(() => useCountUp(100));
    expect(result.current.value).toBe(0);
  });
});
