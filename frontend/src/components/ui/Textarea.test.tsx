import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Textarea from "./Textarea";

describe("Textarea component", () => {
  it("should render and allow user input", () => {
    const handleChange = vi.fn();
    render(<Textarea data-testid="textarea" onChange={handleChange} />);

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "A description of the deck" } });
    expect(handleChange).toHaveBeenCalled();
    expect(textarea.value).toBe("A description of the deck");
  });

  it("should support disabled state", () => {
    render(<Textarea disabled data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeDisabled();
  });
});
