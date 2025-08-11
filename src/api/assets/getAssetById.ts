const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

// API Response interfaces
interface AssetAPIResponse {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  status: string;
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

interface CategoryAPIResponse {
  id: string;
  name: string;
  code?: string;
}

interface AssignmentAPIResponse {
  id: string;
  assetId: string;
  assignedToId: string;
  assignmentDate: string;
  returnDate?: string;
  status: string;
  notes?: string;
}

interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
}

// Asset detayları interface
export interface AssetDetails {
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
  notes?: string;
  // Ek detay bilgileri
  assignmentHistory?: AssignmentHistory[];
  transferHistory?: TransferHistory[];
}

export interface AssignmentHistory {
  id: string;
  assignedToName: string;
  assignedToEmployeeNumber: string;
  assignmentDate: string;
  returnDate?: string;
  status: string;
  notes?: string;
}

export interface TransferHistory {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  transferDate: string;
  notes?: string;
}

// ID'ye göre asset detaylarını getir
export async function getAssetById(id: string): Promise<AssetDetails> {
  try {
    // Tüm asset'leri çek ve istenen ID'yi bul (backend GET /api/Assets/{id} endpoint'i yok)
    const response = await fetch(`${API_BASE_URL}/api/Assets`);
    if (!response.ok) {
      throw new Error('Asset listesi yüklenemedi');
    }
    
    const allAssets: AssetAPIResponse[] = await response.json();
    const asset = allAssets.find((a: AssetAPIResponse) => a.id === id);
    
    if (!asset) {
      throw new Error('Asset bulunamadı');
    }
    
    // Ek bilgileri paralel olarak çek
    const [categoriesResponse, assignmentsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/AssetCategories`),
      fetch(`${API_BASE_URL}/api/AssetAssignments`)
    ]);
    
    const categories: CategoryAPIResponse[] = await categoriesResponse.json();
    const allAssignments: AssignmentAPIResponse[] = await assignmentsResponse.json();
    
    // Kategori bilgisini bul
    const category = categories.find((c: CategoryAPIResponse) => c.id === asset.categoryId);
    
    // Bu asset'in tüm atama geçmişini bul
    const assetAssignments = allAssignments.filter((a: AssignmentAPIResponse) => a.assetId === asset.id);
    
    // Aktif atamayı bul
    const activeAssignment = assetAssignments.find((a: AssignmentAPIResponse) => a.status === 'Active');
    
    // Atama geçmişini hazırla
    const assignmentHistory: AssignmentHistory[] = assetAssignments.map((assignment: AssignmentAPIResponse) => ({
      id: assignment.id,
      assignedToName: getEmployeeName(assignment.assignedToId),
      assignedToEmployeeNumber: getEmployeeNumber(assignment.assignedToId),
      assignmentDate: assignment.assignmentDate,
      returnDate: assignment.returnDate,
      status: assignment.status,
      notes: assignment.notes
    }));
    
    // Departman bilgisi (geçici)
    const departmentInfo = getDepartmentInfo(asset.categoryId);
    
    const assetDetails: AssetDetails = {
      ...asset,
      categoryName: category?.name,
      categoryCode: category?.code,
      departmentName: departmentInfo.name,
      departmentCode: departmentInfo.code,
      departmentId: departmentInfo.id,
      assignedToId: activeAssignment?.assignedToId,
      assignedToName: activeAssignment ? getEmployeeName(activeAssignment.assignedToId) : undefined,
      assignedToEmail: activeAssignment ? getEmployeeEmail(activeAssignment.assignedToId) : undefined,
      assignedToEmployeeNumber: activeAssignment ? getEmployeeNumber(activeAssignment.assignedToId) : undefined,
      assignmentDate: activeAssignment?.assignmentDate,
      assignmentStatus: activeAssignment?.status,
      assignmentHistory,
      transferHistory: [] // Transfer history için ayrı endpoint gerekebilir
    };
    
    return assetDetails;
  } catch (error) {
    console.error('Asset detayları yüklenirken hata:', error);
    throw error;
  }
}

// Asset'in atama durumunu kontrol et
export async function checkAssetAssignmentStatus(assetId: string): Promise<{
  isAssigned: boolean;
  assignedTo?: string;
  assignmentDate?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`);
    const assignments: AssignmentAPIResponse[] = await response.json();
    
    const activeAssignment = assignments.find((a: AssignmentAPIResponse) => 
      a.assetId === assetId && a.status === 'Active'
    );
    
    if (activeAssignment) {
      return {
        isAssigned: true,
        assignedTo: getEmployeeName(activeAssignment.assignedToId),
        assignmentDate: activeAssignment.assignmentDate
      };
    }
    
    return { isAssigned: false };
  } catch (error) {
    console.error('Atama durumu kontrol edilemedi:', error);
    return { isAssigned: false };
  }
}

// Asset'in geçmiş atamalarını getir
export async function getAssetAssignmentHistory(assetId: string): Promise<AssignmentHistory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`);
    const allAssignments: AssignmentAPIResponse[] = await response.json();
    
    const assetAssignments = allAssignments
      .filter((a: AssignmentAPIResponse) => a.assetId === assetId)
      .sort((a: AssignmentAPIResponse, b: AssignmentAPIResponse) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime());
    
    return assetAssignments.map((assignment: AssignmentAPIResponse) => ({
      id: assignment.id,
      assignedToName: getEmployeeName(assignment.assignedToId),
      assignedToEmployeeNumber: getEmployeeNumber(assignment.assignedToId),
      assignmentDate: assignment.assignmentDate,
      returnDate: assignment.returnDate,
      status: assignment.status,
      notes: assignment.notes
    }));
  } catch (error) {
    console.error('Atama geçmişi yüklenemedi:', error);
    return [];
  }
}

// Geçici helper fonksiyonlar (backend Users endpoint'i hazır olana kadar)
function getDepartmentInfo(categoryId: string): DepartmentInfo {
  const categoryDepartmentMap: { [key: string]: DepartmentInfo } = {
    'comp': { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
    'safe': { id: '2', name: 'Güvenlik', code: 'SEC' },
    'port': { id: '3', name: 'El TerminalLERİ', code: 'HTML' },
    'vehicle': { id: '3', name: 'El TerminalLERİ', code: 'HTML' },
    'furniture': { id: '4', name: 'İdari İşler', code: 'ADM' }
  };

  for (const [key, dept] of Object.entries(categoryDepartmentMap)) {
    if (categoryId.toLowerCase().includes(key)) {
      return dept;
    }
  }

  return { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' };
}

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

function getEmployeeEmail(userId: string): string {
  const mockEmails: { [key: string]: string } = {
    '1': 'ahmet.yilmaz@company.com',
    '2': 'fatma.kaya@company.com',
    '3': 'mehmet.demir@company.com',
    '4': 'ayse.celik@company.com',
    '5': 'mustafa.ozkan@company.com'
  };
  return mockEmails[userId] || `user${userId.slice(0, 3)}@company.com`;
}