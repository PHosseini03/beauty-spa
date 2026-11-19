import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { DEMO_PACKAGES, DEMO_SERVICES, DEMO_STAFF, DEMO_TESTIMONIALS } from "../data/demo";
import { mockApi, renderAt } from "./render";

const ROUTES = { "/api/services": DEMO_SERVICES, "/api/staff": DEMO_STAFF, "/api/packages": DEMO_PACKAGES, "/api/testimonials": DEMO_TESTIMONIALS };

describe("pages", () => {
  it("renders the home page with API data", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /durchatmen/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Braut-Strahlen" })).toBeInTheDocument();
    expect(screen.getAllByText(/Charlotte hat mir/).length).toBeGreaterThan(0);
  });

  it("renders services, team, gift cards and 404", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    for (const [path, title] of [["/services", /liebe zum detail/i], ["/team", /expertinnen/i], ["/gift-cards", /verschenken sie/i], ["/nope", "404"]] as const) {
      const { unmount } = renderAt(<App />, path);
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      unmount();
    }
  });

  it("switches service categories and falls back offline", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<App />, "/services?category=nails");
    expect(await screen.findByRole("heading", { name: /Luxus-Gel-Maniküre/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Massage" }));
    expect(screen.getByRole("heading", { name: /Hot-Stone-Ritual/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Luxus-Gel-Maniküre/ })).not.toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    await userEvent.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(screen.getByRole("button", { name: /menü schließen/i })).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("button", { name: /menü öffnen/i })).toBeInTheDocument());
  });
});

async function walkToDetails() {
  await userEvent.click(await screen.findByRole("button", { name: /Clara Schneider/ }));
  await userEvent.click(screen.getByRole("button", { name: "Weiter" }));
  const days = screen.getByRole("group", { name: "Verfügbare Tage" });
  await userEvent.click(within(days).getAllByRole("button")[0]);
  const times = await screen.findByRole("group", { name: "Verfügbare Uhrzeiten" });
  await userEvent.click(within(times).getByRole("button", { name: "11:00" }));
  await userEvent.click(screen.getByRole("button", { name: "Weiter" }));
}

async function fillDetails() {
  await userEvent.type(screen.getByLabelText("Vollständiger Name"), "Katrin Schulz");
  await userEvent.type(screen.getByLabelText("Telefon"), "030 5550 101");
  await userEvent.type(screen.getByLabelText("E-Mail"), "katrin@example.com");
}

describe("booking flow", () => {
  it("books an appointment end to end", async () => {
    const confirmation = { id: 3, service: "Lumière Glow Gesichtsbehandlung", staff: "Clara Schneider", date: "2026-11-17", time: "11:00", message: "Wir freuen uns auf Sie, Katrin Schulz!" };
    const fetchMock = mockApi({ ...ROUTES, "/api/availability": { slots: ["10:00", "11:00"] }, "/api/appointments": confirmation });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<App />, "/book?service=7");
    await walkToDetails();
    await userEvent.click(screen.getByRole("button", { name: "Termin verbindlich buchen" }));
    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen ein")).toBeInTheDocument();
    await fillDetails();
    await userEvent.click(screen.getByRole("button", { name: "Termin verbindlich buchen" }));
    expect(await screen.findByText(/gebucht!/)).toBeInTheDocument();
    expect(screen.getByText("Buchungsnummer 00003")).toBeInTheDocument();
    expect(screen.getByText(/um 11:00 Uhr/)).toHaveTextContent(/Dienstag, 17\. November/);
    const post = fetchMock.mock.calls.find((c) => String(c[0]) === "/api/appointments") as unknown as [string, RequestInit];
    expect(JSON.parse(post[1].body as string)).toMatchObject({ service_id: 7, staff_id: 4, time: "11:00", name: "Katrin Schulz" });
    await userEvent.click(screen.getByRole("button", { name: "Weiteren Termin buchen" }));
    expect(screen.getByRole("heading", { name: "Behandlung" })).toBeInTheDocument();
  });

  it("uses local slots offline and reports a booking failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<App />, "/book?service=7&staff=4");
    await walkToDetails();
    await fillDetails();
    await userEvent.click(screen.getByRole("button", { name: "Termin verbindlich buchen" }));
    await waitFor(() => expect(screen.getByText(/konnte nicht bestätigt werden/)).toBeInTheDocument());
  });

  it("starts at the treatment step and filters specialists", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />, "/book");
    expect(screen.getByRole("button", { name: "Weiter" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /Luxus-Gel-Maniküre/ }));
    await userEvent.click(screen.getByRole("button", { name: "Weiter" }));
    expect(screen.getByRole("button", { name: /Lena Hoffmann/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Charlotte Weber/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(screen.getByRole("heading", { name: "Behandlung" })).toBeInTheDocument();
  });
});
