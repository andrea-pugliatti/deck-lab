import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FormatSelector from "./FormatSelector";

describe("FormatSelector component", () => {
  const formats = ["TCG", "OCG", "Speed Duel", "Rush Duel"];

  it("renders buttons for all available formats", () => {
    render(<FormatSelector selectedFormat="TCG" setSelectedFormat={vi.fn()} formats={formats} />);

    formats.forEach((format) => {
      expect(screen.getByRole("button", { name: format })).toBeInTheDocument();
    });
  });

  it("applies the active styling only to the selected format button", () => {
    render(<FormatSelector selectedFormat="OCG" setSelectedFormat={vi.fn()} formats={formats} />);

    const activeBtn = screen.getByRole("button", { name: "OCG" });
    const inactiveBtn = screen.getByRole("button", { name: "TCG" });

    // Active button has class "text-cyan-accent" (and not "text-slate-400")
    expect(activeBtn.className).toContain("text-cyan-accent");
    expect(activeBtn.className).not.toContain("text-slate-400");

    // Inactive button has class "text-slate-400"
    expect(inactiveBtn.className).toContain("text-slate-400");
    expect(inactiveBtn.className).not.toContain("text-cyan-accent");
  });

  it("calls setSelectedFormat with correct format when clicked", () => {
    const handleSetSelectedFormat = vi.fn();
    render(
      <FormatSelector
        selectedFormat="TCG"
        setSelectedFormat={handleSetSelectedFormat}
        formats={formats}
      />,
    );

    const targetBtn = screen.getByRole("button", { name: "Speed Duel" });
    fireEvent.click(targetBtn);

    expect(handleSetSelectedFormat).toHaveBeenCalledWith("Speed Duel");
  });
});
