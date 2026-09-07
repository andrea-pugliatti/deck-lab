import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import BackLink from "./BackLink";

describe("BackLink component", () => {
  it("renders with label and links to the specified path", () => {
    render(
      <MemoryRouter>
        <BackLink to="/cards" label="Back to Catalog" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /Back to Catalog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/cards");
  });

  it("renders with children as fallback when label is not provided", () => {
    render(
      <MemoryRouter>
        <BackLink to="/decks">Back to Decks</BackLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /Back to Decks/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/decks");
  });

  it("prefers label prop over children if both are passed", () => {
    render(
      <MemoryRouter>
        <BackLink to="/decks" label="Preferred Label">
          Fallback Children
        </BackLink>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Preferred Label/i })).toBeInTheDocument();
    expect(screen.queryByText("Fallback Children")).not.toBeInTheDocument();
  });

  it("applies default mb-8 class when className is omitted", () => {
    render(
      <MemoryRouter>
        <BackLink to="/cards" label="Back to Catalog" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("mb-8");
    expect(link).toHaveClass("group");
    expect(link).toHaveClass("inline-flex");
  });

  it("overrides margin when custom className is provided", () => {
    render(
      <MemoryRouter>
        <BackLink to="/decks" label="Back to Decks" className="custom-class mb-2" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("mb-2");
    expect(link).toHaveClass("custom-class");
    expect(link).not.toHaveClass("mb-8");
  });

  it("renders arrow icon with aria-hidden and hover animation class", () => {
    const { container } = render(
      <MemoryRouter>
        <BackLink to="/my-decks" label="Back to Decks" />
      </MemoryRouter>,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("group-hover:-translate-x-1");
  });

  it("supports custom icon component", () => {
    const CustomIcon = (props: {
      className?: string;
      "aria-hidden"?: boolean | "true" | "false";
    }) => (
      <span data-testid="custom-icon" {...props}>
        &larr;
      </span>
    );

    render(
      <MemoryRouter>
        <BackLink to="/cards" label="Back to Catalog" icon={CustomIcon} />
      </MemoryRouter>,
    );

    const customIcon = screen.getByTestId("custom-icon");
    expect(customIcon).toBeInTheDocument();
    expect(customIcon).toHaveAttribute("aria-hidden", "true");
    expect(customIcon).toHaveClass("group-hover:-translate-x-1");
  });

  it("forwards ref to the underlying anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <MemoryRouter>
        <BackLink ref={ref} to="/cards" label="Back to Catalog" />
      </MemoryRouter>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveAttribute("href", "/cards");
  });
});
