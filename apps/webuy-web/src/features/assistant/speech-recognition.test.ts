import { describe, expect, it } from 'vitest';
import {
  collectSpeechTranscript,
  joinSpeechTranscript,
  localeToSpeechLang,
  type SpeechRecognitionResultListLike,
} from '@/features/assistant/speech-recognition';

describe('localeToSpeechLang', () => {
  it('maps storefront locales to SpeechRecognition language tags', () => {
    expect(localeToSpeechLang('en')).toBe('en-US');
    expect(localeToSpeechLang('ko')).toBe('ko-KR');
    expect(localeToSpeechLang('id')).toBe('id-ID');
  });
});

describe('joinSpeechTranscript', () => {
  it('returns spoken text when the composer is empty', () => {
    expect(joinSpeechTranscript('', 'cheap laptops')).toBe('cheap laptops');
  });

  it('inserts a space between typed prefix and spoken text', () => {
    expect(joinSpeechTranscript('Show me', 'beauty products')).toBe(
      'Show me beauty products',
    );
  });

  it('avoids double spaces when the prefix already ends with whitespace', () => {
    expect(joinSpeechTranscript('Show me ', 'beauty products')).toBe(
      'Show me beauty products',
    );
  });

  it('keeps the prefix when speech is empty', () => {
    expect(joinSpeechTranscript('Show me', '   ')).toBe('Show me');
  });
});

describe('collectSpeechTranscript', () => {
  it('separates final and interim results', () => {
    const results = {
      length: 2,
      0: { isFinal: true, length: 1, 0: { transcript: 'Show me ' } },
      1: { isFinal: false, length: 1, 0: { transcript: 'laptops' } },
    } as SpeechRecognitionResultListLike;

    expect(collectSpeechTranscript(results)).toEqual({
      finalText: 'Show me',
      interimText: 'laptops',
    });
  });
});
