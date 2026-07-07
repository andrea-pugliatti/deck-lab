import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StrategySelector, { strategies } from "./StrategySelector";

describe("StrategySelector component", () => {
  it("should render all strategies and labels correctly", () => {
    const onChange = vi.fn();
    render(<StrategySelector value="None" onChange={onChange} />);

    expect(screen.getByText("Playstyle Strategy")).toBeInTheDocument();

    // Check all strategy buttons exist
    strategies.forEach((strat) => {
      expect(screen.getByRole("button", { name: strat.label })).toBeInTheDocument();
    });

    // Check current strategy description is displayed
    const currentStrat = strategies.find((s) => s.value === "None");
    expect(screen.getByText(currentStrat!.description)).toBeInTheDocument();
  });

  it("should call onChange with strategy value when clicked", () => {
    const onChange = vi.fn();
    render(<StrategySelector value="None" onChange={onChange} />);

    const comboButton = screen.getByRole("button", { name: "Combo / Synchro Spam" });
    fireEvent.click(comboButton);

    expect(onChange).toHaveBeenCalledWith("Combo");
  });

  it("should disable buttons when disabled prop is true", () => {
    const onChange = vi.fn();
    render(<StrategySelector value="None" onChange={onChange} disabled={true} />);

    strategies.forEach((strat) => {
      const button = screen.getByRole("button", { name: strat.label });
      expect(button).toBeDisabled();
    });
  });

  it("should display the appropriate style for the active strategy", () => {
    const onChange = vi.fn();
    const { rerender } = render(<StrategySelector value="None" onChange={onChange} />);

    // None is selected, so it should have active classes
    const noneButton = screen.getByRole("button", { name: "None (Standard)" });
    expect(noneButton.className).toContain("border-cyan-accent");

    const comboButton = screen.getByRole("button", { name: "Combo / Synchro Spam" });
    expect(comboButton.className).not.toContain("border-cyan-accent");

    // Rerender with Combo selected
    rerender(<StrategySelector value="Combo" onChange={onChange} />);

    expect(noneButton.className).not.toContain("border-cyan-accent");
    expect(comboButton.className).toContain("border-cyan-accent");

    // Check combo description is displayed now
    const comboStrat = strategies.find((s) => s.value === "Combo");
    expect(screen.getByText(comboStrat!.description)).toBeInTheDocument();
  });
});
