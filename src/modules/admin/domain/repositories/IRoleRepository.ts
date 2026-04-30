/**
 * IRoleRepository - Interface del repositorio de roles
 * Define el contrato para la persistencia de roles
 */

import { Role } from '../entities/Role';
import { CreateRoleData } from '../value-objects/CreateRoleData';
import { RoleId } from '../value-objects/RoleId';

export interface RoleFilters {
  name?: string;
  search?: string;
  status?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'description' | 'status' | 'createdat';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedRoleResult {
  data: Role[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface IRoleRepository {
  /**
   * Obtener todos los roles con filtros y paginaciÃ³n
   */
  findAll(filters: RoleFilters): Promise<PaginatedRoleResult>;

  /**
   * Obtener un rol por su ID
   */
  findById(id: RoleId): Promise<Role | null>;

  /**
   * Crear un nuevo rol
   */
  create(roleData: CreateRoleData): Promise<Role>;

  /**
   * Actualizar un rol existente
   */
  update(id: RoleId, updateData: CreateRoleData): Promise<Role>;

  /**
   * Eliminar un rol
   */
  delete(id: RoleId): Promise<void>;

  /**
   * Buscar roles por tÃ©rmino
   */
  search(searchTerm: string, filters?: Omit<RoleFilters, 'name'>): Promise<PaginatedRoleResult>;

  /**
   * Obtener roles para dropdown
   */
  getRolesDropdown(): Promise<Array<{ id: string; name: string }>>;
}
