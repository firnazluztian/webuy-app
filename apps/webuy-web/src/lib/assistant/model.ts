import { anthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';

export const assistantModel: LanguageModel = anthropic('claude-haiku-4-5');
