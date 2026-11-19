import { demoResponse } from "../api/demo";

describe("demoResponse (static demo build)", () => {
  it("confirms /api/appointments like the backend does", () => {
    const result = demoResponse("/api/appointments", {"service_id":-1,"staff_id":-1,"name":"Avery","email":"avery@example.com","date":"2026-11-24","time":"10:00"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("avery@example.com");
    expect(result).toMatchObject({"service":"","staff":""});
  });

  it("confirms /api/gift-cards like the backend does", () => {
    const result = demoResponse("/api/gift-cards", {"amount":50,"recipient_name":"Sam"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("50 € für Sam");
    expect(result).toMatchObject({"amount":50});
  });

  it("falls back to a generic confirmation for unknown endpoints and bad payloads", () => {
    const result = demoResponse("/api/unknown", null) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toBe("Vielen Dank! Ihre Anfrage ist eingegangen.");
  });
});
