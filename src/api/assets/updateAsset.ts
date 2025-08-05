const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function updateAsset(id: string, assetData: any) {
  const response = await fetch(`${API_BASE_URL}/api/Assets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData),
  });
  if (!response.ok) throw new Error('Varlık güncellenemedi');
  return await response.json();
}