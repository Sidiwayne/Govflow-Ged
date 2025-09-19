export enum CourrierFlow {
  ENTRANT = 'entrant',
  SORTANT = 'sortant',
}

export type ActionType =
  | 'annoter'
  | 'transmettre'
  | 'valider'
  | 'joindre_document'
  | 'rejeter'
  | 'répondre'
  | 'cloturer'
  | 'archiver';


export interface DataAnnoter {
  note: string;
}

export interface DataTransmettre {
  targets: Array<{
    entity: string;   // nom anglais de l'entité cible
    user: string;
  }>;
  message?: string;
}

export interface DataValider {
  comment?: string;
}

export interface DataRejeter {
  reason: string;
}

export interface DataRépondre {
  content: string;
}

export interface DataCloturer {
  comment?: string;
}

export interface DataArchiver {
  comment?: string;
}

export interface DataDocument {
  id: string;
  filename: string;
  url: string;
  type?: string;
}

export interface DataJoindreDocument {
  documents: Array<DataDocument>;
}

type ActionData = DataAnnoter | DataTransmettre | DataValider | DataRejeter | DataRépondre | DataCloturer | DataArchiver | DataJoindreDocument;

export interface Action {
  id: string;
  nodeId: string;
  type: ActionType;
  date: string;
  authorId: string;
  data: ActionData;
}

export interface Node {
  id: string;
  courierId: string;
  entityId: string;      // entity id
  entityName?: string;  // entity name
  userId: string;      // user who initiated the node
  userFullName?: string; // user full name
  arrivalDate: string;
  closeDate?: string;
  status: 'active' | 'closed';
  previousNodeId?: string; // For tracking the flow between nodes

  // "read" event at node level
  lu: boolean;

  // Actions performed in this node
  actions: Action[];
}

export interface Courrier {
  id: string;
  number: string;
  flow: 'entrant' | 'sortant';
  type: string
  status: 'in_progress' | 'closed' | 'archived';
  metadata: {
    expediteur: string;
    objet: string;
    priorite: 'haute' | 'normale' | 'basse';
    dateReception: string;
    referenceExterne?: string;
    confidentialite?: string;
    tags?: string[];
    canalReception?: string;
  };

  // List of nodes (history + active node)
  nodes: Node[];
}

export interface CourierState {
  courriers: Courrier[];
  isLoading: boolean;
  error: string | null;
  selectedCourrier: Courrier | null;
  filters: {
    type?: 'entrant' | 'sortant';
    status?: 'in_progress' | 'closed' | 'archived';
    entity?: string;
    priorite?: 'haute' | 'normale' | 'basse';
  };
}

export interface CreateCourrierData {
  flow: 'entrant' | 'sortant';
  type: string;
  metadata: {
    expediteur: string;
    objet: string;
    priorite: 'haute' | 'normale' | 'basse';
    dateReception: string;
    referenceExterne?: string;
    confidentialite?: string;
    tags?: string[];
    noteInitiale?: string;
  };
  initialEntity: string; // entity id where the courrier starts
  initialUserId: string;
  destinations: Array<{
    entity: string;
    userId: string;
  }>;
  documents?: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}

export interface CreateActionData {
  courierId: string;
  nodeId: string;
  type: ActionType;
  authorId: string;
  payload?: any; // Specific payload based on action type
}

export interface CreateNodeData {
  courierId: string;
  entity: string;
  userId: string;
  previousNodeId?: string; // For tracking the flow
}
