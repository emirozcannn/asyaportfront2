// api/bulkOperations.ts
import type { BulkOperationResult } from '../types/assets';

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

// Bulk Operations API servisleri
export const bulkOperationsApi = {
  // Toplu asset silme
  bulkDelete: async (assetIds: string[]): Promise<BulkOperationResult> => {
    try {
      const requestBody = {
        baseUrl: "string",
        requestClientOptions: {
          schema: "string",
          headers: {},
          queryParams: {}
        },
        assetIds: assetIds
      };

      return apiRequest<BulkOperationResult>('/api/Assets/bulk-delete', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Bulk delete failed:', error);
      // Fallback: Try individual deletes if bulk endpoint doesn't exist
      return await bulkOperationsApi.fallbackBulkDelete(assetIds);
    }
  },

  // Toplu durum güncelleme
  bulkUpdateStatus: async (assetIds: string[], newStatus: string): Promise<BulkOperationResult> => {
    try {
      const requestBody = {
        baseUrl: "string",
        requestClientOptions: {
          schema: "string",
          headers: {},
          queryParams: {}
        },
        assetIds: assetIds,
        newStatus: newStatus,
        updatedAt: new Date().toISOString()
      };

      return apiRequest<BulkOperationResult>('/api/Assets/bulk-status', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Bulk status update failed:', error);
      // Fallback: Try individual updates if bulk endpoint doesn't exist
      return await bulkOperationsApi.fallbackBulkStatusUpdate(assetIds, newStatus);
    }
  },

  // Toplu atama
  bulkAssign: async (assetIds: string[], userId: string): Promise<BulkOperationResult> => {
    try {
      const requestBody = {
        baseUrl: "string",
        requestClientOptions: {
          schema: "string",
          headers: {},
          queryParams: {}
        },
        assetIds: assetIds,
        assignedToId: userId,
        assignmentDate: new Date().toISOString()
      };

      return apiRequest<BulkOperationResult>('/api/Assets/bulk-assign', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Bulk assign failed:', error);
      // Fallback: Try individual assignments if bulk endpoint doesn't exist
      return await bulkOperationsApi.fallbackBulkAssign(assetIds, userId);
    }
  },

  // Toplu konum güncelleme
  bulkUpdateLocation: async (assetIds: string[], location: string): Promise<BulkOperationResult> => {
    try {
      const requestBody = {
        baseUrl: "string",
        requestClientOptions: {
          schema: "string",
          headers: {},
          queryParams: {}
        },
        assetIds: assetIds,
        location: location,
        updatedAt: new Date().toISOString()
      };

      return apiRequest<BulkOperationResult>('/api/Assets/bulk-location', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Bulk location update failed:', error);
      // Fallback: Try individual updates if bulk endpoint doesn't exist
      return await bulkOperationsApi.fallbackBulkLocationUpdate(assetIds, location);
    }
  },

  // Toplu kategori güncelleme
  bulkUpdateCategory: async (assetIds: string[], categoryId: string): Promise<BulkOperationResult> => {
    try {
      const requestBody = {
        baseUrl: "string",
        requestClientOptions: {
          schema: "string",
          headers: {},
          queryParams: {}
        },
        assetIds: assetIds,
        categoryId: categoryId,
        updatedAt: new Date().toISOString()
      };

      return apiRequest<BulkOperationResult>('/api/Assets/bulk-category', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Bulk category update failed:', error);
      return await bulkOperationsApi.fallbackBulkCategoryUpdate(assetIds, categoryId);
    }
  },

  // FALLBACK METHODS - Eğer backend'de bulk endpoint'ler yoksa tek tek işlem yapar

  // Fallback: Tek tek silme
  fallbackBulkDelete: async (assetIds: string[]): Promise<BulkOperationResult> => {
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        await apiRequest<void>(`/api/Assets/${assetId}`, {
          method: 'DELETE',
        });
        processedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errorCount === 0,
      processedCount,
      errorCount,
      errors
    };
  },

  // Fallback: Tek tek durum güncelleme
  fallbackBulkStatusUpdate: async (assetIds: string[], newStatus: string): Promise<BulkOperationResult> => {
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        await apiRequest<void>(`/api/AssetStatus/${assetId}`, {
          method: 'PUT',
          body: JSON.stringify({ newStatus }),
        });
        processedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errorCount === 0,
      processedCount,
      errorCount,
      errors
    };
  },

  // Fallback: Tek tek atama
  fallbackBulkAssign: async (assetIds: string[], userId: string): Promise<BulkOperationResult> => {
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        // Bu endpoint'in tam yapısı backend'e göre değişebilir
        const assignmentData = {
          baseUrl: "string",
          requestClientOptions: {
            schema: "string",
            headers: {},
            queryParams: {}
          },
          assetId: assetId,
          assignedToId: userId,
          assignmentDate: new Date().toISOString(),
          status: 'Active'
        };

        await apiRequest<void>('/api/Assignments', {
          method: 'POST',
          body: JSON.stringify(assignmentData),
        });
        processedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errorCount === 0,
      processedCount,
      errorCount,
      errors
    };
  },

  // Fallback: Tek tek konum güncelleme
  fallbackBulkLocationUpdate: async (assetIds: string[], location: string): Promise<BulkOperationResult> => {
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        // Önce asset'i getir
        const asset = await apiRequest<any>(`/api/Assets/${assetId}`);
        
        // Location ile birlikte güncelle
        const updatedAsset = {
          ...asset,
          location: location,
          updatedAt: new Date().toISOString()
        };

        await apiRequest<void>(`/api/Assets/${assetId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedAsset),
        });
        processedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errorCount === 0,
      processedCount,
      errorCount,
      errors
    };
  },

  // Fallback: Tek tek kategori güncelleme
  fallbackBulkCategoryUpdate: async (assetIds: string[], categoryId: string): Promise<BulkOperationResult> => {
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const assetId of assetIds) {
      try {
        // Önce asset'i getir
        const asset = await apiRequest<any>(`/api/Assets/${assetId}`);
        
        // Category ile birlikte güncelle
        const updatedAsset = {
          ...asset,
          categoryId: categoryId,
          updatedAt: new Date().toISOString()
        };

        await apiRequest<void>(`/api/Assets/${assetId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedAsset),
        });
        processedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errorCount === 0,
      processedCount,
      errorCount,
      errors
    };
  },

  // Bulk işlem durumunu kontrol et (eğer backend async işlem yapıyorsa)
  getBulkOperationStatus: async (operationId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    progress: number;
    result?: BulkOperationResult;
  }> => {
    return apiRequest<any>(`/api/BulkOperations/${operationId}/status`);
  },

  // Tüm aktif bulk işlemleri getir
  getActiveBulkOperations: async (): Promise<any[]> => {
    return apiRequest<any[]>('/api/BulkOperations/active');
  }
};