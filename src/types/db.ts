// Generated/maintained alongside the Supabase migration in supabase/migrations/.
// Phase 2 will populate concrete table types. For now this is a stub so the
// supabase client compiles.

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Stage =
  | 'new_lead'
  | 'nurturing'
  | 'lap_booked'
  | 'lap_done'
  | 'listing_signed'
  | 'on_market'
  | 'under_contract'
  | 'sold'
  | 'lost';

export const STAGES: ReadonlyArray<{ id: Stage; label: string }> = [
  { id: 'new_lead', label: 'New lead' },
  { id: 'nurturing', label: 'Nurturing' },
  { id: 'lap_booked', label: 'LAP booked' },
  { id: 'lap_done', label: 'LAP done' },
  { id: 'listing_signed', label: 'Listing signed' },
  { id: 'on_market', label: 'On market' },
  { id: 'under_contract', label: 'Under contract' },
  { id: 'sold', label: 'Sold' },
  { id: 'lost', label: 'Lost' },
] as const;
