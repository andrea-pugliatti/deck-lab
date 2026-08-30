import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import NotFound from "./NotFound";

describe("NotFound page component", () => {
  it("should render error details in a card shape layout and provide a home link", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404: Lost in Lab")).toBeInTheDocument();
    expect(screen.getByText(/banished to the Shadow Realm/i)).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
