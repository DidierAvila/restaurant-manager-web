/**
 * Contexto de Usuario
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { apiService } from '../../application/services/api';
import { AuthService } from '../../application/services/authService';
import {
  NavigationItem,
  UserConfigurationData,
  UserContextState,
  UserContextValue,
} from '../../domain/entities/auth';
import { useApiAuth } from '../hooks/useApiAuth';
import { useApiError } from '../hooks/useApiError';

// Estado inicial
const initialState: UserContextState = {
  user: null,
  roles: [],
  portalConfiguration: null,
  navigation: [],
  isLoading: false,
  error: null,
};

// Tipos para las acciones del reducer
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_CONFIGURATION'; payload: UserConfigurationData }
  | { type: 'CLEAR_USER_CONFIGURATION' };

// Reducer
function userReducer(state: typeof initialState, action: UserAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_USER_CONFIGURATION':
      if (!action.payload?.user) {
        return {
          ...state,
          isLoading: false,
          error: 'La configuracion del usuario no tiene un formato valido.',
        };
      }

      return {
        ...state,
        user: action.payload.user,
        roles: action.payload.roles,
        portalConfiguration: action.payload.portalConfiguration,
        navigation: action.payload.portalConfiguration?.additionalConfig?.navigation || [],
        isLoading: false,
        error: null,
      };
    case 'CLEAR_USER_CONFIGURATION':
      return initialState;
    default:
      return state;
  }
}

// Contexto
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props del provider
interface UserProviderProps {
  children: React.ReactNode;
}

// Provider
export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { data: session, status } = useSession();
  useApiError();
  const { isAuthenticated, isLoading: authLoading } = useApiAuth();

  // Acciones
  const setUserConfiguration = useCallback((data: UserConfigurationData) => {
    dispatch({ type: 'SET_USER_CONFIGURATION', payload: data });
  }, []);

  const clearUserConfiguration = useCallback(() => {
    dispatch({ type: 'CLEAR_USER_CONFIGURATION' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // FunciÃ³n para cargar la configuraciÃ³n del usuario
  const loadUserConfiguration = useCallback(async () => {
    if (!session?.user) return;

    // Evitar llamadas duplicadas si ya se estÃ¡ cargando o ya se cargÃ³
    if (state.isLoading || state.user) return;

    try {
      setLoading(true);
      setError(null);

      // Solo intentar cargar configuraciÃ³n si tenemos un token vÃ¡lido
      const accessToken = (session as any)?.accessToken;
      if (!accessToken || accessToken.startsWith('oauth-temp-')) {
        // Usar datos bÃ¡sicos de la sesiÃ³n sin llamar al backend
        // Establecer configuraciÃ³n bÃ¡sica usando el reducer directamente
        dispatch({
          type: 'SET_USER_CONFIGURATION',
          payload: {
            user: {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              avatar: session.user.avatar,
            },
            roles: [
              {
                id: session.user.role,
                name: session.user.role,
                description: `${session.user.role} role`,
                status: true,
              },
            ],
            portalConfiguration: {
              id: 'default',
              userTypeId: session.user.role,
              customLabel: null,
              customIcon: null,
              customRoute: null,
              theme: 'default',
              defaultLandingPage: '/dashboard',
              logoUrl: null,
              language: 'es',
              additionalConfig: {
                navigation: [],
              },
              createdAt: new Date().toISOString(),
              updatedAt: null,
            },
          },
        });

        return;
      }

      // Configurar el token en el ApiService antes de hacer la llamada

      apiService.setAuthToken(accessToken);

      const response = await AuthService.getCurrentUserConfiguration();
      setUserConfiguration(response);
    } catch (error) {
      // No llamar handleError para evitar el bucle de sesiÃ³n expirada
      // Solo establecer el error local
      setError('Error al cargar la configuraciÃ³n del usuario');

      // Usar configuraciÃ³n bÃ¡sica como fallback
      dispatch({
        type: 'SET_USER_CONFIGURATION',
        payload: {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            avatar: session.user.avatar,
          },
          roles: [
            {
              id: session.user.role,
              name: session.user.role,
              description: `${session.user.role} role`,
              status: true,
            },
          ],
          portalConfiguration: {
            id: 'default',
            userTypeId: session.user.role,
            customLabel: null,
            customIcon: null,
            customRoute: null,
            theme: 'default',
            defaultLandingPage: '/dashboard',
            logoUrl: null,
            language: 'es',
            additionalConfig: {
              navigation: [],
            },
            createdAt: new Date().toISOString(),
            updatedAt: null,
          },
        },
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user, state.isLoading, state.user, setUserConfiguration, setLoading, setError]);

  // Efecto para cargar la configuraciÃ³n cuando el usuario se autentica
  useEffect(() => {

    if (status === 'authenticated' && session?.user && !state.user) {
      loadUserConfiguration();
    } else if (status === 'unauthenticated') {
      clearUserConfiguration();
    }
  }, [status, session?.user, state.user, loadUserConfiguration, clearUserConfiguration]);

  // Funciones de utilidad
  const hasPermission = useCallback((permissions: string, requiredPermission: string): boolean => {
    return AuthService.hasPermission(permissions, requiredPermission);
  }, []);

  const getFilteredNavigation = useCallback(
    (navigation: NavigationItem[], requiredPermission = 'read'): NavigationItem[] => {
      // Usamos el tipo correcto para la funciÃ³n del servicio
      return AuthService.filterNavigationByPermissions(
        navigation as any,
        requiredPermission
      ) as any;
    },
    []
  );

  const contextValue: UserContextValue = {
    ...state,
    setUserConfiguration,
    clearUserConfiguration,
    setLoading,
    setError,
    hasPermission,
    getFilteredNavigation,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

// Hook para usar el contexto
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
}

// Hook para verificar permisos
export function usePermissions() {
  const { hasPermission, getFilteredNavigation } = useUser();
  return { hasPermission, getFilteredNavigation };
}

// Hook para obtener informaciÃ³n del usuario
export function useUserInfo() {
  const { user, roles, portalConfiguration, isLoading } = useUser();
  return { user, roles, portalConfiguration, isLoading };
}
