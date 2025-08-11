export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  status: 'Available' | 'Assigned' | 'Damaged';
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  departmentId?: string;
  
  // İlişkili veriler (join'li sorgularda)
  categoryName?: string;
  categoryCode?: string;
  departmentName?: string;
  departmentCode?: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToEmployeeNumber?: string;
  assignmentDate?: string;
  assignmentStatus?: string;
}

export interface CreateAssetRequest {
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  status: 'Available' | 'Assigned' | 'Damaged';
  qrCode: string;
  createdBy: string;
  departmentId?: string;
}

export interface UpdateAssetRequest {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  status: 'Available' | 'Assigned' | 'Damaged';
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  departmentId?: string;
}
