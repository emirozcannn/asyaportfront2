// src/api/assignments/index.ts - Assignment Modülü Ana Export Dosyası

// ========================================
// TEMEL CRUD İŞLEMLERİ
// ========================================
export { 
  getAllAssignments, 
  getActiveAssignments, 
  getUrgentAssignments, 
  getUserAssignments, 
  getAssetAssignmentHistory 
} from './getAllAssignments';

export { 
  getAssignmentById, 
  checkAssignmentExists, 
  isAssignmentActive 
} from './getAssignmentById';

export { 
  createAssignment, 
  assignAssetToUser 
} from './createAssignment';

export { 
  updateAssignment, 
  returnAssignment, 
  markAssignmentUrgent, 
  setAutoApproval, 
  updateAssignmentNotes 
} from './updateAssignment';

export { 
  deleteAssignment, 
  deleteMultipleAssignments, 
  deleteAllUserAssignments, 
  deleteAllAssetAssignments, 
  validateAssignmentDeletion 
} from './deleteAssignment';

// ========================================
// TYPES EXPORT
// ========================================
export type { 
  AssetAssignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentFormData,
  AssignmentStatus,
  AssignmentWithDetails,
  AssignmentHistory,
  BulkAssignmentRequest,
  BulkAssignmentResult,
  AssignmentStatistics,
  AssignmentFilters,
  AssignmentValidation,
  AssetTransferRequest,
  AssignmentNotification,
  AssignmentSchedule,
  AssignmentTemplate,
  AssignmentReport
} from '../types/assignment';

// ========================================
// GELİŞMİŞ ASSIGNMENT FONKSİYONLARI
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Asset transfer işlemi (AssetTransfer API kullanarak)
 */
export const transferAsset = async (
  assetId: string, 
  fromUserId: string, 
  toUserId: string, 
  transferNotes?: string
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/AssetTransfer/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assetId,
        fromUserId,
        toUserId,
        transferDate: new Date().toISOString(),
        notes: transferNotes || `Transfer: ${fromUserId} -> ${toUserId}`
      }),
    });
  } catch (error) {
    console.error('transferAsset error:', error);
    throw new Error('Asset transfer edilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Toplu assignment oluşturma
 */
export const bulkAssignAssets = async (
  assetIds: string[], 
  userId: string, 
  assignedBy: string = '30549f61-ed08-4867-bce0-b80a64ae7199',
  options?: {
    notes?: string;
    isUrgent?: boolean;
    isAutomaticApproval?: boolean;
  }
): Promise<{
  successful: string[];
  failed: { assetId: string; error: string }[];
}> => {
  try {
    const results = await Promise.allSettled(
      assetIds.map(assetId => assignAssetToUser(assetId, userId, assignedBy, options))
    );

    const successful: string[] = [];
    const failed: { assetId: string; error: string }[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(assetIds[index]);
      } else {
        failed.push({
          assetId: assetIds[index],
          error: result.reason.message || 'Bilinmeyen hata'
        });
      }
    });

    return { successful, failed };
  } catch (error) {
    console.error('bulkAssignAssets error:', error);
    throw error;
  }
};

/**
 * Süresi dolmuş assignment'ları getir
 */
export const getOverdueAssignments = async (): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    const now = new Date();

    return allAssignments.filter(assignment => 
      assignment.status === 'Active' &&
      assignment.returnDate &&
      new Date(assignment.returnDate) < now
    );
  } catch (error) {
    console.error('getOverdueAssignments error:', error);
    throw error;
  }
};

/**
 * Kullanıcının aktif assignment'larını getir
 */
export const getUserActiveAssignments = async (userId: string): Promise<AssetAssignment[]> => {
  try {
    const userAssignments = await getUserAssignments(userId);
    return userAssignments.filter(assignment => assignment.status === 'Active');
  } catch (error) {
    console.error('getUserActiveAssignments error:', error);
    throw error;
  }
};

/**
 * Assignment istatistikleri
 */
export const getAssignmentStats = async (): Promise<{
  totalAssignments: number;
  activeAssignments: number;
  returnedAssignments: number;
  urgentAssignments: number;
  autoApprovalAssignments: number;
  overdueAssignments: number;
  recentAssignments: AssetAssignment[];
  statusBreakdown: { [status: string]: number };
}> => {
  try {
    const allAssignments = await getAllAssignments();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    // Status breakdown
    const statusBreakdown: { [status: string]: number } = {};
    allAssignments.forEach(assignment => {
      statusBreakdown[assignment.status] = (statusBreakdown[assignment.status] || 0) + 1;
    });

    // Overdue assignments
    const overdueAssignments = allAssignments.filter(assignment => 
      assignment.status === 'Active' &&
      assignment.returnDate &&
      new Date(assignment.returnDate) < now
    );

    return {
      totalAssignments: allAssignments.length,
      activeAssignments: allAssignments.filter(a => a.status === 'Active').length,
      returnedAssignments: allAssignments.filter(a => a.status === 'Returned').length,
      urgentAssignments: allAssignments.filter(a => a.isUrgent).length,
      autoApprovalAssignments: allAssignments.filter(a => a.isAutomaticApproval).length,
      overdueAssignments: overdueAssignments.length,
      recentAssignments: allAssignments
        .filter(a => new Date(a.assignmentDate) >= oneWeekAgo)
        .sort((a, b) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime())
        .slice(0, 10),
      statusBreakdown
    };
  } catch (error) {
    console.error('getAssignmentStats error:', error);
    throw error;
  }
};

/**
 * Departman bazında assignment'ları getir
 */
export const getDepartmentAssignments = async (departmentId: string): Promise<AssetAssignment[]> => {
  try {
    // Bu fonksiyon için Users API'sinden departman bilgisini alıp filtreleme yapmak gerekebilir
    // Şimdilik temel implementasyon
    const allAssignments = await getAllAssignments();
    
    // Users endpoint'inden kullanıcıları al ve departman bilgisiyle filtrele
    const usersResponse = await fetch(`${API_BASE_URL}/api/Users`);
    if (!usersResponse.ok) {
      console.warn('Users bilgisi alınamadı, departman filtresi uygulanamıyor');
      return allAssignments;
    }
    
    const users = await usersResponse.json();
    const departmentUserIds = users
      .filter((user: any) => user.departmentId === departmentId)
      .map((user: any) => user.id);
    
    return allAssignments.filter(assignment => 
      departmentUserIds.includes(assignment.assignedToId)
    );
  } catch (error) {
    console.error('getDepartmentAssignments error:', error);
    throw error;
  }
};

/**
 * Assignment arama fonksiyonu
 */
export const searchAssignments = async (searchTerm: string): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allAssignments.filter(assignment => 
      assignment.assignmentNumber.toLowerCase().includes(lowerSearchTerm) ||
      assignment.notes?.toLowerCase().includes(lowerSearchTerm) ||
      assignment.status.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('searchAssignments error:', error);
    throw error;
  }
};

// ========================================
// ANA ASSIGNMENTS API OBJESİ
// ========================================
export const assignmentsApi = {
  // Temel CRUD
  getAll: getAllAssignments,
  getById: getAssignmentById,
  create: createAssignment,
  update: updateAssignment,
  delete: deleteAssignment,
  
  // Özel işlemler
  assignToUser: assignAssetToUser,
  return: returnAssignment,
  transfer: transferAsset,
  
  // Kullanıcı bazlı
  getUserAssignments: getUserAssignments,
  getUserActiveAssignments: getUserActiveAssignments,
  
  // Asset bazlı
  getAssetHistory: getAssetAssignmentHistory,
  
  // Departman bazlı
  getDepartmentAssignments: getDepartmentAssignments,
  
  // Filtreleme ve arama
  getActive: getActiveAssignments,
  getUrgent: getUrgentAssignments,
  getOverdue: getOverdueAssignments,
  search: searchAssignments,
  
  // Toplu işlemler
  bulkAssign: bulkAssignAssets,
  bulkDelete: deleteMultipleAssignments,
  
  // İstatistikler
  getStats: getAssignmentStats,
  
  // Doğrulama
  validateDeletion: validateAssignmentDeletion,
  checkExists: checkAssignmentExists,
  isActive: isAssignmentActive,
  
  // Hızlı işlemler
  markUrgent: markAssignmentUrgent,
  setAutoApproval: setAutoApproval,
  updateNotes: updateAssignmentNotes
} as const;

// ========================================
// DEFAULT EXPORT
// ========================================
export default assignmentsApi;