import { supabase } from '../supabaseConfig';
import type { Department } from '../types/Department';

export async function fetchDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('departments').select('*');
  if (error) throw error;
  return data as Department[];
}
