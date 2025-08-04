
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface LogoutResponse {
  message: string;
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}/api/Auth/logout`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const result = await response.json();

    // Backend başarılı response döndürdü
    if (response.ok) {
      return result; // { message: "Logout successful" }
    }

    // Hata durumunda da localStorage'ı temizle
    throw new Error(result.message || 'Çıkış işlemi başarısız');
    
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  } finally {
    // Her durumda localStorage'ı temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
