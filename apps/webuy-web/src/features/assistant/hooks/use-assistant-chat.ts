'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  clearAssistantMessages,
  loadAssistantMessages,
  saveAssistantMessages,
} from '@/features/assistant/storage';
import type { Locale } from '@/i18n/types';
import { getStoredToken } from '@/lib/commerce-api';

export function useAssistantChat(locale: Locale) {
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const [initialMessages] = useState<UIMessage[]>(() => loadAssistantMessages());

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        headers: () => {
          const token = getStoredToken();
          const headers: Record<string, string> = {};
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
          return headers;
        },
        body: () => ({
          locale: localeRef.current,
        }),
      }),
    [],
  );

  const chat = useChat({
    id: 'webuy-assistant',
    transport,
    messages: initialMessages,
  });

  useEffect(() => {
    saveAssistantMessages(chat.messages);
  }, [chat.messages]);

  const clearConversation = () => {
    chat.setMessages([]);
    clearAssistantMessages();
  };

  return {
    ...chat,
    clearConversation,
  };
}
