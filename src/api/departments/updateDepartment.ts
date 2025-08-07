// ==============================================
// updateDepartment.ts
// ==============================================
import type { Department, UpdateDepartmentDto } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const updateDepartment = async (id: string, departmentData: UpdateDepartmentDto): Promise<Department> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Departments/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update department: ${JSON.stringify(errorData)}`);
    }

    const updatedDepartment: Department = await response.json();
    return updatedDepartment;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// Validation helper
export const validateUpdateDepartment = (data: UpdateDepartmentDto): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Department name is required');
  }
  
  if (!data.code || data.code.trim().length === 0) {
    errors.push('Department code is required');
  }
  
  if (data.code && !/^[A-Z]{2,4}$/.test(data.code)) {
    errors.push('Department code must be 2-4 uppercase letters');
  }
  
  return errors;
};

 