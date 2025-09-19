// Configuration de l'application
export const APP_CONFIG = {
  name: 'GEC',
  fullName: 'Gestion Électronique de Courrier',
  version: '1.0.0',
  institution: 'Présidence de la République',
  description: 'Système de gestion électronique de courrier pour institutions publiques',
};

// Couleurs de l'application
export const COLORS = {
  primary: '#007481',
  primaryLight: '#4da3b0',
  primaryDark: '#004d57',
  secondary: '#f5f5f5',
  background: '#fafafa',
  text: '#333333',
  textSecondary: '#666666',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Statuts des courriers
export const COURRIER_STATUS = {
  NOUVEAU: 'nouveau',
  EN_COURS: 'en_cours',
  TRAITE: 'traite',
  ARCHIVE: 'archive',
} as const;

// Priorités des courriers
export const COURRIER_PRIORITY = {
  BASSE: 'basse',
  NORMALE: 'normale',
  HAUTE: 'haute',
  URGENTE: 'urgente',
} as const;

// Types de courriers
export const COURRIER_TYPE = {
  ENTRANT: 'entrant',
  SORTANT: 'sortant',
} as const;

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  SUPERVISEUR: 'superviseur',
} as const;

// Configuration des routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  COURRIERS_ENTRANTS: '/courriers/entrants',
  COURRIERS_SORTANTS: '/courriers/sortants',
  NOUVEAU_COURRIER: '/courriers/nouveau',
  ARCHIVES: '/archives',
  SUIVI: '/suivi',
  ADMIN: '/admin',
} as const;

// Configuration des tableaux
export const TABLE_CONFIG = {
  pageSize: 10,
  pageSizeOptions: [10, 25, 50],
  rowsPerPageOptions: [10, 25, 50],
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_DATE: 'Date invalide',
  NETWORK_ERROR: 'Erreur de connexion réseau',
  SERVER_ERROR: 'Erreur du serveur',
  UNAUTHORIZED: 'Accès non autorisé',
  NOT_FOUND: 'Ressource non trouvée',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  COURRIER_CREATED: 'Courrier créé avec succès',
  COURRIER_UPDATED: 'Courrier mis à jour avec succès',
  COURRIER_DELETED: 'Courrier supprimé avec succès',
  COURRIER_ARCHIVED: 'Courrier archivé avec succès',
  USER_CREATED: 'Utilisateur créé avec succès',
  USER_UPDATED: 'Utilisateur mis à jour avec succès',
  USER_DELETED: 'Utilisateur supprimé avec succès',
} as const;

// Formats de date
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  AUTO_HIDE_DURATION: 6000,
  MAX_NOTIFICATIONS: 50,
} as const;
