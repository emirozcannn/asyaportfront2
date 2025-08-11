const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// Asset geçmiş tipi
export interface AssetHistoryItem {
  id: string;
  assetId: string;
  actionType: 'created' | 'updated' | 'assigned' | 'unassigned' | 'transferred' | 'status_changed' | 'deleted';
  actionDescription: string;
  performedBy: string;
  performedByName?: string;
  performedAt: string;
  oldValue?: any;
  newValue?: any;
  metadata?: any;
}

// Asset geçmişi API servisleri
export const assetHistoryApi = {
  // Asset'in tüm geçmişini getir
  getAssetHistory: async (assetId: string): Promise<AssetHistoryItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetHistory/${assetId}`);
      if (!response.ok) {
        throw new Error('Asset geçmişi alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Asset geçmişi yüklenirken hata:', error);
      // Mock data döndür
      return [
        {
          id: '1',
          assetId: assetId,
          actionType: 'created',
          actionDescription: 'Asset oluşturuldu',
          performedBy: 'system',
          performedByName: 'Sistem',
          performedAt: new Date().toISOString(),
          metadata: {}
        }
      ];
    }
  },

  // Yeni geçmiş kaydı ekle
  addHistoryEntry: async (entry: Omit<AssetHistoryItem, 'id' | 'performedAt'>): Promise<AssetHistoryItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          performedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Geçmiş kaydı eklenemedi');
      }

      return await response.json();
    } catch (error) {
      console.error('Geçmiş kaydı eklenirken hata:', error);
      throw error;
    }
  },

  // Tüm asset geçmişini getir (admin için)
  getAllHistory: async (filters?: {
    startDate?: string;
    endDate?: string;
    actionType?: string;
    performedBy?: string;
  }): Promise<AssetHistoryItem[]> => {
    try {
      let url = `${API_BASE_URL}/api/AssetHistory`;
      const params = new URLSearchParams();

      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.actionType) params.append('actionType', filters.actionType);
      if (filters?.performedBy) params.append('performedBy', filters.performedBy);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Genel geçmiş alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Genel geçmiş yüklenirken hata:', error);
      return [];
    }
  }
};