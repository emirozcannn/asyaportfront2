// src/api/types/user.ts - String Literal Types ile
export interface User {
  id: string;
  fullName: string;
  email: string;
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

// String literal types - daha basit ve güvenli
export type UserRole = 'SuperAdmin' | 'Admin' | 'DepartmentAdmin' | 'User';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

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