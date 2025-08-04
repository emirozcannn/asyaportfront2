// src/api/types/user.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  // Backend'den gelen ek alanlar eklenebilir
  departmentId?: string;
  department?: Department;
  role?: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  DEPARTMENT_ADMIN = 'DepartmentAdmin', 
  USER = 'User'
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended'
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  departmentId?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  id: string;
  fullName?: string;
  email?: string;
  departmentId?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  search?: string;
  departmentId?: string;
  role?: UserRole;
  status?: UserStatus;
}