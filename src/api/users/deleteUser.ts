// src/api/users/deleteUser.ts
import { getAuthHeaders } from '../auth/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      if (response.status === 403) {
        throw new Error('Bu kullanıcıyı silme yetkiniz yok');
      }
      
      throw new Error(`Kullanıcı silinemedi: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}