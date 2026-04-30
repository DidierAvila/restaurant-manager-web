/**
 * GetUserTypesUseCase - Caso de uso para obtener tipos de usuario con filtros
 */
import { UserType } from '../../../domain/entities/UserType';
import {
  IUserTypeRepository,
  PaginatedResult,
} from '../../../domain/repositories/IUserTypeRepository';
import { UserTypeFilters } from '../../../domain/value-objects/UserTypeFilters';

export class GetUserTypesUseCase {
  constructor(private readonly userTypeRepository: IUserTypeRepository) {}

  async execute(filters: UserTypeFilters): Promise<PaginatedResult<UserType>> {
    return await this.userTypeRepository.findAll(filters);
  }
}
