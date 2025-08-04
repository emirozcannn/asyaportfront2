// src/api/users/updateUser.ts
import { getAuthHeaders } from '../auth/utils';
import type { UpdateUserRequest, User } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function updateUser(userData: UpdateUserRequest): Promise<User> {
  try {
    const headers = getAuthHeaders();
    const { id, ...updateData } = userData;

    const response = await fetch(`${API_BASE_URL}/api/Users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Kullanıcı güncellenemedi';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      if (response.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      if (errorMessage.includes('email') && errorMessage.includes('exists')) {
        throw new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor');
      }
      
      throw new Error(errorMessage);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}