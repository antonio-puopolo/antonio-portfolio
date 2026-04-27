import { STAGES } from '@/types/db';

export function PipelinePage() {
  return (
    <div className="px-5 py-8 md:py-12">
      <header className="mb-8 max-w-3xl mx-auto md:mx-0 md:px-0">
        <p className="text-sm text-ink-muted">Pipeline</p>
        <h1 className="font-serif text-4xl text-ink mt-1">From first call to settled.</h1>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className="min-w-[260px] flex-1 snap-start"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-serif text-lg text-ink">{stage.label}</h2>
              <span className="text-xs text-ink-muted">0</span>
            </div>
            <div className="card p-4 min-h-[140px] text-sm text-ink-muted">
              Drag a property here.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
