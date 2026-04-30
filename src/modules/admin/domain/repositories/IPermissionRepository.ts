import { Permission } from '../entities/Permission';
import {
  CreatePermissionData,
  PaginatedPermissionResult,
  PermissionFilters,
  UpdatePermissionData,
} from '../value-objects/PermissionFilters';
import { PermissionId } from '../value-objects/PermissionId';

export interface IPermissionRepository {
  // MÃ©todos de consulta
  findAll(filters?: PermissionFilters): Promise<PaginatedPermissionResult>;
  findById(id: PermissionId): Promise<Permission | null>;
  search(searchTerm: string, filters?: PermissionFilters): Promise<PaginatedPermissionResult>;

  // MÃ©todos de escritura
  create(data: CreatePermissionData): Promise<Permission>;
  update(id: PermissionId, data: UpdatePermissionData): Promise<Permission>;
  delete(id: PermissionId): Promise<void>;

  // MÃ©todos de dropdown
  getPermissionsDropdown(): Promise<
    Array<{ id: string; name: string; description: string; module: string }>
  >;
  // MÃ©todos de importaciÃ³n/exportaciÃ³n
  exportPermissions(filters?: PermissionFilters): Promise<Blob>;
}
