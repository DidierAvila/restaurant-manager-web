/**
 * UpdateUserUseCase - Caso de uso para actualizar un usuario
 */

import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { CreateUserData } from '../../../domain/value-objects/CreateUserData';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: UserId, updateData: Partial<CreateUserData>): Promise<User> {
    return await this.userRepository.update(id, updateData);
  }
}
