import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { STAGES, type Stage } from '@/types/db';
import { StageBadge } from './StageBadge';

type Props = {
  value: Stage;
  onChange: (next: Stage) => void;
  disabled?: boolean;
};

export function StagePicker({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-bone-deep px-3 py-1.5 text-sm hover:bg-ink/5"
      >
        <StageBadge stage={value} />
        <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close stage menu"
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-56 card p-1.5 right-0">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-ink/5',
                  s.id === value && 'bg-ink/5',
                )}
              >
                <span>{s.label}</span>
                {s.id === value && <Check className="h-4 w-4 text-forest" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
