import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ShowingPageIndicator from "./ShowingPageIndicator";

describe("ShowingPageIndicator component", () => {
  it("should show correct ranges for cards", () => {
    const { rerender } = render(
      <ShowingPageIndicator page={0} pageSize={10} totalElements={45} itemType="card" />,
    );

    expect(screen.getByText("Showing 1-10 of 45 cards")).toBeInTheDocument();

    rerender(<ShowingPageIndicator page={4} pageSize={10} totalElements={45} itemType="card" />);
    expect(screen.getByText("Showing 41-45 of 45 cards")).toBeInTheDocument();
  });

  it("should show 0 if totalElements is 0", () => {
    render(<ShowingPageIndicator page={0} pageSize={9} totalElements={0} itemType="deck" />);
    expect(screen.getByText("Showing 0 of 0 decks")).toBeInTheDocument();
  });
});
