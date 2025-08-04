// src/api/users/userRoles.ts
import { getAuthHeaders } from '../auth/utils';
import type { UserRole } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

export async function getUserRoles(): Promise<Role[]> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/roles`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Roller getirilemedi: ${errorText}`);
    }

    const roles = await response.json();
    return roles;
  } catch (error) {
    console.error('Get user roles error:', error);
    throw error;
  }
}

export async function assignUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/Users/${userId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      if (response.status === 403) {
        throw new Error('Rol atama yetkiniz yok');
      }
      
      throw new Error(`Rol atanamadı: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Assign user role error:', error);
    throw error;
  }
}