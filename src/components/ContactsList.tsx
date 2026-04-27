import { useState } from 'react';
import { Phone, Mail, Plus, Pencil, Star, Trash2 } from 'lucide-react';
import {
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from '@/lib/queries';
import type { ContactRole, ContactRow } from '@/types/db';
import { Sheet } from './Sheet';

type Props = { propertyId: string; contacts: ContactRow[] };

export function ContactsList({ propertyId, contacts }: Props) {
  const [editing, setEditing] = useState<ContactRow | 'new' | null>(null);

  return (
    <div className="space-y-3">
      {contacts.length === 0 && (
        <p className="text-sm text-ink-muted">No contacts yet.</p>
      )}

      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} onEdit={() => setEditing(c)} />
      ))}

      <button
        type="button"
        onClick={() => setEditing('new')}
        className="btn-ghost"
      >
        <Plus className="h-4 w-4" />
        Add contact
      </button>

      {editing && (
        <ContactSheet
          propertyId={propertyId}
          contact={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ContactCard({
  contact,
  onEdit,
}: {
  contact: ContactRow;
  onEdit: () => void;
}) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-ink truncate">{contact.name}</p>
          {contact.is_primary && (
            <Star className="h-3.5 w-3.5 fill-forest text-forest" />
          )}
        </div>
        <p className="text-xs text-ink-muted mt-0.5 capitalize">
          {contact.role.replace('_', ' ')}
        </p>

        <div className="mt-3 space-y-1.5">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm text-ink hover:text-forest"
            >
              <Phone className="h-3.5 w-3.5" />
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-sm text-ink hover:text-forest break-all"
            >
              <Mail className="h-3.5 w-3.5" />
              {contact.email}
            </a>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full p-2 text-ink-muted hover:bg-ink/5"
        aria-label="Edit contact"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}

function ContactSheet({
  propertyId,
  contact,
  onClose,
}: {
  propertyId: string;
  contact: ContactRow | null;
  onClose: () => void;
}) {
  const create = useCreateContact();
  const update = useUpdateContact();
  const del = useDeleteContact();

  const [name, setName] = useState(contact?.name ?? '');
  const [role, setRole] = useState<ContactRole>(contact?.role ?? 'owner');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [isPrimary, setIsPrimary] = useState(contact?.is_primary ?? false);

  const pending = create.isPending || update.isPending || del.isPending;

  async function save() {
    if (!name.trim()) return;
    if (contact) {
      await update.mutateAsync({
        id: contact.id,
        patch: { name: name.trim(), role, phone: phone || null, email: email || null, is_primary: isPrimary },
      });
    } else {
      await create.mutateAsync({
        property_id: propertyId,
        name: name.trim(),
        role,
        phone: phone || null,
        email: email || null,
        is_primary: isPrimary,
      });
    }
    onClose();
  }

  async function remove() {
    if (!contact) return;
    await del.mutateAsync({ id: contact.id, propertyId });
    onClose();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={contact ? 'Edit contact' : 'Add contact'}
      footer={
        <div className="flex items-center gap-2">
          {contact && (
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="btn-ghost text-urgent-overdue"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending || !name.trim()}
            className="btn-primary flex-1"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <input
            type="text"
            autoFocus
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Role">
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value as ContactRole)}
          >
            <option value="owner">Owner</option>
            <option value="partner">Partner</option>
            <option value="decision_maker">Decision maker</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            inputMode="tel"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            inputMode="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="h-4 w-4 accent-forest"
          />
          Primary contact
        </label>
      </div>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
