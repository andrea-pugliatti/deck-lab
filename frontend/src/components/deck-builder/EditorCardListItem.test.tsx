import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EditorCardListItem from "./EditorCardListItem";

describe("EditorCardListItem component", () => {
  const mockUpdateQty = vi.fn();
  const mockRemove = vi.fn();

  it("should render card details correctly with image", () => {
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl="blue_eyes.jpg"
        section="MAIN"
        quantity={2}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    // Badge text strips " Monster" and " Card"
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    const img = screen.getByAltText("Blue-Eyes White Dragon") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/api/blue_eyes.jpg");
  });

  it("should render placeholder text if no image is provided", () => {
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl={undefined}
        section="MAIN"
        quantity={1}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    expect(screen.queryByAltText("Blue-Eyes White Dragon")).not.toBeInTheDocument();
    expect(screen.getByText("YuGi")).toBeInTheDocument();
  });

  it("should call updateQty with delta -1 when minus button is clicked", () => {
    mockUpdateQty.mockClear();
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl="blue_eyes.jpg"
        section="MAIN"
        quantity={2}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    const minusBtn = screen.getByTitle("Decrease Quantity");
    fireEvent.click(minusBtn);

    expect(mockUpdateQty).toHaveBeenCalledWith(1, "MAIN", -1);
  });

  it("should call updateQty with delta 1 when plus button is clicked", () => {
    mockUpdateQty.mockClear();
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl="blue_eyes.jpg"
        section="MAIN"
        quantity={2}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    const plusBtn = screen.getByTitle("Increase Quantity");
    fireEvent.click(plusBtn);

    expect(mockUpdateQty).toHaveBeenCalledWith(1, "MAIN", 1);
  });

  it("should disable plus button when quantity is 3 or more", () => {
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl="blue_eyes.jpg"
        section="MAIN"
        quantity={3}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    const plusBtn = screen.getByTitle("Increase Quantity");
    expect(plusBtn).toBeDisabled();
  });

  it("should call remove when delete button is clicked", () => {
    mockRemove.mockClear();
    render(
      <EditorCardListItem
        cardId={1}
        name="Blue-Eyes White Dragon"
        type="Normal Monster"
        imageUrl="blue_eyes.jpg"
        section="MAIN"
        quantity={2}
        updateQty={mockUpdateQty}
        remove={mockRemove}
      />,
    );

    const removeBtn = screen.getByTitle("Remove Card");
    fireEvent.click(removeBtn);

    expect(mockRemove).toHaveBeenCalledWith(1, "MAIN");
  });
});
