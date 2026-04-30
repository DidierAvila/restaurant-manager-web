/**
 * GetUserTypesDropdownUseCase - Caso de uso para obtener tipos de usuario para dropdown
 */

import { IUserTypeRepository } from '../../../domain/repositories/IUserTypeRepository';
import { UserTypeDropdownItem, IDropdownUseCase } from '../../interfaces/DropdownInterfaces';

export class GetUserTypesDropdownUseCase implements IDropdownUseCase<UserTypeDropdownItem> {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(): Promise<UserTypeDropdownItem[]> {
    return await this.userTypeRepository.getUserTypesDropdown();
  }
}
