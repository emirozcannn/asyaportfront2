import { supabase } from '../supabaseConfig';
import type { Asset } from '../types/Asset';

export async function fetchAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addAsset(asset: Omit<Asset, 'id' | 'created_at'>) {
  const { error } = await supabase.from('assets').insert([asset]);
  if (error) throw error;
}

export async function updateAsset(id: string, asset: Omit<Asset, 'id' | 'created_at'>) {
  const { error } = await supabase.from('assets').update(asset).eq('id', id);
  if (error) throw error;
}

export async function deleteAsset(id: string) {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
}
