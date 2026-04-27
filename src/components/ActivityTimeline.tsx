import { formatDistanceToNow } from 'date-fns';
import {
  Phone,
  MessageSquare,
  Mail,
  CalendarCheck,
  StickyNote,
  Mic,
  ArrowRight,
} from 'lucide-react';
import {
  CALL_OUTCOMES,
  STAGES,
  type ActivityKind,
  type ActivityRow,
} from '@/types/db';

const ICONS: Record<ActivityKind, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  sms: MessageSquare,
  email: Mail,
  inspection: CalendarCheck,
  note: StickyNote,
  voice: Mic,
  stage_change: ArrowRight,
};

function outcomeLabel(o: string | null): string | null {
  if (!o) return null;
  return CALL_OUTCOMES.find((c) => c.id === o)?.short ?? o;
}

function stageLabel(s: string | null): string {
  if (!s) return '—';
  return STAGES.find((x) => x.id === s)?.label ?? s;
}

export function ActivityTimeline({ activities }: { activities: ActivityRow[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Nothing logged yet. Calls, notes, and stage changes show up here.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4">
      <span className="absolute left-3 top-2 bottom-2 w-px bg-bone-deep" aria-hidden />
      {activities.map((a) => {
        const Icon = ICONS[a.kind] ?? StickyNote;
        return (
          <li key={a.id} className="relative pl-9">
            <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-bone-warm border border-bone-deep">
              <Icon className="h-3.5 w-3.5 text-ink-muted" />
            </span>
            <p className="text-xs text-ink-muted">
              {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
            </p>
            <p className="text-sm text-ink mt-0.5">
              {summarise(a)}
            </p>
            {a.body && a.kind !== 'stage_change' && (
              <p className="mt-1 text-sm text-ink-soft whitespace-pre-wrap">{a.body}</p>
            )}
          </li>
        );
      })}
    </ol>
  );

  function summarise(a: ActivityRow): string {
    switch (a.kind) {
      case 'call':
        return `Call · ${outcomeLabel(a.outcome) ?? 'logged'}`;
      case 'sms':
        return 'SMS';
      case 'email':
        return 'Email';
      case 'inspection':
        return 'Inspection';
      case 'note':
        return 'Note';
      case 'voice':
        return 'Voice note';
      case 'stage_change':
        return `${stageLabel(a.from_stage)} → ${stageLabel(a.to_stage)}`;
    }
  }
}
