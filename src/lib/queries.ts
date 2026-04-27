import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type {
  ActivityInsert,
  ActivityRow,
  ContactInsert,
  ContactRow,
  ContactUpdate,
  PropertyInsert,
  PropertyRow,
  PropertyUpdate,
} from '@/types/db';

// ---------------- Properties ----------------

export type PropertyWithContacts = PropertyRow & { contacts: ContactRow[] };
export type PropertyDetail = PropertyRow & {
  contacts: ContactRow[];
  activities: ActivityRow[];
};

export function primaryContact(p: { contacts: ContactRow[] }): ContactRow | null {
  if (p.contacts.length === 0) return null;
  return p.contacts.find((c) => c.is_primary) ?? p.contacts[0];
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, contacts(*)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as PropertyWithContacts[];
    },
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ['property', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, contacts(*), activities(*)')
        .eq('id', id!)
        .order('created_at', { referencedTable: 'activities', ascending: false })
        .single();
      if (error) throw error;
      return data as PropertyDetail;
    },
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PropertyInsert) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as PropertyRow;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: PropertyUpdate }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PropertyRow;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['property', id] });
      const prev = qc.getQueryData<PropertyDetail>(['property', id]);
      if (prev) {
        qc.setQueryData<PropertyDetail>(['property', id], { ...prev, ...patch });
      }
      return { prev };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['property', vars.id], ctx.prev);
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: ['properties'] });
      void qc.invalidateQueries({ queryKey: ['property', vars.id] });
    },
  });
}

// ---------------- Contacts ----------------

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContactInsert) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as ContactRow;
    },
    onSuccess: (row) => {
      void qc.invalidateQueries({ queryKey: ['property', row.property_id] });
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: ContactUpdate }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ContactRow;
    },
    onSuccess: (row) => {
      void qc.invalidateQueries({ queryKey: ['property', row.property_id] });
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, propertyId }: { id: string; propertyId: string }) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      return { id, propertyId };
    },
    onSuccess: ({ propertyId }) => {
      void qc.invalidateQueries({ queryKey: ['property', propertyId] });
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// ---------------- Activities ----------------

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ActivityInsert) => {
      const { data, error } = await supabase
        .from('activities')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as ActivityRow;
    },
    onSuccess: (row) => {
      void qc.invalidateQueries({ queryKey: ['property', row.property_id] });
    },
  });
}

// ---------------- Convenience: create property + first contact ----------------

export function useCreatePropertyWithContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      property: PropertyInsert;
      contact: Omit<ContactInsert, 'property_id'>;
    }) => {
      const { data: prop, error: pErr } = await supabase
        .from('properties')
        .insert(input.property)
        .select()
        .single();
      if (pErr) throw pErr;

      const propertyRow = prop as PropertyRow;

      if (input.contact.name || input.contact.phone || input.contact.email) {
        const { error: cErr } = await supabase.from('contacts').insert({
          ...input.contact,
          property_id: propertyRow.id,
          is_primary: true,
        });
        if (cErr) throw cErr;
      }

      return propertyRow;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
