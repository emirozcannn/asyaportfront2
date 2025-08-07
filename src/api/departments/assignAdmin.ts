// ==============================================
// assignAdmin.ts
// ==============================================
import type { AssignAdminDto } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

import type { Department } from '../types/department';

export const assignAdmin = async (data: AssignAdminDto): Promise<Department> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentAdmins`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_id: data.departmentId,
        user_id: data.adminId,
        assigned_at: data.assignedAt || new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign admin: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error assigning admin:', error);
    throw error;
  }
};