import { useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSpeechRecognition } from '@/lib/speech';
import { useCreateActivity } from '@/lib/queries';

type Props = { propertyId: string };

export function VoiceNoteButton({ propertyId }: Props) {
  const { supported, listening, transcript, error, start, stop, reset } =
    useSpeechRecognition();
  const create = useCreateActivity();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Once recording stops with text, persist the activity.
  useEffect(() => {
    if (!listening && transcript.trim().length > 0) {
      void (async () => {
        await create.mutateAsync({
          property_id: propertyId,
          kind: 'voice',
          transcript: transcript.trim(),
          body: transcript.trim(),
        });
        setSavedAt(Date.now());
        reset();
      })();
    }
  }, [listening, transcript, propertyId, create, reset]);

  // Clear "saved" flash after a moment.
  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(null), 2000);
    return () => clearTimeout(t);
  }, [savedAt]);

  if (!supported) {
    return (
      <p className="text-xs text-ink-muted">
        Voice notes need Chrome / Edge / Safari.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={listening ? stop : start}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
          listening
            ? 'bg-urgent-overdue text-bone animate-pulse'
            : 'bg-forest text-bone hover:bg-forest-deep',
        )}
      >
        {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {listening ? 'Stop' : 'Voice note'}
      </button>

      {listening && transcript && (
        <p className="mt-3 text-sm text-ink-muted italic">{transcript}</p>
      )}

      {error && <p className="mt-2 text-xs text-urgent-overdue">{error}</p>}
      {savedAt && (
        <p className="mt-2 text-xs text-forest">Saved.</p>
      )}
    </div>
  );
}
