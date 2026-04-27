import { useState } from 'react';
import { addDays, format, startOfDay } from 'date-fns';
import { CalendarClock, Bell, BellOff, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  value: string | null;
  onChange: (nextIso: string | null) => void;
  disabled?: boolean;
};

const QUICK = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: '3d', days: 3 },
  { label: '1w', days: 7 },
  { label: '2w', days: 14 },
];

function atNineAm(d: Date): string {
  const x = startOfDay(d);
  x.setHours(9, 0, 0, 0);
  return x.toISOString();
}

export function FollowUpControl({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(value ? value.slice(0, 10) : '');

  const date = value ? new Date(value) : null;
  const label = date ? format(date, 'EEE d MMM') : 'No follow-up';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-bone-deep px-3 py-1.5 text-sm hover:bg-ink/5',
          !date && 'text-ink-muted',
        )}
      >
        <CalendarClock className="h-3.5 w-3.5" />
        {label}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-72 card p-3 right-0">
            <p className="text-xs font-medium text-ink-muted px-1 mb-2">Quick</p>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {QUICK.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => {
                    onChange(atNineAm(addDays(new Date(), q.days)));
                    setOpen(false);
                  }}
                  className="rounded-lg px-2 py-2 text-xs font-medium bg-bone-warm hover:bg-bone-deep text-ink"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-ink-muted px-1 mb-2">Custom date</p>
            <div className="flex gap-2">
              <input
                type="date"
                className="input flex-1 py-2"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
              <button
                type="button"
                disabled={!custom}
                onClick={() => {
                  if (!custom) return;
                  onChange(atNineAm(new Date(custom)));
                  setOpen(false);
                }}
                className="rounded-full bg-ink text-bone p-2 disabled:opacity-50"
                aria-label="Set custom date"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onChange(null);
                setCustom('');
                setOpen(false);
              }}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 text-xs text-ink-muted hover:text-ink py-2"
            >
              {value ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
              Clear follow-up
            </button>
          </div>
        </>
      )}
    </div>
  );
}
