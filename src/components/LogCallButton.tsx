import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { CallOutcomeSheet } from './CallOutcomeSheet';

export function LogCallButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-ink text-bone px-3 py-1.5 text-xs font-medium hover:bg-ink-soft"
      >
        <PhoneCall className="h-3.5 w-3.5" />
        Log
      </button>
      <CallOutcomeSheet
        open={open}
        onClose={() => setOpen(false)}
        propertyId={propertyId}
      />
    </>
  );
}
