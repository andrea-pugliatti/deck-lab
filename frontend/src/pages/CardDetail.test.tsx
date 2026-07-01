import { render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "../hooks/useFetch";
import CardDetail from "./CardDetail";

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe("CardDetail page component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useParams).mockReturnValue({ id: "100" });
  });

  it("should render card detail page correctly", () => {
    vi.mocked(useFetch).mockReturnValue({
      data: {
        id: 100,
        name: "Summoned Skull",
        type: "Normal Monster",
        desc: "A fiend with dark powers.",
        description: "A fiend with dark powers.",
        attribute: "DARK",
        level: 6,
        atk: 2500,
        def: 1200,
        imageUrl: "",
      },
      loading: false,
      error: undefined,
    } as any);

    render(
      <MemoryRouter>
        <CardDetail />
      </MemoryRouter>,
    );

    expect(screen.getByText("Summoned Skull")).toBeInTheDocument();
    expect(screen.getByText("DARK")).toBeInTheDocument();
    expect(screen.getByText("A fiend with dark powers.")).toBeInTheDocument();
    expect(screen.getByText("2500")).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
  });
});
