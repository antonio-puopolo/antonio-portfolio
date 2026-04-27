import { useParams } from 'react-router-dom';

export function PropertyDetailPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <p className="text-sm text-ink-muted">Property</p>
      <h1 className="font-serif text-3xl text-ink mt-1">#{id}</h1>
      <p className="mt-6 text-sm text-ink-muted">
        Property detail view will live here — contacts, activity timeline, voice notes,
        follow-up controls.
      </p>
    </div>
  );
}
