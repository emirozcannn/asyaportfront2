// src/api/assignments/createAssignment.ts

import type { AssetAssignment, CreateAssignmentDto } from '../types/assignment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Yeni bir assignment oluşturur
 * @param assignmentData - Assignment oluşturma verisi
 * @returns Promise<AssetAssignment>
 */
export const createAssignment = async (assignmentData: CreateAssignmentDto): Promise<AssetAssignment> => {
  try {
    // Gerekli alanları kontrol et
    if (!assignmentData.asset_id) {
      throw new Error('Asset ID gereklidir');
    }
    if (!assignmentData.assigned_to_id) {
      throw new Error('Atanacak kullanıcı ID gereklidir');
    }
    if (!assignmentData.assigned_by) {
      throw new Error('Atayan kullanıcı ID gereklidir');
    }

    // Backend'in beklediği format - API doc'a göre
    const requestBody = {
      baseUrl: "string",
      requestClientOptions: {
        schema: "string",
        headers: {},
        queryParams: {}
      },
      id: crypto.randomUUID(), // Yeni ID oluştur
      asset_id: assignmentData.asset_id,
      assigned_to_id: assignmentData.assigned_to_id,
      assigned_by: assignmentData.assigned_by,
      assignment_date: assignmentData.assignment_date || new Date().toISOString(),
      return_date: assignmentData.return_date || null,
      status: assignmentData.status || 'Active',
      notes: assignmentData.notes || '',
      is_urgent: assignmentData.is_urgent || false,
      is_automatic_approval: assignmentData.is_automatic_approval || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('createAssignment error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const newAssignment: AssetAssignment = await response.json();
    
    // Assignment oluşturulduktan sonra asset'in durumunu güncelle
    if (assignmentData.status === 'Active' || !assignmentData.status) {
      try {
        await updateAssetStatus(assignmentData.asset_id, 'Assigned');
      } catch (error) {
        console.warn('Asset status güncellenemedi:', error);
        // Assignment oluşturuldu ama status güncellenemedi, warning olarak log'la
      }
    }

    return newAssignment;
  } catch (error) {
    console.error('createAssignment error:', error);
    throw new Error('Assignment oluşturulurken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Asset'e kullanıcı atama - basitleştirilmiş versiyon
 * @param assetId - Asset ID
 * @param userId - Kullanıcı ID
 * @param assignedBy - Atayan kullanıcı ID
 * @param options - Ek seçenekler
 * @returns Promise<AssetAssignment>
 */
export const assignAssetToUser = async (
  assetId: string,
  userId: string,
  assignedBy: string = '30549f61-ed08-4867-bce0-b80a64ae7199', // Default user ID (API'den aldığımız)
  options?: {
    notes?: string;
    isUrgent?: boolean;
    isAutomaticApproval?: boolean;
    expectedReturnDate?: string;
  }
): Promise<AssetAssignment> => {
  try {
    // Önce asset'in müsait olup olmadığını kontrol et
    const assetResponse = await fetch(`${API_BASE_URL}/api/Assets`);
    if (assetResponse.ok) {
      const assets = await assetResponse.json();
      const asset = assets.find((a: any) => a.id === assetId);
      
      if (!asset) {
        throw new Error('Asset bulunamadı');
      }
      
      if (asset.status !== 'Available') {
        throw new Error(`Asset şu anda atanabilir durumda değil. Mevcut durum: ${asset.status}`);
      }
    }

    return await createAssignment({
      asset_id: assetId,
      assigned_to_id: userId,
      assigned_by: assignedBy,
      assignment_date: new Date().toISOString(),
      return_date: options?.expectedReturnDate,
      status: 'Active',
      notes: options?.notes || `Asset ${userId} kullanıcısına atandı`,
      is_urgent: options?.isUrgent || false,
      is_automatic_approval: options?.isAutomaticApproval || false
    });
  } catch (error) {
    console.error('assignAssetToUser error:', error);
    throw error;
  }
};

/**
 * Asset durumunu günceller (helper function)
 * @param assetId - Asset ID
 * @param newStatus - Yeni durum
 */
const updateAssetStatus = async (assetId: string, newStatus: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/AssetStatus/${assetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Asset status update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('updateAssetStatus error:', error);
    throw error;
  }
};

export default createAssignment;