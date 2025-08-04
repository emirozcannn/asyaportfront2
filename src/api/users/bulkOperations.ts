// src/api/users/bulkOperations.ts
import { getAuthHeaders } from '../auth/utils';
import type { UserStatus, UserRole } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface BulkUpdateRequest {
  userIds: string[];
  status?: UserStatus;
  role?: UserRole;
  departmentId?: string;
}

export interface BulkDeleteRequest {
  userIds: string[];
}

export interface BulkUserOperationResult {
  successCount: number;
  failureCount: number;
  errors: string[];
}

export async function bulkUpdateUsers(request: BulkUpdateRequest): Promise<BulkUserOperationResult> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/bulk-update`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Toplu güncelleme başarısız: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Bulk update users error:', error);
    throw error;
  }
}

export async function bulkDeleteUsers(request: BulkDeleteRequest): Promise<BulkUserOperationResult> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/bulk-delete`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Toplu silme başarısız: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Bulk delete users error:', error);
    throw error;
  }
}

// Ana export - bu eksikti!
export const bulkUserOperations = {
  bulkUpdateUsers,
  bulkDeleteUsers
};