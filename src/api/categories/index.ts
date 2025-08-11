// src/api/categories/index.ts - Categories Modül Export

// ========================================
// ANA CATEGORIES API EXPORT
// ========================================
export { categoriesApi } from './categories';

// ========================================
// TYPES EXPORT
// ========================================
export type { 
  AssetCategory, 
  AssetCategoryDto 
} from '../types/assets';

// ========================================
// EK CATEGORY FONKSİYONLARI
import { categoriesApi } from './categories';
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * En çok kullanılan kategorileri getir
 * @param limit - Kaç kategori getirileceği (default: 10)
 * @returns Promise<CategoryUsage[]>
 */
export const getTopCategories = async (limit: number = 10): Promise<{
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  assetCount: number;
  percentage: number;
}[]> => {
  try {
    const [categories, assets] = await Promise.all([
      fetch(`${API_BASE_URL}/api/AssetCategories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json())
    ]);

    // Her kategori için asset sayısını hesapla
    const categoryStats = categories.map((category: any) => {
      const categoryAssets = assets.filter((asset: any) => asset.categoryId === category.id);
      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryCode: category.code || '',
        assetCount: categoryAssets.length
      };
    });

    // Toplam asset sayısı
    const totalAssets = assets.length;

    // Sırala ve limitle
    return categoryStats
      .sort((a, b) => b.assetCount - a.assetCount)
      .slice(0, limit)
      .map(stat => ({
        ...stat,
        percentage: totalAssets > 0 ? (stat.assetCount / totalAssets) * 100 : 0
      }));
  } catch (error) {
    console.error('getTopCategories error:', error);
    return [];
  }
};

/**
 * Boş kategorileri getir (hiç asset'ı olmayan)
 * @returns Promise<AssetCategory[]>
 */
export const getEmptyCategories = async () => {
  try {
    const [categories, assets] = await Promise.all([
      fetch(`${API_BASE_URL}/api/AssetCategories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json())
    ]);

    const usedCategoryIds = [...new Set(assets.map((asset: any) => asset.categoryId))];
    
    return categories.filter((category: any) => !usedCategoryIds.includes(category.id));
  } catch (error) {
    console.error('getEmptyCategories error:', error);
    return [];
  }
};

/**
 * Kategori önerileri (kısmi isim/kod arama)
 * @param partialName - Aranacak kelime
 * @returns Promise<AssetCategory[]>
 */
export const getCategorySuggestions = async (partialName: string) => {
  try {
    const categories = await fetch(`${API_BASE_URL}/api/AssetCategories`).then(r => r.json());
    
    const searchTerm = partialName.toLowerCase();
    return categories.filter((category: any) => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.code?.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('getCategorySuggestions error:', error);
    return [];
  }
};

/**
 * Kategori kullanım detayları
 * @param categoryId - Kategori ID
 * @returns Promise<CategoryDetails>
 */
export const getCategoryDetails = async (categoryId: string): Promise<{
  category: any;
  assetCount: number;
  assets: any[];
  recentlyAdded: any[];
  statusBreakdown: { [status: string]: number };
}> => {
  try {
    const [categoryResponse, assetsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/AssetCategories`),
      fetch(`${API_BASE_URL}/api/Assets`)
    ]);

    const [categories, allAssets] = await Promise.all([
      categoryResponse.json(),
      assetsResponse.json()
    ]);

    const category = categories.find((c: any) => c.id === categoryId);
    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    const categoryAssets = allAssets.filter((asset: any) => asset.categoryId === categoryId);
    
    // Status breakdown
    const statusBreakdown: { [status: string]: number } = {};
    categoryAssets.forEach((asset: any) => {
      statusBreakdown[asset.status] = (statusBreakdown[asset.status] || 0) + 1;
    });

    // Son 30 gün içinde eklenen asset'lar
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentlyAdded = categoryAssets
      .filter((asset: any) => new Date(asset.createdAt) >= thirtyDaysAgo)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      category,
      assetCount: categoryAssets.length,
      assets: categoryAssets,
      recentlyAdded,
      statusBreakdown
    };
  } catch (error) {
    console.error('getCategoryDetails error:', error);
    throw error;
  }
};

/**
 * Kategori kodu benzersizlik kontrolü
 * @param code - Kontrol edilecek kod
 * @param excludeId - Hariç tutulacak kategori ID (güncelleme sırasında)
 * @returns Promise<boolean>
 */
export const validateCategoryCode = async (code: string, excludeId?: string): Promise<boolean> => {
  try {
    const categories = await fetch(`${API_BASE_URL}/api/AssetCategories`).then(r => r.json());
    
    return !categories.some((category: any) => 
      category.code === code && category.id !== excludeId
    );
  } catch (error) {
    console.error('validateCategoryCode error:', error);
    return false;
  }
};

/**
 * Kategori silme öncesi kontrol
 * @param categoryId - Silinecek kategori ID
 * @returns Promise<{canDelete: boolean, reason?: string, assetCount?: number}>
 */
export const canDeleteCategory = async (categoryId: string): Promise<{
  canDelete: boolean;
  reason?: string;
  assetCount?: number;
}> => {
  try {
    const assets = await fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json());
    const categoryAssets = assets.filter((asset: any) => asset.categoryId === categoryId);
    
    if (categoryAssets.length > 0) {
      return {
        canDelete: false,
        reason: 'Bu kategoriye ait asset\'lar bulunuyor',
        assetCount: categoryAssets.length
      };
    }
    
    return { canDelete: true };
  } catch (error) {
    console.error('canDeleteCategory error:', error);
    return {
      canDelete: false,
      reason: 'Kontrol sırasında hata oluştu'
    };
  }
};

/**
 * Kategori bazlı asset dağılım raporu
 * @returns Promise<CategoryDistribution[]>
 */
export const getCategoryDistribution = async (): Promise<{
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  percentage: number;
}[]> => {
  try {
    const [categories, assets] = await Promise.all([
      fetch(`${API_BASE_URL}/api/AssetCategories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json())
    ]);

    const totalAssets = assets.length;

    return categories.map((category: any) => {
      const categoryAssets = assets.filter((asset: any) => asset.categoryId === category.id);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryCode: category.code || '',
        totalAssets: categoryAssets.length,
        availableAssets: categoryAssets.filter((a: any) => a.status === 'Available').length,
        assignedAssets: categoryAssets.filter((a: any) => a.status === 'Assigned').length,
        maintenanceAssets: categoryAssets.filter((a: any) => a.status === 'Maintenance').length,
        percentage: totalAssets > 0 ? (categoryAssets.length / totalAssets) * 100 : 0
      };
    }).sort((a, b) => b.totalAssets - a.totalAssets);
  } catch (error) {
    console.error('getCategoryDistribution error:', error);
    return [];
  }
};

/**
 * Kategori trend analizi (son 6 ay)
 * @param categoryId - Kategori ID
 * @returns Promise<CategoryTrend[]>
 */
export const getCategoryTrend = async (categoryId: string): Promise<{
  month: string;
  assetsAdded: number;
  totalAssets: number;
}[]> => {
  try {
    const assets = await fetch(`${API_BASE_URL}/api/Assets`).then(r => r.json());
    const categoryAssets = assets.filter((asset: any) => asset.categoryId === categoryId);
    
    // Son 6 ay için trend hesapla
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toISOString().slice(0, 7), // YYYY-MM format
        monthName: date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
      });
    }

    return months.map((month, index) => {
      const monthStart = new Date(month.month + '-01');
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const assetsAddedThisMonth = categoryAssets.filter((asset: any) => {
        const assetDate = new Date(asset.createdAt);
        return assetDate >= monthStart && assetDate < monthEnd;
      }).length;

      // Bu aya kadar toplam asset sayısı
      const totalAssetsByThisMonth = categoryAssets.filter((asset: any) => {
        const assetDate = new Date(asset.createdAt);
        return assetDate < monthEnd;
      }).length;

      return {
        month: month.monthName,
        assetsAdded: assetsAddedThisMonth,
        totalAssets: totalAssetsByThisMonth
      };
    });
  } catch (error) {
    console.error('getCategoryTrend error:', error);
    return [];
  }
};

// ========================================
// GELİŞMİŞ CATEGORIES API OBJESİ
// ========================================
export const categoriesApiExtended = {
  ...categoriesApi,
  getTopCategories,
  getEmptyCategories,
  getCategorySuggestions,
  getCategoryDetails,
  validateCategoryCode,
  canDeleteCategory,
  getCategoryDistribution,
  getCategoryTrend,
  isEmpty: async (categoryId: string): Promise<boolean> => {
    const details = await getCategoryDetails(categoryId);
    return details.assetCount === 0;
  },
  getAssetsByStatus: async (categoryId: string, status: string) => {
    const details = await getCategoryDetails(categoryId);
    return details.assets.filter((asset: any) => asset.status === status);
  },
  validateMultipleCodes: async (codes: { code: string; excludeId?: string }[]): Promise<{
    code: string;
    isValid: boolean;
  }[]> => {
    const results = await Promise.all(
      codes.map(async ({ code, excludeId }) => ({
        code,
        isValid: await validateCategoryCode(code, excludeId)
      }))
    );
    return results;
  }
} as const;