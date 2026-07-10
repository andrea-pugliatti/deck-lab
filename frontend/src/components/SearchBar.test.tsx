import { useQuery } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SearchBar from "./SearchBar";

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: vi.fn((q) => q),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("SearchBar component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useQuery).mockReturnValue({
      data: {
        content: [
          { id: 1, name: "Blue-Eyes White Dragon", type: "Normal Monster" },
          { id: 2, name: "Blue-Eyes Alternative", type: "Effect Monster" },
        ],
      },
      isLoading: false,
    } as any);
  });

  it("should render input field and static trending links", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/search card names/i)).toBeInTheDocument();
    expect(screen.getByText("Snake-Eye")).toBeInTheDocument();
  });

  it("should trigger navigation on form submit", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Exodia" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);

    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Exodia");
  });

  it("should open suggestions dropdown on focus/input", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Blue" } });

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Blue-Eyes Alternative")).toBeInTheDocument();
  });

  it("should select suggestion on click", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Blue" } });

    const suggestion = screen.getByText("Blue-Eyes Alternative");
    fireEvent.click(suggestion);

    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Blue-Eyes%20Alternative");
  });

  it("should support keyboard navigation in suggestions dropdown", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search card names/i);
    fireEvent.change(input, { target: { value: "Blue" } });

    // Arrow down highlights first item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // Arrow down highlights second item
    fireEvent.keyDown(input, { key: "ArrowDown" });

    // Enter selects second item
    fireEvent.keyDown(input, { key: "Enter" });
    expect(navigateMock).toHaveBeenCalledWith("/cards?q=Blue-Eyes%20Alternative");
  });
});
