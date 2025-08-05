// Asset temel tipi
export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  currentUser?: {
    id: string;
    fullName: string;
    email: string;
    department?: string;
  };
  status: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warranty?: string;
  brand?: string;
  model?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  notes?: string;
  value?: number;
  depreciation?: number;
  warrantyExpiry?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

// Asset DTO (Data Transfer Object) - API'ye gönderilecek veriler için
export interface AssetDto {
  id?: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  status: string;
  qrCode?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Asset Kategori tipi
export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  assetCount?: number;
  parentId?: string;
  created_at: string;
  updated_at?: string;
  // Backward compatibility fields
  createdAt?: string;
  updatedAt?: string;
}

// Asset Kategori DTO
export interface AssetCategoryDto {
  id?: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Asset Atama tipi
export interface AssetAssignment {
  id: string;
  assignmentNumber: string;
  assetId: string;
  assignedToId: string;
  assignedById: string;
  assignmentDate: string;
  returnDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Asset Atama DTO
export interface AssetAssignmentDto {
  id?: string;
  asset_id: string;
  assigned_to_id: string;
  assigned_by: string;
  assignment_date: string;
  return_date?: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Asset Durum tipi
export interface AssetStatus {
  id: string;
  name: string;
  status: string;
  updatedAt?: string;
}

// Asset Transfer tipi
export interface AssetTransfer {
  assetId: string;
  fromUserId: string;
  toUserId: string;
  transferDate: string;
  notes?: string;
}

// Asset durumları enum
export const AssetStatusEnum = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  LOST: 'Lost',
  DAMAGED: 'Damaged'
} as const;

export type AssetStatusEnum = typeof AssetStatusEnum[keyof typeof AssetStatusEnum];

// Atama durumları enum
export const AssignmentStatusEnum = {
  ACTIVE: 'Active',
  RETURNED: 'Returned',
  OVERDUE: 'Overdue',
  LOST: 'Lost'
} as const;

export type AssignmentStatusEnum = typeof AssignmentStatusEnum[keyof typeof AssignmentStatusEnum];

// Asset listesi için filtreleme
export interface AssetFilter {
  categoryId?: string;
  status?: string;
  searchTerm?: string;
  assignedToId?: string;
}

// Asset istatistikleri
export interface AssetStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  assetsByCategory: { [key: string]: number };
}

// Bulk operations için
export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors: string[];
}

// QR kod generator için
export interface QRCodeData {
  assetId: string;
  assetNumber: string;
  name: string;
}

// Stock durumu
export interface StockStatus {
  categoryId: string;
  categoryName: string;
  totalCount: number;
  availableCount: number;
  assignedCount: number;
  maintenanceCount: number;
}