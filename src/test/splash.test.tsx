import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CinematicSplash } from "@/components/CinematicSplash";
import StoreApp from "@/StoreApp";

describe("CinematicSplash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows initially, fades out at 2200ms, and unmounts cleanly at 2700ms", () => {
    const { container } = render(<CinematicSplash />);

    const splash = screen.getByRole("status");
    expect(splash).toBeInTheDocument();
    expect(splash).toHaveClass("opacity-100");
    expect(splash).toHaveClass("transition-opacity", "duration-500");

    act(() => {
      vi.advanceTimersByTime(2199);
    });
    expect(screen.getByRole("status")).toHaveClass("opacity-100");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("status")).toHaveClass("opacity-0", "pointer-events-none");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.firstChild).toBeNull();
  });

  it("dismisses immediately when tapped or clicked", () => {
    const { container } = render(<CinematicSplash />);
    const splash = screen.getByRole("status");

    fireEvent.click(splash);
    expect(container.firstChild).toBeNull();
  });
});

describe("StoreApp mount", () => {
  it("renders StoreApp without throwing runtime errors", () => {
    const { container } = render(<StoreApp />);
    expect(container.firstChild).not.toBeNull();
  });
});
