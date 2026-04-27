import { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useProperties, useUpdateProperty, type PropertyWithContacts } from '@/lib/queries';
import { PropertyCard } from '@/components/PropertyCard';
import { STAGES, type Stage } from '@/types/db';
import { cn } from '@/lib/cn';

export function PipelinePage() {
  const { data, isLoading } = useProperties();
  const update = useUpdateProperty();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s.id, [] as PropertyWithContacts[]])) as Record<
      Stage,
      PropertyWithContacts[]
    >;
    for (const p of data ?? []) map[p.stage].push(p);
    return map;
  }, [data]);

  const dragging = useMemo(
    () => (data ?? []).find((p) => p.id === draggingId) ?? null,
    [data, draggingId],
  );

  function onDragEnd(e: DragEndEvent) {
    setDraggingId(null);
    const id = e.active.id as string;
    const overId = e.over?.id as Stage | undefined;
    if (!overId) return;
    if (!STAGES.some((s) => s.id === overId)) return;
    const property = (data ?? []).find((p) => p.id === id);
    if (!property || property.stage === overId) return;
    void update.mutate({ id, patch: { stage: overId } });
  }

  return (
    <div className="px-5 py-8 md:py-10">
      <header className="mb-6 max-w-3xl">
        <p className="text-sm text-ink-muted">Pipeline</p>
        <h1 className="font-serif text-4xl text-ink mt-1">From first call to settled.</h1>
        <p className="text-sm text-ink-muted mt-2 hidden md:block">
          Drag a card between columns to move it. On mobile, open a property and use the stage picker.
        </p>
      </header>

      {isLoading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={(e) => setDraggingId(e.active.id as string)}
          onDragCancel={() => setDraggingId(null)}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x">
            {STAGES.map((stage) => (
              <Column key={stage.id} stage={stage.id} label={stage.label} items={byStage[stage.id]} />
            ))}
          </div>

          <DragOverlay>
            {dragging && (
              <div className="rotate-2">
                <PropertyCard property={dragging} compact />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

function Column({
  stage,
  label,
  items,
}: {
  stage: Stage;
  label: string;
  items: PropertyWithContacts[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="min-w-[280px] flex-1 snap-start">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-serif text-base text-ink">{label}</h2>
        <span className="text-xs text-ink-muted">{items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'rounded-card min-h-[160px] p-2 space-y-2 transition-colors',
          isOver ? 'bg-forest/10 ring-1 ring-forest/30' : 'bg-bone-warm/60',
        )}
      >
        {items.length === 0 ? (
          <p className="text-xs text-ink-muted px-2 py-4 text-center">Empty</p>
        ) : (
          items.map((p) => <DraggableCard key={p.id} property={p} />)
        )}
      </div>
    </div>
  );
}

function DraggableCard({ property }: { property: PropertyWithContacts }) {
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: property.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0 : 1 }}
      className="touch-none"
    >
      <PropertyCard property={property} showStage={false} compact />
    </div>
  );
}
