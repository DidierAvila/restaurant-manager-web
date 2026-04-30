/**
 * ApiRoleRepository - ImplementaciÃ³n del repositorio de roles usando API REST
 */

import {
  ApiResponse,
  PaginatedResponse,
  backendApiService,
} from '@/modules/shared/application/services/api';
import { Role } from '../../domain/entities/Role';
import {
  IRoleRepository,
  PaginatedRoleResult,
  RoleFilters,
} from '../../domain/repositories/IRoleRepository';
import { CreateRoleData } from '../../domain/value-objects/CreateRoleData';
import { RoleId } from '../../domain/value-objects/RoleId';
import { RoleApiAdapter } from '../adapters/RoleApiAdapter';

export class ApiRoleRepository implements IRoleRepository {
  private adapter = new RoleApiAdapter();

  async findAll(filters: RoleFilters): Promise<PaginatedRoleResult> {
    const apiFilters = this.adapter.filtersToApi(filters);
    const response: PaginatedResponse<any> = await backendApiService.getWithParams(
      '/Api/Auth/Roles',
      (apiFilters as unknown) as Record<string, string | number | boolean | undefined>
    );

    return {
      data: response.data.map((roleData: any) => this.adapter.fromApi(roleData)),
      total: response.totalRecords,
      page: response.currentPage,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    };
  }

  async findById(id: RoleId): Promise<Role | null> {
    try {
      const response: ApiResponse<any> = await backendApiService.get(`/Api/Auth/Roles/${id.value}`);
      return this.adapter.fromApi(response.data);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(roleData: CreateRoleData): Promise<Role> {
    const apiData = this.adapter.createDataToApi(roleData);
    const response: ApiResponse<any> = await backendApiService.post(
      '/Api/Auth/Roles',
      (apiData as unknown) as Record<string, unknown>
    );
    return this.adapter.fromApi(response.data);
  }

  async update(id: RoleId, updateData: CreateRoleData): Promise<Role> {
    const apiData = this.adapter.updateDataToApi({ ...updateData, id: id.value });
    const response: ApiResponse<any> = await backendApiService.put(
      `/Api/Auth/Roles/${id.value}`,
      (apiData as unknown) as Record<string, unknown>
    );
    return this.adapter.fromApi(response.data);
  }

  async delete(id: RoleId): Promise<void> {
    await backendApiService.delete(`/Api/Auth/Roles/${id.value}`);
  }

  async getRolesDropdown(): Promise<Array<{ id: string; name: string }>> {
    const response = await backendApiService.get<Array<{ id: string; name: string }>>(
      '/Api/Auth/Roles/dropdown'
    );
    return response;
  }

  async search(
    searchTerm: string,
    filters: Omit<RoleFilters, 'search'> = {}
  ): Promise<PaginatedRoleResult> {
    const apiFilters = this.adapter.filtersToApi({ ...filters, search: searchTerm });
    const response: PaginatedResponse<any> = await backendApiService.getWithParams(
      '/Api/Auth/Roles',
      (apiFilters as unknown) as Record<string, string | number | boolean | undefined>
    );

    return {
      data: response.data.map((roleData: any) => this.adapter.fromApi(roleData)),
      total: response.totalRecords,
      page: response.currentPage,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    };
  }
}
