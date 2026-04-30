/**
 * GetPermissionsDropdownUseCase - Caso de uso para obtener permisos en formato dropdown
 */

import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { PermissionDropdownItem, IDropdownUseCase } from '../../interfaces/DropdownInterfaces';

export class GetPermissionsDropdownUseCase implements IDropdownUseCase<PermissionDropdownItem> {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(): Promise<PermissionDropdownItem[]> {
    return await this.permissionRepository.getPermissionsDropdown();
  }
}
