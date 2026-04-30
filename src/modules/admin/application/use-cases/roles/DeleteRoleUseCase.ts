/**
 * DeleteRoleUseCase - Caso de uso para eliminar un rol
 */

import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { RoleId } from '../../../domain/value-objects/RoleId';

export class DeleteRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: RoleId): Promise<void> {
    // Verificar que el rol existe
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error(`Role with id ${id.value} not found`);
    }

    await this.roleRepository.delete(id);
  }
}
