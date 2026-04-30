/**
 * GetUserByIdUseCase - Caso de uso para obtener un usuario por ID
 */

import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: UserId): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(`User with id ${id.value} not found`);
    }

    return user;
  }
}
