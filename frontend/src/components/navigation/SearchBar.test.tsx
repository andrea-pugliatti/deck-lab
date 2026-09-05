import { fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cardKeys } from "../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../test/setup";
import SearchBar from "./SearchBar";

vi.mock("../../hooks/useDebounce", () => ({
  useDebounce: vi.fn((q) => q),
}));

vi.mock("../../features/cards", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../features/cards")>();
  return {
    ...actual,
    getSuggestions: vi.fn().mockResolvedValue({
      content: [
        { id: 1, name: "Blue-Eyes White Dragon", type: "Normal Monster" },
        { id: 2, name: "Blue-Eyes Alternative", type: "Effect Monster" },
      ],
    }),
  };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("SearchBar component", () => {
  const navigateMock = vi.fn();
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    queryClient = createTestQueryClient();
    queryClient.setQueryData(cardKeys.suggestions("Blue"), {
      content: [
        { id: 1, name: "Blue-Eyes White Dragon", type: "Normal Monster" },
        { id: 2, name: "Blue-Eyes Alternative", type: "Effect Monster" },
      ],
    });
  });

  it("should render input field and static trending links", () => {
    renderWithClient(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
      queryClient,
    );

    const searchInput = screen.getByPlaceholderText(/search card names/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass("focus-visible:outline-hidden");
    expect(searchInput).not.toHaveClass("focus-visible:ring-2");
    expect(searchInput.closest("form")).toHaveClass("focus-within:border-cyan-accent");
    expect(screen.getByText("Snake-Eye")).toBeInTheDocument();
  });

  it("should trigger navigation on form submit", () => {
    renderWithClient(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
      queryClient,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Exodia" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);

    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Exodia");
  });

  it("should open suggestions dropdown on focus/input", () => {
    renderWithClient(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
      queryClient,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Blue" } });

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Blue-Eyes Alternative")).toBeInTheDocument();
  });

  it("should select suggestion on click", () => {
    renderWithClient(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
      queryClient,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Blue" } });

    const suggestion = screen.getByText("Blue-Eyes Alternative");
    fireEvent.click(suggestion);

    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Blue-Eyes%20Alternative");
  });

  it("should support keyboard navigation in suggestions dropdown", () => {
    renderWithClient(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
      queryClient,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Blue" } });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Blue-Eyes%20Alternative");
  });
});
