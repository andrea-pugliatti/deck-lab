import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

describe("Footer component", () => {
  it("should render navigation links and legal text", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("DeckLab")).toBeInTheDocument();
    expect(screen.getByText("Public Decks")).toBeInTheDocument();
    expect(screen.getByText("Card Database")).toBeInTheDocument();
    expect(screen.getByText("Hand Simulator")).toBeInTheDocument();
    expect(screen.getByText(/unofficial fan-made simulator/i)).toBeInTheDocument();
  });

  it("should render current year in copy notice", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
  });
});
