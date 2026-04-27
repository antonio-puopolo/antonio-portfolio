import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/cn';
import type { PropertyWithContacts } from '@/lib/queries';
import { primaryContact } from '@/lib/queries';
import { StageBadge } from './StageBadge';
import { LogCallButton } from './LogCallButton';
import { SnoozeButton } from './SnoozeButton';

type Props = {
  property: PropertyWithContacts;
  showStage?: boolean;
  compact?: boolean;
};

export function PropertyCard({ property, showStage = true, compact = false }: Props) {
  const owner = primaryContact(property);
  const followUp = property.next_follow_up_at ? new Date(property.next_follow_up_at) : null;

  const tone =
    followUp && isPast(followUp) && !isToday(followUp)
      ? 'bg-urgent-overdue'
      : followUp && isToday(followUp)
        ? 'bg-urgent-today'
        : 'bg-urgent-future';

  return (
    <article
      className={cn(
        'card flex flex-col gap-3',
        compact ? 'p-3' : 'p-4',
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', tone)} aria-hidden />
        <div className="flex-1 min-w-0">
          <Link
            to={`/property/${property.id}`}
            className="block hover:text-forest"
          >
            <h3 className="font-serif text-lg leading-tight text-ink truncate">
              {property.address}
            </h3>
          </Link>
          {property.suburb && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
              <MapPin className="h-3 w-3" />
              {property.suburb}
            </p>
          )}
          {owner && (
            <p className="mt-1 text-sm text-ink-soft truncate">{owner.name}</p>
          )}
        </div>
        {showStage && <StageBadge stage={property.stage} />}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          {followUp ? format(followUp, 'EEE d MMM') : 'No follow-up'}
        </p>
        <div className="flex items-center gap-1.5">
          <SnoozeButton propertyId={property.id} />
          {owner?.phone && (
            <>
              <a
                href={`tel:${owner.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-bone-deep px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5"
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </a>
              <LogCallButton propertyId={property.id} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
