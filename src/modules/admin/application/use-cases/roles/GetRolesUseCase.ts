/**
 * GetRolesUseCase - Caso de uso para obtener roles con filtros
 */

import {
  IRoleRepository,
  PaginatedRoleResult,
  RoleFilters,
} from '../../../domain/repositories/IRoleRepository';

export class GetRolesUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(filters: RoleFilters): Promise<PaginatedRoleResult> {
    return await this.roleRepository.findAll(filters);
  }
}
