'use client';

import { AssistantAccordionBlock } from '@/features/assistant/components/blocks/accordion-block';
import { AssistantButtonBlock } from '@/features/assistant/components/blocks/button-block';
import { AssistantChipsBlock } from '@/features/assistant/components/blocks/chips-block';
import { AssistantProductCardsBlock } from '@/features/assistant/components/blocks/product-cards-block';
import { AssistantTextBlock } from '@/features/assistant/components/blocks/text-block';
import type { UiBlock } from '@/features/assistant/schema';
import type { Locale } from '@/i18n/types';

interface UiBlockRendererProps {
  blocks: UiBlock[];
  locale: Locale;
  onNavigate: (href: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

function blockKey(block: UiBlock, index: number): string {
  switch (block.type) {
    case 'text':
      return `text-${index}-${block.content.slice(0, 24)}`;
    case 'button':
      return `button-${index}-${block.label}`;
    case 'productCards':
      return `products-${block.products.map((product) => product.id).join('-')}`;
    case 'accordion':
      return `accordion-${index}-${block.items.length}`;
    case 'chips':
      return `chips-${index}-${block.items.map((item) => item.label).join('-')}`;
    default:
      return `block-${index}`;
  }
}

export const UiBlockRenderer = ({
  blocks,
  locale,
  onNavigate,
  onSendMessage,
  disabled = false,
}: UiBlockRendererProps) => {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        const key = blockKey(block, index);

        switch (block.type) {
          case 'text':
            return <AssistantTextBlock key={key} block={block} />;
          case 'button':
            return (
              <AssistantButtonBlock
                key={key}
                block={block}
                onNavigate={onNavigate}
                onSendMessage={onSendMessage}
              />
            );
          case 'productCards':
            return (
              <AssistantProductCardsBlock
                key={key}
                block={block}
                locale={locale}
                onNavigate={onNavigate}
              />
            );
          case 'accordion':
            return <AssistantAccordionBlock key={key} block={block} />;
          case 'chips':
            return (
              <AssistantChipsBlock
                key={key}
                block={block}
                onSendMessage={onSendMessage}
                disabled={disabled}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
