/**
 * Servicio de AutenticaciÃ³n
 * Platform Web Frontend - Next.js TypeScript
 */

import { UserConfigurationData, UserConfigurationResponse } from '../../domain/entities/auth';
import { FieldValue } from '../../domain/entities/dynamic-fields';
import { backendApiService } from './api';

// Tipos para elementos de navegaciÃ³n
interface NavigationItem {
  route?: string;
  permissions?: string;
  children?: NavigationItem[];
  [key: string]: unknown;
}

export class AuthPermissionService {
  /**
   * Obtiene la configuraciÃ³n del usuario actual
   * @param token - Token de autenticaciÃ³n
   * @returns Promise con la configuraciÃ³n del usuario
   */
  static async getCurrentUserConfiguration(token?: string): Promise<UserConfigurationData> {
    // Configurar el token si se proporciona
    if (token) {
      backendApiService.setAuthToken(token);
    }

    const response = await backendApiService.get<UserConfigurationResponse | UserConfigurationData>(
      '/Api/Auth/me'
    );

    if ('user' in response) {
      return response;
    }

    if (response.data) {
      return response.data;
    }

    throw new Error('La respuesta de configuracion de usuario no tiene un formato valido.');
  }

  /**
   * Verifica si el usuario tiene un permiso especÃ­fico en una ruta
   * @param permissions - Permisos del usuario en formato string (ej: "read,create,edit,delete")
   * @param requiredPermission - Permiso requerido
   * @returns boolean indicando si tiene el permiso
   */
  static hasPermission(permissions: string, requiredPermission: string): boolean {
    if (!permissions) return false;
    const userPermissions = permissions.split(',').map((p) => p.trim().toLowerCase());
    return userPermissions.includes(requiredPermission.toLowerCase());
  }

  /**
   * Verifica si el usuario puede acceder a una ruta especÃ­fica
   * @param navigation - Array de elementos de navegaciÃ³n
   * @param route - Ruta a verificar
   * @param requiredPermission - Permiso requerido (por defecto 'read')
   * @returns boolean indicando si puede acceder
   */
  static canAccessRoute(
    navigation: NavigationItem[],
    route: string,
    requiredPermission = 'read'
  ): boolean {
    const findRoutePermissions = (items: NavigationItem[]): string | null => {
      for (const item of items) {
        if (item.route === route) {
          return item.permissions || null;
        }
        if (item.children && item.children.length > 0) {
          const childPermissions = findRoutePermissions(item.children);
          if (childPermissions) return childPermissions;
        }
      }
      return null;
    };

    const permissions = findRoutePermissions(navigation);
    return permissions ? this.hasPermission(permissions, requiredPermission) : false;
  }

  /**
   * Filtra los elementos de navegaciÃ³n basÃ¡ndose en los permisos del usuario
   * @param navigation - Array de elementos de navegaciÃ³n
   * @param requiredPermission - Permiso requerido (por defecto 'read')
   * @returns Array filtrado de elementos de navegaciÃ³n
   */
  static filterNavigationByPermissions(
    navigation: NavigationItem[],
    requiredPermission = 'read'
  ): NavigationItem[] {
    return navigation.filter((item) => {
      if (item.permissions) {
        return this.hasPermission(item.permissions, requiredPermission);
      }
      return true; // Si no tiene permisos definidos, permitir acceso
    });
  }

  /**
   * Actualiza el perfil del usuario actual
   * @param profileData - Datos del perfil a actualizar
   * @returns Promise con la respuesta del servidor
   */
  static async updateUserProfile(profileData: {
    email: string;
    name: string;
    image?: string;
    phone?: string;
    userTypeId: string;
    address?: string;
    additionalData?: Record<string, FieldValue>;
  }) {
    return backendApiService.put('/Api/Auth/me/update', profileData);
  }
}

// Exportar tambiÃ©n con el nombre original para compatibilidad
export { AuthPermissionService as AuthService };
