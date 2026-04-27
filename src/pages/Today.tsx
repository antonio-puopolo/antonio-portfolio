export function TodayPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <header className="mb-8">
        <p className="text-sm text-ink-muted">Today</p>
        <h1 className="font-serif text-4xl text-ink mt-1">Who needs a call.</h1>
      </header>

      <section className="space-y-8">
        <Stack title="Overdue" tone="overdue" />
        <Stack title="Today" tone="today" />
        <Stack title="This week" tone="future" />
      </section>
    </div>
  );
}

function Stack({ title, tone }: { title: string; tone: 'overdue' | 'today' | 'future' }) {
  const dot = {
    overdue: 'bg-urgent-overdue',
    today: 'bg-urgent-today',
    future: 'bg-urgent-future',
  }[tone];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`urgency-dot ${dot}`} aria-hidden />
        <h2 className="font-serif text-xl text-ink">{title}</h2>
      </div>
      <div className="card p-6 text-sm text-ink-muted">
        Nothing here yet — leads you add will appear once they have a follow-up date.
      </div>
    </div>
  );
}
