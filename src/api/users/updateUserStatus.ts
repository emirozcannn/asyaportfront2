// src/api/users/updateUserStatus.ts
import { getAuthHeaders } from '../auth/utils';
import type { User, UserStatus } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function updateUserStatus(id: string, status: UserStatus): Promise<User> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      if (response.status === 403) {
        throw new Error('Kullanıcı durumunu değiştirme yetkiniz yok');
      }
      
      throw new Error(`Kullanıcı durumu güncellenemedi: ${errorText}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
}