// Ek kategoriler fonksiyonları
import type { AssetCategory, AssetCategoryDto } from '../../types/Asset';
// ...existing code...
export const additionalCategoriesFunctions = {
  // Kategori oluşturma validasyonu
  validateCreate: async (categoryDto: AssetCategoryDto): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];
    if (!categoryDto.name || categoryDto.name.trim().length < 2) {
      errors.push('Kategori adı en az 2 karakter olmalıdır');
    }
    if (!categoryDto.code || categoryDto.code.trim().length < 2) {
      errors.push('Kategori kodu en az 2 karakter olmalıdır');
    }
    if (categoryDto.code) {
      try {
        const categories = await categoriesApi.getAll();
        const codeExists = categories.some(cat => cat.code?.toLowerCase() === categoryDto.code?.toLowerCase());
        if (codeExists) {
          errors.push('Bu kategori kodu zaten kullanılıyor');
        }
      } catch {
        errors.push('Kod kontrolü yapılamadı');
      }
    }
    if (categoryDto.name) {
      try {
        const categories = await categoriesApi.getAll();
        const nameExists = categories.some(cat => cat.name.toLowerCase() === categoryDto.name.toLowerCase());
        if (nameExists) {
          errors.push('Bu kategori adı zaten kullanılıyor');
        }
      } catch {
        errors.push('İsim kontrolü yapılamadı');
      }
    }
    return { isValid: errors.length === 0, errors };
  },

  // Kategori güncelleme validasyonu
  validateUpdate: async (id: string, categoryDto: AssetCategoryDto): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];
    if (!categoryDto.name || categoryDto.name.trim().length < 2) {
      errors.push('Kategori adı en az 2 karakter olmalıdır');
    }
    if (!categoryDto.code || categoryDto.code.trim().length < 2) {
      errors.push('Kategori kodu en az 2 karakter olmalıdır');
    }
    if (categoryDto.code) {
      try {
        const categories = await categoriesApi.getAll();
        const codeExists = categories.some(cat => cat.code?.toLowerCase() === categoryDto.code?.toLowerCase() && cat.id !== id);
        if (codeExists) {
          errors.push('Bu kategori kodu başka bir kategori tarafından kullanılıyor');
        }
      } catch {
        errors.push('Kod kontrolü yapılamadı');
      }
    }
    if (categoryDto.name) {
      try {
        const categories = await categoriesApi.getAll();
        const nameExists = categories.some(cat => cat.name.toLowerCase() === categoryDto.name.toLowerCase() && cat.id !== id);
        if (nameExists) {
          errors.push('Bu kategori adı başka bir kategori tarafından kullanılıyor');
        }
      } catch {
        errors.push('İsim kontrolü yapılamadı');
      }
    }
    return { isValid: errors.length === 0, errors };
  },

  // Kategori silme validasyonu
  validateDelete: async (id: string): Promise<{ canDelete: boolean; warnings: string[]; assetCount: number }> => {
    const warnings: string[] = [];
    let assetCount = 0;
    try {
      assetCount = await categoriesApi.getAssetCount(id);
      if (assetCount > 0) {
        warnings.push(`Bu kategoriye ait ${assetCount} adet asset bulunmaktadır`);
        warnings.push('Kategoriyi silmek için önce tüm asset\'ları başka kategorilere taşıyın');
        return { canDelete: false, warnings, assetCount };
      }
      return { canDelete: true, warnings: ['Kategori güvenle silinebilir'], assetCount: 0 };
    } catch {
      return { canDelete: false, warnings: ['Asset sayısı kontrol edilemedi, silme işlemi riskli olabilir'], assetCount: 0 };
    }
  },

  // Kategori import öncesi validasyon
  validateImport: async (categories: AssetCategoryDto[]): Promise<{ validCategories: AssetCategoryDto[]; invalidCategories: { category: AssetCategoryDto; errors: string[] }[] }> => {
    const validCategories: AssetCategoryDto[] = [];
    const invalidCategories: { category: AssetCategoryDto; errors: string[] }[] = [];
    for (const category of categories) {
      const validation = await additionalCategoriesFunctions.validateCreate(category);
      if (validation.isValid) {
        validCategories.push(category);
      } else {
        invalidCategories.push({ category, errors: validation.errors });
      }
    }
    return { validCategories, invalidCategories };
  },

  // Kategori export
  exportCategories: async (format: 'json' | 'csv' = 'json'): Promise<{ success: boolean; exportedCount: number }> => {
    try {
      const categories = await categoriesApi.getAll();
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const assetCount = await categoriesApi.getAssetCount(category.id);
          return { ...category, assetCount };
        })
      );
      if (format === 'csv') {
        const csvHeaders = 'ID,Name,Code,Description,Asset Count,Created At\n';
        const csvRows = categoriesWithStats.map(cat => 
          `"${cat.id}","${cat.name}","${cat.code || ''}","${cat.description || ''}","${cat.assetCount}","${cat.created_at}"`
        ).join('\n');
        const csvContent = csvHeaders + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return { success: true, exportedCount: categoriesWithStats.length };
      } else {
        const jsonContent = JSON.stringify(categoriesWithStats, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return { success: true, exportedCount: categoriesWithStats.length };
      }
    } catch (err) {
      console.error('Category export error:', err);
      throw new Error('Kategori export edilirken hata oluştu');
    }
  },

  // Toplu kategori silme
  bulkDelete: async (categoryIds: string[]): Promise<{ successful: string[]; failed: { id: string; error: string }[] }> => {
    const results = await Promise.allSettled(
      categoryIds.map(async (id: string) => {
        const validation = await additionalCategoriesFunctions.validateDelete(id);
        if (!validation.canDelete) {
          throw new Error(`Kategori silinemez: ${validation.warnings.join(', ')}`);
        }
        await categoriesApi.delete(id);
        return id;
      })
    );
    const successful: string[] = [];
    const failed: { id: string; error: string }[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push((result as PromiseFulfilledResult<string>).value);
      } else {
        failed.push({ id: categoryIds[index], error: (result as PromiseRejectedResult).reason?.message || 'Bilinmeyen hata' });
      }
    });
    return { successful, failed };
  }
};
// ...existing code...

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
      const usedCategoryIds = [...new Set((assets as Asset[]).map(asset => asset.categoryId))];
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
          (asset: Asset) => asset.categoryId === category.id
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