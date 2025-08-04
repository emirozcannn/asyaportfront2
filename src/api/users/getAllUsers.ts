// src/api/users/getAllUsers.ts
import { getAuthHeaders } from '../auth/utils';
import type { User, UserFilters } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export async function getAllUsers(filters?: UserFilters): Promise<User[]> {
  try {
    const headers = getAuthHeaders();
    
    // Filtreleme parametrelerini hazırla (backend'de filtreleme varsa)
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.departmentId) {
      params.append('departmentId', filters.departmentId);
    }
    if (filters?.role) {
      params.append('role', filters.role);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/Users${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kullanıcılar getirilemedi: ${errorText}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}