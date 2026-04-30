/**
 * CreateUserUseCase - Caso de uso para crear un nuevo usuario
 */

import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreateUserData } from '../../../domain/value-objects/CreateUserData';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: CreateUserData): Promise<User> {
    // Crear el usuario directamente
    return await this.userRepository.create(userData);
  }
}
