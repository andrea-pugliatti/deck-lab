import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NotFound from "./NotFound";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("NotFound page component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it("should render error details in a card shape layout", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404: Lost in Lab")).toBeInTheDocument();
    expect(screen.getByText(/banished to the Shadow Realm/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Return Home/i })).toBeInTheDocument();
  });

  it("should navigate back home when return home button is clicked", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Return Home/i }));
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
