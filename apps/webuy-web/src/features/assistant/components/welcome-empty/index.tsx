'use client';

import { Button, Text } from '@kiichan/design-system';
import {
  getWelcomeGreeting,
  WELCOME_SUGGESTIONS,
} from '@/features/assistant/welcome';
import type { Locale } from '@/i18n/types';

interface WelcomeEmptyProps {
  locale: Locale;
  displayName: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const WelcomeEmpty = ({
  locale,
  displayName,
  onSendMessage,
  disabled = false,
}: WelcomeEmptyProps) => {
  const suggestions = WELCOME_SUGGESTIONS[locale];

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-5 px-4 py-6">
      <div className="flex flex-col gap-2">
        <Text variant="subtitle1" className="text-neutral-900">
          {getWelcomeGreeting(locale, displayName)}
        </Text>
        <Text variant="body2" className="text-neutral-600">
          {locale === 'ko'
            ? '아래에서 골라 시작하거나 직접 질문해 보세요.'
            : locale === 'id'
              ? 'Pilih salah satu di bawah, atau ketik pertanyaan Anda.'
              : 'Pick a suggestion below, or type your own question.'}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.label}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onSendMessage(suggestion.message)}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
