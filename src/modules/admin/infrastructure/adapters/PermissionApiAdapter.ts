/**
 * PermissionApiAdapter - Adaptador para convertir entre entidades de dominio y datos de la API
 */

import { Permission, PermissionPrimitives } from '../../domain/entities/Permission';
import { PermissionFilters, CreatePermissionData, UpdatePermissionData } from '../../domain/value-objects/PermissionFilters';

// Interfaces para la API
export interface ApiPermission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  status: boolean;
  rolesCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiPermissionFilters {
  Name?: string;
  Status?: boolean;
  Module?: string;
  Action?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

export interface ApiCreatePermissionData {
  name: string;
  description: string;
  module: string;
  action: string;
  status: boolean;
}

export interface ApiUpdatePermissionData {
  name?: string;
  description?: string;
  module?: string;
  action?: string;
  status?: boolean;
}

export class PermissionApiAdapter {
  /**
   * Convierte una entidad de dominio a datos de la API
   */
  static toApi(permission: Permission): ApiPermission {
    const primitives = permission.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      description: primitives.description,
      module: primitives.module,
      action: primitives.action,
      status: primitives.status,
      rolesCount: primitives.rolesCount,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }

  /**
   * Convierte datos de la API a una entidad de dominio
   */
  static fromApi(apiPermission: ApiPermission): Permission {
    return Permission.fromPrimitives({
      id: apiPermission.id,
      name: apiPermission.name,
      description: apiPermission.description,
      module: apiPermission.module,
      action: apiPermission.action as 'read' | 'create' | 'edit' | 'delete' | 'config',
      status: apiPermission.status,
      rolesCount: apiPermission.rolesCount || 0,
      createdAt: apiPermission.createdAt,
      updatedAt: apiPermission.updatedAt,
    });
  }

  /**
   * Convierte datos de creaciÃ³n del dominio a formato de la API
   */
  static createDataToApi(data: CreatePermissionData): ApiCreatePermissionData {
    return {
      name: data.name,
      description: data.description,
      module: data.module,
      action: data.action,
      status: data.status,
    };
  }

  /**
   * Convierte datos de actualizaciÃ³n del dominio a formato de la API
   */
  static updateDataToApi(data: UpdatePermissionData): ApiUpdatePermissionData {
    return {
      name: data.name,
      description: data.description,
      module: data.module,
      action: data.action,
      status: data.status,
    };
  }

  /**
   * Convierte filtros del dominio a formato de la API
   */
  static filtersToApi(filters: PermissionFilters): ApiPermissionFilters {
    return {
      Name: filters.name,
      Status: filters.status,
      Module: filters.module,
      Action: filters.action,
      Page: filters.page,
      PageSize: filters.pageSize,
      SortBy: filters.sortBy,
      SortOrder: filters.sortOrder,
    };
  }
}