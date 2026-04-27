import { STAGES, type Stage } from '@/types/db';
import { cn } from '@/lib/cn';

const TONES: Record<Stage, string> = {
  new_lead: 'bg-bone-deep text-ink',
  nurturing: 'bg-bone-deep text-ink',
  lap_booked: 'bg-forest/15 text-forest',
  lap_done: 'bg-forest/15 text-forest',
  listing_signed: 'bg-forest text-bone',
  on_market: 'bg-forest text-bone',
  under_contract: 'bg-forest text-bone',
  sold: 'bg-ink text-bone',
  lost: 'bg-bone-deep text-ink-muted line-through',
};

export function StageBadge({ stage, className }: { stage: Stage; className?: string }) {
  const label = STAGES.find((s) => s.id === stage)?.label ?? stage;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase',
        TONES[stage],
        className,
      )}
    >
      {label}
    </span>
  );
}
