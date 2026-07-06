import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fetchAiSuggestions } from "../../services/deck";
import type { DeckCardItem, Suggestion } from "../../types";
import AiSuggestionsPanel from "./AiSuggestionsPanel";

vi.mock("../../services/deck", () => ({
  fetchAiSuggestions: vi.fn(),
}));

describe("AiSuggestionsPanel component", () => {
  const mockAddCard = vi.fn();
  const mockDeckCards: DeckCardItem[] = [
    { cardId: 1, name: "Blue-Eyes White Dragon", quantity: 1, section: "MAIN" },
  ];

  it("should render instructions initially", () => {
    render(<AiSuggestionsPanel deckCards={mockDeckCards} formatName="TCG" addCard={mockAddCard} />);

    expect(screen.getByText(/Click/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Analyze Synergy" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  });

  it("should show loading spinner and fetch recommendations when Analyze Synergy is clicked", async () => {
    const suggestions: Suggestion[] = [
      {
        cardId: 101,
        name: "Dark Magician",
        type: "Spellcaster / Normal",
        section: "MAIN",
        synergyReason: "High spellcaster synergy",
      },
    ];
    vi.mocked(fetchAiSuggestions).mockResolvedValueOnce(suggestions);

    const { container } = render(
      <AiSuggestionsPanel deckCards={mockDeckCards} formatName="TCG" addCard={mockAddCard} />,
    );

    const btn = screen.getByRole("button", { name: "Analyze Synergy" });
    fireEvent.click(btn);

    // spinner should render
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
    });

    expect(fetchAiSuggestions).toHaveBeenCalledWith("TCG", [
      { cardId: 1, name: "Blue-Eyes White Dragon", section: "MAIN", quantity: 1 },
    ]);
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("should display error message if API fails", async () => {
    vi.mocked(fetchAiSuggestions).mockRejectedValueOnce(new Error("API Error"));

    const { container } = render(
      <AiSuggestionsPanel deckCards={mockDeckCards} formatName="TCG" addCard={mockAddCard} />,
    );

    const btn = screen.getByRole("button", { name: "Analyze Synergy" });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
    });

    expect(screen.getByText("API Error")).toBeInTheDocument();
  });

  it("should reset the panel to initial state when Reset is clicked", async () => {
    const suggestions: Suggestion[] = [
      {
        cardId: 101,
        name: "Dark Magician",
        type: "Spellcaster / Normal",
        section: "MAIN",
        synergyReason: "High spellcaster synergy",
      },
    ];
    vi.mocked(fetchAiSuggestions).mockResolvedValue(suggestions);

    render(<AiSuggestionsPanel deckCards={mockDeckCards} formatName="TCG" addCard={mockAddCard} />);

    fireEvent.click(screen.getByRole("button", { name: "Analyze Synergy" }));
    await waitFor(() => {
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
    expect(screen.getByText(/Click/)).toBeInTheDocument();
  });

  it("should trigger addCard when a suggested item calls onAdd", async () => {
    const suggestions: Suggestion[] = [
      {
        cardId: 101,
        name: "Dark Magician",
        type: "Spellcaster / Normal",
        section: "MAIN",
        imageUrl: "/dm.png",
        synergyReason: "High spellcaster synergy",
      },
    ];
    vi.mocked(fetchAiSuggestions).mockResolvedValue(suggestions);
    mockAddCard.mockClear();

    render(<AiSuggestionsPanel deckCards={mockDeckCards} formatName="TCG" addCard={mockAddCard} />);

    fireEvent.click(screen.getByRole("button", { name: "Analyze Synergy" }));
    await waitFor(() => {
      expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Add to MAIN Deck" }));
    expect(mockAddCard).toHaveBeenCalledWith(
      {
        id: 101,
        name: "Dark Magician",
        type: "Spellcaster / Normal",
        imageUrlCropped: "/dm.png",
        description: "",
        race: "",
        attribute: "",
      },
      "MAIN",
    );
  });
});
