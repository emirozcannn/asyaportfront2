import { supabase } from '../supabaseConfig';

export async function fetchAssignments() {
  const { data, error } = await supabase
    .from('asset_assignments')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function addAssignment({ asset_id, assigned_to_id }: { asset_id: string, assigned_to_id: string }) {
  const { data, error } = await supabase
    .from('asset_assignments')
    .insert([{ asset_id, assigned_to_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAssignment(id: string) {
  const { error } = await supabase
    .from('asset_assignments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
