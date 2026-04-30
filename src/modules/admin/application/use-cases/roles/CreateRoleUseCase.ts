/**
 * CreateRoleUseCase - Caso de uso para crear un nuevo rol
 */

import { Role } from '../../../domain/entities/Role';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { CreateRoleData } from '../../../domain/value-objects/CreateRoleData';

export class CreateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(roleData: CreateRoleData): Promise<Role> {
    return await this.roleRepository.create(roleData);
  }
}
