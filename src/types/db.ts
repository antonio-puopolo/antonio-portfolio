// Mirrors supabase/migrations/0001_init.sql.
// Keep in sync when the schema changes.

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

export type LeadSource =
  | 'ofi'
  | 'door_knock'
  | 'referral'
  | 'online_enquiry'
  | 'appraisal_request'
  | 'social'
  | 'past_client'
  | 'other';

export type LostReason =
  | 'listed_with_another_agent'
  | 'withdrew_from_market'
  | 'not_selling_anymore'
  | 'sold_privately'
  | 'no_contact'
  | 'other';

export type ContactRole = 'owner' | 'partner' | 'decision_maker' | 'other';

export type ActivityKind =
  | 'call'
  | 'sms'
  | 'email'
  | 'inspection'
  | 'note'
  | 'voice'
  | 'stage_change';

export type CallOutcome =
  | 'spoke'
  | 'no_answer'
  | 'left_vm'
  | 'booked_lap'
  | 'wrong_number'
  | 'do_not_call';

export type PropertyRow = {
  id: string;
  user_id: string;
  address: string;
  suburb: string | null;
  postcode: string | null;
  property_type: string | null;
  beds: number | null;
  baths: number | null;
  cars: number | null;
  est_price_low: number | null;
  est_price_high: number | null;
  source: LeadSource | null;
  stage: Stage;
  next_follow_up_at: string | null;
  snoozed_until: string | null;
  lost_reason: LostReason | null;
  lost_note: string | null;
  listed_at: string | null;
  sold_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyInsert = {
  id?: string;
  user_id?: string;
  address: string;
  suburb?: string | null;
  postcode?: string | null;
  property_type?: string | null;
  beds?: number | null;
  baths?: number | null;
  cars?: number | null;
  est_price_low?: number | null;
  est_price_high?: number | null;
  source?: LeadSource | null;
  stage?: Stage;
  next_follow_up_at?: string | null;
  snoozed_until?: string | null;
  lost_reason?: LostReason | null;
  lost_note?: string | null;
  listed_at?: string | null;
  sold_at?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PropertyUpdate = Partial<PropertyInsert>;

export type ContactRow = {
  id: string;
  user_id: string;
  property_id: string;
  name: string;
  role: ContactRole;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  created_at: string;
};

export type ContactInsert = {
  id?: string;
  user_id?: string;
  property_id: string;
  name: string;
  role?: ContactRole;
  phone?: string | null;
  email?: string | null;
  is_primary?: boolean;
  created_at?: string;
};

export type ContactUpdate = Partial<ContactInsert>;

export type ActivityRow = {
  id: string;
  user_id: string;
  property_id: string;
  kind: ActivityKind;
  outcome: CallOutcome | null;
  body: string | null;
  transcript: string | null;
  from_stage: Stage | null;
  to_stage: Stage | null;
  created_at: string;
};

export type ActivityInsert = {
  id?: string;
  user_id?: string;
  property_id: string;
  kind: ActivityKind;
  outcome?: CallOutcome | null;
  body?: string | null;
  transcript?: string | null;
  from_stage?: Stage | null;
  to_stage?: Stage | null;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: PropertyRow;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
        Relationships: [];
      };
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: ContactUpdate;
        Relationships: [
          {
            foreignKeyName: 'contacts_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      activities: {
        Row: ActivityRow;
        Insert: ActivityInsert;
        Update: Partial<ActivityInsert>;
        Relationships: [
          {
            foreignKeyName: 'activities_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [key: string]: never };
    Functions: { [key: string]: never };
    Enums: {
      stage: Stage;
      lead_source: LeadSource;
      lost_reason: LostReason;
      contact_role: ContactRole;
      activity_kind: ActivityKind;
      call_outcome: CallOutcome;
    };
    CompositeTypes: { [key: string]: never };
  };
};

// ---- UI labels (kept here so enums + display strings live together) ----

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

export const LEAD_SOURCES: ReadonlyArray<{ id: LeadSource; label: string }> = [
  { id: 'ofi', label: 'OFI' },
  { id: 'door_knock', label: 'Door knock' },
  { id: 'referral', label: 'Referral' },
  { id: 'online_enquiry', label: 'Online enquiry' },
  { id: 'appraisal_request', label: 'Appraisal request' },
  { id: 'social', label: 'Social' },
  { id: 'past_client', label: 'Past client' },
  { id: 'other', label: 'Other' },
] as const;

export const LOST_REASONS: ReadonlyArray<{ id: LostReason; label: string }> = [
  { id: 'listed_with_another_agent', label: 'Listed with another agent' },
  { id: 'withdrew_from_market', label: 'Withdrew from market' },
  { id: 'not_selling_anymore', label: 'Not selling anymore' },
  { id: 'sold_privately', label: 'Sold privately' },
  { id: 'no_contact', label: 'No contact' },
  { id: 'other', label: 'Other' },
] as const;

export const CALL_OUTCOMES: ReadonlyArray<{
  id: CallOutcome;
  label: string;
  short: string;
}> = [
  { id: 'spoke', label: 'Spoke with them', short: 'Spoke' },
  { id: 'no_answer', label: 'No answer', short: 'No answer' },
  { id: 'left_vm', label: 'Left voicemail', short: 'Left VM' },
  { id: 'booked_lap', label: 'Booked listing appointment', short: 'Booked LAP' },
  { id: 'wrong_number', label: 'Wrong number', short: 'Wrong #' },
  { id: 'do_not_call', label: 'Do not call', short: 'DNC' },
] as const;
