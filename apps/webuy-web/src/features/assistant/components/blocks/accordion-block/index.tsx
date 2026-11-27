'use client';

import { Accordion } from '@kiichan/design-system';
import type { AccordionBlock } from '@/features/assistant/schema';

export const AssistantAccordionBlock = ({
  block,
}: {
  block: AccordionBlock;
}) => {
  return (
    <Accordion
      items={block.items.map((item, index) => ({
        id: `assistant-accordion-${index}`,
        title: item.title,
        content: item.content,
      }))}
      variant="light"
      borderless
    />
  );
};
