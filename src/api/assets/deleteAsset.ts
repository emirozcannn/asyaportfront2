const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function deleteAsset(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/Assets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Varlık silinemedi');
  return await response.json();
}