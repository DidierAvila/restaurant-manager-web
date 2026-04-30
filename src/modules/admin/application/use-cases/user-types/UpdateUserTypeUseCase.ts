/**
 * UpdateUserTypeUseCase - Caso de uso para actualizar un tipo de usuario
 */

import { UserType } from '../../../domain/entities/UserType';
import { IUserTypeRepository } from '../../../domain/repositories/IUserTypeRepository';
import { CreateUserTypeData } from '../../../domain/value-objects/CreateUserTypeData';
import { UserTypeId } from '../../../domain/value-objects/UserTypeId';

export class UpdateUserTypeUseCase {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(id: UserTypeId, data: CreateUserTypeData): Promise<UserType> {
    // Actualizar usando el repositorio
    return await this.userTypeRepository.update(id, data);
  }
}
