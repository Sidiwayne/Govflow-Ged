
export interface EntiteAdministrative {
  id: string;
  nom: string;
  code: string;
  responsable: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface PieceJointe {
  id: string;
  nom: string;
  type: string;
  taille: number;
  url: string;
  dateAjout: Date;
}

export interface HistoriqueAction {
  id: string;
  action: string;
  description: string;
  utilisateur: string;
  dateAction: Date;
  entite: string;
}

export interface Stats {
  courriersEntrants: number;
  courriersSortants: number;
  courriersEnCours: number;
  courriersTraites: number;
  courriersUrgents: number;
  tauxTraitement: number;
}

export interface FiltresCourrier {
  type?: 'entrant' | 'sortant';
  statut?: 'nouveau' | 'en_cours' | 'traite' | 'archive';
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  dateDebut?: Date;
  dateFin?: Date;
  entite?: string;
  agent?: string;
}
