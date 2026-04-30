/**
 * DeleteUserTypeUseCase - Caso de uso para eliminar un tipo de usuario
 */

import { IUserTypeRepository } from '../../../domain/repositories/IUserTypeRepository';
import { UserTypeId } from '../../../domain/value-objects/UserTypeId';

export class DeleteUserTypeUseCase {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(id: UserTypeId): Promise<void> {
    // Eliminar el tipo de usuario
    await this.userTypeRepository.delete(id);
  }
}
