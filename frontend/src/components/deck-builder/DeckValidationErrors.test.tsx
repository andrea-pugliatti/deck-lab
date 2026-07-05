import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DeckValidationErrors from "./DeckValidationErrors";

describe("DeckValidationErrors component", () => {
  it("should return null if not successful and no errors are present", () => {
    const { container } = render(
      <DeckValidationErrors validationSuccess={false} validationErrors={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render success alert when validationSuccess is true", () => {
    render(<DeckValidationErrors validationSuccess={true} validationErrors={[]} />);

    expect(screen.getByText("Deck is Valid!")).toBeInTheDocument();
    expect(
      screen.getByText("Your deck list complies with all format limits and rules."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Deck Validation Failed")).not.toBeInTheDocument();
  });

  it("should render validation errors list when validationErrors is not empty", () => {
    render(
      <DeckValidationErrors
        validationSuccess={false}
        validationErrors={["Main Deck is too small.", "Only 3 copies allowed."]}
      />,
    );

    expect(screen.getByText("Deck Validation Failed")).toBeInTheDocument();
    expect(screen.getByText("Main Deck is too small.")).toBeInTheDocument();
    expect(screen.getByText("Only 3 copies allowed.")).toBeInTheDocument();
    expect(screen.queryByText("Deck is Valid!")).not.toBeInTheDocument();
  });

  it("should render submitError if present", () => {
    render(
      <DeckValidationErrors
        validationSuccess={false}
        validationErrors={[]}
        submitError="Network timeout."
      />,
    );

    expect(screen.getByText("Deck Validation Failed")).toBeInTheDocument();
    expect(screen.getByText("Network timeout.")).toBeInTheDocument();
  });
});
