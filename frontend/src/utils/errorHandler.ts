/**
 * Centralized error handling utilities
 */
import { Alert } from 'react-native';
import { ApiError } from '../services/apiClient';

/**
 * User-friendly error messages map
 */
const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
  TIMEOUT_ERROR: 'La requête a pris trop de temps. Veuillez réessayer.',
  UNAUTHORIZED: 'Votre session a expiré. Veuillez vous reconnecter.',
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires pour cette action.",
  NOT_FOUND: 'Ressource introuvable.',
  VALIDATION_ERROR: 'Les données fournies sont invalides.',
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
};

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: ApiError): string {
  // Check for custom error code
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }

  // Check HTTP status code
  if (error.status) {
    switch (error.status) {
      case 400:
        return error.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 429:
        return 'Trop de requêtes. Veuillez patienter quelques instants.';
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.message || 'Une erreur est survenue';
    }
  }

  return error.message || 'Une erreur inattendue est survenue';
}

/**
 * Show error alert to user
 */
export function showErrorAlert(error: ApiError, title: string = 'Erreur'): void {
  const message = getErrorMessage(error);
  Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
}

/**
 * Log error for debugging/monitoring
 */
export function logError(error: ApiError, context?: string): void {
  const errorInfo = {
    context,
    message: error.message,
    status: error.status,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
  };

  if (__DEV__) {
    console.error('API Error:', errorInfo);
  }

  // In production, send to error tracking service (Sentry, etc.)
  // Example: Sentry.captureException(error);
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: ApiError): boolean {
  return error.code === 'NETWORK_ERROR' || !error.status;
}

/**
 * Check if error requires re-authentication
 */
export function requiresReauth(error: ApiError): boolean {
  return error.status === 401 || error.code === 'UNAUTHORIZED';
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(
  error: ApiError
): Record<string, string> | null {
  if (!error.details || !Array.isArray(error.details)) {
    return null;
  }

  const formErrors: Record<string, string> = {};

  error.details.forEach((detail: any) => {
    if (detail.loc && detail.msg) {
      const field = detail.loc[detail.loc.length - 1];
      formErrors[field] = detail.msg;
    }
  });

  return Object.keys(formErrors).length > 0 ? formErrors : null;
}
