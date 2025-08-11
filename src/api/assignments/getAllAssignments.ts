// src/api/assignments/getAllAssignments.ts

import type { AssetAssignment } from '../types/assignment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Tüm asset atamalarını getirir
 * @returns Promise<AssetAssignment[]>
 */
export const getAllAssignments = async (): Promise<AssetAssignment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const assignments: AssetAssignment[] = await response.json();
    return assignments;
  } catch (error) {
    console.error('getAllAssignments error:', error);
    throw new Error('Atamalar yüklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Aktif atamaları getirir
 * @returns Promise<AssetAssignment[]>
 */
export const getActiveAssignments = async (): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    return allAssignments.filter(assignment => assignment.status === 'Active');
  } catch (error) {
    console.error('getActiveAssignments error:', error);
    throw error;
  }
};

/**
 * Acil atamaları getirir
 * @returns Promise<AssetAssignment[]>
 */
export const getUrgentAssignments = async (): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    return allAssignments.filter(assignment => 
      assignment.isUrgent && assignment.status === 'Active'
    );
  } catch (error) {
    console.error('getUrgentAssignments error:', error);
    throw error;
  }
};

/**
 * Belirli bir kullanıcının atamalarını getirir
 * @param userId - Kullanıcı ID'si
 * @returns Promise<AssetAssignment[]>
 */
export const getUserAssignments = async (userId: string): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    return allAssignments.filter(assignment => assignment.assignedToId === userId);
  } catch (error) {
    console.error('getUserAssignments error:', error);
    throw error;
  }
};

/**
 * Belirli bir asset'in atama geçmişini getirir
 * @param assetId - Asset ID'si
 * @returns Promise<AssetAssignment[]>
 */
export const getAssetAssignmentHistory = async (assetId: string): Promise<AssetAssignment[]> => {
  try {
    const allAssignments = await getAllAssignments();
    return allAssignments
      .filter(assignment => assignment.assetId === assetId)
      .sort((a, b) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime());
  } catch (error) {
    console.error('getAssetAssignmentHistory error:', error);
    throw error;
  }
};

export default getAllAssignments;