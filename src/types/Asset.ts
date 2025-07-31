export interface Asset {
  id: string;
  name: string;
  serial_number: string;
  category: string;
  status: string;
  assigned_to_id?: string | null;
  created_at: string;
}
