import { useState } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { Moon } from 'lucide-react';
import { useUpdateProperty } from '@/lib/queries';
import { cn } from '@/lib/cn';

const OPTIONS = [
  { label: 'Tomorrow', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
];

export function SnoozeButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const update = useUpdateProperty();

  function snooze(days: number) {
    const d = startOfDay(addDays(new Date(), days));
    d.setHours(9, 0, 0, 0);
    void update.mutate({
      id: propertyId,
      patch: { next_follow_up_at: d.toISOString() },
    });
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-bone-deep px-3 py-1.5 text-xs font-medium hover:bg-ink/5',
          open && 'bg-ink/5',
        )}
        aria-label="Snooze"
      >
        <Moon className="h-3.5 w-3.5" />
        Snooze
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-2 right-0 w-40 card p-1.5">
            {OPTIONS.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => snooze(o.days)}
                className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-ink/5"
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
