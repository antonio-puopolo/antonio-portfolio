import { useMemo } from 'react';
import { addDays, isAfter, isBefore, isToday, startOfDay } from 'date-fns';
import { CalendarX2, ListTodo } from 'lucide-react';
import { useProperties, type PropertyWithContacts } from '@/lib/queries';
import { PropertyCard } from '@/components/PropertyCard';
import { useQuickAdd } from '@/components/QuickAddContext';

type Bucket = 'overdue' | 'today' | 'week';

function bucketise(properties: PropertyWithContacts[]): Record<Bucket, PropertyWithContacts[]> {
  const todayStart = startOfDay(new Date());
  const weekEnd = addDays(todayStart, 7);

  const overdue: PropertyWithContacts[] = [];
  const today: PropertyWithContacts[] = [];
  const week: PropertyWithContacts[] = [];

  for (const p of properties) {
    if (!p.next_follow_up_at) continue;
    const d = new Date(p.next_follow_up_at);
    if (isToday(d)) {
      today.push(p);
    } else if (isBefore(d, todayStart)) {
      overdue.push(p);
    } else if (isAfter(d, todayStart) && isBefore(d, weekEnd)) {
      week.push(p);
    }
  }

  const byDate = (a: PropertyWithContacts, b: PropertyWithContacts) =>
    new Date(a.next_follow_up_at!).getTime() - new Date(b.next_follow_up_at!).getTime();

  return {
    overdue: overdue.sort(byDate),
    today: today.sort(byDate),
    week: week.sort(byDate),
  };
}

export function TodayPage() {
  const { data, isLoading, error } = useProperties();
  const quickAdd = useQuickAdd();
  const buckets = useMemo(() => bucketise(data ?? []), [data]);

  const totalActive = buckets.overdue.length + buckets.today.length + buckets.week.length;
  const hasAnyProperty = (data?.length ?? 0) > 0;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <header className="mb-8">
        <p className="text-sm text-ink-muted">Today</p>
        <h1 className="font-serif text-4xl text-ink mt-1">
          {totalActive === 0 ? 'All caught up.' : 'Who needs a call.'}
        </h1>
      </header>

      {isLoading && (
        <p className="text-sm text-ink-muted">Loading your leads…</p>
      )}

      {error && (
        <p className="text-sm text-urgent-overdue">Could not load leads.</p>
      )}

      {!isLoading && !hasAnyProperty && (
        <div className="card p-8 text-center">
          <ListTodo className="h-8 w-8 mx-auto text-ink-muted" />
          <h2 className="font-serif text-xl text-ink mt-3">No leads yet.</h2>
          <p className="text-sm text-ink-muted mt-2">
            Add the first one — address and phone is enough.
          </p>
          <button type="button" onClick={quickAdd.open} className="btn-primary mt-5">
            Add a lead
          </button>
        </div>
      )}

      {!isLoading && hasAnyProperty && totalActive === 0 && (
        <div className="card p-8 text-center">
          <CalendarX2 className="h-8 w-8 mx-auto text-forest" />
          <h2 className="font-serif text-xl text-ink mt-3">Nothing due.</h2>
          <p className="text-sm text-ink-muted mt-2">
            Set a follow-up date on a property and it'll appear here.
          </p>
        </div>
      )}

      {hasAnyProperty && totalActive > 0 && (
        <div className="space-y-8">
          <Stack title="Overdue" tone="overdue" items={buckets.overdue} />
          <Stack title="Today" tone="today" items={buckets.today} />
          <Stack title="This week" tone="future" items={buckets.week} />
        </div>
      )}
    </div>
  );
}

function Stack({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'overdue' | 'today' | 'future';
  items: PropertyWithContacts[];
}) {
  if (items.length === 0) return null;

  const dot = {
    overdue: 'bg-urgent-overdue',
    today: 'bg-urgent-today',
    future: 'bg-urgent-future',
  }[tone];

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className={`urgency-dot ${dot}`} aria-hidden />
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        <span className="text-xs text-ink-muted">{items.length}</span>
      </div>
      <div className="grid gap-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
