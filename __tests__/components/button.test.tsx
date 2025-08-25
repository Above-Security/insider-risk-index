import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("should render with variant prop", () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toHaveClass("border-input");
  });

  it("should render with size prop", () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toHaveClass("h-11");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});