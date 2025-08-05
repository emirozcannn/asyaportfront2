import type { AssetCategory, AssetCategoryDto } from '../types/assets';

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

// Asset Categories API servisleri
export const categoriesApi = {
  // Tüm kategorileri getir
  getAll: async (): Promise<AssetCategory[]> => {
    return apiRequest<AssetCategory[]>('/api/AssetCategories');
  },

  // ID'ye göre kategori getir
  getById: async (id: string): Promise<AssetCategory> => {
    return apiRequest<AssetCategory>(`/api/AssetCategories/${id}`);
  },

  // Yeni kategori oluştur
  create: async (categoryDto: AssetCategoryDto): Promise<AssetCategory> => {
    // Backend'deki request body yapısına uygun şekilde gönder
    const requestBody = {
      baseUrl: "string",
      requestClientOptions: {
        schema: "string",
        headers: {},
        queryParams: {}
      },
      id: categoryDto.id || crypto.randomUUID(),
      name: categoryDto.name,
      code: categoryDto.code,
      description: categoryDto.description || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return apiRequest<AssetCategory>('/api/AssetCategories', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  // Kategori güncelle
  update: async (id: string, categoryDto: AssetCategoryDto): Promise<AssetCategory> => {
    // Backend'deki request body yapısına uygun şekilde gönder
    const requestBody = {
      baseUrl: "string",
      requestClientOptions: {
        schema: "string",
        headers: {},
        queryParams: {}
      },
      id: id,
      name: categoryDto.name,
      code: categoryDto.code,
      description: categoryDto.description || "",
      created_at: categoryDto.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return apiRequest<AssetCategory>(`/api/AssetCategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });
  },

  // Kategori sil
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/api/AssetCategories/${id}`, {
      method: 'DELETE',
    });
  },

  // Kategoriye göre asset sayısını getir (ek endpoint gerekebilir)
  getAssetCount: async (categoryId: string): Promise<number> => {
    try {
      // Bu endpoint backend'de yoksa, assets endpoint'inden filtrele
      const response = await fetch(`${API_BASE_URL}/api/Assets?categoryId=${categoryId}`);
      const assets = await response.json();
      return Array.isArray(assets) ? assets.length : 0;
    } catch (error) {
      console.error('Asset count fetch failed:', error);
      return 0;
    }
  },

  // Kullanımda olan kategorileri getir
  getUsedCategories: async (): Promise<AssetCategory[]> => {
    try {
      const [categories, assets] = await Promise.all([
        categoriesApi.getAll(),
        fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json())
      ]);

      // Sadece asset'ı olan kategorileri döndür
      const usedCategoryIds = [...new Set(assets.map((asset: any) => asset.categoryId))];
      return categories.filter(category => usedCategoryIds.includes(category.id));
    } catch (error) {
      console.error('Used categories fetch failed:', error);
      return [];
    }
  },

  // Kategori adına göre ara
  searchByName: async (searchTerm: string): Promise<AssetCategory[]> => {
    const categories = await categoriesApi.getAll();
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Kategori koduna göre getir
  getByCode: async (code: string): Promise<AssetCategory | null> => {
    const categories = await categoriesApi.getAll();
    return categories.find(category => category.code === code) || null;
  },

  // Kategori istatistiklerini getir
  getStats: async (): Promise<{
    totalCategories: number;
    usedCategories: number;
    emptyCategories: number;
    categoryAssetCounts: { [categoryId: string]: number };
  }> => {
    try {
      const [categories, assets] = await Promise.all([
        categoriesApi.getAll(),
        fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json())
      ]);

      // Her kategori için asset sayısını hesapla
      const categoryAssetCounts: { [categoryId: string]: number } = {};
      categories.forEach(category => {
        categoryAssetCounts[category.id] = assets.filter(
          (asset: any) => asset.categoryId === category.id
        ).length;
      });

      const usedCategories = Object.values(categoryAssetCounts).filter(count => count > 0).length;

      return {
        totalCategories: categories.length,
        usedCategories,
        emptyCategories: categories.length - usedCategories,
        categoryAssetCounts
      };
    } catch (error) {
      console.error('Category stats fetch failed:', error);
      return {
        totalCategories: 0,
        usedCategories: 0,
        emptyCategories: 0,
        categoryAssetCounts: {}
      };
    }
  }
};