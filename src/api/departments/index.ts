// ==============================================
// departments/index.ts - Central export file
// ==============================================

// Export all API functions - CRUD Operations
export { getAllDepartments } from './getAllDepartments';
export { getDepartmentById } from './getDepartmentById';
export { createDepartment, validateCreateDepartment, isDepartmentCodeUnique } from './createDepartment';
export { updateDepartment } from './updateDepartment';
export { deleteDepartment } from './deleteDepartment';

// Statistics
export { getDepartmentStats, getSpecificDepartmentStats, getDepartmentStatsById } from './getDepartmentStats';

// Department Admins
export { assignAdmin } from './assignAdmin';
export { getDepartmentAdmins } from './getDepartmentAdmins';
export { removeDepartmentAdmin } from './removeDepartmentAdmin';

// Department Permissions
export { getDepartmentPermissions } from './getDepartmentPermissions';
export { getDepartmentPermissionsByDepartment } from './getDepartmentPermissions';
export { createDepartmentPermission } from './createDepartmentPermission';
export { updateDepartmentPermission } from './updateDepartmentPermission';
export { deleteDepartmentPermission } from './deleteDepartmentPermission';

// Re-export all types
export type { 
  Department, 
  CreateDepartmentDto, 
  UpdateDepartmentDto, 
  AssignAdminDto,
  DepartmentCategoryPermission,
  CreateDepartmentPermissionDto,
  UpdateDepartmentPermissionDto,
  DepartmentStats,
  SpecificDepartmentStats
} from '../types/department';