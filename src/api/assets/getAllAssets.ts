const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function getAllAssets() {
  const response = await fetch(`${API_BASE_URL}/api/Assets`);
  if (!response.ok) throw new Error('Varlıklar alınamadı');
  return await response.json();
}