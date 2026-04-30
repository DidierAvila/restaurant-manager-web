/**
 * Hook para manejo de autenticaciÃ³n en las llamadas a la API
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { apiService, backendApiService } from '@/modules/shared/application/services/api';

export interface UseApiAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setApiToken: (token: string) => void;
  clearApiToken: () => void;
}

/**
 * Hook que sincroniza la sesiÃ³n de NextAuth con el servicio de API
 */
export function useApiAuth(): UseApiAuthReturn {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const token = (session as any)?.accessToken || null;

  // Sincronizar token con ambos servicios de API
  useEffect(() => {
    if (token) {
      apiService.setAuthToken(token);
      backendApiService.setAuthToken(token);
    } else {
      apiService.clearAuthToken();
      backendApiService.clearAuthToken();
    }
  }, [token]);

  const setApiToken = (newToken: string) => {
    apiService.setAuthToken(newToken);
    backendApiService.setAuthToken(newToken);
  };

  const clearApiToken = () => {
    apiService.clearAuthToken();
    backendApiService.clearAuthToken();
  };

  return {
    isAuthenticated,
    isLoading,
    token,
    setApiToken,
    clearApiToken,
  };
}

export default useApiAuth;
