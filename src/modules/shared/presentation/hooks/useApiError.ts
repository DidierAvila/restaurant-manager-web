/**
 * Hook para manejo centralizado de errores de API
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

import { ApiError } from '@/modules/shared/application/services/api';
import { getErrorMessage } from '@/modules/shared/application/services/errorMessages';
import { useNotificationContext } from '@/modules/shared/presentation/components/providers/NotificationProvider';
import { signOut } from 'next-auth/react';
import { useCallback, useState } from 'react';

export interface UseApiErrorReturn {
  error: ApiError | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: unknown) => void;
  handleApiError: (error: ApiError) => void;
}

/**
 * Hook que proporciona manejo centralizado de errores de API
 */
export function useApiError(): UseApiErrorReturn {
  const [error, setError] = useState<ApiError | null>(null);
  const { showNotification } = useNotificationContext();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback(
    (apiError: ApiError) => {
      setError(apiError);

      // Manejo especÃ­fico segÃºn el tipo de error
      if (apiError.isUnauthorized) {
        showNotification('SesiÃ³n expirada. Por favor, inicia sesiÃ³n nuevamente.', 'error');
        // Redirigir al login despuÃ©s de un breve delay
        setTimeout(() => {
          signOut({ callbackUrl: '/auth/signin' });
        }, 2000);
      } else if (apiError.isForbidden) {
        // Error 403 - Sin permisos para realizar la acciÃ³n
        const permissionMessage =
          apiError.message || 'No tienes permisos para realizar esta acciÃ³n.';
        showNotification(permissionMessage, 'warning');
        // No redirigir al login, solo mostrar el mensaje de permisos
      } else if (apiError.isServerError) {
        showNotification('Error del servidor. Por favor, intenta nuevamente mÃ¡s tarde.', 'error');
      } else if (apiError.isNetworkError) {
        showNotification('Error de conexión. Verifica tu conexiÃ³n a internet.', 'error');
      } else if (apiError.isClientError) {
        // Errores 4xx - mostrar mensaje especÃ­fico del servidor

        // Si hay errores de validación, mostrar el primero
        if (apiError.validationErrors && Object.keys(apiError.validationErrors).length > 0) {
          const firstField = Object.keys(apiError.validationErrors)[0];
          const firstError = apiError.validationErrors[firstField][0];
          showNotification(firstError || apiError.message || 'Error de validación.', 'error');
        } else {
          // Usar traducción del código si está disponible, sino usar el mensaje del backend
          const translatedMessage = getErrorMessage(apiError.code, apiError.message);
          showNotification(translatedMessage || 'Error en la solicitud.', 'error');
        }
      } else {
        // Error genÃ©rico - intentar usar traducción si hay código
        const translatedMessage = getErrorMessage(
          apiError.code,
          apiError.message || 'Ha ocurrido un error inesperado.'
        );
        showNotification(translatedMessage, 'error');
      }

      // Log del error para debugging (incluye el código de error si existe)
      if (apiError.code) {
        console.error(`API Error [${apiError.code}]:`, apiError);
      }
    },
    [showNotification]
  );

  const handleError = useCallback(
    (unknownError: unknown) => {
      if (unknownError instanceof ApiError) {
        handleApiError(unknownError);
      } else if (unknownError instanceof Error) {
        const genericError = new ApiError(
          unknownError.message || 'Error desconocido',
          0,
          undefined,
          [],
          undefined,
          'unknown'
        );
        handleApiError(genericError);
      } else {
        const genericError = new ApiError(
          'Ha ocurrido un error inesperado',
          0,
          undefined,
          [],
          undefined,
          'unknown'
        );
        handleApiError(genericError);
      }
    },
    [handleApiError]
  );

  return {
    error,
    isError: !!error,
    clearError,
    handleError,
    handleApiError,
  };
}

export default useApiError;
