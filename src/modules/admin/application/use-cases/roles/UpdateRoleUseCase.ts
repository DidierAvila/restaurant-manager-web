/**
 * UpdateRoleUseCase - Caso de uso para actualizar un rol
 */

import { Role } from '../../../domain/entities/Role';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { RoleId } from '../../../domain/value-objects/RoleId';
import { CreateRoleData } from '../../../domain/value-objects/CreateRoleData';

export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: RoleId, updateData: CreateRoleData): Promise<Role> {
    return await this.roleRepository.update(id, updateData);
  }
}
