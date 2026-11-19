import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GiftCards from "../pages/GiftCards";
import { mockApi, renderAt } from "./render";

async function fill() {
  await userEvent.type(screen.getByLabelText("Ihr Name"), "Eva Grün");
  await userEvent.type(screen.getByLabelText("Ihre E-Mail"), "ava@example.com");
  await userEvent.type(screen.getByLabelText("Name der beschenkten Person"), "Mia Grün");
  await userEvent.type(screen.getByLabelText("E-Mail der beschenkten Person"), "mia@example.com");
}

describe("gift cards", () => {
  it("validates amount and required fields", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<GiftCards />);
    const amount = screen.getByLabelText(/wunschbetrag/i);
    await userEvent.clear(amount);
    await userEvent.type(amount, "52");
    await userEvent.click(screen.getByRole("button", { name: "Gutschein reservieren" }));
    expect(await screen.findByText("Der Betrag muss durch 5 teilbar sein")).toBeInTheDocument();
    expect(screen.getByText("Bitte geben Sie eine gültige E-Mail-Adresse ein", { selector: "#" + screen.getByLabelText("Ihre E-Mail").id + "-error" })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("updates the live preview and submits", async () => {
    const fetchMock = mockApi({ "/api/gift-cards": { id: 1, code: "LUM-00001", amount: 250, message: "Ihr Gutschein für Mia Grün ist reserviert." } });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<GiftCards />);
    await userEvent.click(screen.getByRole("button", { name: "250 €" }));
    await fill();
    await userEvent.type(screen.getByLabelText(/persönliche nachricht/i), "Genieß es!");
    const preview = screen.getByLabelText("Gutschein-Vorschau");
    expect(preview).toHaveTextContent(/250\s€/);
    expect(preview).toHaveTextContent("Für: Mia Grün");
    expect(preview).toHaveTextContent("Genieß es!");
    await userEvent.click(screen.getByRole("button", { name: "Gutschein reservieren" }));
    expect(await screen.findByText("LUM-00001")).toBeInTheDocument();
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(call[1].body as string)).toMatchObject({ amount: 250, recipient_email: "mia@example.com", delivery: "email" });
    await userEvent.click(screen.getByRole("button", { name: "Weiteren Gutschein verschenken" }));
    expect(screen.getByRole("button", { name: "Gutschein reservieren" })).toBeInTheDocument();
  });

  it("shows an error when the server rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "Zu viele Anfragen." }), { status: 429 })));
    renderAt(<GiftCards />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Gutschein reservieren" }));
    await waitFor(() => expect(screen.getByText(/konnte nicht reserviert werden/)).toBeInTheDocument());
  });
});
