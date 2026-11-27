import { Text } from '@kiichan/design-system';
import type { TextBlock } from '@/features/assistant/schema';

export const AssistantTextBlock = ({ block }: { block: TextBlock }) => {
  return (
    <Text variant="body2" className="whitespace-pre-wrap text-neutral-800">
      {block.content}
    </Text>
  );
};
