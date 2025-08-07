// ==============================================
// deleteDepartment.ts
// ==============================================

const API_BASE_URL = 'https://localhost:7190/api';

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const deleteDepartment = async (id: string): Promise<DeleteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Departments/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // API'den gelen hata mesajını yakala
      const errorText = await response.text();
      
      // Foreign key constraint hatası
      if (errorText.includes('foreign key constraint')) {
        return {
          success: false,
          message: 'Bu departman silinemez. Departmana bağlı kayıtlar bulunmaktadır.'
        };
      }
      
      return {
        success: false,
        message: `Departman silinirken hata oluştu: ${response.status}`
      };
    }

    return {
      success: true,
      message: 'Departman başarıyla silindi'
    };
  } catch (error) {
    console.error('Error deleting department:', error);
    return {
      success: false,
      message: 'Ağ hatası: Departman silinemedi'
    };
  }
};