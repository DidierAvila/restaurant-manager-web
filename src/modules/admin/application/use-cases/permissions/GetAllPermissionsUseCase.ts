/**
 * GetAllPermissionsUseCase - Caso de uso para obtener permisos con filtros y paginaciÃ³n
 */

import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import {
  PaginatedPermissionResult,
  PermissionFilters,
} from '../../../domain/value-objects/PermissionFilters';

export class GetAllPermissionsUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(filters?: PermissionFilters): Promise<PaginatedPermissionResult> {
    return await this.permissionRepository.findAll(filters);
  }
}
