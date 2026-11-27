import {
  convertToModelMessages,
  hasToolCall,
  isStepCount,
  streamText,
  type UIMessage,
} from 'ai';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { assistantModel } from '@/lib/assistant/model';
import { buildAssistantSystemPrompt } from '@/lib/assistant/system-prompt';
import { createAssistantTools } from '@/lib/assistant/tools';

export const maxDuration = 60;

export async function POST(req: Request) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return Response.json(
      { error: 'Sign in required to use the assistant.' },
      { status: 401 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'Assistant is unavailable. ANTHROPIC_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  const body = (await req.json()) as {
    messages?: UIMessage[];
    locale?: string;
  };

  const messages = body.messages ?? [];
  const rawLocale = body.locale ?? 'en';
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'en';

  const result = streamText({
    model: assistantModel,
    system: buildAssistantSystemPrompt(locale),
    messages: await convertToModelMessages(messages),
    tools: createAssistantTools(),
    stopWhen: [isStepCount(8), hasToolCall('present_ui')],
  });

  return result.toUIMessageStreamResponse();
}
