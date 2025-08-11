import type { UpdateAssetRequest } from '../../types/Asset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function updateAsset(id: string, assetData: UpdateAssetRequest) {
  // Backend'e uygun format - sadece güncellenmesi gereken alanları gönder
  const updateBody = {
    id: id,
    assetNumber: assetData.assetNumber,
    name: assetData.name,
    serialNumber: assetData.serialNumber,
    categoryId: assetData.categoryId,
    status: assetData.status || 'Available', // Schema'da geçerli değerler: Available, Assigned, Damaged
    qrCode: assetData.qrCode,
    createdBy: assetData.createdBy, // Mevcut değeri koru
    createdAt: assetData.createdAt, // Mevcut değeri koru
    updatedAt: new Date().toISOString(),
    departmentId: assetData.departmentId || null
  };

  const response = await fetch(`${API_BASE_URL}/api/Assets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Asset update error:', errorText);
    throw new Error('Varlık güncellenemedi: ' + errorText);
  }
  
  return await response.json();
}