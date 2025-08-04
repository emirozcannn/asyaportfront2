// src/api/auth/login.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface LoginError {
  message: string;
  error: string;
  details?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Backend'inizin error formatına göre
      const errorMessage = result.message || 'Giriş başarısız';
      
      // Supabase error parsing (backend'inizde Supabase kullanıyorsunuz)
      if (result.error) {
        try {
          const supabaseError = JSON.parse(result.error);
          throw new Error(supabaseError.msg || errorMessage);
        } catch {
          throw new Error(errorMessage);
        }
      }
      
      throw new Error(errorMessage);
    }

    // Başarılı login - token ve user bilgilerini kaydet
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    
    // Error mesajını daha kullanıcı dostu hale getir
    if (error instanceof Error) {
      if (error.message.includes('invalid_credentials')) {
        throw new Error('E-posta veya şifre hatalı');
      }
      if (error.message.includes('email_address_invalid')) {
        throw new Error('Geçersiz e-posta adresi');
      }
    }
    
    throw error;
  }
}