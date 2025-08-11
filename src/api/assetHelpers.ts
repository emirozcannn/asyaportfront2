export interface AssetStats {
  total: number;
  available: number;
  assigned: number;
  damaged: number;
  byCategory: { [key: string]: number };
  byDepartment: { [key: string]: number };
}

export async function getAssetStats(): Promise<AssetStats> {
  // Mock data - gerçek istatistikler
  return {
    total: 0,
    available: 0,
    assigned: 0,
    damaged: 0,
    byCategory: {},
    byDepartment: {}
  };
}

export async function getAssetById(id: string) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/Assets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Asset getById error: ${response.status} ${response.statusText}`);
      throw new Error(`Asset bulunamadı: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('getAssetById error:', error);
    throw error;
  }
}
