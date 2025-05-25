import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  within,
  cleanup,
} from "@testing-library/react";
import { AddInsight } from "./../add-insight/add-insight.tsx";
import type { PropsWithChildren } from "react";
import { ModalProps } from "../modal/modal.tsx";

vi.mock("../modal/modal", () => ({
  Modal: ({ children }: PropsWithChildren<ModalProps>) => (
    <div data-testid="modal">{children}</div>
  ),
}));

describe("AddInsight", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the form", () => {
    render(<AddInsight open onClose={vi.fn()} />);
    expect(screen.getByText("Add a new insight")).toBeTruthy();
    expect(screen.getByPlaceholderText("Something insightful...")).toBeTruthy();
    expect(screen.getByRole("button", { name: /add insight/i })).toBeTruthy();
  });

  it("shows error when submitted with empty text", () => {
    render(<AddInsight open onClose={vi.fn()} />);
    const modal = screen.getByTestId("modal");
    const submitBtn = within(modal).getByRole("button", {
      name: /add insight/i,
    });
    fireEvent.click(submitBtn);
    expect(screen.findByText("Please enter an insight")).toBeTruthy();
  });

  it("calls onSuccess and onClose when submission is successful", async () => {
    const mockOnSuccess = vi.fn();
    const mockOnClose = vi.fn();

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as unknown as typeof globalThis.fetch;

    render(<AddInsight open onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "Testing insight" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add insight/i }));

    await new Promise((res) => setTimeout(res, 10));

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
