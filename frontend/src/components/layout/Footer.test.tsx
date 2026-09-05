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
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Public Decks" })).toHaveAttribute("href", "/decks");
    expect(screen.getByRole("link", { name: "Card Database" })).toHaveAttribute("href", "/cards");
    expect(screen.getByRole("link", { name: "Hand Simulator" })).toHaveAttribute(
      "href",
      "/simulator",
    );
    expect(screen.getByText(/unofficial fan-made simulator/i)).toBeInTheDocument();
    const privacyBtn = screen.getByRole("button", { name: "Privacy Policy" });
    const termsBtn = screen.getByRole("button", { name: "Terms of Service" });
    expect(privacyBtn).toBeInTheDocument();
    expect(privacyBtn).toHaveClass("focus-visible:outline-hidden");
    expect(privacyBtn).toHaveClass("focus-visible:ring-2");
    expect(privacyBtn).toHaveClass("focus-visible:ring-cyan-accent");
    expect(termsBtn).toBeInTheDocument();
    expect(termsBtn).toHaveClass("focus-visible:outline-hidden");
    expect(termsBtn).toHaveClass("focus-visible:ring-2");
    expect(termsBtn).toHaveClass("focus-visible:ring-cyan-accent");
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
