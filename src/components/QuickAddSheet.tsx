import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Tag } from 'lucide-react';
import { Sheet } from './Sheet';
import { useCreatePropertyWithContact } from '@/lib/queries';
import { LEAD_SOURCES, type LeadSource } from '@/types/db';

type Props = { open: boolean; onClose: () => void };

const DEFAULT_SUBURB = 'Camp Hill';

export function QuickAddSheet({ open, onClose }: Props) {
  const navigate = useNavigate();
  const create = useCreatePropertyWithContact();

  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState(DEFAULT_SUBURB);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setAddress('');
    setSuburb(DEFAULT_SUBURB);
    setName('');
    setPhone('');
    setSource('');
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setError('Address and phone are the minimum.');
      return;
    }
    setError(null);
    try {
      const prop = await create.mutateAsync({
        property: {
          address: address.trim(),
          suburb: suburb.trim() || null,
          source: source || null,
        },
        contact: {
          name: name.trim() || 'Owner',
          phone: phone.trim(),
        },
      });
      reset();
      onClose();
      navigate(`/property/${prop.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save lead.');
    }
  }

  return (
    <Sheet
      open={open}
      onClose={() => {
        if (!create.isPending) {
          reset();
          onClose();
        }
      }}
      title="New lead"
      footer={
        <button
          type="submit"
          form="quick-add-form"
          disabled={create.isPending || !address.trim() || !phone.trim()}
          className="btn-primary w-full"
        >
          {create.isPending ? 'Saving…' : 'Save & open'}
        </button>
      }
    >
      <p className="text-sm text-ink-muted mb-5">
        Address and phone are all you need. Everything else can wait.
      </p>

      <form id="quick-add-form" onSubmit={onSubmit} className="space-y-4">
        <Field label="Address" icon={MapPin}>
          <input
            type="text"
            autoFocus
            required
            className="input pl-10"
            placeholder="42 Bennett St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>

        <Field label="Suburb">
          <input
            type="text"
            className="input"
            placeholder="Camp Hill"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
        </Field>

        <Field label="Owner name" icon={User}>
          <input
            type="text"
            className="input pl-10"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Phone" icon={Phone}>
          <input
            type="tel"
            inputMode="tel"
            required
            className="input pl-10"
            placeholder="0400 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>

        <Field label="Source" icon={Tag}>
          <select
            className="input pl-10 appearance-none"
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource | '')}
          >
            <option value="">Pick a source…</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        {error && <p className="text-xs text-urgent-overdue">{error}</p>}
      </form>
    </Sheet>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-muted mb-1.5">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        )}
        {children}
      </div>
    </label>
  );
}
