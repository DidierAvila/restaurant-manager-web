/**
 * GetRoleByIdUseCase - Caso de uso para obtener un rol por ID
 */

import { Role } from '../../../domain/entities/Role';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { RoleId } from '../../../domain/value-objects/RoleId';

export class GetRoleByIdUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: RoleId): Promise<Role> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new Error(`Role with id ${id.value} not found`);
    }

    return role;
  }
}
