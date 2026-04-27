import type { CallOutcome } from '@/types/db';

// Default follow-up cadence in days after a call outcome.
// Cadence index = how many touches we've already had with this lead.
// Capped at the last value once we've passed the end of the array.
export const CADENCE_DAYS = [1, 3, 7, 14, 30] as const;

export function nextFollowUpDate(touches: number, from: Date = new Date()): Date {
  const idx = Math.min(Math.max(touches, 0), CADENCE_DAYS.length - 1);
  const days = CADENCE_DAYS[idx];
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

// Maps a call outcome to how the next follow-up should behave.
export function nextFollowUpForOutcome(
  outcome: CallOutcome,
  touches: number,
  from: Date = new Date(),
): { next: Date | null; clearFollowUp?: boolean } {
  switch (outcome) {
    case 'booked_lap':
      // LAP is booked — agent will set a date manually for prep.
      return { next: null, clearFollowUp: true };
    case 'do_not_call':
    case 'wrong_number':
      return { next: null, clearFollowUp: true };
    case 'spoke':
    case 'no_answer':
    case 'left_vm':
    default:
      return { next: nextFollowUpDate(touches, from) };
  }
}
