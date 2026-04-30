/**
 * IUserRepository - Interface del repositorio de usuarios
 * Define el contrato para la persistencia de usuarios
 */

import { User } from '../entities/User';
import { CreateUserData } from '../value-objects/CreateUserData';
import { UserFilters } from '../value-objects/UserFilters';
import { UserId } from '../value-objects/UserId';

export interface PaginatedResult<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  sortBy?: string;
}

export interface IUserRepository {
  /**
   * Obtener todos los usuarios con filtros y paginaciÃ³n
   */
  findAll(filters: UserFilters): Promise<PaginatedResult<User>>;

  /**
   * Obtener un usuario por su ID
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Crear un nuevo usuario
   */
  create(userData: CreateUserData): Promise<User>;

  /**
   * Actualizar un usuario existente
   */
  update(id: UserId, updateData: Partial<CreateUserData>): Promise<User>;

  /**
   * Eliminar un usuario
   */
  delete(id: UserId): Promise<void>;
}
