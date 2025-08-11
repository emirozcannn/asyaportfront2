const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// Stock durum tipi
export interface StockStatusItem {
  categoryId: string;
  categoryName: string;
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  damagedAssets: number;
  minimumStock?: number;
  maximumStock?: number;
  alertLevel: 'normal' | 'low' | 'critical' | 'overstock';
}

// Stock Alert tipi
export interface StockAlert {
  id: string;
  categoryId: string;
  categoryName: string;
  alertType: 'low_stock' | 'overstock' | 'maintenance_due';
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  isActive: boolean;
}

// Stock durumu API servisleri
export const stockStatusApi = {
  // Tüm kategorilerin stock durumunu getir
  getStockStatus: async (): Promise<StockStatusItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/StockStatus`);
      if (!response.ok) {
        throw new Error('Stock durumu alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Stock durumu yüklenirken hata:', error);
      // Mock data döndür
      return [
        {
          categoryId: '1',
          categoryName: 'Bilgisayarlar',
          totalAssets: 50,
          availableAssets: 10,
          assignedAssets: 35,
          maintenanceAssets: 3,
          retiredAssets: 2,
          damagedAssets: 0,
          minimumStock: 5,
          maximumStock: 100,
          alertLevel: 'normal'
        }
      ];
    }
  },

  // Kategori bazında stock durumu getir
  getCategoryStockStatus: async (categoryId: string): Promise<StockStatusItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/StockStatus/${categoryId}`);
      if (!response.ok) {
        throw new Error('Kategori stock durumu alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Kategori stock durumu yüklenirken hata:', error);
      throw error;
    }
  },

  // Stock alertlerini getir
  getStockAlerts: async (): Promise<StockAlert[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/StockAlerts`);
      if (!response.ok) {
        throw new Error('Stock alertleri alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Stock alertleri yüklenirken hata:', error);
      return [];
    }
  },

  // Stock limitlerini güncelle
  updateStockLimits: async (categoryId: string, limits: {
    minimumStock?: number;
    maximumStock?: number;
  }): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/StockStatus/${categoryId}/limits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(limits),
      });

      if (!response.ok) {
        throw new Error('Stock limitleri güncellenemedi');
      }
    } catch (error) {
      console.error('Stock limitleri güncellenirken hata:', error);
      throw error;
    }
  }
};