import type { CreateAssetRequest } from '../../types/Asset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function createAsset(assetData: CreateAssetRequest) {
  // Backend'e uygun format - schema'ya göre düzelt
  const requestBody = {
    assetNumber: assetData.assetNumber,
    name: assetData.name,
    serialNumber: assetData.serialNumber,
    categoryId: assetData.categoryId,
    status: assetData.status || 'Available', // Schema'da geçerli değerler: Available, Assigned, Damaged
    qrCode: assetData.qrCode,
    createdBy: assetData.createdBy || '30549f61-ed08-4867-bce0-b80a64ae7199', // Default user ID
    createdAt: new Date().toISOString(),
    departmentId: assetData.departmentId || null
  };

  const response = await fetch(`${API_BASE_URL}/api/Assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Asset creation error:', errorText);
    throw new Error('Varlık eklenemedi: ' + errorText);
  }
  
  return await response.json();
}