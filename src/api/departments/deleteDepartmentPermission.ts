// ==============================================
// deleteDepartmentPermission.ts
// ==============================================
import type { DepartmentCategoryPermission } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const deleteDepartmentPermission = async (id: string): Promise<DepartmentCategoryPermission> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentCategoryPermissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete department permission: ${response.status}`);
    }

    const deletedPermission: DepartmentCategoryPermission = await response.json();
    return deletedPermission;
  } catch (error) {
    console.error('Error deleting department permission:', error);
    throw error;
  }
};