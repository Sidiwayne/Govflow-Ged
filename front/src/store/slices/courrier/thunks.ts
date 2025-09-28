import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  Courrier, 
  Node, 
  Action, 
  CreateCourrierData, 
  CreateActionData, 
  CreateNodeData,
  DataAnnoter,
  DataTransmettre
} from '../../../types/courrier';
import { selectAllEntities } from '../entity';

// Types pour la transmission
interface TransmitCourrierData {
  courierId: string;
  nodeId: string;
  recipients: Array<{
    entity: string;
    user: string;
    userId: string;
    entityId: string;
  }>;
  message: string;
  priority: string;
  confidentialite: string;
  additionalDocuments?: any[];
}

// Mock data for demonstration
const mockCourriers: Courrier[] = [
  {
    id: '1',
    number: 'GEC-2025-0001',
    type: 'entrant',
    flow: 'entrant',
    status: 'in_progress',
    metadata: {
      expediteur: 'Ministère de l\'Intérieur',
      objet: 'Demande d\'autorisation pour manifestation publique',
      priorite: 'haute',
      dateReception: '2024-01-15T10:30:00Z',
      referenceExterne: 'REF-2024-001',
      confidentialite: 'interne',
      tags: ['Sécurité', 'Manifestation'],
    },
    nodes: [
      {
        id: 'node-1',
        courierId: '1',
        entityId: 'secretariat',
        entityName: 'Secretariat',
        userId: '1',
        arrivalDate: '2024-01-15T10:30:00Z',
        status: 'closed',
        lu: true,
        actions: [
          {
            id: 'action-1',
            nodeId: 'node-1',
            type: 'annoter',
            date: '2024-01-15T11:00:00Z',
            authorId: '1',
            data: {
              note: 'Courrier reçu et enregistré. À transmettre au conseiller principal.',
            },
          },
          {
            id: 'action-2',
            nodeId: 'node-1',
            type: 'transmettre',
            date: '2024-01-15T11:30:00Z',
            authorId: '1',
            data: {
              targets: [{
                entity: 'conseiller',
                user: '2',
              }],
              message: 'Demande d\'autorisation pour manifestation. Priorité haute.',
            },
          },
        ],
      },
      {
        id: 'node-2',
        courierId: '1',
        entityId: 'conseiller',
        userId: '2',
        arrivalDate: '2024-01-15T11:30:00Z',
        status: 'active',
        entityName: 'Conseiller',
        lu: false,
        actions: [],
      },
    ],
  },
  {
    id: '2',
    number: 'GEC-2025-0002',
    type: 'entrant',
    flow: 'entrant',
    status: 'in_progress',
    metadata: {
      expediteur: 'Direction Générale des Impôts',
      objet: 'Rapport fiscal trimestriel',
      priorite: 'normale',
      dateReception: '2024-01-14T14:20:00Z',
      referenceExterne: 'REF-2024-002',
      confidentialite: 'confidentiel',
      tags: ['Fiscalité', 'Rapport'],
    },
    nodes: [
      {
        id: 'node-3',
        courierId: '2',
        entityId: 'secretariat',
        userId: '1',
        arrivalDate: '2024-01-14T14:20:00Z',
        status: 'closed',
        lu: true,
        actions: [
          {
            id: 'action-3',
            nodeId: 'node-3',
            type: 'annoter',
            date: '2024-01-14T15:00:00Z',
            authorId: '1',
            data: {
              note: 'Rapport fiscal reçu. À transmettre à la DAF pour analyse.',
            },
          },
          {
            id: 'action-4',
            nodeId: 'node-3',
            type: 'transmettre',
            date: '2024-01-14T15:30:00Z',
            authorId: '1',
            data: {
              targets: [{
                entity: 'daf',
                user: '3',
              }],
              message: 'Rapport fiscal trimestriel pour analyse et recommandations.',
            },
          },
        ],
      },
      {
        id: 'node-4',
        courierId: '2',
        entityId: 'daf',
        userId: '3',
        arrivalDate: '2024-01-14T15:30:00Z',
        status: 'active',
        lu: true,
        actions: [
          {
            id: 'action-5',
            nodeId: 'node-4',
            type: 'annoter',
            date: '2024-01-15T09:00:00Z',
            authorId: '3',
            data: {
              note: 'Analyse en cours du rapport fiscal.',
            },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    number: 'GEC-2025-0003',
    type: 'lettre',
    flow: 'sortant',
    status: 'closed',
    metadata: {
      expediteur: 'Présidence de la République',
      objet: 'Réponse à la demande de subvention',
      priorite: 'normale',
      dateReception: '2024-01-10T08:00:00Z',
      referenceExterne: 'REF-2024-003',
      confidentialite: 'publique',
      tags: ['Subvention', 'Réponse'],
    },
    nodes: [
      {
        id: 'node-5',
        courierId: '3',
        entityId: 'secretariat',
        userId: '1',
        arrivalDate: '2024-01-10T08:00:00Z',
        status: 'closed',
        lu: true,
        actions: [
          {
            id: 'action-6',
            nodeId: 'node-5',
            type: 'répondre',
            date: '2024-01-12T16:00:00Z',
            authorId: '1',
            data: {
              content: 'Suite à votre demande de subvention, nous avons le plaisir de vous informer que votre dossier a été accepté.',
              documents: [
                {
                  id: 'doc-1',
                  filename: 'reponse_subvention.pdf',
                  url: '/documents/reponse_subvention.pdf',
                },
              ],
            },
          },
          {
            id: 'action-7',
            nodeId: 'node-5',
            type: 'cloturer',
            date: '2024-01-12T16:30:00Z',
            authorId: '1',
            data: {
              comment: 'Courrier traité et réponse envoyée.',
            },
          },
        ],
      },
    ],
  },
];

// Mock API calls
const mockFetchCourriers = async (): Promise<Courrier[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockCourriers;
};

const newCourrier = async (data: CreateCourrierData): Promise<Courrier> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create the initial node (where the courrier starts)
  const initialNode: Node = {
    id: `node-${Date.now()}`,
    courierId: Date.now().toString(),
    entityId: data.initialEntity,
    userId: data.initialUserId,
    arrivalDate: new Date().toISOString(),
    status: 'active',
    lu: true,
    actions: [],
  };
  
  // Create actions for the initial node
  const initialActions: Action[] = [
    {
      id: `action-${Date.now()}`,
      nodeId: initialNode.id,
      type: 'joindre_document',
      date: new Date().toISOString(),
      authorId: data.initialUserId,
      data: {
        documents: data.documents || [],
      },
    },
  ];

  // Add note action if noteInitiale is provided
  if (data.metadata.noteInitiale) {
    const noteAction: Action = {
      id: `action-note-${Date.now()}`,
      nodeId: initialNode.id,
      type: 'annoter',
      date: new Date().toISOString(),
      authorId: data.initialUserId,
      data: {
        note: data.metadata.noteInitiale,
      },
    };
    (noteAction.data as DataAnnoter).note = data.metadata.noteInitiale;
    initialActions.push(noteAction);
  }

  initialNode.actions = initialActions;

  // Create nodes for each destination
  const destinationNodes: Node[] = data.destinations.map((destination, index) => ({
    id: `node-${Date.now()}-${index}`,
    courierId: initialNode.courierId,
    entityId: destination.entity,
    userId: destination.userId,
    arrivalDate: new Date().toISOString(),
    status: 'active',
    lu: false,
    previousNodeId: initialNode.id, // Reference to the initial node
    actions: [],
  }));

  // Add single transmettre action to the initial node for all destinations
  if (data.destinations.length > 0) {
    const transmettreAction: Action = {
      id: `action-transmettre-${Date.now()}`,
      nodeId: initialNode.id,
      type: 'transmettre',
      date: new Date().toISOString(),
      authorId: data.initialUserId,
      data: {
        targets: data.destinations.map(destination => ({
          entity: destination.entity,
          user: destination.userId,
        })),
        message: data.metadata.objet,
      },
    };
    initialNode.actions.push(transmettreAction);
  }

  const newCourrier: Courrier = {
    id: initialNode.courierId,
    number: `GEC-2025-000${Math.floor(Math.random() * 10000)}`,
    type: data.type,
    flow: data.flow,
    status: 'in_progress',
    metadata: data.metadata,
    nodes: [initialNode, ...destinationNodes],
  };

  return newCourrier;
};

const mockCreateAction = async (data: CreateActionData): Promise<Action> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newAction: Action = {
    id: `action-${Date.now()}`,
    nodeId: data.nodeId,
    type: data.type,
    date: new Date().toISOString(),
    authorId: data.authorId,
    ...data.payload,
  };

  return newAction;
};

const mockCreateNode = async (data: CreateNodeData): Promise<Node> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newNode: Node = {
    id: `node-${Date.now()}`,
    courierId: data.courierId,
    entityId: data.entity,
    userId: data.userId,
    arrivalDate: new Date().toISOString(),
    status: 'active',
    lu: false,
    actions: [],
  };

  return newNode;
};

const mockTransmitCourrier = async (data: TransmitCourrierData, { getState }: { getState: () => any }): Promise<{
  action: Action;
  nodes: Node[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Récupérer les entités depuis le state
  const state = getState();
  const entities = selectAllEntities(state);
  
  // Créer l'action de transmission
  const transmitAction: Action = {
    id: `action-transmit-${Date.now()}`,
    nodeId: data.nodeId,
    type: 'transmettre',
    date: new Date().toISOString(),
    authorId: 'current-user', // En réalité, cela viendrait du contexte d'authentification
    data: {
      targets: data.recipients.map(recipient => ({
        entity: recipient.entity,
        user: recipient.userId,
      })),
      message: data.message,
    } as DataTransmettre,
  };

  // Créer les nodes pour chaque destinataire
  const destinationNodes: Node[] = data.recipients.map((recipient, index) => {
    // Trouver l'entité correspondante pour récupérer son nom
    const entity = entities.find(e => e.id === recipient.entityId);
    
    return {
      id: `node-${Date.now()}-${index}`,
      courierId: data.courierId,
      entityId: recipient.entityId,
      entityName: entity?.name || 'Entité inconnue',
      userId: recipient.userId,
      arrivalDate: new Date().toISOString(),
      status: 'active',
      lu: false,
      previousNodeId: data.nodeId, // Référence au node source
      actions: [],
    };
  });

  return {
    action: transmitAction,
    nodes: destinationNodes,
  };
};

// Async thunks
export const fetchCourriers = createAsyncThunk(
  'courrier/fetchCourriers',
  async () => {
    const response = await mockFetchCourriers();
    return response;
  }
);

export const createCourrier = createAsyncThunk(
  'courrier/createCourrier',
  async (data: CreateCourrierData) => {
    const response = await newCourrier(data);
    return response;
  }
);

export const createAction = createAsyncThunk(
  'courrier/createAction',
  async (data: CreateActionData) => {
    const response = await mockCreateAction(data);
    return response;
  }
);

export const createNode = createAsyncThunk(
  'courrier/createNode',
  async (data: CreateNodeData) => {
    const response = await mockCreateNode(data);
    return response;
  }
);

export const markNodeAsRead = createAsyncThunk(
  'courrier/markNodeAsRead',
  async ({ courierId, nodeId }: { courierId: string; nodeId: string }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { courierId, nodeId };
  }
);

export const transmitCourrier = createAsyncThunk(
  'courrier/transmitCourrier',
  async (data: TransmitCourrierData, { getState }) => {
    const response = await mockTransmitCourrier(data, { getState });
    return {
      courierId: data.courierId,
      nodeId: data.nodeId,
      action: response.action,
      nodes: response.nodes,
    };
  }
);