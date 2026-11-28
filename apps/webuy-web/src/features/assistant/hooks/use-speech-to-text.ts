'use client';

import { useEffect, useRef, useState } from 'react';
import {
  collectSpeechTranscript,
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
  joinSpeechTranscript,
  localeToSpeechLang,
  type SpeechRecognitionLike,
} from '@/features/assistant/speech-recognition';
import type { Locale } from '@/i18n/types';

export type SpeechToTextError = 'permission' | 'unavailable' | 'failed';

interface UseSpeechToTextOptions {
  locale: Locale;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

interface UseSpeechToTextResult {
  isSupported: boolean;
  isListening: boolean;
  error: SpeechToTextError | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export function useSpeechToText({
  locale,
  value,
  onValueChange,
  disabled = false,
}: UseSpeechToTextOptions): UseSpeechToTextResult {
  const [isSupported] = useState(() => isSpeechRecognitionSupported());
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechToTextError | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prefixRef = useRef('');
  const finalTextRef = useRef('');
  const valueRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);
  const localeRef = useRef(locale);
  const disabledRef = useRef(disabled);

  valueRef.current = value;
  onValueChangeRef.current = onValueChange;
  localeRef.current = locale;
  disabledRef.current = disabled;

  const stop = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setIsListening(false);
      return;
    }
    recognition.stop();
  };

  const start = () => {
    if (disabledRef.current || !isSupported || recognitionRef.current) {
      return;
    }

    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      setError('unavailable');
      return;
    }

    setError(null);
    prefixRef.current = valueRef.current;
    finalTextRef.current = '';

    const recognition = new Recognition();
    recognition.lang = localeToSpeechLang(localeRef.current);
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const { finalText, interimText } = collectSpeechTranscript(event.results);
      if (finalText) {
        finalTextRef.current = finalText;
      }
      const spoken = [finalTextRef.current, interimText]
        .filter(Boolean)
        .join(' ');
      onValueChangeRef.current(
        joinSpeechTranscript(prefixRef.current, spoken),
      );
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('permission');
      } else if (event.error === 'aborted') {
        // Programmatic stop — ignore.
      } else if (event.error !== 'no-speech') {
        setError('failed');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setError('failed');
    }
  };

  const toggle = () => {
    if (recognitionRef.current) {
      stop();
      return;
    }
    start();
  };

  useEffect(() => {
    if (!disabled) {
      return;
    }
    recognitionRef.current?.stop();
  }, [disabled]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  return {
    isSupported,
    isListening,
    error,
    start,
    stop,
    toggle,
  };
}
