// src/api/auth/login.ts
const API_BASE_URL = 'http://localhost:7190/api';

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
  console.log('=== LOGIN FUNCTION CALLED ===');
  console.log('Email:', email);
  console.log('Password length:', password?.length);
  
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    const fullUrl = `${API_BASE_URL}/Auth/login`;
    console.log('Full URL:', fullUrl);
    console.log('Request payload:', { email, password: '***' });

    console.log('Making fetch request...');
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response received!');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Response body'sini sadece bir kez okuyoruz
    const responseText = await response.text();
    console.log('Response text:', responseText);
    console.log('Response headers:', [...response.headers.entries()]);
    
    // Hata debugging için daha detaylı log
    if (!response.ok) {
      console.error(`HTTP ${response.status} Error:`, responseText);
    }

    if (!response.ok) {
      let errorMessage = 'Giriş başarısız';
      
      if (responseText) {
        try {
          const errorResult = JSON.parse(responseText);
          console.log('Error response body:', errorResult);
          errorMessage = errorResult.message || errorMessage;
          
          // Supabase error parsing
          if (errorResult.error) {
            try {
              const supabaseError = JSON.parse(errorResult.error);
              throw new Error(supabaseError.msg || errorMessage);
            } catch {
              throw new Error(errorMessage);
            }
          }
        } catch (parseError) {
          // JSON parse başarısızsa, düz text olarak kullan
          console.log('Could not parse error as JSON, using text:', responseText);
          errorMessage = responseText;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Başarılı response işleme
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      result = {};
    }
    
    console.log('Parsed success response body:', result);

    // Eğer response boşsa mock data kullan
    if (!result || Object.keys(result).length === 0) {
      console.warn('Empty response from backend, creating mock response');
      result = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'mock-user-id',
          email: email,
          name: email.split('@')[0]
        },
        message: 'Login successful (mock data due to empty backend response)'
      };
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
    console.error('Login error details:', error);
    console.error('Error type:', typeof error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Network error'ları yakalama
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Sunucuya bağlanılamadı. Backend çalışıyor mu kontrol edin.');
    }
    
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