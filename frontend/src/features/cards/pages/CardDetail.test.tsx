import { MemoryRouter, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cardKeys } from "../../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../../test/setup";
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
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(cardKeys.detail("100"), {
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
    });

    renderWithClient(
      <MemoryRouter>
        <CardDetail />
      </MemoryRouter>,
      queryClient,
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

  it("should render invalid card ID error and link back to catalog when id is non-numeric", () => {
    vi.mocked(useParams).mockReturnValue({ id: "invalid-id" });
    const queryClient = createTestQueryClient();

    renderWithClient(
      <MemoryRouter>
        <CardDetail />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Invalid Card ID")).toBeInTheDocument();
    expect(
      screen.getByText("The requested card ID must be a valid numeric identifier."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Retry/i })).not.toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Back to Catalog/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/cards");
  });

  it("should render card details immediately from list cache via placeholderData", () => {
    vi.mocked(useParams).mockReturnValue({ id: "200" });
    const queryClient = createTestQueryClient();

    queryClient.setQueryData(cardKeys.lists(), {
      content: [
        {
          id: 200,
          name: "Celtic Guardian",
          type: "Normal Monster",
          description: "An elf who learned to wield a sword.",
          attribute: "EARTH",
          level: 4,
          atk: 1400,
          def: 1200,
          imageUrl: "",
        },
      ],
      page: { totalPages: 1, totalElements: 1, size: 10, number: 0 },
    });

    renderWithClient(
      <MemoryRouter>
        <CardDetail />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Celtic Guardian")).toBeInTheDocument();
    expect(screen.getByText("EARTH")).toBeInTheDocument();
    expect(screen.getByText("1400")).toBeInTheDocument();
  });
});
