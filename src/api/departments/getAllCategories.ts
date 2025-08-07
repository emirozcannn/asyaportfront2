const API_BASE_URL = 'https://localhost:7190/api';

export const getAllCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/Categories`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Kategori verisi alınamadı');
  return await response.json();
};