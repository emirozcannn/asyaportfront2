// src/api/assignments/getAssignmentById.ts

import type { AssetAssignment } from '../types/assignment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Belirli bir assignment'ı ID'ye göre getirir
 * @param id - Assignment ID'si
 * @returns Promise<AssetAssignment>
 */
export const getAssignmentById = async (id: string): Promise<AssetAssignment> => {
  try {
    if (!id) {
      throw new Error('Assignment ID gereklidir');
    }

    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`ID ${id} ile assignment bulunamadı`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const assignment: AssetAssignment = await response.json();
    return assignment;
  } catch (error) {
    console.error('getAssignmentById error:', error);
    throw new Error('Assignment yüklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Assignment'ın mevcut olup olmadığını kontrol eder
 * @param id - Assignment ID'si
 * @returns Promise<boolean>
 */
export const checkAssignmentExists = async (id: string): Promise<boolean> => {
  try {
    await getAssignmentById(id);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Assignment'ın aktif olup olmadığını kontrol eder
 * @param id - Assignment ID'si
 * @returns Promise<boolean>
 */
export const isAssignmentActive = async (id: string): Promise<boolean> => {
  try {
    const assignment = await getAssignmentById(id);
    return assignment.status === 'Active';
  } catch (error) {
    return false;
  }
};

export default getAssignmentById;