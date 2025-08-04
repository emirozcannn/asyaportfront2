import { supabase } from '../supabaseConfig';


// Environment değişkeni üzerinden backend API URL'sini al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * LocalStorage üzerinden token'ı alır.
 * Eğer kullanıcı giriş yaptıysa backend'den gelen JWT token burada tutulur.
 */
export async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('authToken');
}

/**
 * Generic API istek fonksiyonu
 * Authorization header otomatik eklenir, hata durumları işlenir
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  console.log('Auth token:', token ? 'Token exists' : 'No token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorJson.error || 'Unknown error';
        console.error('Backend error details:', errorJson);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error('Full error object:', error);
    throw error;
  }
}

/**
 * Kullanıcı girişi
 * Supabase değil, backend login endpoint'i kullanılmaktadır
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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

    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Yeni kullanıcı kaydı
 */
export async function registerUser(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
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

/**
 * Kullanıcı çıkışı
 */
export async function logoutUser() {
  try {
    const result = await apiRequest('/api/Auth/logout', {
      method: 'POST',
    });

    localStorage.removeItem('authToken');

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

/**
 * Giriş yapan kullanıcının bilgilerini getirir
 */
export async function getCurrentUser() {
  try {
    return await apiRequest('/api/Auth/me', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}
