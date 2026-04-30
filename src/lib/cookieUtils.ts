/**
 * Utilidades para manejo de cookies - El Buen Sazón Web
 * Funciones para limpiar cookies problemáticas
 */

/**
 * Lista de cookies que pueden causar conflictos
 * NOTA: NO incluimos 'auth.s' aquí­ porque es la cookie de sesión activa de NextAuth
 */
const PROBLEMATIC_COOKIES = [
  'next-auth.csrf-token',
  'next-auth.callback-url',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.pkce.code_verifier',
  'next-auth.state',
  'next-auth.nonce',
];

/**
 * Limpia cookies problemáticas relacionadas con autenticación
 * PRESERVA la cookie de sesión activa (auth.s) para mantener la sesión del usuario
 */
export function clearAuthCookies(): void {
  if (typeof document === 'undefined') {
    // No ejecutar en el servidor
    return;
  }

  console.log('ðŸ§¹ [COOKIES] Iniciando limpieza de cookies problemáticas');

  // Obtener todas las cookies actuales
  const allCookies = document.cookie.split(';');

  // Limpiar cookies especÃ­ficas problemÃ¡ticas
  PROBLEMATIC_COOKIES.forEach((cookieName) => {
    deleteCookie(cookieName);
  });

  // Limpiar cookies problemáticas pero PRESERVAR la cookie de sesión activa
  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();

    // NO eliminar la cookie de sesión activa de NextAuth
    if (cookieName === 'auth.s') {
      return;
    }

    // Eliminar otras cookies problemáticas
    if (
      cookieName.toLowerCase().includes('csrf') ||
      cookieName.toLowerCase().includes('callback') ||
      cookieName.toLowerCase().includes('pkce') ||
      cookieName.toLowerCase().includes('state') ||
      cookieName.toLowerCase().includes('nonce')
    ) {
      deleteCookie(cookieName);
    }
  });
}

/**
 * Elimina una cookie especÃ­fica
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;

  // Eliminar cookie en diferentes paths y dominios
  const paths = ['/', '/auth', '/dashboard'];
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
    'localhost',
    '.localhost',
  ];

  paths.forEach((path) => {
    domains.forEach((domain) => {
      // Eliminar cookie normal
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
      // Eliminar cookie segura
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}; secure`;
      // Eliminar cookie con SameSite
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}; SameSite=Lax`;
    });
  });
}

/**
 * Limpia localStorage y sessionStorage relacionados con autenticaciÃ³n
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') {
    // No ejecutar en el servidor
    return;
  }

  console.log('ðŸ§¹ [STORAGE] Iniciando limpieza de storage de autenticaciÃ³n');

  try {
    // Limpiar localStorage
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach((key) => {
      if (
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('session')
      ) {
        localStorage.removeItem(key);
      }
    });
    // Limpiar sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach((key) => {
      if (
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('session')
      ) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('âš ï¸ [STORAGE] Error al limpiar storage:', error);
  }
}

/**
 * Limpia TODAS las cookies de autenticación incluyendo la sesión activa
 * SOLO usar durante logout completo
 */
export function clearAllAuthCookies(): void {
  if (typeof document === 'undefined') {
    // No ejecutar en el servidor
    return;
  }

  console.log('ðŸ§¹ [COOKIES] Iniciando limpieza COMPLETA de cookies de autenticación');

  // Obtener todas las cookies actuales
  const allCookies = document.cookie.split(';');

  // Limpiar TODAS las cookies de autenticación incluyendo auth.s
  const ALL_AUTH_COOKIES = [
    'auth.s', // Cookie de sesión de NextAuth
    ...PROBLEMATIC_COOKIES,
  ];

  ALL_AUTH_COOKIES.forEach((cookieName) => {
    deleteCookie(cookieName);
  });

  // Limpiar cualquier cookie que contenga términos de autenticación
  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    if (
      cookieName.toLowerCase().includes('auth') ||
      cookieName.toLowerCase().includes('csrf') ||
      cookieName.toLowerCase().includes('session') ||
      cookieName.toLowerCase().includes('token')
    ) {
      deleteCookie(cookieName);
    }
  });
}

/**
 * Limpia todos los datos de autenticación (cookies + storage)
 * Para logout completo
 */
export function clearAllAuthData(): void {
  clearAllAuthCookies(); // Usar la función completa para logout
  clearAuthStorage();
}

/**
 * Limpia solo cookies problemáticas preservando la sesión activa
 * Para limpieza durante login o startup
 */
export function clearProblematicData(): void {
  clearAuthCookies(); // Usar la función que preserva la sesión
  // NO limpiar storage durante login
}

/**
 * Hook para limpiar cookies al montar un componente
 */
export function useCookieCleanup(shouldClean = false): void {
  if (typeof window !== 'undefined' && shouldClean) {
    clearAllAuthData();
  }
}
