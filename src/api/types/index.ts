// src/api/types/index.ts - Düzeltilmiş versiyon
// User types
export type {
  User,
  Department,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  UserRole,      // type olarak export et
  UserStatus     // type olarak export et
} from './user';

// Auth types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from './auth';

// Common types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}