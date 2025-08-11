// src/api/assignments/updateAssignment.ts

import type { AssetAssignment, UpdateAssignmentDto } from '../types/assignment';
import { getAssignmentById } from './getAssignmentById';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Assignment'ı günceller
 * @param id - Assignment ID
 * @param assignmentData - Güncellenecek veriler
 * @returns Promise<AssetAssignment>
 */
export const updateAssignment = async (id: string, assignmentData: UpdateAssignmentDto): Promise<AssetAssignment> => {
  try {
    if (!id) {
      throw new Error('Assignment ID gereklidir');
    }

    // Önce mevcut assignment'ı al
    const existingAssignment = await getAssignmentById(id);
    
    // Backend'in beklediği tam format (API doc'a göre)
    const requestBody = {
      baseUrl: "string",
      requestClientOptions: {
        schema: "string",
        headers: {},
        queryParams: {}
      },
      id: existingAssignment.id,
      asset_id: existingAssignment.assetId,
      assigned_to_id: existingAssignment.assignedToId,
      assigned_by: existingAssignment.assignedById,
      assignment_date: existingAssignment.assignmentDate,
      return_date: assignmentData.return_date ?? existingAssignment.returnDate,
      status: assignmentData.status ?? existingAssignment.status,
      notes: assignmentData.notes ?? existingAssignment.notes,
      is_urgent: assignmentData.is_urgent ?? existingAssignment.isUrgent,
      is_automatic_approval: assignmentData.is_automatic_approval ?? existingAssignment.isAutomaticApproval,
      created_at: existingAssignment.createdAt,
      updated_at: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('updateAssignment error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const updatedAssignment: AssetAssignment = await response.json();

    // Eğer status değiştirilmişse asset durumunu da güncelle
    if (assignmentData.status && assignmentData.status !== existingAssignment.status) {
      try {
        await updateAssetStatus(existingAssignment.assetId, assignmentData.status);
      } catch (error) {
        console.warn('Asset status güncellenemedi:', error);
      }
    }

    return updatedAssignment;
  } catch (error) {
    console.error('updateAssignment error:', error);
    throw new Error('Assignment güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Assignment'ı sonlandırır (return işlemi)
 * @param id - Assignment ID
 * @param returnNotes - İade notları
 * @returns Promise<AssetAssignment>
 */
export const returnAssignment = async (id: string, returnNotes?: string): Promise<AssetAssignment> => {
  try {
    const updatedAssignment = await updateAssignment(id, {
      status: 'Returned',
      return_date: new Date().toISOString(),
      notes: returnNotes || 'Asset iade edildi'
    });

    // Asset durumunu Available yap
    try {
      await updateAssetStatusToAvailable(updatedAssignment.assetId);
    } catch (error) {
      console.warn('Asset status "Available" olarak güncellenemedi:', error);
    }

    return updatedAssignment;
  } catch (error) {
    console.error('returnAssignment error:', error);
    throw error;
  }
};

/**
 * Assignment'ı acil olarak işaretler
 * @param id - Assignment ID
 * @param isUrgent - Acil durumu
 * @returns Promise<AssetAssignment>
 */
export const markAssignmentUrgent = async (id: string, isUrgent: boolean = true): Promise<AssetAssignment> => {
  try {
    return await updateAssignment(id, {
      is_urgent: isUrgent
    });
  } catch (error) {
    console.error('markAssignmentUrgent error:', error);
    throw error;
  }
};

/**
 * Assignment'ın otomatik onay durumunu değiştirir
 * @param id - Assignment ID
 * @param isAutoApproval - Otomatik onay durumu
 * @returns Promise<AssetAssignment>
 */
export const setAutoApproval = async (id: string, isAutoApproval: boolean): Promise<AssetAssignment> => {
  try {
    return await updateAssignment(id, {
      is_automatic_approval: isAutoApproval
    });
  } catch (error) {
    console.error('setAutoApproval error:', error);
    throw error;
  }
};

/**
 * Assignment notlarını günceller
 * @param id - Assignment ID
 * @param notes - Yeni notlar
 * @returns Promise<AssetAssignment>
 */
export const updateAssignmentNotes = async (id: string, notes: string): Promise<AssetAssignment> => {
  try {
    return await updateAssignment(id, {
      notes
    });
  } catch (error) {
    console.error('updateAssignmentNotes error:', error);
    throw error;
  }
};

/**
 * Asset durumunu assignment status'a göre günceller
 * @param assetId - Asset ID
 * @param assignmentStatus - Assignment status
 */
const updateAssetStatus = async (assetId: string, assignmentStatus: string): Promise<void> => {
  try {
    let newAssetStatus: string;
    
    switch (assignmentStatus) {
      case 'Active':
        newAssetStatus = 'Assigned';
        break;
      case 'Returned':
      case 'Cancelled':
        newAssetStatus = 'Available';
        break;
      case 'Lost':
      case 'Damaged':
        newAssetStatus = 'Damaged';
        break;
      default:
        return; // Status değiştirme
    }

    const response = await fetch(`${API_BASE_URL}/api/AssetStatus/${assetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus: newAssetStatus }),
    });

    if (!response.ok) {
      throw new Error(`Asset status update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('updateAssetStatus error:', error);
    throw error;
  }
};

/**
 * Asset durumunu Available yapar
 * @param assetId - Asset ID
 */
const updateAssetStatusToAvailable = async (assetId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/AssetStatus/${assetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus: 'Available' }),
    });

    if (!response.ok) {
      throw new Error(`Asset status update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('updateAssetStatusToAvailable error:', error);
    throw error;
  }
};

export default updateAssignment;