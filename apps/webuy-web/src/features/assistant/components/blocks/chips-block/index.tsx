'use client';

import { Button } from '@kiichan/design-system';
import type { ChipsBlock } from '@/features/assistant/schema';

interface AssistantChipsBlockProps {
  block: ChipsBlock;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const AssistantChipsBlock = ({
  block,
  onSendMessage,
  disabled = false,
}: AssistantChipsBlockProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {block.items.map((item) => (
        <Button
          key={`${item.label}-${item.message}`}
          type="button"
          variant="outline"
          disabled={disabled}
          leftIcon="mdi:chat-outline"
          onClick={() => onSendMessage(item.message)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
