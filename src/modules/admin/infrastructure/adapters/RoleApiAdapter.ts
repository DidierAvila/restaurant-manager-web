/**
 * RoleApiAdapter - Adaptador para transformar datos entre API y dominio para roles
 */

import { Role } from '../../domain/entities/Role';
import { RoleId } from '../../domain/value-objects/RoleId';
import { RoleFilters } from '../../domain/repositories/IRoleRepository';
import { CreateRoleData } from '../../domain/value-objects/CreateRoleData';

// Tipos de la API (basados en el servicio existente)
interface ApiRole {
  id: string;
  name: string;
  description: string;
  permissions: Array<{ id: string; name: string }>;
  userCount?: number;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface ApiCreateRoleData {
  name: string;
  description: string;
  permissionIds: string[];
  status: boolean;
}

interface ApiRoleFilters {
  Name?: string;
  SearchTerm?: string;
  Status?: boolean | string;
  Page?: number;
  PageSize?: number;
  SortBy?: 'name' | 'description' | 'status' | 'createdat';
  SortOrder?: 'asc' | 'desc';
}

export class RoleApiAdapter {
  /**
   * Convierte datos de la API a entidad de dominio
   */
  fromApi(apiRole: ApiRole): Role {
    return Role.fromPrimitives({
      id: apiRole.id,
      name: apiRole.name,
      description: apiRole.description,
      permissions: apiRole.permissions || [],
      status: apiRole.status,
      createdAt: apiRole.createdAt,
      updatedAt: apiRole.updatedAt
    });
  }

  /**
   * Convierte entidad de dominio a datos de API
   */
  toApi(role: Role): ApiRole {
    const primitives = role.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      description: primitives.description,
      permissions: primitives.permissions,
      status: primitives.status,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt
    };
  }

  /**
   * Convierte CreateRoleData a formato de API
   */
  createDataToApi(createData: CreateRoleData): ApiCreateRoleData {
    return {
      name: createData.name,
      description: createData.description,
      permissionIds: createData.permissions,
      status: createData.status
    };
  }

  /**
   * Convierte datos de actualizaciÃ³n a formato de API
   */
  updateDataToApi(updateData: any): ApiCreateRoleData & { id: string } {
    return {
      id: updateData.id,
      name: updateData.name,
      description: updateData.description,
      permissionIds: updateData.permissions,
      status: updateData.status
    };
  }

  /**
   * Convierte filtros de dominio a formato de API
   */
  filtersToApi(filters: RoleFilters): ApiRoleFilters {
    return {
      Name: filters.name,
      SearchTerm: filters.search,
      Status: filters.status,
      Page: filters.page,
      PageSize: filters.pageSize,
      SortBy: filters.sortBy as any,
      SortOrder: filters.sortOrder
    };
  }
}