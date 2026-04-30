/**
 * CreateUserTypeUseCase - Caso de uso para crear un nuevo tipo de usuario
 */

import { UserType } from '../../../domain/entities/UserType';
import { IUserTypeRepository } from '../../../domain/repositories/IUserTypeRepository';
import { CreateUserTypeData } from '../../../domain/value-objects/CreateUserTypeData';

export class CreateUserTypeUseCase {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(data: CreateUserTypeData): Promise<UserType> {
    // Crear el tipo de usuario usando el repositorio
    // El backend se encarga de validar nombres duplicados
    return await this.userTypeRepository.create(data);
  }
}
