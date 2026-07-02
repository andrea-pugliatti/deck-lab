import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Pagination from "./Pagination";

describe("Pagination component", () => {
  it("should render page description details", () => {
    render(<Pagination page={0} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText("Page 1 of 10")).toBeInTheDocument();
  });

  it("should disable previous button on first page", () => {
    const handlePageChange = vi.fn();
    render(<Pagination page={0} totalPages={5} onPageChange={handlePageChange} />);

    const prevBtn = screen.getAllByRole("button")[0];
    const nextBtn = screen.getAllByRole("button")[1];

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("should disable next button on last page", () => {
    const handlePageChange = vi.fn();
    render(<Pagination page={4} totalPages={5} onPageChange={handlePageChange} />);

    const prevBtn = screen.getAllByRole("button")[0];
    const nextBtn = screen.getAllByRole("button")[1];

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
