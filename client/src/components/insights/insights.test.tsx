import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Insights } from "./insights.tsx";
import { promise } from "zod";

const TEST_INSIGHTS = [
  {
    id: 998,
    brandId: 1,
    date: new Date(),
    text: "Test insight",
  },
  {
    id: 999,
    brandId: 2,
    date: new Date(),
    text: "Another test insight",
  },
];

describe("insights", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });
  it("renders", () => {
    const { getByText } = render(<Insights insights={TEST_INSIGHTS} />);
    expect(getByText(TEST_INSIGHTS[0].text)).toBeTruthy();
  });

  it("test delete functionality", async () => {
    const mockOnDelete = vi.fn();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
      })
    ) as unknown as typeof globalThis.fetch;

    render(<Insights insights={TEST_INSIGHTS} onDelete={mockOnDelete} />);

    const button = await screen.getByTestId("delete-button-999");
    await fireEvent.click(button);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/insights/999", {
        method: "DELETE",
      });
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });
});
