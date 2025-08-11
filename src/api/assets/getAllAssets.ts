const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// Asset response interface (backend'den gelecek join'li data için)
export interface AssetResponse {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  categoryName?: string;
  categoryCode?: string;
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToEmployeeNumber?: string;
  assignmentDate?: string;
  assignmentStatus?: string;
  status: string;
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// Tüm assets'ları detaylı bilgiyle getir
export async function getAllAssets(): Promise<AssetResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Assets`);
    if (!response.ok) throw new Error('Assets yüklenemedi');
    const assets = await response.json();
    
    // Backend join'li endpoint hazır olmadığı için geçici olarak manuel join yapıyoruz
    const assetsWithDetails = await Promise.all(
      assets.map(async (asset: any) => {
        try {
          // Kategori bilgisini çek
          const [categoriesResponse, assignmentsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/AssetCategories`),
            fetch(`${API_BASE_URL}/api/AssetAssignments`)
          ]);
          
          const categories = await categoriesResponse.json();
          const assignments = await assignmentsResponse.json();
          
          const category = categories.find((c: any) => c.id === asset.categoryId);
          
          // Aktif atama bilgisini bul
          const activeAssignment = assignments.find((a: any) => 
            a.assetId === asset.id && a.status === 'Active'
          );

          // Geçici departman bilgisi (backend endpoint eklenene kadar)
          const departmentInfo = getDepartmentInfo(asset.categoryId);

          return {
            ...asset,
            categoryName: category?.name,
            categoryCode: category?.code,
            departmentName: departmentInfo.name,
            departmentCode: departmentInfo.code,
            departmentId: departmentInfo.id,
            assignedToId: activeAssignment?.assignedToId,
            assignedToName: activeAssignment ? getEmployeeName(activeAssignment.assignedToId) : undefined,
            assignedToEmployeeNumber: activeAssignment ? getEmployeeNumber(activeAssignment.assignedToId) : undefined,
            assignmentDate: activeAssignment?.assignmentDate,
            assignmentStatus: activeAssignment?.status
          };
        } catch (err) {
          console.warn('Asset detayları alınamadı:', asset.id, err);
          return asset;
        }
      })
    );
    
    return assetsWithDetails;
  } catch (error) {
    console.error('Assets yüklenirken hata:', error);
    throw error;
  }
}

// Filtrelenmiş assets getir
export async function getFilteredAssets(filters: {
  searchTerm?: string;
  categoryId?: string;
  status?: string;
  departmentId?: string;
}): Promise<AssetResponse[]> {
  const allAssets = await getAllAssets();
  
  let filtered = allAssets;

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(asset =>
      asset.name.toLowerCase().includes(term) ||
      asset.assetNumber.toLowerCase().includes(term) ||
      asset.serialNumber.toLowerCase().includes(term) ||
      (asset.assignedToName && asset.assignedToName.toLowerCase().includes(term))
    );
  }

  if (filters.categoryId && filters.categoryId !== 'all') {
    filtered = filtered.filter(asset => asset.categoryId === filters.categoryId);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(asset => asset.status === filters.status);
  }

  if (filters.departmentId && filters.departmentId !== 'all') {
    filtered = filtered.filter(asset => asset.departmentId === filters.departmentId);
  }

  return filtered;
}

// Asset istatistiklerini hesapla
export async function getAssetStats() {
  const assets = await getAllAssets();
  
  return {
    total: assets.length,
    available: assets.filter(a => a.status === 'Available').length,
    assigned: assets.filter(a => a.status === 'Assigned').length,
    maintenance: assets.filter(a => a.status === 'Maintenance').length,
    damaged: assets.filter(a => a.status === 'Damaged').length,
    byCategory: getAssetsByCategory(assets),
    byDepartment: getAssetsByDepartment(assets)
  };
}

// Kategori bazında asset dağılımı
function getAssetsByCategory(assets: AssetResponse[]) {
  const categoryCount: { [key: string]: number } = {};
  assets.forEach(asset => {
    const categoryName = asset.categoryName || 'Kategori Yok';
    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
  });
  return categoryCount;
}

// Departman bazında asset dağılımı
function getAssetsByDepartment(assets: AssetResponse[]) {
  const departmentCount: { [key: string]: number } = {};
  assets.forEach(asset => {
    const departmentName = asset.departmentName || 'Departman Yok';
    departmentCount[departmentName] = (departmentCount[departmentName] || 0) + 1;
  });
  return departmentCount;
}

// Geçici departman bilgisi (backend endpoint hazır olana kadar)
function getDepartmentInfo(categoryId: string) {
  // Kategori bazında departman mapping'i
  const categoryDepartmentMap: { [key: string]: any } = {
    // IT kategorileri
    'comp': { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
    'network': { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
    // Güvenlik kategorileri  
    'safe': { id: '2', name: 'Güvenlik', code: 'SEC' },
    'security': { id: '2', name: 'Güvenlik', code: 'SEC' },
    // Liman operasyon kategorileri
    'port': { id: '3', name: 'El TerminalLERİ', code: 'HTML' },
    'vehicle': { id: '3', name: 'El TerminalLERİ', code: 'HTML' },
    // Diğer
    'furniture': { id: '4', name: 'İdari İşler', code: 'ADM' },
    'office': { id: '4', name: 'İdari İşler', code: 'ADM' }
  };

  // CategoryId'den departman tahmin etmeye çalış
  for (const [key, dept] of Object.entries(categoryDepartmentMap)) {
    if (categoryId.toLowerCase().includes(key)) {
      return dept;
    }
  }

  // Default departman
  return { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' };
}

// Geçici employee bilgisi (backend endpoint hazır olana kadar)
function getEmployeeName(userId: string): string {
  const mockUsers: { [key: string]: string } = {
    '1': 'Ahmet Yılmaz',
    '2': 'Fatma Kaya', 
    '3': 'Mehmet Demir',
    '4': 'Ayşe Çelik',
    '5': 'Mustafa Özkan'
  };
  return mockUsers[userId] || `Kullanıcı ${userId.slice(0, 8)}`;
}

function getEmployeeNumber(userId: string): string {
  const mockEmployeeNumbers: { [key: string]: string } = {
    '1': 'EMP001',
    '2': 'EMP002',
    '3': 'EMP003', 
    '4': 'EMP004',
    '5': 'EMP005'
  };
  return mockEmployeeNumbers[userId] || `EMP${userId.slice(0, 3).toUpperCase()}`;
}