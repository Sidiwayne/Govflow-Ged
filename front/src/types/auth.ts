import { Entity } from "./entity";

export interface User {
  id: string; // UUID
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string | null;
  role: UserRole;
  entity: Entity;
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export type UserRole = 
  | 'admin'
  | 'secretaire'
  | 'conseiller_principal'
  | 'responsable_service'
  | 'ministre'
  | 'archiviste';


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  role: UserRole;
  entity_id: string;
}
