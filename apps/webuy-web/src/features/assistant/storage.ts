import type { UIMessage } from 'ai';

export const ASSISTANT_CHAT_STORAGE_KEY = 'webuy-assistant-chat-v1';

export function loadAssistantMessages(): UIMessage[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ASSISTANT_CHAT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as UIMessage[];
  } catch {
    return [];
  }
}

export function saveAssistantMessages(messages: UIMessage[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(
    ASSISTANT_CHAT_STORAGE_KEY,
    JSON.stringify(messages),
  );
}

export function clearAssistantMessages(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ASSISTANT_CHAT_STORAGE_KEY);
}
