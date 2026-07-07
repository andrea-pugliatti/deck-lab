import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import WizardWarnings from "./WizardWarnings";

describe("WizardWarnings component", () => {
  it("should render warnings correctly", () => {
    const warnings = ["Warning 1", "Warning 2"];
    const onClose = vi.fn();

    render(<WizardWarnings warnings={warnings} onClose={onClose} />);

    expect(screen.getByText("Deck Generated with Validation Warnings:")).toBeInTheDocument();
    expect(screen.getByText("Warning 1")).toBeInTheDocument();
    expect(screen.getByText("Warning 2")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The deck has been loaded into your builder workspace, but does not satisfy format legality rules. You can edit it manually before saving.",
      ),
    ).toBeInTheDocument();
  });

  it("should trigger onClose when clicking acknowledge button", () => {
    const warnings = ["Warning 1"];
    const onClose = vi.fn();

    render(<WizardWarnings warnings={warnings} onClose={onClose} />);

    const button = screen.getByRole("button", { name: /Acknowledge & Close/i });
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
