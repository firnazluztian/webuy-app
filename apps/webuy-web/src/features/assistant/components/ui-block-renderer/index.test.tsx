import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UiBlockRenderer } from "./index";
import type { UiBlock } from "@/features/assistant/schema";

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => (
    <span role="img" aria-label={props.alt} />
  ),
}));

vi.mock("@/features/shell/hooks/use-format-money", () => ({
  useFormatMoney: () => ({
    format: (amount: number) => `$${amount.toFixed(2)}`,
  }),
}));

describe("UiBlockRenderer", () => {
  it("maps catalog blocks to visible UI", () => {
    const blocks: UiBlock[] = [
      { type: "text", content: "Top picks for you" },
      {
        type: "button",
        label: "Browse beauty",
        action: { kind: "navigate", href: "/en/search?q=beauty" },
      },
      {
        type: "chips",
        items: [{ label: "Laptops", message: "Show laptops" }],
      },
    ];

    render(
      <UiBlockRenderer
        blocks={blocks}
        locale="en"
        onNavigate={vi.fn()}
        onSendMessage={vi.fn()}
      />,
    );

    expect(screen.getByText("Top picks for you")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Browse beauty" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Laptops" })).toBeTruthy();
  });
});
