import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ModalCloseButton from "./ModalCloseButton";

describe("ModalCloseButton component", () => {
  it("should call onClose when clicked", () => {
    const handleClose = vi.fn();
    render(<ModalCloseButton onClose={handleClose} />);

    const button = screen.getByRole("button", { name: "Close dialog" });
    fireEvent.click(button);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when provided", () => {
    const handleClick = vi.fn();
    render(<ModalCloseButton onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Close dialog" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled and not trigger when disabled prop is true", () => {
    const handleClose = vi.fn();
    render(<ModalCloseButton onClose={handleClose} disabled />);

    const button = screen.getByRole("button", { name: "Close dialog" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should support sm iconSize", () => {
    render(<ModalCloseButton iconSize="sm" />);

    const button = screen.getByRole("button", { name: "Close dialog" });
    expect(button.querySelector("svg")).toHaveClass("size-4");
  });
});
