'use client';

import { Button } from '@kiichan/design-system';
import type { ButtonBlock } from '@/features/assistant/schema';

interface AssistantButtonBlockProps {
  block: ButtonBlock;
  onNavigate: (href: string) => void;
  onSendMessage: (message: string) => void;
}

export const AssistantButtonBlock = ({
  block,
  onNavigate,
  onSendMessage,
}: AssistantButtonBlockProps) => {
  return (
    <Button
      type="button"
      variant={block.variant ?? 'primary'}
      onClick={() => {
        if (block.action.kind === 'navigate') {
          onNavigate(block.action.href);
          return;
        }
        onSendMessage(block.action.message);
      }}
    >
      {block.label}
    </Button>
  );
};
