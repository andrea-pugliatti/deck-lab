import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorAlert from "./ErrorAlert";

describe("ErrorAlert component", () => {
  it("should render title and error message", () => {
    render(<ErrorAlert title="Connection Failure" message="Database connection failed." />);

    expect(screen.getByText("Connection Failure")).toBeInTheDocument();
    expect(screen.getByText("Database connection failed.")).toBeInTheDocument();
  });

  it("should render default title if not provided", () => {
    render(<ErrorAlert message="Something went wrong." />);
    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  it("should render retry button when onRetry is provided", () => {
    const handleRetry = vi.fn();
    render(<ErrorAlert message="Error" onRetry={handleRetry} retryText="Try Again" />);

    const retryBtn = screen.getByRole("button", { name: "Try Again" });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
