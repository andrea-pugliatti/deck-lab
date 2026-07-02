import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Badge from "./Badge";

describe("Badge component", () => {
  it("should render correctly with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const element = screen.getByText("Default Badge");
    expect(element).toBeInTheDocument();
    expect(element.className).toContain("text-slate-400");
  });

  it("should apply variant classes correctly", () => {
    const { rerender } = render(<Badge variant="monster">Monster</Badge>);
    let element = screen.getByText("Monster");
    expect(element.className).toContain("text-amber-400");

    rerender(<Badge variant="spell">Spell</Badge>);
    element = screen.getByText("Spell");
    expect(element.className).toContain("text-emerald-400");

    rerender(<Badge variant="trap">Trap</Badge>);
    element = screen.getByText("Trap");
    expect(element.className).toContain("text-rose-400");
  });

  it("should accept custom classNames and other span attributes", () => {
    render(
      <Badge className="custom-class" data-testid="badge" id="my-badge">
        Text
      </Badge>,
    );
    const element = screen.getByTestId("badge");
    expect(element).toHaveAttribute("id", "my-badge");
    expect(element.className).toContain("custom-class");
  });
});
