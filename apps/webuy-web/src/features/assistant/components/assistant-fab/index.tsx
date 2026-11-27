'use client';

import { Button, Dialog, Popover } from '@kiichan/design-system';
import { Mascot } from 'page-mascot';
import { useEffect, useState } from 'react';
import { ChatPanel } from '@/features/assistant/components/chat-panel';
import { useAssistantChat } from '@/features/assistant/hooks/use-assistant-chat';
import {
  loadAssistantBubbleDismissed,
  saveAssistantBubbleDismissed,
} from '@/features/assistant/storage';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

const MASCOT_SIZE = 140;
const KIICHAN_DIRECTIONS = '/mascots/kiichan-directions.webp';
const KIICHAN_REACTIONS = '/mascots/kiichan-reactions.webp';

interface AssistantFabProps {
  locale: Locale;
}

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

export const AssistantFab = ({ locale }: AssistantFabProps) => {
  const t = useTranslations(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // Start hidden to avoid SSR/client mismatch; reveal after hydrate if not dismissed.
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const { messages, sendMessage, status, error, clearConversation } =
    useAssistantChat(locale);

  const closeAll = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const dismissBubble = () => {
    setIsBubbleVisible(false);
    saveAssistantBubbleDismissed();
  };

  useEffect(() => {
    if (!loadAssistantBubbleDismissed()) {
      setIsBubbleVisible(true);
    }
  }, []);

  // Dialog locks body via overflow=hidden and only restores after its exit
  // timeout — collapsing to popover / clearing that timer can leave scroll stuck.
  useEffect(() => {
    if (isOpen && isExpanded) {
      return;
    }
    unlockBodyScroll();
  }, [isOpen, isExpanded]);

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
      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
        {isBubbleVisible ? (
          <div
            className="kiichan-bubble-in relative mb-2 max-w-54 cursor-pointer rounded-2xl bg-white px-3.5 py-2.5 text-left shadow-[0_10px_28px_-16px_rgba(12,18,34,0.35)] ring-1 ring-gray-200 sm:max-w-60"
            onClick={dismissBubble}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                {t.shell.assistantBubbleSays}
              </p>
              <Button
                type="button"
                variant="ghost"
                isIconOnly
                leftIcon="mdi:close"
                aria-label={t.shell.assistantBubbleClose}
                className="-mr-1 -mt-1 min-w-0 shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  dismissBubble();
                }}
              />
            </div>
            <p className="mt-1 text-sm leading-snug text-dark">
              {t.shell.assistantBubbleMessage}
            </p>
            <span
              aria-hidden
              className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-8 border-x-transparent border-t-white drop-shadow-[0_1px_0_#e5e7eb]"
            />
          </div>
        ) : null}

        <Popover
          placement="top-end"
          variant="elevated"
          color="light"
          backdrop="blur"
          isDismissable
          shouldCloseOnScroll={false}
          offset={12}
          triggerScaleOnOpen={false}
          zIndex={60}
          isOpen={isOpen && !isExpanded}
          onOpenChange={(open) => {
            if (isExpanded) {
              if (!open) {
                closeAll();
              }
              return;
            }
            setIsOpen(open);
          }}
          className="m-0 max-w-2xl w-full overflow-hidden rounded-lg p-0"
          content={
            <div className="flex h-[min(70vh,560px)] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden sm:w-md">
              <ChatPanel {...panelProps} />
            </div>
          }
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={t.shell.assistantOpen}
            aria-expanded={isOpen}
            className="cursor-pointer outline-none"
            onClick={() => {
              if (isExpanded) {
                closeAll();
              }
            }}
            onKeyDown={(event) => {
              if (!isExpanded) {
                return;
              }
              if (event.key !== 'Enter' && event.key !== ' ') {
                return;
              }
              event.preventDefault();
              closeAll();
            }}
          >
            {/* Mascot is a <button>; disable pointer events so the trigger owns press/dismiss. */}
            <div className="kiichan-float pointer-events-none">
              <Mascot
                directions={KIICHAN_DIRECTIONS}
                reactions={KIICHAN_REACTIONS}
                size={MASCOT_SIZE}
                label={t.shell.assistantOpen}
              />
            </div>
          </div>
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
