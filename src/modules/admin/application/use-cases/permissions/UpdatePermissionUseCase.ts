/**
 * UpdatePermissionUseCase - Caso de uso para actualizar un permiso existente
 */

import { Permission } from '../../../domain/entities/Permission';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { UpdatePermissionData } from '../../../domain/value-objects/PermissionFilters';
import { PermissionId } from '../../../domain/value-objects/PermissionId';

export class UpdatePermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(id: string, data: UpdatePermissionData): Promise<Permission> {
    const permissionId = PermissionId.fromString(id);
    // El backend se encarga de las validaciones
    return await this.permissionRepository.update(permissionId, data);
  }
}
