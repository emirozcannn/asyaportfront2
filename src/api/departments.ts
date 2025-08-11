const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export async function getAllDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Departments`);
    if (!response.ok) throw new Error('Departmanlar yüklenemedi');
    return await response.json();
  } catch (error) {
    console.error('Departments API error:', error);
    // Fallback data
    return [
      { id: '1', name: 'Bilgi ve İletişim Teknolojileri', code: 'IT' },
      { id: '2', name: 'Güvenlik', code: 'SEC' },
      { id: '3', name: 'El Terminalleri', code: 'HTML' },
      { id: '4', name: 'İdari İşler', code: 'ADM' }
    ];
  }
}


export const departmentsApi = {
  getAll: getAllDepartments
};

// createDepartment, deleteDepartment, getDepartmentStats, updateDepartment, createDepartmentPermission, deleteDepartmentPermission, getAllCategories, getAllPermissions, getDepartmentPermissions ve updateDepartmentPermission fonksiyonlarını buradan export et
export { createDepartment } from './departments/createDepartment';
export { deleteDepartment } from './departments/deleteDepartment';
export { getDepartmentStats } from './departments/getDepartmentStats';
export { updateDepartment } from './departments/updateDepartment';
export { createDepartmentPermission } from './departments/createDepartmentPermission';
export { deleteDepartmentPermission } from './departments/deleteDepartmentPermission';
export { getAllCategories } from './departments/getAllCategories';
export { getAllPermissions } from './departments/getAllPermissions';
export { getDepartmentPermissions } from './departments/getDepartmentPermissions';
export { updateDepartmentPermission } from './departments/updateDepartmentPermission';
