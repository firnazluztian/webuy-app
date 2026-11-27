"use client";

import { Button, Dialog, Popover } from "@kiichan/design-system";
import { useState } from "react";
import { ChatPanel } from "@/features/assistant/components/chat-panel";
import { useAssistantChat } from "@/features/assistant/hooks/use-assistant-chat";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { Locale } from "@/i18n/types";

interface AssistantFabProps {
  locale: Locale;
}

export const AssistantFab = ({ locale }: AssistantFabProps) => {
  const t = useTranslations(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, sendMessage, status, error, clearConversation } =
    useAssistantChat(locale);

  const closeAll = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const handleToggleExpanded = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setIsOpen(true);
      return;
    }
    setIsExpanded(true);
    setIsOpen(true);
  };

  const panelProps = {
    locale,
    messages,
    status,
    error,
    isExpanded,
    onToggleExpanded: handleToggleExpanded,
    onClearConversation: clearConversation,
    onSendMessage: (text: string) => {
      void sendMessage({ text });
    },
    onNavigateAway: closeAll,
  } as const;

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
        <Popover
          placement="top-end"
          variant="elevated"
          color="light"
          backdrop="blur"
          isDismissable
          shouldBlockScroll
          offset={12}
          isOpen={isOpen && !isExpanded}
          onOpenChange={(open) => {
            if (isExpanded) {
              return;
            }
            setIsOpen(open);
          }}
          className="max-w-2xl w-full overflow-hidden p-0 m-0 rounded-lg"
          content={
            <div className="flex h-[min(70vh,560px)] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden sm:w-md">
              <ChatPanel {...panelProps} />
            </div>
          }
        >
          <Button
            type="button"
            variant="primary"
            isIconOnly
            leftIcon="mdi:robot-outline"
            className="h-10 shadow-lg"
            aria-label={t.shell.assistantOpen}
            onClick={() => {
              if (isExpanded) {
                closeAll();
              }
            }}
          />
        </Popover>
      </div>

      <Dialog
        isOpen={isOpen && isExpanded}
        onClose={closeAll}
        backdrop="blur"
        closeOnBackdropClick
        scrollBehavior="inside"
        position="right"
        sizeClassName="h-full max-h-none w-full max-w-md sm:max-w-lg"
        className="flex h-full flex-col overflow-hidden p-0"
      >
        <ChatPanel {...panelProps} />
      </Dialog>
    </>
  );
};
