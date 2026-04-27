import { useEffect, useRef, useState } from 'react';
import { useUpdateProperty } from '@/lib/queries';

type Props = { propertyId: string; value: string | null };

export function NotesEditor({ propertyId, value }: Props) {
  const [text, setText] = useState(value ?? '');
  const [saved, setSaved] = useState(true);
  const update = useUpdateProperty();
  const debounce = useRef<number | null>(null);

  useEffect(() => {
    setText(value ?? '');
    setSaved(true);
  }, [value, propertyId]);

  function onChange(next: string) {
    setText(next);
    setSaved(false);
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      void update
        .mutateAsync({ id: propertyId, patch: { notes: next } })
        .then(() => setSaved(true));
    }, 600);
  }

  useEffect(
    () => () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    },
    [],
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Anything to remember about this lead — partner's name, vendor motivation, kids at school, dog's name…"
        className="input resize-y min-h-[120px]"
      />
      <p className="mt-1 text-[11px] text-ink-muted text-right">
        {saved ? 'Saved' : 'Saving…'}
      </p>
    </div>
  );
}
