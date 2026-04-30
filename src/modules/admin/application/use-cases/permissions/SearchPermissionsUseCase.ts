/**
 * SearchPermissionsUseCase - Caso de uso para buscar permisos
 */

import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import {
  PaginatedPermissionResult,
  PermissionFilters,
} from '../../../domain/value-objects/PermissionFilters';

export class SearchPermissionsUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(
    searchTerm: string,
    filters?: PermissionFilters
  ): Promise<PaginatedPermissionResult> {
    return await this.permissionRepository.search(searchTerm, filters);
  }
}
