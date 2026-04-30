/**
 * CookieManager - Componente para gestiÃ³n automÃ¡tica de cookies
 * El Buen SazÃ³n Web Frontend - Next.js TypeScript
 */

'use client';
import { clearAllAuthData, clearProblematicData } from '@/lib/cookieUtils';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface CookieManagerProps {
  /** Si debe limpiar cookies al montar el componente */
  cleanOnMount?: boolean;
  /** Si debe limpiar cookies cuando cambia el estado de sesiÃ³n */
  cleanOnSessionChange?: boolean;
}

/**
 * Componente que gestiona la limpieza automÃ¡tica de cookies
 */
export function CookieManager({
  cleanOnMount = false,
  cleanOnSessionChange = true,
}: CookieManagerProps) {
  const { status } = useSession();

  useEffect(() => {
    // Limpiar solo cookies problemÃ¡ticas al montar si estÃ¡ habilitado
    if (cleanOnMount) {
      clearProblematicData(); // Preserva la sesiÃ³n activa
    }
  }, [cleanOnMount]);

  useEffect(() => {
    // Limpiar TODAS las cookies cuando el usuario se desautentica
    if (cleanOnSessionChange && status === 'unauthenticated') {
      clearAllAuthData(); // Limpieza completa para logout
    }
  }, [status, cleanOnSessionChange]);

  // Este componente no renderiza nada
  return null;
}

/**
 * Hook personalizado para gestiÃ³n de cookies
 */
export function useCookieManager(
  options: {
    cleanOnMount?: boolean;
    cleanOnLogin?: boolean;
    cleanOnLogout?: boolean;
  } = {}
) {
  const { status } = useSession();
  const { cleanOnMount = false, cleanOnLogin = false, cleanOnLogout = true } = options;

  useEffect(() => {
    if (cleanOnMount) {
      clearProblematicData(); // Preserva la sesiÃ³n activa
    }
  }, [cleanOnMount]);

  useEffect(() => {
    if (status === 'authenticated' && cleanOnLogin) {
      // Solo limpiar cookies problemÃ¡ticas, no la sesiÃ³n actual
      setTimeout(() => {
        clearProblematicData();
      }, 1000); // Esperar un segundo para que NextAuth establezca las nuevas cookies
    }

    if (status === 'unauthenticated' && cleanOnLogout) {
      clearAllAuthData(); // Limpieza completa para logout
    }
  }, [status, cleanOnLogin, cleanOnLogout]);

  return {
    clearCookies: clearAllAuthData,
    clearProblematicCookies: clearProblematicData,
    sessionStatus: status,
    isAuthenticated: status === 'authenticated',
  };
}
