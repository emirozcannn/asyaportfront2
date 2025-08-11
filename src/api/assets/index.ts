import { createAsset } from './createAsset';
import { updateAsset } from './updateAsset';
import { deleteAsset } from './deleteAsset';
import { getAllAssets, getFilteredAssets, getAssetStats } from './getAllAssets';
import { getAssetById, checkAssetAssignmentStatus, getAssetAssignmentHistory } from './getAssetById';
import type { AssetResponse } from './getAllAssets';
import type { AssetDetails, AssignmentHistory, TransferHistory } from './getAssetById';

export type { AssetResponse } from './getAllAssets';
export type { AssetDetails, AssignmentHistory, TransferHistory } from './getAssetById';
export { createAsset } from './createAsset';
export { updateAsset } from './updateAsset';
export { deleteAsset } from './deleteAsset';
export { getAllAssets, getFilteredAssets, getAssetStats } from './getAllAssets';
export { getAssetById, checkAssetAssignmentStatus, getAssetAssignmentHistory } from './getAssetById';

// Asset History API
export { assetHistoryApi } from './assetHistory';

// Stock Status API
export { stockStatusApi } from './stockStatus';

// Transfer API
export { assetTransferApi } from './transferAsset';

// Categories API (mevcut dosyadan import)
export { categoriesApi } from '../categories/categories';

// Transfer API - ayrı dosyada tanımlı olduğu için comment out
// export { assetTransferApi } from './transferAsset';

// Departments API (henüz yok, geçici mock)
export const departmentsApi = {
  getAll: async () => {
    // Backend Department endpoint'i hazır olana kadar mock data
    return [
      { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT', createdAt: new Date().toISOString() },
      { id: '2', name: 'Güvenlik', code: 'SEC', createdAt: new Date().toISOString() },
      { id: '3', name: 'El TerminalLERİ', code: 'HTML', createdAt: new Date().toISOString() },
      { id: '4', name: 'İdari İşler', code: 'ADM', createdAt: new Date().toISOString() }
    ];
  }
};

// Users API (henüz yok, geçici mock)
export const usersApi = {
  getAll: async () => {
    // Backend Users endpoint'i hazır olana kadar mock data
    return [
      {
        id: '1',
        employeeNumber: 'EMP001',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        fullName: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@company.com',
        departmentId: '1',
        department: { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
        role: 'User',
        isActive: true
      },
      {
        id: '2',
        employeeNumber: 'EMP002',
        firstName: 'Fatma',
        lastName: 'Kaya',
        fullName: 'Fatma Kaya',
        email: 'fatma.kaya@company.com',
        departmentId: '2',
        department: { id: '2', name: 'Güvenlik', code: 'SEC' },
        role: 'User',
        isActive: true
      },
      {
        id: '3',
        employeeNumber: 'EMP003',
        firstName: 'Mehmet',
        lastName: 'Demir',
        fullName: 'Mehmet Demir',
        email: 'mehmet.demir@company.com',
        departmentId: '3',
        department: { id: '3', name: 'El TerminalLERİ', code: 'HTML' },
        role: 'User',
        isActive: true
      },
      {
        id: '4',
        employeeNumber: 'EMP004',
        firstName: 'Ayşe',
        lastName: 'Çelik',
        fullName: 'Ayşe Çelik',
        email: 'ayse.celik@company.com',
        departmentId: '4',
        department: { id: '4', name: 'İdari İşler', code: 'ADM' },
        role: 'User',
        isActive: true
      },
      {
        id: '5',
        employeeNumber: 'EMP005',
        firstName: 'Mustafa',
        lastName: 'Özkan',
        fullName: 'Mustafa Özkan',
        email: 'mustafa.ozkan@company.com',
        departmentId: '1',
        department: { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
        role: 'User',
        isActive: true
      }
    ];
  }
};

// Asset Transfer API - transferAsset.ts dosyasından import edildi
// Bu kısım kaldırıldı çünkü çakışma yaratıyordu

// Asset Status API (mevcut backend endpoint'i kullan)
export const assetStatusApi = {
  updateStatus: async (assetId: string, newStatus: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';
    const response = await fetch(`${API_BASE_URL}/api/AssetStatus/${assetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStatus }),
    });
    
    if (!response.ok) {
      throw new Error('Asset durumu güncellenemedi');
    }
  },
  
  getStatus: async (assetId: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';
    const response = await fetch(`${API_BASE_URL}/api/AssetStatus/${assetId}`);
    
    if (!response.ok) {
      throw new Error('Asset durumu alınamadı');
    }
    
    return await response.json();
  }
};

// QR Code Generator
export const qrGeneratorApi = {
  generateQR: (assetId: string, assetNumber: string, assetName: string) => {
    // QR kod sayfasını yeni pencerede aç
    const qrData = {
      assetId,
      assetNumber,
      name: assetName,
      timestamp: new Date().toISOString()
    };
    
    const qrUrl = `/qr-generator?data=${encodeURIComponent(JSON.stringify(qrData))}`;
    window.open(qrUrl, '_blank', 'width=400,height=400');
  }
};

// Bulk Operations (toplu işlemler)
export const bulkOperationsApi = {
  deleteMultiple: async (assetIds: string[]) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';
    
    const results = await Promise.allSettled(
      assetIds.map(id => 
        fetch(`${API_BASE_URL}/api/Assets/${id}`, { method: 'DELETE' })
      )
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const errorCount = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: errorCount === 0,
      processedCount: assetIds.length,
      successCount,
      errorCount,
      errors: results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason)
    };
  },
  
  updateStatusMultiple: async (assetIds: string[], newStatus: string) => {
    const results = await Promise.allSettled(
      assetIds.map(id => assetStatusApi.updateStatus(id, newStatus))
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const errorCount = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: errorCount === 0,
      processedCount: assetIds.length,
      successCount,
      errorCount,
      errors: results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason)
    };
  }
};

// Export/Import API
export const exportImportApi = {
  exportToCSV: async (assetIds?: string[]) => {
    try {
      const assets = await getAllAssets();
      const dataToExport = assetIds 
        ? assets.filter(asset => assetIds.includes(asset.id))
        : assets;
      
      const csvContent = convertToCSV(dataToExport);
      downloadCSV(csvContent, `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
      
      return { success: true, exportedCount: dataToExport.length };
    } catch (error) {
      console.error('Export hatası:', error);
      throw new Error('Export işlemi başarısız');
    }
  },
  
  exportToExcel: async (assetIds?: string[]) => {
    // Excel export için ayrı implementation gerekebilir
    throw new Error('Excel export henüz implementlenmedi');
  }
};

// Helper functions
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = [
    'Asset No',
    'Asset Adı', 
    'Seri No',
    'Kategori',
    'Durum',
    'Atanan Kişi',
    'Departman',
    'Oluşturma Tarihi',
    'Son Güncelleme'
  ];
  
  const rows = data.map(asset => [
    asset.assetNumber,
    asset.name,
    asset.serialNumber,
    asset.categoryName || '',
    asset.status,
    asset.assignedToName || 'Atanmamış',
    asset.departmentName || '',
    asset.createdAt,
    asset.updatedAt || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
// Toplu asset fonksiyonları
export const assetsApi = {
  create: createAsset,
  update: updateAsset,
  delete: deleteAsset,
  getAll: getAllAssets,
  getFiltered: getFilteredAssets,
  getStats: getAssetStats,
  getById: getAssetById,
  checkAssignmentStatus: checkAssetAssignmentStatus,
  getAssignmentHistory: getAssetAssignmentHistory
};