import type { Locale } from '@/i18n/types';

/** Minimal Web Speech API surface — DOM lib coverage is incomplete across targets. */
export interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

export interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

export interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
}

export interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

export interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string;
}

export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: ((event: Event) => void) | null;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

const SPEECH_LANG_BY_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  id: 'id-ID',
};

export function localeToSpeechLang(locale: Locale): string {
  return SPEECH_LANG_BY_LOCALE[locale];
}

export function getSpeechRecognitionConstructor():
  | SpeechRecognitionConstructor
  | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

export function joinSpeechTranscript(
  prefix: string,
  spoken: string,
): string {
  const trimmedSpoken = spoken.trim();
  if (!trimmedSpoken) {
    return prefix;
  }
  if (!prefix) {
    return trimmedSpoken;
  }
  if (prefix.endsWith(' ') || prefix.endsWith('\n')) {
    return `${prefix}${trimmedSpoken}`;
  }
  return `${prefix} ${trimmedSpoken}`;
}

export function collectSpeechTranscript(
  results: SpeechRecognitionResultListLike,
): { finalText: string; interimText: string } {
  const finals: string[] = [];
  const interims: string[] = [];

  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    const transcript = result[0]?.transcript ?? '';
    if (!transcript) {
      continue;
    }
    if (result.isFinal) {
      finals.push(transcript);
    } else {
      interims.push(transcript);
    }
  }

  return {
    finalText: finals.join('').trim(),
    interimText: interims.join('').trim(),
  };
}
