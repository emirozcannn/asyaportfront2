// src/api/maintenance/createMaintenanceSchedule.ts
interface CreateMaintenanceScheduleData {
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  assignedTo: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  priority: string;
}

export const createMaintenanceSchedule = async (data: CreateMaintenanceScheduleData): Promise<ApiMaintenanceSchedule> => {
  try {
    const response = await apiClient.post('/api/MaintenanceCalendar', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }
    throw new Error(error.response?.data || error.message || 'Bakım programı oluşturulamadı');
  }
};

// src/api/maintenance/updateMaintenanceStatus.ts
export const updateMaintenanceStatus = async (
  id: string, 
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Overdue'
): Promise<void> => {
  try {
    await apiClient.patch(`/api/MaintenanceCalendar/${id}/status`, { status });
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Durum güncellenemedi');
  }
};

// src/api/maintenance/deleteMaintenanceSchedule.ts
export const deleteMaintenanceSchedule = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/MaintenanceCalendar/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Bakım programı silinemedi');
  }
};