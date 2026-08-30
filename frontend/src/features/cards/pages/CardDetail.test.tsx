import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardDetail from "./CardDetail";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe("CardDetail page component", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: "100" });
  });

  it("should render card detail page correctly and provide link back to catalog", () => {
    vi.mocked(useQuery).mockReturnValue({
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
      isLoading: false,
      error: undefined,
    } as unknown as ReturnType<typeof useQuery>);

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

    const backLink = screen.getByRole("link", { name: /Back to Catalog/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/cards");
  });
});
