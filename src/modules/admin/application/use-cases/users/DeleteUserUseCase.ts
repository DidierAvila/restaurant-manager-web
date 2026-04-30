/**
 * DeleteUserUseCase - Caso de uso para eliminar un usuario
 */

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: UserId): Promise<void> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id.value} not found`);
    }

    await this.userRepository.delete(id);
  }
}
