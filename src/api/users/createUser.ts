// src/api/users/createUser.ts
import { getAuthHeaders } from '../auth/utils';
import type { CreateUserRequest, User } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function createUser(userData: CreateUserRequest): Promise<User> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Kullanıcı oluşturulamadı';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      // Kullanıcı dostu hata mesajları
      if (errorMessage.includes('email') && errorMessage.includes('exists')) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      }
      if (errorMessage.includes('validation')) {
        throw new Error('Girilen bilgiler geçersiz');
      }
      
      throw new Error(errorMessage);
    }

    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}