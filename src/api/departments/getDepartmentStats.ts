// ==============================================
// getDepartmentStats.ts
// ==============================================
import type { Department, DepartmentStats, SpecificDepartmentStats } from '../types/department';

const API_BASE_URL = 'https://localhost:7190/api';

// Genel departman istatistikleri
export const getDepartmentStats = async (): Promise<DepartmentStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Departments`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch departments for stats: ${response.status}`);
    }

    const departments: Department[] = await response.json();
    
    // İstatistikleri hesapla
    const stats: DepartmentStats = {
      totalDepartments: departments.length,
      latestDepartment: departments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0],
      averageDepartmentsPerMonth: Math.round(departments.length / 12), // Basit hesaplama
      departmentCodes: departments.map(d => d.code)
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};

// Belirli bir departmanın detaylı istatistikleri
export const getSpecificDepartmentStats = async (departmentId: string): Promise<SpecificDepartmentStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentStatistics/${departmentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch specific department stats: ${response.status}`);
    }

    const stats: SpecificDepartmentStats = await response.json();
    return stats;
  } catch (error) {
    console.error('Error fetching specific department stats:', error);
    throw error;
  }
};

// Alternatif: Departman ID'sini parametre olarak alan genel stats fonksiyonu
export const getDepartmentStatsById = async (departmentId?: string): Promise<DepartmentStats | SpecificDepartmentStats> => {
  if (departmentId) {
    return await getSpecificDepartmentStats(departmentId);
  } else {
    return await getDepartmentStats();
  }
};