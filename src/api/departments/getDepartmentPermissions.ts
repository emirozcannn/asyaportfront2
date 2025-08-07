// ==============================================
// getDepartmentPermissions.ts
// ==============================================
import type { DepartmentCategoryPermission } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const getDepartmentPermissions = async (): Promise<DepartmentCategoryPermission[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentCategoryPermissions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch department permissions: ${response.status}`);
    }

    const permissions: DepartmentCategoryPermission[] = await response.json();
    return permissions;
  } catch (error) {
    console.error('Error fetching department permissions:', error);
    throw error;
  }
};

export const getDepartmentPermissionsByDepartment = async (departmentId: string): Promise<DepartmentCategoryPermission[]> => {
  try {
    const allPermissions = await getDepartmentPermissions();
    return allPermissions.filter(p => p.department_id === departmentId);
  } catch (error) {
    console.error('Error fetching department permissions by department:', error);
    throw error;
  }
};