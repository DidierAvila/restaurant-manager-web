/**
 * DeletePermissionUseCase - Caso de uso para eliminar un permiso
 */

import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { PermissionId } from '../../../domain/value-objects/PermissionId';

export class DeletePermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(id: string): Promise<void> {
    const permissionId = PermissionId.fromString(id);
    await this.permissionRepository.delete(permissionId);
  }
}
