const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function deleteAsset(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/Assets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Varlık silinemedi');
  
  // DELETE işlemi genelde boş response döner (204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true, message: 'Asset başarıyla silindi' };
  }
  
  // Eğer content varsa JSON olarak parse et
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  }
  
  return { success: true, message: 'Asset başarıyla silindi' };
}