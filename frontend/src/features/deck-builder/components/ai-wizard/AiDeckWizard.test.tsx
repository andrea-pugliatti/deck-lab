import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { generateAiDeck } from "../../../../features/decks";
import { formatKeys, metaKeys } from "../../../../services/queryKeys";
import { createTestQueryClient, renderWithClient } from "../../../../test/setup";
import type { Format } from "../../../../types";
import { useGenerateAiDeck } from "../../hooks/useGenerateAiDeck";
import AiDeckWizard from "./AiDeckWizard";

vi.mock("../../../../features/decks", () => ({
  generateAiDeck: vi.fn(),
}));

vi.mock("../../hooks/useGenerateAiDeck", () => ({
  useGenerateAiDeck: vi.fn(),
}));

describe("AiDeckWizard component", () => {
  let queryClient = createTestQueryClient();

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
    queryClient = createTestQueryClient();
    queryClient.setQueryData(metaKeys.archetypes(), ["Blue-Eyes", "Dark Magician"]);
    queryClient.setQueryData(formatKeys.all, ["TCG", "OCG", "Goat", "Edison"]);

    // Mock useGenerateAiDeck — mutate delegates to the mocked generateAiDeck
    // and invokes onSuccess/onError callbacks so the component behaves as in prod.
    vi.mocked(useGenerateAiDeck).mockReturnValue({
      mutate: vi.fn((payload, callbacks) => {
        const result = generateAiDeck(payload);
        Promise.resolve(result).then(
          (data) => callbacks?.onSuccess?.(data),
          (err) => callbacks?.onError?.(err),
        );
      }),
      isPending: false,
      error: null,
      isError: false,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
    } as unknown as ReturnType<typeof useGenerateAiDeck>);
  });

  it("should not show dialog if isOpen is false", () => {
    const { container } = renderWithClient(
      <AiDeckWizard
        isOpen={false}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog?.open).toBeFalsy();
  });

  it("should open dialog and load format rules if isOpen is true", () => {
    const { container } = renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="Goat"
      />,
      queryClient,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog?.open).toBe(true);

    expect(screen.getByText("AI Deck Generator Wizard")).toBeInTheDocument();
    expect(screen.getByLabelText("Format rules")).toHaveValue("Goat");
  });

  it("should require archetype and show validation error if archetype is empty", async () => {
    const { container } = renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
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
      formatName: "TCG" as Format,
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

    renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
    );

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    const formatSelect = screen.getByLabelText("Format rules");
    fireEvent.change(formatSelect, { target: { value: "TCG" } });

    const strategyBtn = screen.getByRole("button", { name: "Combo / Synchro Spam" });
    fireEvent.click(strategyBtn);

    const customPromptInput = screen.getByLabelText(/Custom Rules/);
    fireEvent.change(customPromptInput, { target: { value: "Include Blue-Eyes Alternative" } });

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
      formatName: "TCG" as Format,
      deckCards: [],
      validationWarnings: ["Too few cards", "Missing core cards"],
    };

    vi.mocked(generateAiDeck).mockResolvedValue(mockDeckResult);

    renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
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

    renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
    );

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Deck/i });
    fireEvent.click(generateBtn);

    await screen.findByText("API generation failed.");
    expect(screen.getByText("API generation failed.")).toBeInTheDocument();
  });

  it("should call onClose when clicking cancel or close buttons", () => {
    renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when dialog backdrop is clicked", () => {
    const { container } = renderWithClient(
      <AiDeckWizard
        isOpen={true}
        onClose={mockOnClose}
        onDeckGenerated={mockOnDeckGenerated}
        currentFormat="TCG"
      />,
      queryClient,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.click(dialog!);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
