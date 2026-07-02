import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Label from "./Label";

describe("Label component", () => {
  it("should render its children correctly", () => {
    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("should support htmlFor attribute", () => {
    render(<Label htmlFor="input-id">Username</Label>);
    const label = screen.getByText("Username");
    expect(label).toHaveAttribute("for", "input-id");
  });
});
