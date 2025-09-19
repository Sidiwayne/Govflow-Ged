import { createAsyncThunk } from '@reduxjs/toolkit';
import { Entity, CreateEntityData, UpdateEntityData } from '../../../types/entity';
import { User } from '../../../types/auth';

// Mock users for demonstration - replace with real API data
const mockUsers: User[] = [
  {
    id: '1',
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@simandou.gn',
    password: '',
    phone_number: '+224123456789',
    role: 'responsable_service',
    entity: {
      id: 'secretariat',
      name: 'Secretariat',
      description: 'Secretariat de la Présidence',
      main_user: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    firstname: 'Marie',
    lastname: 'Konaté',
    email: 'marie.konate@simandou.gn',
    password: '',
    phone_number: '+224123456790',
    role: 'responsable_service',
    entity: {
      id: 'drh',
      name: 'DRH',
      description: 'Direction des Ressources Humaines', 
      main_user: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    firstname: 'Moussa',
    lastname: 'Camara',
    email: 'moussa.camara@simandou.gn',
    password: '',
    phone_number: '+224123456791',
    role: 'responsable_service',
    entity: {
      id: 'daf',
      name: 'DAF',
      description: 'Direction Administrative et Financière',
      main_user: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock entities with main users
const mockEntities: Entity[] = [
  {
    id: 'secretariat',
    name: 'Secrétariat',
    description: 'Secrétariat général de la présidence',
    main_user: mockUsers[0], // Jean Dupont
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'le_protocol',
    name: 'Le Protocole',
    description: 'Service du protocole présidentiel',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lintendance',
    name: 'L\'Intendance',
    description: 'Service d\'intendance et de logistique',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'drh',
    name: 'DRH',
    description: 'Direction des Ressources Humaines',
    main_user: mockUsers[1], // Marie Konaté
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'daf',
    name: 'DAF',
    description: 'Direction Administrative et Financière',
    main_user: mockUsers[2], // Moussa Camara
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dci',
    name: 'DCI',
    description: 'Direction de la Communication et de l\'Information',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'le_bspc',
    name: 'Le BSPC',
    description: 'Bureau Stratégique de Priorité Présidentielle',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'conseiller',
    name: 'Conseiller',
    description: 'Conseillers présidentiels',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'documentation_archivage',
    name: 'Documentation & Archivage',
    description: 'Service de documentation et d\'archivage',
    main_user: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock API calls - replace with real API endpoints
const mockFetchEntities = async (): Promise<Entity[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEntities;
};

const mockCreateEntity = async (data: CreateEntityData): Promise<Entity> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newEntity: Entity = {
      id: data.id,
    name: data.name,
    description: data.description,
    main_user: data.main_user_id ? mockUsers.find(u => u.id === data.main_user_id) || null : null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return newEntity;
};

const mockUpdateEntity = async (data: UpdateEntityData): Promise<Entity> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const existingEntity = mockEntities.find(e => e.id === data.id);
  if (!existingEntity) {
    throw new Error('Entity not found');
  }
  
  const updatedEntity: Entity = {
    ...existingEntity,
    id: data.id || existingEntity.id,
    name: data.name || existingEntity.name,
    description: data.description || existingEntity.description,
    main_user: data.main_user_id ? mockUsers.find(u => u.id === data.main_user_id) || null : existingEntity.main_user,
    is_active: data.is_active !== undefined ? data.is_active : existingEntity.is_active,
    updated_at: new Date().toISOString(),
  };
  
  return updatedEntity;
};

// Async thunks
export const fetchEntities = createAsyncThunk(
  'entity/fetchEntities',
  async () => {
    const response = await mockFetchEntities();
    return response;
  }
);

export const createEntity = createAsyncThunk(
  'entity/createEntity',
  async (data: CreateEntityData) => {
    const response = await mockCreateEntity(data);
    return response;
  }
);

export const updateEntity = createAsyncThunk(
  'entity/updateEntity',
  async (data: UpdateEntityData) => {
    const response = await mockUpdateEntity(data);
    return response;
  }
);

export const assignMainUser = createAsyncThunk(
  'entity/assignMainUser',
  async ({ entityId, userId }: { entityId: string; userId: string }) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const entity = mockEntities.find(e => e.id === entityId);
    if (!entity) {
      throw new Error('Entity not found');
    }
    
    const updatedEntity: Entity = {
      ...entity,
      main_user: user,
      updated_at: new Date().toISOString(),
    };
    
    return updatedEntity;
  }
);