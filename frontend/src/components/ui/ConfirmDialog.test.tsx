import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog component", () => {
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

  it("should not show dialog content if isOpen is false", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Delete Deck"
        description="Are you sure?"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    // Dialog element shouldn't be open
    const dialog = screen.queryByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("should show dialog content and text when isOpen is true", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Deck"
        description="Are you sure you want to delete this deck?"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        confirmText="Yes, delete"
        cancelText="No, cancel"
      />,
    );

    expect(screen.getByText("Delete Deck")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this deck?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes, delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No, cancel" })).toBeInTheDocument();
  });

  it("should trigger onConfirm when clicking confirm button", () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Title"
        description="Desc"
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("should trigger onClose when clicking cancel button", () => {
    const handleClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Title"
        description="Desc"
        onClose={handleClose}
        onConfirm={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
