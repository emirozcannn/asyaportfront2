import { apiRequest } from './supabaseAuth';

export interface Department {
  id: string;
  name: string;
  description?: string;
}

// Backend'den frontend'e mapping fonksiyonu
function mapBackendDepartmentToFrontend(dept: any): Department {
  return {
    id: dept.id || dept.Id,
    name: dept.name || dept.Name,
    description: dept.description || dept.Description
  };
}

export async function fetchDepartments(): Promise<Department[]> {
  try {
    console.log('Fetching departments...');
    const data = await apiRequest('/api/Departments', {
      method: 'GET'
    });
    console.log('Fetched departments:', data);
    return Array.isArray(data) ? data.map(mapBackendDepartmentToFrontend) : [];
  } catch (error) {
    console.error('Fetch departments error:', error);
    throw new Error(`Departmanlar yüklenemedi: ${error.message}`);
  }
}
