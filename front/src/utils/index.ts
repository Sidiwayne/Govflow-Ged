import { COURRIER_STATUS, COURRIER_PRIORITY, DATE_FORMATS } from '../constants';

// Formatage des dates
export const formatDate = (date: Date | string, format: string = DATE_FORMATS.DISPLAY): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.API_WITH_TIME:
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    default:
      return dateObj.toLocaleDateString('fr-FR');
  }
};

// Formatage des timestamps relatifs
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 43200) return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  
  return formatDate(dateObj);
};

// Génération de numéros de courrier
export const generateCourrierNumber = (type: 'entrant' | 'sortant', year: number = new Date().getFullYear()): string => {
  const timestamp = Date.now().toString().slice(-6);
  const prefix = type === 'entrant' ? 'GEC-E' : 'GEC-S';
  return `${prefix}-${year}-${timestamp}`;
};

// Validation d'email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation de numéro de téléphone
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
};

// Formatage des tailles de fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Obtention de la couleur pour les statuts
export const getStatusColor = (status: string): string => {
  switch (status) {
    case COURRIER_STATUS.NOUVEAU:
      return '#ff9800'; // Orange
    case COURRIER_STATUS.EN_COURS:
      return '#2196f3'; // Bleu
    case COURRIER_STATUS.TRAITE:
      return '#4caf50'; // Vert
    case COURRIER_STATUS.ARCHIVE:
      return '#9e9e9e'; // Gris
    default:
      return '#757575';
  }
};

// Obtention de la couleur pour les priorités
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case COURRIER_PRIORITY.BASSE:
      return '#9e9e9e'; // Gris
    case COURRIER_PRIORITY.NORMALE:
      return '#007481'; // Bleu institutionnel
    case COURRIER_PRIORITY.HAUTE:
      return '#ff9800'; // Orange
    case COURRIER_PRIORITY.URGENTE:
      return '#f44336'; // Rouge
    default:
      return '#757575';
  }
};

// Formatage des noms
export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// Capitalisation de la première lettre
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Formatage des statuts pour l'affichage
export const formatStatus = (status: string): string => {
  return status.replace('_', ' ').split(' ').map(capitalize).join(' ');
};

// Formatage des priorités pour l'affichage
export const formatPriority = (priority: string): string => {
  return capitalize(priority);
};

// Validation de formulaire
export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Génération d'ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Copie dans le presse-papiers
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    return false;
  }
};

// Téléchargement de fichier
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
