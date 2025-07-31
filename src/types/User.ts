export interface User {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  department_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
