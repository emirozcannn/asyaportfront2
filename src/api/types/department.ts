// ==============================================
// types/department.ts - Interface definitions
// ==============================================
export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
}

export interface UpdateDepartmentDto {
  name: string;
  code: string;
}

export interface AssignAdminDto {
  departmentId: string;
  adminId: string;
  assignedBy: string;
  assignedAt?: string;
}

// Department Category Permissions
export interface DepartmentCategoryPermission {
  id: string;
  department_id: string;
  category_id: string;
  can_assign: boolean;
  can_manage: boolean;
}

export interface CreateDepartmentPermissionDto {
  department_id: string;
  category_id: string;
  can_assign: boolean;
  can_manage: boolean;
}

export interface UpdateDepartmentPermissionDto {
  can_assign: boolean;
  can_manage: boolean;
}

// Department Statistics
export interface DepartmentStats {
  totalDepartments: number;
  latestDepartment?: Department;
  averageDepartmentsPerMonth: number;
  departmentCodes: string[];
}

export interface SpecificDepartmentStats {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  mostUsedCategory: string;
}

export interface DepartmentAdmin {
  id: string;
  departmentId: string;
  userId: string;
  assignedAt: string;
}