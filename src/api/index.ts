// src/api/index.ts - Mevcut klasör yapınıza uygun final versiyon

import axios from 'axios';

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backend;

// ========================================
// ASSETS MODÜLÜ - TAM İMPORT
// ========================================
export {
  getAllAssets,
  getFilteredAssets,
  getAssetStats,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetById,
  checkAssetAssignmentStatus,
  getAssetAssignmentHistory,
  assetsApi,
  assetStatusApi,
  assetHistoryApi,
  stockStatusApi,
  assetTransferApi,
  qrGeneratorApi,
  bulkOperationsApi,
  exportImportApi,
  categoriesApi,
  type AssetResponse,
  type AssetDetails,
  type AssignmentHistory,
  type TransferHistory
} from './assets';

// ========================================
// ASSIGNMENTS MODÜLÜ - TAM İMPORT
// ========================================
export {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from './assignments';

// ========================================
// DEPARTMENTS MODÜLÜ - TAM İMPORT
// ========================================
export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  validateCreateDepartment,
  isDepartmentCodeUnique,
  getDepartmentStats,
  getSpecificDepartmentStats,
  getDepartmentStatsById,
  assignAdmin,
  getDepartmentAdmins,
  removeDepartmentAdmin,
  getDepartmentPermissions,
  getDepartmentPermissionsByDepartment,
  createDepartmentPermission,
  updateDepartmentPermission,
  deleteDepartmentPermission,
  getAllCategories,
  getAllPermissions,
  type Department,
  type CreateDepartmentDto,
  type UpdateDepartmentDto,
  type AssignAdminDto,
  type DepartmentCategoryPermission,
  type CreateDepartmentPermissionDto,
  type UpdateDepartmentPermissionDto,
  type DepartmentStats,
  type SpecificDepartmentStats
} from './departments';

// ========================================
// USERS MODÜLÜ - TAM İMPORT
// ========================================
export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserRoles,
  getUserStats,
  bulkUserOperations,
  userActivity
} from './users';

// ========================================
// CATEGORIES MODÜLÜ
// ========================================
export {
  categoriesApiExtended,
  getCategoryUsageStats,
  getTopCategories,
  getEmptyCategories,
  getCategorySuggestions
} from './categories';

// ========================================
// AUTH MODÜLÜ
// ========================================
export {
  login,
  logout,
  register,
  getProfile
} from './auth';

// ========================================
// REQUESTS MODÜLÜ
// ========================================
export {
  createRequest,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  updateRequest,
  urgentRequests,
  autoApprove
} from './requests';

// ========================================
// RETURNS MODÜLÜ
// ========================================
export {
  createReturn,
  getAllReturns,
  getReturnById,
  completeReturn,
  updateReturn,
  overdueReturns,
  reminders,
  returnCalendar
} from './returns';

// ========================================
// REPORTS MODÜLÜ
// ========================================
export {
  assetReports,
  departmentReports,
  userReports,
  costAnalysis,
  trendAnalysis,
  usageAnalysis,
  exportReports,
  dashboardStats
} from './reports';

// ========================================
// MAINTENANCE MODÜLÜ
// ========================================
export {
  maintenanceCalendar,
  maintenanceHistory,
  serviceRequests,
  partsManagement,
  warrantyTracking
} from './maintenance';

// ========================================
// SECURITY MODÜLÜ
// ========================================
export {
  accessLogs,
  userActivity as securityUserActivity,
  sessionManagement,
  suspiciousActivity,
  securityPolicies,
  ipRestrictions,
  roleHistory
} from './security';

// ========================================
// SETTINGS MODÜLÜ
// ========================================
export {
  generalSettings,
  notificationSettings,
  approvalSettings,
  systemParameters,
  emailTemplates,
  categoryMapping,
  systemMaintenance,
  backupRestore
} from './settings';

// ========================================
// INTEGRATION MODÜLÜ
// ========================================
export {
  apiManagement,
  webhookSettings,
  thirdPartyIntegrations,
  pushNotifications,
  mobileSettings,
  qrManagement
} from './integration';

// ========================================
// HELP MODÜLÜ
// ========================================
export {
  documentation,
  faq,
  userGuide,
  videoTutorials,
  technicalSupport,
  feedback,
  systemStatus
} from './help';

// ========================================
// TYPE EXPORTS
// ========================================
export type {
  Asset,
  AssetDto,
  AssetUpdateDto,
  User,
  Department
} from './types';

// ========================================
// ANA API OBJESİ - TAMAMLANMİŞ
// ========================================
export const api = {
  // Backend config
  backend,

  // ========================================
  // ASSETS - Tam fonksiyonalite
  // ========================================
  assets: {
    // Temel CRUD
    getAll: async () => {
      const { getAllAssets } = await import('./assets');
      return getAllAssets();
    },
    getFiltered: async (filters: any) => {
      const { getFilteredAssets } = await import('./assets');
      return getFilteredAssets(filters);
    },
    getStats: async () => {
      const { getAssetStats } = await import('./assets');
      return getAssetStats();
    },
    getById: async (id: string) => {
      const { getAssetById } = await import('./assets');
      return getAssetById(id);
    },
    create: async (data: any) => {
      const { createAsset } = await import('./assets');
      return createAsset(data);
    },
    update: async (id: string, data: any) => {
      const { updateAsset } = await import('./assets');
      return updateAsset(id, data);
    },
    delete: async (id: string) => {
      const { deleteAsset } = await import('./assets');
      return deleteAsset(id);
    },
    
    // Assignment kontrolü
    checkAssignmentStatus: async (assetId: string) => {
      const { checkAssetAssignmentStatus } = await import('./assets');
      return checkAssetAssignmentStatus(assetId);
    },
    getAssignmentHistory: async (assetId: string) => {
      const { getAssetAssignmentHistory } = await import('./assets');
      return getAssetAssignmentHistory(assetId);
    },
    
    // Toplu işlemler
    bulkDelete: async (assetIds: string[]) => {
      const { bulkOperationsApi } = await import('./assets');
      return bulkOperationsApi.deleteMultiple(assetIds);
    },
    bulkUpdateStatus: async (assetIds: string[], status: string) => {
      const { bulkOperationsApi } = await import('./assets');
      return bulkOperationsApi.updateStatusMultiple({ assetIds, newStatus: status });
    },
    
    // Export/Import
    exportToCSV: async (options: any) => {
      const { exportImportApi } = await import('./assets');
      return exportImportApi.exportToCSV(options);
    },
    importFromCSV: async (options: any) => {
      const { exportImportApi } = await import('./assets');
      return exportImportApi.importFromCSV(options);
    },
    
    // QR işlemleri
    generateQR: async (assetId: string, assetNumber: string, assetName: string) => {
      const { qrGeneratorApi } = await import('./assets');
      return qrGeneratorApi.generateQR(assetId, assetNumber, assetName);
    },
    
    // Kategoriler
    categories: {
      getAll: async () => {
        const { categoriesApi } = await import('./assets');
        return categoriesApi.getAll();
      },
      create: async (data: any) => {
        const { categoriesApi } = await import('./assets');
        return categoriesApi.create(data);
      },
      update: async (id: string, data: any) => {
        const { categoriesApi } = await import('./assets');
        return categoriesApi.update(id, data);
      },
      delete: async (id: string) => {
        const { categoriesApi } = await import('./assets');
        return categoriesApi.delete(id);
      }
    }
  },

  // ========================================
  // ASSIGNMENTS - Temel fonksiyonlar
  // ========================================
  assignments: {
    getAll: async () => {
      const { getAllAssignments } = await import('./assignments');
      return getAllAssignments();
    },
    getById: async (id: string) => {
      const { getAssignmentById } = await import('./assignments');
      return getAssignmentById(id);
    },
    create: async (data: any) => {
      const { createAssignment } = await import('./assignments');
      return createAssignment(data);
    },
    update: async (id: string, data: any) => {
      const { updateAssignment } = await import('./assignments');
      return updateAssignment(id, data);
    },
    delete: async (id: string) => {
      const { deleteAssignment } = await import('./assignments');
      return deleteAssignment(id);
    }
  },

  // ========================================
  // DEPARTMENTS - Tam fonksiyonalite
  // ========================================
  departments: {
    getAll: async () => {
      const { getAllDepartments } = await import('./departments');
      return getAllDepartments();
    },
    getById: async (id: string) => {
      const { getDepartmentById } = await import('./departments');
      return getDepartmentById(id);
    },
    create: async (data: any) => {
      const { createDepartment } = await import('./departments');
      return createDepartment(data);
    },
    update: async (id: string, data: any) => {
      const { updateDepartment } = await import('./departments');
      return updateDepartment(id, data);
    },
    delete: async (id: string) => {
      const { deleteDepartment } = await import('./departments');
      return deleteDepartment(id);
    },
    getStats: async () => {
      const { getDepartmentStats } = await import('./departments');
      return getDepartmentStats();
    }
  },

  // ========================================
  // USERS - Tam fonksiyonalite
  // ========================================
  users: {
    getAll: async () => {
      const { getAllUsers } = await import('./users');
      return getAllUsers();
    },
    getById: async (id: string) => {
      const { getUserById } = await import('./users');
      return getUserById(id);
    },
    getByEmail: async (email: string) => {
      const { getUserByEmail } = await import('./users');
      return getUserByEmail(email);
    },
    create: async (data: any) => {
      const { createUser } = await import('./users');
      return createUser(data);
    },
    update: async (id: string, data: any) => {
      const { updateUser } = await import('./users');
      return updateUser(id, data);
    },
    delete: async (id: string) => {
      const { deleteUser } = await import('./users');
      return deleteUser(id);
    },
    updateStatus: async (id: string, status: string) => {
      const { updateUserStatus } = await import('./users');
      return updateUserStatus(id, status);
    },
    getStats: async () => {
      const { getUserStats } = await import('./users');
      return getUserStats();
    }
  },

  // ========================================
  // REQUESTS - Tam fonksiyonalite
  // ========================================
  requests: {
    getAll: async () => {
      const { getAllRequests } = await import('./requests');
      return getAllRequests();
    },
    getById: async (id: string) => {
      const { getRequestById } = await import('./requests');
      return getRequestById(id);
    },
    create: async (data: any) => {
      const { createRequest } = await import('./requests');
      return createRequest(data);
    },
    approve: async (id: string) => {
      const { approveRequest } = await import('./requests');
      return approveRequest(id);
    },
    reject: async (id: string) => {
      const { rejectRequest } = await import('./requests');
      return rejectRequest(id);
    },
    getUrgent: async () => {
      const { urgentRequests } = await import('./requests');
      return urgentRequests();
    }
  },

  // ========================================
  // RETURNS - Tam fonksiyonalite
  // ========================================
  returns: {
    getAll: async () => {
      const { getAllReturns } = await import('./returns');
      return getAllReturns();
    },
    getById: async (id: string) => {
      const { getReturnById } = await import('./returns');
      return getReturnById(id);
    },
    create: async (data: any) => {
      const { createReturn } = await import('./returns');
      return createReturn(data);
    },
    complete: async (id: string) => {
      const { completeReturn } = await import('./returns');
      return completeReturn(id);
    },
    getOverdue: async () => {
      const { overdueReturns } = await import('./returns');
      return overdueReturns();
    }
  },

  // ========================================
  // REPORTS - Raporlama
  // ========================================
  reports: {
    assets: async () => {
      const { assetReports } = await import('./reports');
      return assetReports();
    },
    departments: async () => {
      const { departmentReports } = await import('./reports');
      return departmentReports();
    },
    users: async () => {
      const { userReports } = await import('./reports');
      return userReports();
    },
    dashboard: async () => {
      const { dashboardStats } = await import('./reports');
      return dashboardStats();
    }
  }
} as const;