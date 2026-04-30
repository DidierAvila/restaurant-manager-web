/**
 * ApiUserTypeRepository - ImplementaciÃ³n del repositorio de tipos de usuario usando API REST
 */

import {
  ApiResponse,
  PaginatedResponse,
  backendApiService,
} from '@/modules/shared/application/services/api';
import { UserTypeDropdownItem } from '../../application/interfaces/DropdownInterfaces';
import { UserType } from '../../domain/entities/UserType';
import {
  IUserTypeRepository,
  PaginatedResult,
} from '../../domain/repositories/IUserTypeRepository';
import { CreateUserTypeData } from '../../domain/value-objects/CreateUserTypeData';
import { UserTypeFilters } from '../../domain/value-objects/UserTypeFilters';
import { UserTypeId } from '../../domain/value-objects/UserTypeId';
import { ApiUserType, UserTypeApiAdapter } from '../adapters/UserTypeApiAdapter';

export class ApiUserTypeRepository implements IUserTypeRepository {
  private adapter = new UserTypeApiAdapter();
  async findAll(filters: UserTypeFilters): Promise<PaginatedResult<UserType>> {
    const apiFilters = this.adapter.filtersToApi(filters);

    const response: PaginatedResponse<unknown> = await backendApiService.getWithParams(
      '/Api/Auth/UserTypes',
      apiFilters as Record<string, string | number | boolean | undefined>
    );

    const transformedData = this.transformApiDataToUserTypes(response.data as ApiUserType[]);

    return {
      data: transformedData,
      totalRecords: response.totalRecords,
      currentPage: response.currentPage,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
      hasPreviousPage: response.hasPreviousPage,
      hasNextPage: response.hasNextPage,
      sortBy: response.sortBy || undefined,
    };
  }

  /**
   * Transforma un array de datos de la API a entidades UserType
   * Maneja errores de forma robusta y filtra elementos invÃ¡lidos
   */
  private transformApiDataToUserTypes(apiData: ApiUserType[]): UserType[] {
    if (!Array.isArray(apiData)) {
      console.warn('API response data is not an array, returning empty array');
      return [];
    }

    return apiData
      .map((item, index) => this.safeTransformApiItem(item, index))
      .filter((item): item is UserType => item !== null);
  }

  /**
   * Transforma de forma segura un elemento de la API a UserType
   * Registra errores sin interrumpir el procesamiento del resto de elementos
   */
  private safeTransformApiItem(item: ApiUserType, index: number): UserType | null {
    try {
      if (!item || typeof item !== 'object') {
        console.warn(
          `Invalid API item at index ${index}: item is null, undefined, or not an object`
        );
        return null;
      }

      const result = this.adapter.fromApi(item);

      if (result === null) {
        console.warn(`Failed to transform API item at index ${index}: adapter returned null`);
        return null;
      }

      return result;
    } catch (error) {
      console.error(`Error transforming API item at index ${index}:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        item: item ? { id: item.id, name: item.name } : 'Invalid item',
      });
      return null;
    }
  }

  async findById(id: UserTypeId): Promise<UserType | null> {
    try {
      const response: ApiResponse<ApiUserType> = await backendApiService.get(
        `/Api/Auth/UserTypes/${id.value}`
      );
      return this.adapter.fromApi(response.data);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(userTypeData: CreateUserTypeData): Promise<UserType> {
    const apiData = this.adapter.createDataToApi(userTypeData);

    const response: ApiUserType = await backendApiService.post(
      '/Api/Auth/UserTypes',
      apiData as unknown as Record<string, unknown>
    );

    return this.adapter.fromApi(response);
  }

  async update(id: UserTypeId, updateData: CreateUserTypeData): Promise<UserType> {
    const apiData = this.adapter.updateDataToApi(updateData);
    const response: ApiUserType = await backendApiService.put(
      `/Api/Auth/UserTypes/${id.value}`,
      apiData as unknown as Record<string, unknown>
    );
    return this.adapter.fromApi(response);
  }

  async delete(id: UserTypeId): Promise<void> {
    await backendApiService.delete(`/Api/Auth/UserTypes/${id.value}`);
  }

  async getUserTypesDropdown(): Promise<UserTypeDropdownItem[]> {
    const response = await backendApiService.get<UserTypeDropdownItem[]>(
      '/Api/Auth/UserTypes/dropdown'
    );
    return response;
  }
}
