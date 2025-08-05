const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function createAsset(assetData: any) {
  const response = await fetch(`${API_BASE_URL}/api/Assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData),
  });
  if (!response.ok) throw new Error('Varlık eklenemedi');
  return await response.json();
}