import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Pencil } from 'lucide-react';
import { useProperty, useUpdateProperty } from '@/lib/queries';
import { StagePicker } from '@/components/StagePicker';
import { FollowUpControl } from '@/components/FollowUpControl';
import { ContactsList } from '@/components/ContactsList';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { VoiceNoteButton } from '@/components/VoiceNoteButton';
import { NotesEditor } from '@/components/NotesEditor';
import { LogCallButton } from '@/components/LogCallButton';
import { LostReasonSheet } from '@/components/LostReasonSheet';
import { LOST_REASONS, type Stage } from '@/types/db';

export function PropertyDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProperty(id);
  const update = useUpdateProperty();
  const [lostSheet, setLostSheet] = useState<'new' | 'edit' | null>(null);

  if (isLoading) {
    return <div className="p-12 text-sm text-ink-muted">Loading…</div>;
  }
  if (error || !data) {
    return (
      <div className="p-12 text-sm text-urgent-overdue">
        Could not load property.
      </div>
    );
  }

  function setStage(stage: Stage) {
    if (!data) return;
    if (stage === 'lost') {
      setLostSheet('new');
      return;
    }
    void update.mutate({
      id: data.id,
      patch: stage === 'sold'
        ? { stage }
        : { stage, lost_reason: null, lost_note: null },
    });
  }
  function setFollowUp(next: string | null) {
    if (!data) return;
    void update.mutate({ id: data.id, patch: { next_follow_up_at: next } });
  }

  const lostReasonLabel =
    data.lost_reason && LOST_REASONS.find((r) => r.id === data.lost_reason)?.label;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6">
        <ArrowLeft className="h-4 w-4" />
        Today
      </Link>

      <header className="mb-8">
        <p className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5" />
          {data.suburb ?? 'Brisbane'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mt-1 leading-tight">
          {data.address}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <StagePicker value={data.stage} onChange={setStage} />
          <FollowUpControl value={data.next_follow_up_at} onChange={setFollowUp} />
          <LogCallButton propertyId={data.id} />
        </div>

        {data.stage === 'lost' && (
          <button
            type="button"
            onClick={() => setLostSheet('edit')}
            className="mt-3 inline-flex items-center gap-2 text-xs text-ink-muted hover:text-ink"
          >
            <Pencil className="h-3 w-3" />
            Lost: {lostReasonLabel ?? 'no reason set'}
            {data.lost_note && ` — ${data.lost_note}`}
          </button>
        )}
      </header>

      <Section title="Contacts">
        <ContactsList propertyId={data.id} contacts={data.contacts} />
      </Section>

      <Section title="Notes">
        <NotesEditor propertyId={data.id} value={data.notes} />
      </Section>

      <Section title="Voice note">
        <VoiceNoteButton propertyId={data.id} />
      </Section>

      <Section title="Activity">
        <ActivityTimeline activities={data.activities} />
      </Section>

      {lostSheet && (
        <LostReasonSheet
          open
          propertyId={data.id}
          onClose={() => setLostSheet(null)}
          initialReason={data.lost_reason}
          initialNote={data.lost_note}
          withStageChange={lostSheet === 'new'}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl text-ink mb-3">{title}</h2>
      {children}
    </section>
  );
}
