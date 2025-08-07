// ==============================================
// updateDepartmentPermission.ts
// ==============================================
import type { DepartmentCategoryPermission, UpdateDepartmentPermissionDto } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const updateDepartmentPermission = async (
  id: string, 
  data: UpdateDepartmentPermissionDto
): Promise<DepartmentCategoryPermission> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentCategoryPermissions/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        can_assign: data.can_assign,
        can_manage: data.can_manage,
        created_at: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (errorText.includes('ID mismatch')) {
        throw new Error('ID uyuşmazlığı hatası.');
      }
      
      throw new Error(`Failed to update department permission: ${response.status}`);
    }

    const permission: DepartmentCategoryPermission = await response.json();
    return permission;
  } catch (error) {
    console.error('Error updating department permission:', error);
    throw error;
  }
};