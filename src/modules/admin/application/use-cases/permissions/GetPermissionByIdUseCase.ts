/**
 * GetPermissionByIdUseCase - Caso de uso para obtener un permiso por su ID
 */

import { Permission } from '../../../domain/entities/Permission';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { PermissionId } from '../../../domain/value-objects/PermissionId';

export class GetPermissionByIdUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(id: string): Promise<Permission | null> {
    const permissionId = PermissionId.fromString(id);
    return await this.permissionRepository.findById(permissionId);
  }
}
