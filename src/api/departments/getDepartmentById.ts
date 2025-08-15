// ==============================================
// getDepartmentById.ts
// ==============================================
import type { Department } from '../types/department';

const API_BASE_URL = 'http://localhost:7190/api';

export const getDepartmentById = async (id: string): Promise<Department> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Departments/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch department: ${response.status}`);
    }

    const department: Department = await response.json();
    return department;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
};
