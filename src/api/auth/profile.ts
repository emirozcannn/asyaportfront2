// src/api/auth/profile.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface User {
  // Backend'den dönen user yapısına göre güncellenecek
  // Şimdilik genel bir yapı
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserError {
  message: string;
}

export async function getCurrentUser(): Promise<User> {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }

    const response = await fetch(`${API_BASE_URL}/api/Auth/me`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token geçersiz, localStorage'ı temizle
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      }
      
      throw new Error(result.message || 'Kullanıcı bilgileri alınamadı');
    }

    // Güncel user bilgilerini cache'le
    localStorage.setItem('user', JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}