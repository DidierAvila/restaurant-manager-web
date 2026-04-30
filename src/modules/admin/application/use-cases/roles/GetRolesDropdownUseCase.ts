/**
 * GetRolesDropdownUseCase - Caso de uso para obtener los roles disponibles para dropdown
 */

import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { RoleDropdownItem, IDropdownUseCase } from '../../interfaces/DropdownInterfaces';

export class GetRolesDropdownUseCase implements IDropdownUseCase<RoleDropdownItem> {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(): Promise<RoleDropdownItem[]> {
    return await this.roleRepository.getRolesDropdown();
  }
}
