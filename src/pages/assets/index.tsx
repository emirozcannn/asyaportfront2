import type { Asset, AssetDto, AssetFilter } from '../../api/types/assets';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7190/api';

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
  getAll: async (filter?: AssetFilter): Promise<Asset[]> => {
    let endpoint = '/Assets';
    
    // Filter parametrelerini query string'e çevir
    if (filter) {
      const params = new URLSearchParams();
      if (filter.categoryId) params.append('categoryId', filter.categoryId);
      if (filter.status) params.append('status', filter.status);
      if (filter.searchTerm) params.append('search', filter.searchTerm);
      if (filter.assignedToId) params.append('assignedToId', filter.assignedToId);
      
      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }
    
    return apiRequest<Asset[]>(endpoint);
  },

  // ID'ye göre asset getir
  getById: async (id: string): Promise<Asset> => {
    return apiRequest<Asset>(`/Assets/${id}`);
  },

  // Yeni asset oluştur
  create: async (assetDto: AssetDto): Promise<Asset> => {
    return apiRequest<Asset>('/Assets', {
      method: 'POST',
      body: JSON.stringify(assetDto),
    });
  },

  // Asset güncelle
  update: async (id: string, assetDto: AssetDto): Promise<Asset> => {
    return apiRequest<Asset>(`/Assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...assetDto, id }),
    });
  },

  // Asset sil
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Assets/${id}`, {
      method: 'DELETE',
    });
  },

  // Asset durumunu güncelle
  updateStatus: async (id: string, newStatus: string): Promise<void> => {
    return apiRequest<void>(`/AssetStatus/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus }),
    });
  },

  // Asset arama
  search: async (searchTerm: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/Assets?search=${encodeURIComponent(searchTerm)}`);
  },

  // Kategoriye göre asset'ları getir
  getByCategory: async (categoryId: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/Assets?categoryId=${categoryId}`);
  },

  // Kullanıcıya atanmış asset'ları getir
  getAssignedToUser: async (userId: string): Promise<Asset[]> => {
    return apiRequest<Asset[]>(`/Assets?assignedToId=${userId}`);
  },

  // Müsait asset'ları getir
  getAvailable: async (): Promise<Asset[]> => {
    return apiRequest<Asset[]>('/Assets?status=Available');
  },

  // Atanmış asset'ları getir
  getAssigned: async (): Promise<Asset[]> => {
    return apiRequest<Asset[]>('/Assets?status=Assigned');
  },

  // Asset istatistiklerini getir (bu endpoint backend'de yoksa eklenebilir)
  getStats: async (): Promise<any> => {
    try {
      return apiRequest<any>('/Assets/stats');
    } catch (error) {
      // Eğer stats endpoint'i yoksa, tüm asset'ları çekip hesapla
      const assets = await assetsApi.getAll();
      const stats = {
        totalAssets: assets.length,
        availableAssets: assets.filter(a => a.status === 'Available').length,
        assignedAssets: assets.filter(a => a.status === 'Assigned').length,
        maintenanceAssets: assets.filter(a => a.status === 'Maintenance').length,
        retiredAssets: assets.filter(a => a.status === 'Retired').length,
      };
      return stats;
    }
  },
};