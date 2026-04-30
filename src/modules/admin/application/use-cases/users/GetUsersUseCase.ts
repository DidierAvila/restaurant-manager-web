/**
 * GetUsersUseCase - Caso de uso para obtener usuarios con filtros
 */

import { User } from '../../../domain/entities/User';
import { IUserRepository, PaginatedResult } from '../../../domain/repositories/IUserRepository';
import { UserFilters } from '../../../domain/value-objects/UserFilters';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filters: UserFilters): Promise<PaginatedResult<User>> {
    return await this.userRepository.findAll(filters);
  }
}
