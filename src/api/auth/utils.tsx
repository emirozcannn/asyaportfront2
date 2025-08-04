// src/api/auth/utils.ts
export async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('authToken');
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  return !!token;
}

export function getUserFromStorage(): any | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
}

export function clearAuthData(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// Auth durumu kontrolü için hook benzeri fonksiyon
export function checkAuthStatus(): {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
} {
  const token = localStorage.getItem('authToken');
  const user = getUserFromStorage();
  
  return {
    isAuthenticated: !!token,
    user,
    token
  };
}

// API request'ler için auth header ekleme
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}