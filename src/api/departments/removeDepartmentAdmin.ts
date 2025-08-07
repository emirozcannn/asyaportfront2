// ==============================================
// removeDepartmentAdmin.ts
// ==============================================

const API_BASE_URL = 'https://localhost:7190/api';

export const removeDepartmentAdmin = async (adminId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DepartmentAdmins/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove department admin: ${response.status}`);
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    console.error('Error removing department admin:', error);
    throw error;
  }
};