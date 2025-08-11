import type { Asset } from '../../types/Asset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// HTTP helper fonksiyonu
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 204 No Content durumunda boş response döndür
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Asset API servisleri
export const assetsApi = {
  // Tüm asset'ları getir
  getAll: async (): Promise<Asset[]> => {
    return apiRequest<Asset[]>('/api/Assets');
  },

  // ID'ye göre asset getir
  getById: async (id: string): Promise<Asset> => {
    return apiRequest<Asset>(`/api/Assets/${id}`);
  },

  // Asset sil
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/api/Assets/${id}`, {
      method: 'DELETE',
    });
  },

  // Asset durumunu güncelle
  updateStatus: async (id: string, newStatus: string): Promise<void> => {
    return apiRequest<void>(`/api/Assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  // Asset arama
  search: async (searchTerm: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/api/Assets?search=${encodeURIComponent(searchTerm)}`);
  },

  // Kategoriye göre asset'ları getir
  getByCategory: async (categoryId: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/api/Assets?categoryId=${categoryId}`);
  },

  // Kullanıcıya atanmış asset'ları getir
  getAssignedToUser: async (userId: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/api/Assets?assignedToId=${userId}`);
  },

  // Müsait asset'ları getir
  getAvailable: async (): Promise<Asset[]> => {
    return apiRequest<Asset[]>('/api/Assets?status=Available');
  },

  // Atanmış asset'ları getir
  getAssigned: async (): Promise<Asset[]> => {
    return apiRequest<Asset[]>('/api/Assets?status=Assigned');
  }
};
