// ==============================================
// createDepartment.ts
// ==============================================
import type { Department, CreateDepartmentDto } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

export const createDepartment = async (departmentData: CreateDepartmentDto): Promise<Department> => {
  try {
    // Doğrudan name ve code gönder
    const requestBody = {
      name: departmentData.name,
      code: departmentData.code,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/Departments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create department: ${JSON.stringify(errorData)}`);
    }

    const createdDepartment: Department = await response.json();
    return createdDepartment;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};
// Validation helper
export const validateCreateDepartment = (data: CreateDepartmentDto): string[] => {
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

export const isDepartmentCodeUnique = async (code: string): Promise<boolean> => {
  try {
    const { getAllDepartments } = await import('./getAllDepartments');
    const departments = await getAllDepartments();
    return !departments.some(dept => dept.code.toLowerCase() === code.toLowerCase());
  } catch (error) {
    console.error('Error checking department code uniqueness:', error);
    return true;
  }
};