import { User } from './auth';

export interface Entity {
  id: string;
  name: string;
  description: string;
  main_user: User | null; // The main user responsible for this entity
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EntityState {
  entities: Entity[];
  isLoading: boolean;
  error: string | null;
  selectedEntity: Entity | null;
}

export interface CreateEntityData {
  id: string;
  name: string;
  description: string;
  main_user_id?: string;
}

export interface UpdateEntityData {
  id: string;
  name?: string;
  description?: string;
  main_user_id?: string;
  is_active?: boolean;
}

export type EntitySlug = 
  | 'secretariat'
  | 'le_protocol'
  | 'lintendance'
  | 'drh'
  | 'daf'
  | 'dci'
  | 'le_bspc'
  | 'conseiller'
  | 'ministre'
  | 'documentation_archivage';
