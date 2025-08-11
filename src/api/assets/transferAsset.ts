const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// Transfer tipi
export interface AssetTransfer {
  id?: string;
  assetId: string;
  fromUserId?: string;
  toUserId?: string;
  fromDepartmentId?: string;
  toDepartmentId?: string;
  transferType: 'user_to_user' | 'user_to_department' | 'department_to_user' | 'location_change';
  transferDate: string;
  reason?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
  completedAt?: string;
}

// Transfer history tipi
export interface TransferHistory {
  id: string;
  assetId: string;
  assetName: string;
  assetNumber: string;
  fromUserName?: string;
  toUserName?: string;
  fromDepartmentName?: string;
  toDepartmentName?: string;
  transferDate: string;
  reason?: string;
  status: string;
  requestedByName: string;
}

// Asset transfer API servisleri
export const assetTransferApi = {
  // Asset transfer et
  transferAsset: async (transferData: Omit<AssetTransfer, 'id' | 'status' | 'requestedBy'>): Promise<AssetTransfer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetTransfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transferData,
          status: 'pending',
          requestedBy: 'current-user-id' // Bu gerçek user ID olmalı
        }),
      });

      if (!response.ok) {
        throw new Error('Asset transfer edilemedi');
      }

      return await response.json();
    } catch (error) {
      console.error('Asset transfer hatası:', error);
      throw error;
    }
  },

  // Transfer geçmişini getir
  getTransferHistory: async (assetId?: string): Promise<TransferHistory[]> => {
    try {
      let url = `${API_BASE_URL}/api/AssetTransfer/history`;
      if (assetId) {
        url += `?assetId=${assetId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Transfer geçmişi alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Transfer geçmişi yüklenirken hata:', error);
      return [];
    }
  },

  // Pending transferleri getir
  getPendingTransfers: async (): Promise<AssetTransfer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetTransfer/pending`);
      if (!response.ok) {
        throw new Error('Bekleyen transferler alınamadı');
      }
      return await response.json();
    } catch (error) {
      console.error('Bekleyen transferler yüklenirken hata:', error);
      return [];
    }
  },

  // Transfer'ı onayla
  approveTransfer: async (transferId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetTransfer/${transferId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Transfer onaylanamadı');
      }
    } catch (error) {
      console.error('Transfer onaylama hatası:', error);
      throw error;
    }
  },

  // Transfer'ı reddet
  rejectTransfer: async (transferId: string, reason: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetTransfer/${transferId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Transfer reddedilemedi');
      }
    } catch (error) {
      console.error('Transfer reddetme hatası:', error);
      throw error;
    }
  },

  // Direkt transfer (admin için - onaysız)
  directTransfer: async (assetId: string, transferData: {
    toUserId?: string;
    toDepartmentId?: string;
    reason?: string;
    notes?: string;
  }): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssetTransfer/direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          ...transferData,
          transferDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Direkt transfer başarısız');
      }
    } catch (error) {
      console.error('Direkt transfer hatası:', error);
      throw error;
    }
  }
};