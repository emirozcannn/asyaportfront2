export interface Asset {
  id: string;
  asset_number: string;
  name: string;
  serial_number?: string;
  category_id: string;
  status: 'Available' | 'Assigned' | 'Damaged';
  qr_code: string;
  created_by: string;
  created_at: string; // ISO string
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface StockStatus {
  id: string;
  asset_id: string;
  status: string;
  location?: string;
  quantity: number;
  last_updated: string;
  updated_by: string;
}