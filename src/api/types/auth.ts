// src/api/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  user?: AuthUser;
}

export interface UserError {
  message: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}