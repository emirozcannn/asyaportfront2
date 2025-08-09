// src/api/auth/utils.ts

export async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('authToken');
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  
  // Token expire kontrolü
  if (token && isTokenExpired()) {
    clearAuthData();
    return false;
  }
  
  return !!token;
}

export function getUserFromStorage(): Record<string, unknown> | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as Record<string, unknown> : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
}

export function clearAuthData(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
}

// Auth durumu kontrolü için hook benzeri fonksiyon
export function checkAuthStatus(): {
  isAuthenticated: boolean;
  user: Record<string, unknown> | null;
  token: string | null;
} {
  const token = localStorage.getItem('authToken');
  const user = getUserFromStorage();
  const authenticated = isAuthenticated(); // Bu expire kontrolü de yapar
  
  return {
    isAuthenticated: authenticated,
    user: authenticated ? user : null,
    token: authenticated ? token : null
  };
}

// API request'ler için auth header ekleme
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token && !isTokenExpired()) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Token expire kontrolü
export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return false;
  
  return new Date() > new Date(expiry);
}

// Güvenli logout fonksiyonu
// Not: NavigateFunction tipi import edilemiyor, bu yüzden any kullanıyoruz
export function logout(navigate?: any): void {
  clearAuthData();
  
  if (navigate) {
    navigate('/login', { replace: true });
  } else {
    window.location.href = '/login';
  }
}

// Token kaydetme fonksiyonu
export function setAuthData(token: string, user?: Record<string, unknown>, rememberMe = false): void {
  localStorage.setItem('authToken', token);
  
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  if (rememberMe) {
    // Remember me seçildiyse 30 gün
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
  } else {
    // Normal session - 8 saat
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 8);
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
  }
}

// Backend'de token validation
export async function validateToken(): Promise<boolean> {
  const token = await getAuthToken();
  
  if (!token) return false;
  
  // Token expire kontrolü
  if (isTokenExpired()) {
    clearAuthData();
    return false;
  }
  
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      clearAuthData();
      return false;
    }
    
    const data = await response.json();
    
    // Kullanıcı bilgilerini güncelle
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return true;
    
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// API çağrıları için wrapper
export async function apiRequest<T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };
  
  const config: RequestInit = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    // 401 durumunda otomatik logout
    if (response.status === 401) {
      clearAuthData();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Login API çağrısı
export async function loginUser(
  email: string, 
  password: string, 
  rememberMe = false
): Promise<{ token: string; user: Record<string, unknown> }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Giriş başarısız');
    }
    
    const data = await response.json();
    
    // Auth data'yı kaydet
    setAuthData(data.token, data.user, rememberMe);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Refresh token fonksiyonu (eğer kullanıyorsanız)
export async function refreshToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuthData();
    return null;
  }
}

// Permission kontrolü
export function hasPermission(permission: string): boolean {
  const user = getUserFromStorage();
  
  if (!user || !isAuthenticated()) return false;
  
  // Admin her şeyi yapabilir
  if (user.role === 'admin') return true;
  
  // Kullanıcı permissions array'inde kontrol et
  const permissions = user.permissions as string[] || [];
  return permissions.includes(permission);
}

// Role kontrolü
export function hasRole(role: string): boolean {
  const user = getUserFromStorage();
  
  if (!user || !isAuthenticated()) return false;
  
  const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
  return userRoles.includes(role);
}

/* Kullanım Örnekleri:

// 1. Component'te auth kontrolü
const AuthExample = () => {
  const { isAuthenticated, user } = checkAuthStatus();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Hoş geldin {user?.name}</div>;
};

// 2. API çağrısı
const fetchUserData = async () => {
  try {
    const data = await apiRequest('/api/users/profile');
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

// 3. Permission kontrolü
const AdminPanel = () => {
  if (!hasPermission('admin.access')) {
    return <div>Bu alana erişim yetkiniz yok</div>;
  }
  
  return <AdminDashboard />;
};

// 4. Manual login
const handleLogin = async () => {
  try {
    await loginUser(email, password, rememberMe);
    navigate('/dashboard');
  } catch (error) {
    setError(error.message);
  }
};

*/