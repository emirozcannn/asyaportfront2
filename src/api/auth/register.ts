// src/api/auth/register.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  user?: any;
}

export interface RegisterError {
  message: string;
  error: string;
}

export async function registerUser(registerData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(registerData),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || 'Kayıt başarısız';
      
      // Supabase error parsing
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

    return result;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Error mesajını daha kullanıcı dostu hale getir
    if (error instanceof Error) {
      if (error.message.includes('email_address_invalid')) {
        throw new Error('Geçersiz e-posta adresi formatı');
      }
      if (error.message.includes('password')) {
        throw new Error('Şifre gereksinimleri karşılanmıyor');
      }
      if (error.message.includes('email') && error.message.includes('exists')) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      }
    }
    
    throw error;
  }
}
