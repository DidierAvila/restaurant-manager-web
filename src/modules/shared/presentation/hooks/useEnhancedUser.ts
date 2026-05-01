/**
 * Enhanced User Hook - Hook centralizado para gestiÃ³n de datos de usuario
 * Combina datos del token JWT y del endpoint /me para una fuente Ãºnica de verdad
 * Platform Web Frontend - Next.js TypeScript
 */

'use client';

import { AuthPermissionService } from '@/modules/shared/application/services/authService';
import { NavigationItem, PortalConfiguration, Role, UserConfigurationData } from '@/modules/shared/domain/entities/auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

// Interface para datos completos del usuario (combinando token + endpoint /me)
export interface EnhancedUser {
  // Datos bÃ¡sicos del token
  id: string;
  email: string;
  name: string;

  // Datos especÃ­ficos del token JWT
  userId: string;
  userName: string;
  userEmail: string;
  userTypeId: string;
  userTypeName: string;

  // Datos adicionales del endpoint /me
  avatar?: string;
  portalConfiguration?: PortalConfiguration;
  roles?: Role[];
  navigation?: NavigationItem[];

  // Datos derivados/computados
  displayName: string; // Nombre preferido para mostrar
  displayEmail: string; // Email preferido para mostrar
  displayUserType: string; // Tipo de usuario para mostrar
  initials: string; // Iniciales para avatar
}

export interface UseEnhancedUserReturn {
  user: EnhancedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;

  // Datos del token (inmediatos)
  tokenData: {
    userId?: string;
    userName?: string;
    userEmail?: string;
    userTypeId?: string;
    userTypeName?: string;
  } | null;

  // Datos del endpoint /me (pueden tardar en cargar)
  meData: UserConfigurationData | null;
  meLoading: boolean;
  meError: string | null;

  // Estados de conexión
  connectionFailed: boolean;
  retryCount: number;
  circuitBreakerOpen: boolean;

  // Funciones utilitarias
  refreshUserData: () => Promise<void>;
  resetConnectionState: () => void;
  getDisplayName: () => string;
  getDisplayEmail: () => string;
  getUserInitials: () => string;
}

/**
 * Hook centralizado para gestión de datos de usuario
 * Combina datos del token JWT con datos del endpoint /me
 */
export function useEnhancedUser(): UseEnhancedUserReturn {
  const { data: session, status } = useSession();
  const [meData, setMeData] = useState<UserConfigurationData | null>(null);
  const [meLoading, setMeLoading] = useState(false);
  const [meError, setMeError] = useState<string | null>(null);
  const [meAttempted, setMeAttempted] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [circuitBreakerOpen, setCircuitBreakerOpen] = useState(false);

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const accessToken = session?.accessToken || null;

  // Extraer datos del token JWT
  const tokenData = session?.accessToken ? extractTokenData(session.accessToken) : null;

  const MAX_RETRY_ATTEMPTS = 3;

  /**
   * Detectar si un error es de conexiÃ³n de red (NO de permisos/autorizaciÃ³n)
   */
  function isNetworkError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const e = error as Record<string, unknown>;

    if (typeof e.status === 'number' && e.status >= 400 && e.status < 600) return false;

    const name = e.name as string | undefined;
    const message = e.message as string | undefined;
    const code = e.code as string | undefined;

    if (name === 'TypeError' && message?.includes('fetch')) return true;
    if (message?.includes('Failed to fetch')) return true;
    if (message?.includes('Network request failed')) return true;
    if (message?.includes('internet')) return true;
    if (message?.includes('conexión')) return true;
    if (code === 'NETWORK_ERROR') return true;
    if (e.status === 0) return true;

    return false;
  }

  /**
   * FunciÃ³n para extraer datos del token JWT
   */
  function extractTokenData(token: string) {
    try {
      // Verificar que no sea un token temporal de OAuth
      if (token.startsWith('oauth-temp-')) {
        return null;
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      return {
        userId: payload.userId,
        userName: payload.userName,
        userEmail: payload.userEmail,
        userTypeId: payload.userTypeId,
        userTypeName: payload.userTypeName,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Cargar datos del endpoint /me
   */
  const loadMeData = useCallback(async () => {
    if (!session?.accessToken || session.accessToken.startsWith('oauth-temp-')) {
      return;
    }

    // Validar que el token tenga datos bÃ¡sicos
    if (!tokenData) {
      return;
    }

    setMeLoading(true);
    setMeError(null);
    setMeAttempted(true);

    try {
      const data = await AuthPermissionService.getCurrentUserConfiguration();
      setMeData(data);
      setConnectionFailed(false); // Reset en caso de Ã©xito
      setRetryCount(0); // Reset contador
      setCircuitBreakerOpen(false); // Cerrar circuit breaker en caso de Ã©xito
    } catch (error: unknown) {

      // ðŸ” ERRORES DE AUTORIZACIÃ“N/PERMISOS (401, 403) - No reintentar
      if ((error as Record<string,unknown>)?.status === 401) {
        setMeError(null); // No mostrar como error, es comportamiento esperado
        setConnectionFailed(false);
        setMeAttempted(true); // âœ… Marcar como intentado para evitar bucles
        // NO incrementar retryCount, NO activar circuit breaker
      } else if ((error as Record<string,unknown>)?.status === 403) {
        setMeError(null); // No mostrar como error, es comportamiento esperado
        setConnectionFailed(false);
        setMeAttempted(true); // âœ… Marcar como intentado para evitar bucles
        // NO incrementar retryCount, NO activar circuit breaker
      }
      // ðŸŒ ERRORES DE RED - SÃ­ reintentar con circuit breaker
      else if (isNetworkError(error)) {
        setConnectionFailed(true);

        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);

        if (newRetryCount >= MAX_RETRY_ATTEMPTS) {
          setCircuitBreakerOpen(true);
          setMeError('Sin conexión a internet. La aplicación funcionará con datos básicos.');
        } else {
          setMeError('Error de conexión. Verifica tu conexión a internet.');
        }
      }
      // ðŸ”§ OTROS ERRORES DEL SERVIDOR (4xx, 5xx) - No reintentar
      else {
        setMeError('Error del servidor al cargar configuraciÃ³n adicional');
        setConnectionFailed(false);
        // NO incrementar retryCount, NO activar circuit breaker
      }

      // Asegurar que setMeData se llame con null para indicar que no hay datos adicionales
      setMeData(null);
    } finally {
      setMeLoading(false);
    }
  }, [session?.accessToken, tokenData, retryCount]);

  /**
   * Cargar datos al montar o cambiar sesiÃ³n
   */
  useEffect(() => {
    // No hacer nada si el circuit breaker estÃ¡ abierto
    if (circuitBreakerOpen) {
      return;
    }

    // Condiciones para intentar cargar datos /me
    const shouldLoadMeData = isAuthenticated && tokenData && !meData && !meLoading && !meAttempted;

    if (shouldLoadMeData) {
      loadMeData();
    }
  }, [
    isAuthenticated,
    tokenData,
    meData,
    meLoading,
    meAttempted,
    circuitBreakerOpen,
    loadMeData,
  ]);;

  /**
   * Función para refrescar datos del usuario
   */
  const refreshUserData = useCallback(async () => {
    setMeAttempted(false); // Reset para permitir nuevo intento
    setConnectionFailed(false); // Reset estado de conexión
    setRetryCount(0); // Reset contador de reintentos
    setCircuitBreakerOpen(false); // Abrir circuit breaker
    setMeError(null); // Limpiar error anterior
    await loadMeData();
  }, [loadMeData]);

  /**
   * Función para resetear el circuit breaker manualmente
   */
  const resetConnectionState = useCallback(() => {
    setConnectionFailed(false);
    setRetryCount(0);
    setMeAttempted(false);
    setCircuitBreakerOpen(false);
    setMeError(null);
  }, []);

  /**
   * Crear objeto usuario combinado
   */
  const user: EnhancedUser | null = session?.user
    ? {
        // Datos básicos de NextAuth
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,

        // Datos del token (prioritarios)
        userId: tokenData?.userId || session.user.id,
        userName: tokenData?.userName || session.user.name,
        userEmail: tokenData?.userEmail || session.user.email,
        userTypeId: tokenData?.userTypeId || '',
        userTypeName: tokenData?.userTypeName || session.user.role || '',

        // Datos del endpoint /me
        avatar: meData?.user?.avatar || session.user.avatar,
        portalConfiguration: meData?.portalConfiguration,
        roles: meData?.roles,
        navigation: meData?.portalConfiguration?.additionalConfig?.navigation,

        // Datos computados (priorizando token > /me > session)
        displayName: tokenData?.userName || meData?.user?.name || session.user.name || 'Usuario',
        displayEmail: tokenData?.userEmail || meData?.user?.email || session.user.email || '',
        displayUserType: tokenData?.userTypeName || session.user.role || 'Usuario',
        initials: getInitials(
          tokenData?.userName || meData?.user?.name || session.user.name || 'U'
        ),
      }
    : null;

  /**
   * Funciones utilitarias
   */
  const getDisplayName = useCallback(() => {
    return user?.displayName || 'Usuario';
  }, [user]);

  const getDisplayEmail = useCallback(() => {
    return user?.displayEmail || '';
  }, [user]);

  const getUserInitials = useCallback(() => {
    return user?.initials || 'U';
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated,
    accessToken,
    tokenData,
    meData,
    meLoading,
    meError,
    connectionFailed,
    retryCount,
    circuitBreakerOpen,
    refreshUserData,
    resetConnectionState,
    getDisplayName,
    getDisplayEmail,
    getUserInitials,
  };
}

/**
 * Función utilitaria para generar iniciales
 */
function getInitials(name: string): string {
  if (!name) return 'U';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export default useEnhancedUser;
