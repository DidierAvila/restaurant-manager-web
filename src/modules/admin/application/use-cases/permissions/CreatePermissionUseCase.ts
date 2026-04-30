/**
 * CreatePermissionUseCase - Caso de uso para crear un nuevo permiso
 */

import { Permission } from '../../../domain/entities/Permission';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { CreatePermissionData } from '../../../domain/value-objects/PermissionFilters';

export class CreatePermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(data: CreatePermissionData): Promise<Permission> {
    // El backend se encarga de las validaciones
    return await this.permissionRepository.create(data);
  }
}
