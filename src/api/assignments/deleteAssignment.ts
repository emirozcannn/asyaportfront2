// src/api/assignments/deleteAssignment.ts

import { getAssignmentById } from './getAssignmentById';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

/**
 * Assignment'ı siler
 * @param id - Assignment ID
 * @returns Promise<void>
 */
export const deleteAssignment = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Assignment ID gereklidir');
    }

    // Önce assignment'ı al (silme öncesi kontrol için)
    const assignment = await getAssignmentById(id);
    
    // Eğer aktif bir assignment ise uyarı ver
    if (assignment.status === 'Active') {
      console.warn('Aktif bir assignment siliniyor. Asset durumu kontrol edilecek.');
    }

    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`ID ${id} ile assignment bulunamadı`);
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    // Eğer silinen assignment aktifse asset'i Available yap
    if (assignment.status === 'Active') {
      try {
        await updateAssetStatusToAvailable(assignment.assetId);
      } catch (error) {
        console.warn('Asset status güncellenemedi:', error);
      }
    }

    console.log(`Assignment ${id} başarıyla silindi`);
  } catch (error) {
    console.error('deleteAssignment error:', error);
    throw new Error('Assignment silinirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

/**
 * Toplu assignment silme
 * @param ids - Assignment ID'leri
 * @returns Promise<{successful: string[], failed: {id: string, error: string}[]}>
 */
export const deleteMultipleAssignments = async (ids: string[]): Promise<{
  successful: string[];
  failed: { id: string; error: string }[];
}> => {
  try {
    if (!ids || ids.length === 0) {
      throw new Error('En az bir Assignment ID gereklidir');
    }

    const results = await Promise.allSettled(
      ids.map(id => deleteAssignment(id))
    );

    const successful: string[] = [];
    const failed: { id: string; error: string }[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(ids[index]);
      } else {
        failed.push({
          id: ids[index],
          error: result.reason.message || 'Bilinmeyen hata'
        });
      }
    });

    return { successful, failed };
  } catch (error) {
    console.error('deleteMultipleAssignments error:', error);
    throw error;
  }
};

/**
 * Kullanıcının tüm assignment'larını siler
 * @param userId - Kullanıcı ID
 * @returns Promise<number> - Silinen assignment sayısı
 */
export const deleteAllUserAssignments = async (userId: string): Promise<number> => {
  try {
    if (!userId) {
      throw new Error('Kullanıcı ID gereklidir');
    }

    // Kullanıcının tüm assignment'larını al
    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`);
    if (!response.ok) {
      throw new Error('Assignment'lar alınamadı');
    }

    const allAssignments = await response.json();
    const userAssignments = allAssignments.filter((assignment: any) => 
      assignment.assignedToId === userId
    );

    if (userAssignments.length === 0) {
      return 0;
    }

    const assignmentIds = userAssignments.map((assignment: any) => assignment.id);
    const deleteResults = await deleteMultipleAssignments(assignmentIds);

    console.log(`${deleteResults.successful.length} assignment silindi, ${deleteResults.failed.length} başarısız`);
    
    if (deleteResults.failed.length > 0) {
      console.warn('Bazı assignment\'lar silinemedi:', deleteResults.failed);
    }

    return deleteResults.successful.length;
  } catch (error) {
    console.error('deleteAllUserAssignments error:', error);
    throw error;
  }
};

/**
 * Asset'in tüm assignment'larını siler
 * @param assetId - Asset ID
 * @returns Promise<number> - Silinen assignment sayısı
 */
export const deleteAllAssetAssignments = async (assetId: string): Promise<number> => {
  try {
    if (!assetId) {
      throw new Error('Asset ID gereklidir');
    }

    // Asset'in tüm assignment'larını al
    const response = await fetch(`${API_BASE_URL}/api/AssetAssignments`);
    if (!response.ok) {
      throw new Error('Assignment\'lar alınamadı');
    }

    const allAssignments = await response.json();
    const assetAssignments = allAssignments.filter((assignment: any) => 
      assignment.assetId === assetId
    );

    if (assetAssignments.length === 0) {
      return 0;
    }

    const assignmentIds = assetAssignments.map((assignment: any) => assignment.id);
    const deleteResults = await deleteMultipleAssignments(assignmentIds);

    console.log(`${deleteResults.successful.length} assignment silindi, ${deleteResults.failed.length} başarısız`);
    
    if (deleteResults.failed.length > 0) {
      console.warn('Bazı assignment\'lar silinemedi:', deleteResults.failed);
    }

    // Asset durumunu Available yap
    if (deleteResults.successful.length > 0) {
      try {
        await updateAssetStatusToAvailable(assetId);
      } catch (error) {
        console.warn('Asset status güncellenemedi:', error);
      }
    }

    return deleteResults.successful.length;
  } catch (error) {
    console.error('deleteAllAssetAssignments error:', error);
    throw error;
  }
};

/**
 * Assignment silme öncesi doğrulama
 * @param id - Assignment ID
 * @returns Promise<{canDelete: boolean, reason?: string}>
 */
export const validateAssignmentDeletion = async (id: string): Promise<{
  canDelete: boolean;
  reason?: string;
}> => {
  try {
    const assignment = await getAssignmentById(id);
    
    // Aktif assignment'ları silmek için ekstra uyarı
    if (assignment.status === 'Active') {
      return {
        canDelete: true,
        reason: 'Bu aktif bir assignment. Silme işlemi asset\'i Available durumuna getirecektir.'
      };
    }

    // Acil assignment'lar için uyarı
    if (assignment.isUrgent) {
      return {
        canDelete: true,
        reason: 'Bu acil bir assignment. Silme işlemini onaylıyor musunuz?'
      };
    }

    return { canDelete: true };
  } catch (error) {
    return {
      canDelete: false,
      reason: 'Assignment bulunamadı veya erişilemedi'
    };
  }
};

/**
 * Asset durumunu Available yapar (helper function)
 * @param