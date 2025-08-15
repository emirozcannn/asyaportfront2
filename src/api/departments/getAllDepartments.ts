// ==============================================
// getAllDepartments.ts
// ==============================================
import type { Department } from '../types/department';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Departments`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status}`);
    }

    const departments: Department[] = await response.json();
    return departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};