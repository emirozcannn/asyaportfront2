// src/api/maintenance/deleteMaintenanceSchedule.ts
export const deleteMaintenanceSchedule = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/MaintenanceCalendar/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Bakım programı silinemedi');
  }
};