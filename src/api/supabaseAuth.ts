import { supabase } from '../supabaseConfig';
import type { User } from '../types/User';

// Backend API base URL - Environment variable kullan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7190';

// Token refresh utility (Bu fonksiyon, backend API'si token yönetimini devraldığı için artık gerekli değil)
// Backend'iniz JWT token'ları yönetiyorsa ve Supabase sadece oturum bilgilerini tutuyorsa, bu kısım basitleştirilebilir.
// Ancak, Supabase'in kendi oturum yönetimini kullanmaya devam ediyorsanız, bu fonksiyonu tutabilirsiniz.
// Şimdilik, backend'in token'ı döndürdüğünü ve client'ın bunu kullanacağını varsayarak basitleştiriyoruz.
/*
async function refreshTokenIfNeeded() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('Authentication required');
  }
  
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  
  if (expiresAt && (expiresAt - now) < 300) { // 5 dakika kala yenile
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error('Token refresh failed');
    }
  }
  
  return session.access_token;
}
*/

// Generic API request handler with error handling
// Bu fonksiyon, kimlik doğrulamadan sonraki tüm API çağrıları için kullanılacak.
// Token'ı localStorage'dan alacak veya başka bir merkezi yerden yönetecek şekilde güncellenebilir.
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    // Backend API'nizden alınan token'ı burada kullanın
    // Örneğin, localStorage'dan alabilirsiniz:
    const token = localStorage.getItem('authToken'); 

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Token varsa Authorization başlığını ekle
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API functions
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Giriş başarısız: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Backend'den gelen token'ı localStorage'a kaydet
    if (result.token) {
      localStorage.setItem('authToken', result.token);
      // Supabase'in kendi oturum yönetimini kullanmıyorsanız bu satırı kaldırabilirsiniz.
      // Eğer Supabase'i sadece kullanıcı tablosu için kullanıyorsanız, auth kısmı backend'de yönetilmelidir.
      // const { error } = await supabase.auth.setSession({
      //   access_token: result.token,
      //   refresh_token: result.refreshToken || '',
      // });
      
      // if (error) {
      //   console.error('Supabase session set error:', error);
      // }
    }
    
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Kayıt başarısız: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    // Backend'e logout isteği gönder
    const result = await apiRequest('/api/Auth/logout', {
      method: 'POST'
    });
    
    // localStorage'daki token'ı temizle
    localStorage.removeItem('authToken');
    
    // Supabase auth state'ini temizle (eğer kullanılıyorsa)
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signout error:', error);
    }
    
    return result;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    return await apiRequest('/api/Auth/me', {
      method: 'GET'
    });
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

// apiRequest fonksiyonunu diğer modüllerin kullanabilmesi için dışa aktar
export { apiRequest };
