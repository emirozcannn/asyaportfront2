// ==============================================
// createDepartmentPermission.ts
// ==============================================
import type { DepartmentCategoryPermission, CreateDepartmentPermissionDto } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const createDepartmentPermission = async (data: CreateDepartmentPermissionDto): Promise<DepartmentCategoryPermission> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentCategoryPermissions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_id: data.department_id,
        category_id: data.category_id,
        can_assign: data.can_assign,
        can_manage: data.can_manage,
        created_at: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Foreign key constraint hatası
      if (errorText.includes('foreign key constraint')) {
        throw new Error('Belirtilen departman veya kategori bulunamadı.');
      }
      
      throw new Error(`Failed to create department permission: ${response.status}`);
    }

    const permission: DepartmentCategoryPermission = await response.json();
    return permission;
  } catch (error) {
    console.error('Error creating department permission:', error);
    throw error;
  }
};