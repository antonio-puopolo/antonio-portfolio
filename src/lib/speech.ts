import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal Web Speech API typing — TS DOM lib doesn't ship with these by default.
type SpeechRecognitionResult = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResult };
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition() {
  const ctorRef = useRef<SpeechRecognitionCtor | null>(getRecognitionCtor());
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported = ctorRef.current !== null;

  const start = useCallback(() => {
    if (!ctorRef.current) {
      setError('Voice notes need a browser with Web Speech support (Chrome / Edge / Safari).');
      return;
    }
    setError(null);
    setTranscript('');

    const rec = new ctorRef.current();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-AU';

    rec.onresult = (e) => {
      let next = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        next += e.results[i][0].transcript;
      }
      setTranscript((prev) => (e.results[e.resultIndex]?.isFinal ? prev + next : prev + next));
    };
    rec.onend = () => setListening(false);
    rec.onerror = (ev) => {
      setError(ev.error || 'Voice capture failed');
      setListening(false);
    };

    recRef.current = rec;
    rec.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => recRef.current?.stop(), []);

  const reset = useCallback(() => setTranscript(''), []);

  return { supported, listening, transcript, error, start, stop, reset };
}
