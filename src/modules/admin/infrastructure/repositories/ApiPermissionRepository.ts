/**
 * ApiPermissionRepository - ImplementaciÃ³n del repositorio de permisos usando la API
 */

import { backendApiService } from '../../../shared/application/services/api';
import { Permission } from '../../domain/entities/Permission';
import { IPermissionRepository } from '../../domain/repositories/IPermissionRepository';
import {
  CreatePermissionData,
  PaginatedPermissionResult,
  PermissionFilters,
  UpdatePermissionData,
} from '../../domain/value-objects/PermissionFilters';
import { PermissionId } from '../../domain/value-objects/PermissionId';
import { ApiPermission, PermissionApiAdapter } from '../adapters/PermissionApiAdapter';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  totalItems?: number;
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  message?: string;
}

export class ApiPermissionRepository implements IPermissionRepository {
  private readonly adapter = PermissionApiAdapter;

  async findAll(filters?: PermissionFilters): Promise<PaginatedPermissionResult> {
    const apiFilters = filters ? this.adapter.filtersToApi(filters) : {};

    const queryParams = apiFilters as Record<string, string | number | boolean | undefined>;
    const response: ApiResponse<ApiPermission[]> = await backendApiService.getWithParams(
      '/Api/Auth/Permissions',
      queryParams
    );

    const permissions = response.data.map((apiPermission) => this.adapter.fromApi(apiPermission));

    return {
      permissions,
      total: response.totalRecords || response.totalItems || 0,
      page: response.currentPage || 1,
      pageSize: response.pageSize || 10,
      totalPages: response.totalPages || 1,
      hasNextPage: (response.currentPage || 1) < (response.totalPages || 1),
      hasPreviousPage: (response.currentPage || 1) > 1,
    };
  }

  async findById(id: PermissionId): Promise<Permission | null> {
    try {
      const response: ApiResponse<ApiPermission> = await backendApiService.get(
        `/Api/Auth/Permissions/${id.value}`
      );

      return this.adapter.fromApi(response.data);
    } catch (error) {
      // Si no se encuentra, retornar null
      return null;
    }
  }

  async create(data: CreatePermissionData): Promise<Permission> {
    const apiData = this.adapter.createDataToApi(data);

    const response: ApiResponse<ApiPermission> = await backendApiService.post(
      '/Api/Auth/Permissions',
      (apiData as unknown) as Record<string, unknown>
    );

    return this.adapter.fromApi(response.data);
  }

  async update(id: PermissionId, data: UpdatePermissionData): Promise<Permission> {
    const apiData = this.adapter.updateDataToApi(data);

    const response: ApiResponse<ApiPermission> = await backendApiService.put(
      `/Api/Auth/Permissions/${id.value}`,
      (apiData as unknown) as Record<string, unknown>
    );

    return this.adapter.fromApi(response.data);
  }

  async delete(id: PermissionId): Promise<void> {
    await backendApiService.delete(`/Api/Auth/Permissions/${id.value}`);
  }

  async search(
    searchTerm: string,
    filters?: PermissionFilters
  ): Promise<PaginatedPermissionResult> {
    const searchFilters = {
      ...filters,
      name: searchTerm,
    };

    return this.findAll(searchFilters);
  }

  async getPermissionsDropdown(): Promise<
    Array<{ id: string; name: string; description: string; module: string }>
  > {
    const response: ApiResponse<
      Array<{ id: string; name: string; description: string; module: string }>
    > = await backendApiService.get('/Api/Auth/Permissions/dropdown');

    return response.data;
  }

  async exportPermissions(filters?: PermissionFilters): Promise<Blob> {
    const apiFilters = filters ? this.adapter.filtersToApi(filters) : {};

    const exportParams = apiFilters as Record<string, string | number | boolean | undefined>;
    const blob = await backendApiService.getBlob(
      '/Api/Auth/Permissions/export',
      exportParams
    );

    return blob;
  }
}
