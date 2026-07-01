import { render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import DeckDetail from "./DeckDetail";

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe("DeckDetail page component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "yugi" },
    } as any);
  });

  it("should render mock deck and compute counts", () => {
    vi.mocked(useFetch).mockReturnValue({
      data: {
        id: 1,
        name: "Yugi Ultimate Deck",
        creatorUsername: "yugi",
        formatName: "TCG",
        deckCards: [
          {
            cardId: 10,
            name: "Dark Magician",
            quantity: 3,
            section: "MAIN",
            type: "Normal Monster",
          },
          { cardId: 11, name: "Monster Reborn", quantity: 1, section: "MAIN", type: "Spell Card" },
        ],
      },
      loading: false,
    } as any);

    render(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
    );

    expect(screen.getByText("Yugi Ultimate Deck")).toBeInTheDocument();
    expect(screen.getByText("TCG")).toBeInTheDocument();

    // Stats calculations: 3 monsters + 1 spell = 4 main deck cards
    expect(screen.getAllByText("Main Deck")[0]).toBeInTheDocument();
    expect(screen.getByText("4 / 60")).toBeInTheDocument();
  });
});
