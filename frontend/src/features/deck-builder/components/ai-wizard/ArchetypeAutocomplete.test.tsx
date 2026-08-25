import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import ArchetypeAutocomplete from "./ArchetypeAutocomplete";

function ArchetypeAutocompleteWrapper({
  initialValue = "",
  archetypes = [],
  disabled = false,
  onChangeMock,
}: {
  initialValue?: string;
  archetypes?: string[];
  disabled?: boolean;
  onChangeMock?: (val: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <ArchetypeAutocomplete
      value={value}
      onChange={(val) => {
        setValue(val);
        if (onChangeMock) onChangeMock(val);
      }}
      disabled={disabled}
      archetypes={archetypes}
    />
  );
}

describe("ArchetypeAutocomplete component", () => {
  const testArchetypes = [
    "Blue-Eyes",
    "Blue-Eyes Alternative",
    "Dark Magician",
    "Red-Eyes",
    "Lightsworn",
    "Cyber Dragon",
    "Blue-Eyes Ultimate",
    "Blue-Eyes Toon",
    "Blue-Eyes Spirit",
  ];

  it("should render input field with value and disabled state", () => {
    const onChange = vi.fn();
    render(
      <ArchetypeAutocomplete
        value="Blue-Eyes"
        onChange={onChange}
        archetypes={testArchetypes}
        disabled={true}
      />,
    );

    const input = screen.getByLabelText("Archetype / Core Theme") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Blue-Eyes");
    expect(input).toBeDisabled();
  });

  it("should call onChange when typing", () => {
    const onChange = vi.fn();
    render(
      <ArchetypeAutocompleteWrapper
        initialValue=""
        archetypes={testArchetypes}
        onChangeMock={onChange}
      />,
    );

    const input = screen.getByLabelText("Archetype / Core Theme") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "blue" } });

    expect(onChange).toHaveBeenCalledWith("blue");
    expect(input.value).toBe("blue");
  });

  it("should display filtered suggestions case-insensitively, limited to 5 results", () => {
    render(<ArchetypeAutocompleteWrapper initialValue="blue" archetypes={testArchetypes} />);

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.focus(input);

    const suggestions = screen.getAllByRole("button");
    // Should match: Blue-Eyes, Blue-Eyes Alternative, Blue-Eyes Ultimate, Blue-Eyes Toon, Blue-Eyes Spirit (5 total, limited by slice(0,5))
    expect(suggestions).toHaveLength(5);
    expect(screen.getByText("Blue-Eyes")).toBeInTheDocument();
    expect(screen.getByText("Blue-Eyes Alternative")).toBeInTheDocument();
    expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
  });

  it("should update input value and close suggestions when click on a suggestion", () => {
    const onChange = vi.fn();
    render(
      <ArchetypeAutocompleteWrapper
        initialValue="blue"
        archetypes={testArchetypes}
        onChangeMock={onChange}
      />,
    );

    const input = screen.getByLabelText("Archetype / Core Theme");
    fireEvent.focus(input);

    const firstSuggestion = screen.getByText("Blue-Eyes");
    fireEvent.click(firstSuggestion);

    expect(onChange).toHaveBeenLastCalledWith("Blue-Eyes");
    // Suggestions list should be gone
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    expect((input as HTMLInputElement).value).toBe("Blue-Eyes");
  });

  it("should hide suggestions on blur after 200ms timeout", async () => {
    vi.useFakeTimers();
    render(<ArchetypeAutocompleteWrapper initialValue="blue" archetypes={testArchetypes} />);

    const input = screen.getByLabelText("Archetype / Core Theme");

    // First focus
    fireEvent.focus(input);
    expect(screen.getAllByRole("button")).toHaveLength(5);

    // Blur
    fireEvent.blur(input);

    // Immediately they should still be visible
    expect(screen.getAllByRole("button")).toHaveLength(5);

    // Advance timers by 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now they should be gone
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
