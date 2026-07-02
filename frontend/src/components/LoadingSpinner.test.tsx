import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner component", () => {
  it("should render correctly", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should support size settings", () => {
    const { container: containerSm } = render(<LoadingSpinner size="sm" />);
    expect(containerSm.querySelector(".w-6.h-6")).toBeInTheDocument();

    const { container: containerLg } = render(<LoadingSpinner size="lg" />);
    expect(containerLg.querySelector(".w-12.h-12")).toBeInTheDocument();
  });
});
