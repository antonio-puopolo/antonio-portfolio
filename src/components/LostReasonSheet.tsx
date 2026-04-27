import { useState } from 'react';
import { Sheet } from './Sheet';
import { LOST_REASONS, type LostReason } from '@/types/db';
import { useUpdateProperty } from '@/lib/queries';

type Props = {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  initialReason?: LostReason | null;
  initialNote?: string | null;
  // When called from a stage change, also flips stage to 'lost'.
  withStageChange?: boolean;
};

export function LostReasonSheet({
  open,
  onClose,
  propertyId,
  initialReason,
  initialNote,
  withStageChange,
}: Props) {
  const update = useUpdateProperty();
  const [reason, setReason] = useState<LostReason>(initialReason ?? 'listed_with_another_agent');
  const [note, setNote] = useState(initialNote ?? '');

  async function save() {
    await update.mutateAsync({
      id: propertyId,
      patch: {
        lost_reason: reason,
        lost_note: note.trim() || null,
        ...(withStageChange ? { stage: 'lost' as const } : {}),
      },
    });
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={withStageChange ? 'Mark as lost' : 'Edit lost reason'}
      footer={
        <button
          type="button"
          onClick={save}
          disabled={update.isPending}
          className="btn-primary w-full"
        >
          {update.isPending ? 'Saving…' : 'Save'}
        </button>
      }
    >
      <p className="text-sm text-ink-muted mb-4">
        Helps you spot patterns later — why didn't this one land?
      </p>

      <div className="space-y-2 mb-4">
        {LOST_REASONS.map((r) => (
          <label
            key={r.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer ${
              reason === r.id
                ? 'border-forest bg-forest/5'
                : 'border-bone-deep hover:bg-bone-warm'
            }`}
          >
            <input
              type="radio"
              name="lost-reason"
              value={r.id}
              checked={reason === r.id}
              onChange={() => setReason(r.id)}
              className="accent-forest"
            />
            <span className="text-sm text-ink">{r.label}</span>
          </label>
        ))}
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-ink-muted mb-1.5">
          Note (optional)
        </span>
        <textarea
          rows={3}
          className="input resize-y"
          placeholder="Anything else worth remembering"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
    </Sheet>
  );
}
