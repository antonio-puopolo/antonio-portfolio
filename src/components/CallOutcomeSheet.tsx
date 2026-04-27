import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sheet } from './Sheet';
import {
  useCreateActivity,
  useUpdateProperty,
} from '@/lib/queries';
import { supabase } from '@/lib/supabase';
import { CALL_OUTCOMES, type CallOutcome } from '@/types/db';
import { nextFollowUpForOutcome } from '@/lib/cadence';

type Props = {
  open: boolean;
  onClose: () => void;
  propertyId: string;
};

function useCallCount(propertyId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['call-count', propertyId],
    enabled,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('activities')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('kind', 'call');
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function CallOutcomeSheet({ open, onClose, propertyId }: Props) {
  const calls = useCallCount(propertyId, open);
  const createActivity = useCreateActivity();
  const updateProperty = useUpdateProperty();

  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState<CallOutcome | null>(null);

  useEffect(() => {
    if (!open) {
      setNote('');
      setSubmitting(null);
    }
  }, [open]);

  async function pick(outcome: CallOutcome) {
    setSubmitting(outcome);
    try {
      await createActivity.mutateAsync({
        property_id: propertyId,
        kind: 'call',
        outcome,
        body: note.trim() || null,
      });

      const touches = (calls.data ?? 0) + 1;
      const { next, clearFollowUp } = nextFollowUpForOutcome(outcome, touches);

      const patch: { next_follow_up_at?: string | null; stage?: 'lap_booked' } = {};
      if (clearFollowUp) patch.next_follow_up_at = null;
      else if (next) patch.next_follow_up_at = next.toISOString();
      if (outcome === 'booked_lap') patch.stage = 'lap_booked';

      if (Object.keys(patch).length > 0) {
        await updateProperty.mutateAsync({ id: propertyId, patch });
      }

      onClose();
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="How did the call go?">
      <p className="text-sm text-ink-muted mb-4">
        One tap. We'll log the call and set your next follow-up.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {CALL_OUTCOMES.map((o) => {
          const isPrimary = o.id === 'booked_lap' || o.id === 'spoke';
          return (
            <button
              key={o.id}
              type="button"
              disabled={submitting !== null}
              onClick={() => void pick(o.id)}
              className={
                isPrimary
                  ? 'rounded-2xl bg-forest text-bone py-4 text-sm font-medium hover:bg-forest-deep disabled:opacity-50 transition-colors'
                  : 'rounded-2xl bg-bone-warm text-ink py-4 text-sm font-medium hover:bg-bone-deep disabled:opacity-50 transition-colors'
              }
            >
              {submitting === o.id ? 'Saving…' : o.label}
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-ink-muted mb-1.5">
          Note (optional)
        </span>
        <textarea
          rows={3}
          className="input resize-y"
          placeholder="Anything they said worth remembering"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
    </Sheet>
  );
}
