/**
 * GetUserTypeByIdUseCase - Caso de uso para obtener un tipo de usuario por ID
 */

import { UserType } from '../../../domain/entities/UserType';
import { IUserTypeRepository } from '../../../domain/repositories/IUserTypeRepository';
import { UserTypeId } from '../../../domain/value-objects/UserTypeId';

export class GetUserTypeByIdUseCase {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(id: UserTypeId): Promise<UserType> {
    const userType = await this.userTypeRepository.findById(id);

    if (!userType) {
      throw new Error(`UserType with id ${id.value} not found`);
    }

    return userType;
  }
}
