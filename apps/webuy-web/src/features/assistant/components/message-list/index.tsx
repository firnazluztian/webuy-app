"use client";

import { Skeleton, Text } from "@kiichan/design-system";
import type { UIMessage } from "ai";
import { useScrollOnSubmit } from "@/features/assistant/components/message-list/hooks/use-scroll-on-submit";
import { UiBlockRenderer } from "@/features/assistant/components/ui-block-renderer";
import { parseUiBlocks, type UiBlock } from "@/features/assistant/schema";
import type { Locale } from "@/i18n/types";

interface MessageListProps {
  messages: UIMessage[];
  locale: Locale;
  emptyLabel: string;
  thinkingLabel: string;
  onNavigate: (href: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isBusy?: boolean;
  /** Bumped by ChatPanel on every send so we pin to the latest post. */
  scrollNonce?: number;
}

type PresentUiState =
  | { status: "ready"; blocks: UiBlock[] }
  | { status: "building" }
  | { status: "none" };

function isToolPart(
  part: UIMessage["parts"][number],
): part is UIMessage["parts"][number] & {
  type: `tool-${string}`;
  state: string;
} {
  return typeof part.type === "string" && part.type.startsWith("tool-");
}

function extractPresentUiState(message: UIMessage): PresentUiState {
  let sawPresentUiBuilding = false;

  for (const part of message.parts) {
    if (part.type !== "tool-present_ui") {
      continue;
    }

    // Prefer fully executed tool output — never paint partial streamed input.
    if (part.state === "output-available" && part.output != null) {
      const blocks = parseUiBlocks(part.output);
      if (blocks.length > 0) {
        return { status: "ready", blocks };
      }
    }

    if (part.state === "input-available" && part.input != null) {
      const blocks = parseUiBlocks(part.input);
      if (blocks.length > 0) {
        return { status: "ready", blocks };
      }
    }

    if (
      part.state === "input-streaming" ||
      part.state === "input-available" ||
      part.state === "approval-requested" ||
      part.state === "approval-responded"
    ) {
      sawPresentUiBuilding = true;
    }
  }

  if (sawPresentUiBuilding) {
    return { status: "building" };
  }

  const hasOtherToolActivity = message.parts.some((part) => {
    if (!isToolPart(part) || part.type === "tool-present_ui") {
      return false;
    }
    // Only in-flight tool states — completed search outputs must not lock the UI.
    return part.state === "input-streaming" || part.state === "input-available";
  });

  if (hasOtherToolActivity) {
    return { status: "building" };
  }

  return { status: "none" };
}

function extractText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

const ComposingPlaceholder = ({ label }: { label: string }) => (
  <div className="flex min-h-16 flex-col gap-2" aria-live="polite" aria-busy>
    <Text variant="caption" className="text-neutral-500">
      {label}
    </Text>
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-3 w-3/5" />
    <Skeleton className="h-16 w-full" />
  </div>
);

export const MessageList = ({
  messages,
  locale,
  emptyLabel,
  thinkingLabel,
  onNavigate,
  onSendMessage,
  disabled = false,
  isBusy = false,
  scrollNonce = 0,
}: MessageListProps) => {
  const listRef = useScrollOnSubmit(scrollNonce, messages.length);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8">
        <Text variant="body2" className="text-center text-neutral-500">
          {emptyLabel}
        </Text>
      </div>
    );
  }

  const lastMessage = messages[messages.length - 1];

  return (
    <div
      ref={listRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          const text = extractText(message);
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-white">
                <Text
                  variant="body2"
                  className="whitespace-pre-wrap text-inherit"
                >
                  {text}
                </Text>
              </div>
            </div>
          );
        }

        const presentUi = extractPresentUiState(message);
        const fallbackText = extractText(message);
        const isLatestAssistant = message.id === lastMessage?.id;
        // Hold a stable placeholder until present_ui is complete — avoids
        // text ↔ partial-JSON ↔ components flicker while the model streams.
        const holdComposing =
          presentUi.status === "building" ||
          (isBusy && isLatestAssistant && presentUi.status !== "ready");

        return (
          <div key={message.id} className="flex justify-start">
            <div className="max-w-[95%] min-w-48 rounded-2xl bg-neutral-50 px-3 py-3">
              {presentUi.status === "ready" ? (
                <UiBlockRenderer
                  blocks={presentUi.blocks}
                  locale={locale}
                  onNavigate={onNavigate}
                  onSendMessage={onSendMessage}
                  disabled={disabled}
                />
              ) : holdComposing ? (
                <ComposingPlaceholder label={thinkingLabel} />
              ) : fallbackText ? (
                <Text
                  variant="body2"
                  className="whitespace-pre-wrap text-neutral-800"
                >
                  {fallbackText}
                </Text>
              ) : (
                <ComposingPlaceholder label={thinkingLabel} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
