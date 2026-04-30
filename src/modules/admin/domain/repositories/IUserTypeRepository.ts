/**
 * IUserTypeRepository - Interface del repositorio de tipos de usuario
 * Define el contrato para la persistencia de tipos de usuario
 */

import { UserTypeDropdownItem } from '../../application/interfaces/DropdownInterfaces';
import { UserType } from '../entities/UserType';
import { CreateUserTypeData } from '../value-objects/CreateUserTypeData';
import { UserTypeFilters } from '../value-objects/UserTypeFilters';
import { UserTypeId } from '../value-objects/UserTypeId';

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

export interface IUserTypeRepository {
  /**
   * Obtener todos los tipos de usuario con filtros y paginaciÃ³n
   */
  findAll(filters: UserTypeFilters): Promise<PaginatedResult<UserType>>;

  /**
   * Obtener un tipo de usuario por su ID
   */
  findById(id: UserTypeId): Promise<UserType | null>;

  /**
   * Crear un nuevo tipo de usuario
   */
  create(userTypeData: CreateUserTypeData): Promise<UserType>;

  /**
   * Actualizar un tipo de usuario existente
   */
  update(id: UserTypeId, updateData: CreateUserTypeData): Promise<UserType>;

  /**
   * Eliminar un tipo de usuario
   */
  delete(id: UserTypeId): Promise<void>;

  /**
   * Obtener tipos de usuario para dropdown
   */
  getUserTypesDropdown(): Promise<UserTypeDropdownItem[]>;
}
export { UserTypeFilters };
