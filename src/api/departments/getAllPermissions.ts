const API_BASE_URL = 'https://localhost:7190/api';

export const getAllPermissions = async () => {
  const response = await fetch(`${API_BASE_URL}/Permissions`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('İzin verisi alınamadı');
  return await response.json();
};