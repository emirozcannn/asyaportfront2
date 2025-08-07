// ==============================================
// getDepartmentAdmins.ts
// ==============================================

const API_BASE_URL = 'https://localhost:7190/api';

export const getDepartmentAdmins = async (departmentId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentAdmins/${departmentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch department admins: ${response.status}`);
    }

    const admins: any[] = await response.json();
    return admins;
  } catch (error) {
    console.error('Error fetching department admins:', error);
    throw error;
  }
};