'use client';

import { Button, Skeleton, Text, Textarea } from '@kiichan/design-system';
import type { ChatStatus, UIMessage } from 'ai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from '@/features/account/hooks/use-session';
import { LoginGate } from '@/features/assistant/components/login-gate';
import { MessageList } from '@/features/assistant/components/message-list';
import { WelcomeEmpty } from '@/features/assistant/components/welcome-empty';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

interface ChatPanelProps {
  locale: Locale;
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onNavigateAway?: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const ChatPanel = ({
  locale,
  messages,
  status,
  error,
  onSendMessage,
  onClearConversation,
  onNavigateAway,
  isExpanded,
  onToggleExpanded,
}: ChatPanelProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState('');
  const [scrollNonce, setScrollNonce] = useState(0);

  const isBusy = status === 'submitted' || status === 'streaming';
  const isSignedIn = Boolean(session.data);
  const canClear = isSignedIn && messages.length > 0 && !isBusy;
  const displayName =
    session.data?.firstName?.trim() ||
    session.data?.username?.trim() ||
    t.shell.assistantGuestName;

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy || !isSignedIn) {
      return;
    }
    onSendMessage(trimmed);
    setInput('');
    setScrollNonce((value) => value + 1);
  };

  const handleNavigate = (href: string) => {
    onNavigateAway?.();
    router.push(href);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-2 border-b border-neutral-100 px-4 py-3">
        <div className="min-w-0">
          <Text variant="subtitle1" className="text-neutral-900">
            {t.shell.assistantTitle}
          </Text>
          <Text variant="caption" className="text-neutral-500">
            {t.shell.assistantSubtitle}
          </Text>
        </div>
        <Button
          type="button"
          variant="ghost"
          isIconOnly
          leftIcon={isExpanded ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}
          aria-label={
            isExpanded ? t.shell.assistantCollapse : t.shell.assistantExpand
          }
          onClick={onToggleExpanded}
        />
      </div>

      {session.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-6">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !isSignedIn ? (
        <LoginGate locale={locale} onNavigateAway={onNavigateAway} />
      ) : messages.length === 0 && !isBusy ? (
        <WelcomeEmpty
          locale={locale}
          displayName={displayName}
          onSendMessage={handleSend}
          disabled={isBusy}
        />
      ) : (
        <MessageList
          messages={messages}
          locale={locale}
          emptyLabel={t.shell.assistantEmpty}
          thinkingLabel={t.shell.assistantThinking}
          onNavigate={handleNavigate}
          onSendMessage={handleSend}
          disabled={isBusy}
          isBusy={isBusy}
          scrollNonce={scrollNonce}
        />
      )}

      {error && isSignedIn ? (
        <div className="px-4 pb-2">
          <Text variant="caption" className="text-danger">
            {t.shell.assistantError}
          </Text>
        </div>
      ) : null}

      {isSignedIn ? (
        <>
          <div className="border-t border-neutral-100 px-3 pt-2">
            {canClear ? (
              <div className="mb-1 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  leftIcon="mdi:trash-can-outline"
                  onClick={onClearConversation}
                >
                  {t.shell.assistantClear}
                </Button>
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 px-3 pb-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend(input);
            }}
          >
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.shell.assistantPlaceholder}
              disabled={isBusy}
              minRows={1}
              maxRows={4}
              resize="none"
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend(input);
                }
              }}
            />
            <Button
              type="submit"
              variant="outline"
              isIconOnly
              leftIcon="mdi:send"
              aria-label={t.shell.assistantSend}
              disabled={isBusy || !input.trim()}
            />
          </form>
        </>
      ) : null}
    </div>
  );
};
