import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import Modal from "./Modal";

describe("Modal component", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
      this.dispatchEvent(new Event("show"));
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    });
  });

  it("should open dialog when isOpen is true", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should not open dialog when isOpen is false", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.queryByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("should close dialog when isOpen changes to false", () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");

    rerender(
      <Modal isOpen={false} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(dialog).not.toHaveAttribute("open");
  });

  it("should trigger onClose when dialog close event fires", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent(dialog, new Event("close"));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should trigger close when clicking the dialog backdrop", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent.click(dialog);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should not close when clicking inside the modal content", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <button type="button">Inside Button</button>
      </Modal>,
    );

    const button = screen.getByRole("button", { name: "Inside Button" });
    fireEvent.click(button);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should not close on backdrop click when closeOnBackdropClick is false", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false}>
        <p>Modal Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent.click(dialog);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should apply size classes correctly", () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose} size="sm">
        <p>SM</p>
      </Modal>,
    );

    let dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveClass("max-w-sm");

    rerender(
      <Modal isOpen={true} onClose={handleClose} size="4xl">
        <p>4XL</p>
      </Modal>,
    );
    dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveClass("max-w-4xl");
  });

  it("should apply aria attributes", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} ariaLabel="Test Title">
        <p>Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("aria-label", "Test Title");
  });
});
