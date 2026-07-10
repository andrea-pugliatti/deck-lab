import { useQuery } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { generateAiDeck } from "../../../services/deck";
import AiDeckWizard from "./AiDeckWizard";

// Mock services
vi.mock("../../../services/deck", () => ({
  generateAiDeck: vi.fn(),
}));

describe("AiDeckWizard component", () => {
  beforeAll(() => {
    // Mock HTMLDialogElement APIs that JSDOM doesn't support completely
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
      this.dispatchEvent(new Event("show"));
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    });
  });

  const mockOnClose = vi.fn();
  const mockOnDeckGenerated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useQuery
    vi.mocked(useQuery).mockImplementation((options: any) => {
      const queryKey = options?.queryKey || [];
      if (queryKey.includes("archetypes")) {
        return { data: ["Blue-Eyes", "Dark Magician"], isLoading: false } as any;
      }
      if (queryKey.includes("formats")) {
        return { data: ["TCG", "OCG", "Goat", "Edison"], isLoading: false } as any;
      }
      return { data: null, isLoading: false } as any;
    });
  });

  it("should not show dialog if isOpen is false", () => {
    const { container } = render(
      <AiDeckWizard
        isOpen={false}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog?.open).toBeFalsy();
  });

  it("should open dialog and load format rules if isOpen is true", () => {
    const { container } = render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="Goat"
      />,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog?.open).toBe(true);

    expect(screen.getByText("AI Deck Generator Wizard")).toBeInTheDocument();
    expect(screen.getByLabelText("Format rules")).toHaveValue("Goat");
  });

  it("should require archetype and show validation error if archetype is empty", async () => {
    const { container } = render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    expect(screen.getByText("Please specify an archetype first.")).toBeInTheDocument();
  });

  it("should successfully generate deck and close dialog on submit", async () => {
    const mockDeckResult = {
      name: "Blue-Eyes Deck",
      description: "Generated Blue-Eyes Deck",
      formatName: "TCG",
      deckCards: [
        {
          cardId: 123,
          name: "Blue-Eyes White Dragon",
          quantity: 3,
          section: "MAIN" as const,
        },
      ],
    };

    vi.mocked(generateAiDeck).mockResolvedValue(mockDeckResult);

    render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    // Enter archetype
    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    // Select format
    const formatSelect = screen.getByLabelText("Format rules");
    fireEvent.change(formatSelect, { target: { value: "TCG" } });

    // Select Strategy
    const strategyBtn = screen.getByRole("button", { name: "Combo / Synchro Spam" });
    fireEvent.click(strategyBtn);

    // Select Custom Prompt
    const customPromptInput = screen.getByLabelText(/Custom Rules/);
    fireEvent.change(customPromptInput, { target: { value: "Include Blue-Eyes Alternative" } });

    // Submit form
    const generateBtn = screen.getByRole("button", { name: /Generate Deck/i });
    fireEvent.click(generateBtn);

    expect(generateAiDeck).toHaveBeenCalledWith({
      archetype: "Blue-Eyes",
      strategy: "Combo",
      formatName: "TCG",
      customPrompt: "Include Blue-Eyes Alternative",
    });

    await waitFor(() => {
      expect(mockOnDeckGenerated).toHaveBeenCalledWith(mockDeckResult);
    });
  });

  it("should show warnings and call onClose when acknowledged if result contains validation warnings", async () => {
    const mockDeckResult = {
      name: "Blue-Eyes Deck",
      description: "Generated Blue-Eyes Deck",
      formatName: "TCG",
      deckCards: [],
      validationWarnings: ["Too few cards", "Missing core cards"],
    };

    vi.mocked(generateAiDeck).mockResolvedValue(mockDeckResult);

    render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Deck/i });
    fireEvent.click(generateBtn);

    await screen.findByText("Deck Generated with Validation Warnings:");
    expect(screen.getByText("Too few cards")).toBeInTheDocument();
    expect(screen.getByText("Missing core cards")).toBeInTheDocument();

    const acknowledgeBtn = screen.getByRole("button", { name: /Acknowledge & Close/i });
    fireEvent.click(acknowledgeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should display API errors when generation fails", async () => {
    vi.mocked(generateAiDeck).mockRejectedValue(new Error("API generation failed."));

    render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Deck/i });
    fireEvent.click(generateBtn);

    await screen.findByText("API generation failed.");
    expect(screen.getByText("API generation failed.")).toBeInTheDocument();
  });

  it("should call onClose when clicking cancel or close buttons", () => {
    render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when dialog backdrop is clicked", () => {
    const { container } = render(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();

    // Simulate click directly on dialog backdrop
    fireEvent.click(dialog!);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
