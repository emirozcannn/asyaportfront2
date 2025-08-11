// Asset temel tipi - Güncellenmiş
export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    code: string;
    color?: string;
    icon?: string;
  };
  departmentId?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  currentAssignment?: {
    id: string;
    assignedToId: string;
    assignedUser?: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      employeeNumber: string;
      department?: string;
    };
    assignmentDate: string;
    status: string;
  };
  status: string;
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  // İsteğe bağlı ek alanlar
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warranty?: string;
  brand?: string;
  model?: string;
  notes?: string;
  value?: number;
  depreciation?: number;
  warrantyExpiry?: string;
}

// Asset detayları için genişletilmiş tip
export interface AssetDetails extends Asset {
  assignmentHistory?: AssetAssignment[];
  transferHistory?: AssetTransfer[];
  maintenanceHistory?: any[]; // İleride maintenance özelliği eklenirse
}

// API'den dönen extended asset response
export interface AssetResponse {
  id: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  categoryName?: string;
  categoryCode?: string;
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToEmployeeNumber?: string;
  assignmentDate?: string;
  assignmentStatus?: string;
  status: string;
  qrCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// User tipi (dropdown için)
export interface User {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  role: string;
  isActive: boolean;
}

// Department tipi
export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

// Asset DTO - güncellenmiş
export interface AssetDto {
  id?: string;
  assetNumber: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  departmentId?: string;
  status: string;
  qrCode?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Asset update DTO
export interface AssetUpdateDto {
  name: string;
  serialNumber: string;
  categoryId: string;
  departmentId?: string;
  status: string;
  notes?: string;
  updatedAt: string;
}