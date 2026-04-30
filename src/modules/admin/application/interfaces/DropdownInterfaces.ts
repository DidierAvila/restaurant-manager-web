/**
 * DropdownInterfaces - Interfaces base para casos de uso de dropdown
 * Proporciona tipos estÃ¡ndar para elementos de dropdown en toda la aplicaciÃ³n
 */

/**
 * Interfaz base para elementos de dropdown simples
 */
export interface BaseDropdownItem {
  id: string;
  name: string;
}

/**
 * Interfaz extendida para elementos de dropdown con descripción
 */
export interface ExtendedDropdownItem extends BaseDropdownItem {
  description: string;
}

/**
 * Interfaz para elementos de dropdown con módulo (usado en permisos)
 */
export interface ModuleDropdownItem extends ExtendedDropdownItem {
  module: string;
}

/**
 * Interfaz base para casos de uso de dropdown
 */
export interface IDropdownUseCase<T extends BaseDropdownItem> {
  execute(): Promise<T[]>;
}

/**
 * Tipos específicos para cada entidad
 */

// Roles
export interface RoleDropdownItem extends BaseDropdownItem {}

// User Types
export interface UserTypeDropdownItem extends BaseDropdownItem {}

// Permissions
export interface PermissionDropdownItem extends ModuleDropdownItem {}
