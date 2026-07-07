import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WizardLoading from "./WizardLoading";

describe("WizardLoading component", () => {
  it("should render loading text and spinner correctly", () => {
    const { container } = render(<WizardLoading />);

    expect(screen.getByText("AI is crafting your deck...")).toBeInTheDocument();
    expect(screen.getByText("Please wait while DeckLab builds your blueprint")).toBeInTheDocument();

    // Check that LoadingSpinner is rendered with size lg (w-12 h-12 based on LoadingSpinner.test.tsx)
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
