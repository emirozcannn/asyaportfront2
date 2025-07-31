export interface AssetAssignment {
  id: string;
  asset_id: string;
  assigned_to_id: string;
  assigned_by_id?: string;
  assignment_number?: string;
  created_at: string;
}
