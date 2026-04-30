/**
 * ApiUserRepository - ImplementaciÃ³n del repositorio de usuarios usando API REST
 */

import { PaginatedResponse, backendApiService } from '@/modules/shared/application/services/api';
import { User } from '../../domain/entities/User';
import { IUserRepository, PaginatedResult } from '../../domain/repositories/IUserRepository';
import { CreateUserData } from '../../domain/value-objects/CreateUserData';
import { UserFilters } from '../../domain/value-objects/UserFilters';
import { UserId } from '../../domain/value-objects/UserId';
import { UserApiAdapter } from '../adapters/UserApiAdapter';

export class ApiUserRepository implements IUserRepository {
  private adapter = new UserApiAdapter();

  async findAll(filters: UserFilters): Promise<PaginatedResult<User>> {
    const apiFilters = this.adapter.filtersToApi(filters);
    const response: PaginatedResponse<unknown> = await backendApiService.getWithParams(
      '/Api/Auth/Users',
      (apiFilters as unknown) as Record<string, string | number | boolean | undefined>
    );

    const transformedData = this.transformApiDataToUsers(response.data as any[]);

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
   * Transforma un array de datos de la API a entidades User del dominio
   * @param apiData Array de datos de usuarios desde la API
   * @returns Array de entidades User vÃ¡lidas
   */
  private transformApiDataToUsers(apiData: any[]): User[] {
    if (!Array.isArray(apiData)) {
      console.error('Los datos de usuarios de la API no son un array vÃ¡lido:', apiData);
      return [];
    }

    return apiData
      .map((item, index) => this.safeTransformApiItem(item, index))
      .filter((item): item is User => item !== null);
  }

  /**
   * Transforma de forma segura un elemento individual de la API a entidad User
   * @param item Elemento individual de la API
   * @param index Ãndice del elemento para logging
   * @returns Entidad User o null si hay error
   */
  private safeTransformApiItem(item: any, index: number): User | null {
    try {
      if (!item || typeof item !== 'object') {
        console.warn(`Elemento de usuario en Ã­ndice ${index} no es un objeto vÃ¡lido:`, item);
        return null;
      }

      return this.adapter.fromApi(item);
    } catch (error) {
      console.error(`Error al procesar usuario en Ã­ndice ${index}:`, error, 'Datos:', item);
      return null;
    }
  }

  async findById(id: UserId): Promise<User | null> {
    try {
      const response: unknown = await backendApiService.get(`/Api/Auth/Users/${id.value}`);

      // Validar que la respuesta contenga datos vÃ¡lidos
      if (!response) {
        console.error('ðŸš¨ [ApiUserRepository] Respuesta del backend sin datos:', response);
        throw new Error('El backend no retornÃ³ datos del usuario');
      }

      console.log('âœ… [ApiUserRepository] Datos recibidos del backend:', response);
      return this.adapter.fromApi(response as any);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      console.error('ðŸš¨ [ApiUserRepository] Error al obtener usuario:', error);
      throw error;
    }
  }

  async create(userData: CreateUserData): Promise<User> {
    const apiData = this.adapter.createDataToApi(userData);
    const response: any = await backendApiService.post(
      '/Api/Auth/Users',
      (apiData as unknown) as Record<string, unknown>
    );
    return this.adapter.fromApi(response);
  }

  async update(id: UserId, updateData: Partial<CreateUserData>): Promise<User> {
    const apiData = this.adapter.updateDataToApi(updateData);
    const response: any = await backendApiService.put(
      `/Api/Auth/Users/${id.value}`,
      (apiData as unknown) as Record<string, unknown>
    );
    return this.adapter.fromApi(response);
  }

  async delete(id: UserId): Promise<void> {
    await backendApiService.delete(`/Api/Auth/Users/${id.value}`);
  }

  async changePassword(id: UserId, currentPassword: string, newPassword: string): Promise<void> {
    await backendApiService.patch(`/Api/Auth/Users/${id.value}/password`, {
      currentPassword,
      newPassword,
    });
  }

  // MÃ©todos futuros (comentados hasta que se implementen en el backend)
  /*
  async search(term: string, limit = 10): Promise<User[]> {
    const response: ApiResponse<User[]> = await backendApiService.getWithParams(
      '/Api/Auth/Users/search',
      { q: term, limit }
    );
    return response.data.map((userData) => this.adapter.toDomain(userData));
  }

  async changePassword(
    id: UserId,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await backendApiService.patch(`/Api/Auth/Users/${id.value}/password`, {
      currentPassword,
      newPassword,
    });
  }
  */
}
