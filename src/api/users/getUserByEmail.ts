// src/api/users/getUserByEmail.ts
import { getAuthHeaders } from '../auth/utils';
import type { User } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      throw new Error(`Kullanıcı getirilemedi: ${errorText}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Get user by email error:', error);
    throw error;
  }
}