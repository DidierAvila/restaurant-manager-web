'use client';

/**
 * useRoles - Hook para gestionar roles
 */

import { useCallback, useState } from 'react';
import { Role } from '../../domain/entities/Role';
import { PaginatedRoleResult, RoleFilters } from '../../domain/repositories/IRoleRepository';
import { RoleId } from '../../domain/value-objects/RoleId';

// Use Cases
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetRoleByIdUseCase,
  GetRolesDropdownUseCase,
  GetRolesUseCase,
  UpdateRoleUseCase,
} from '../../application/use-cases/roles';

// Infrastructure
import { CreateRoleData } from '../../domain/value-objects/CreateRoleData';
import { ApiRoleRepository } from '../../infrastructure/repositories/ApiRoleRepository';

// Instancias de repositorios y casos de uso
const roleRepository = new ApiRoleRepository();
const getRolesUseCase = new GetRolesUseCase(roleRepository);
const getRoleByIdUseCase = new GetRoleByIdUseCase(roleRepository);
const createRoleUseCase = new CreateRoleUseCase(roleRepository);
const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
const getRolesDropdownUseCase = new GetRolesDropdownUseCase(roleRepository);

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface UseRolesReturn {
  // Estado
  roles: Role[];
  role: Role | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };

  // Funciones
  getRoles: (filters?: Partial<RoleFilters>) => Promise<void>;
  getRoleById: (id: string) => Promise<void>;
  createRole: (roleData: CreateRoleData) => Promise<Role>;
  updateRole: (id: string, updateData: CreateRoleData) => Promise<Role>;
  deleteRole: (id: string) => Promise<void>;
  getRolesDropdown: () => Promise<Array<{ id: string; name: string }>>;
  clearError: () => void;
  clearRole: () => void;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRole = useCallback(() => {
    setRole(null);
  }, []);

  const getRoles = useCallback(async (filters: Partial<RoleFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const roleFilters: RoleFilters = {
        page: 1,
        pageSize: 10,
        ...filters,
      };

      const result: PaginatedRoleResult = await getRolesUseCase.execute(roleFilters);

      setRoles(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener roles');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoleById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const roleId = RoleId.fromString(id);
      const result = await getRoleByIdUseCase.execute(roleId);

      setRole(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener rol');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(
    async (roleData: CreateRoleData): Promise<Role> => {
      try {
        setLoading(true);
        setError(null);

        const result = await createRoleUseCase.execute(roleData);

        // Refrescar la lista de roles
        await getRoles();

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al crear rol';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getRoles]
  );

  const updateRole = useCallback(
    async (id: string, updateData: CreateRoleData): Promise<Role> => {
      try {
        setLoading(true);
        setError(null);

        const roleId = RoleId.fromString(id);
        const result = await updateRoleUseCase.execute(roleId, updateData);

        // Actualizar el rol en la lista
        setRoles((prev) => prev.map((r) => (r.id.value === id ? result : r)));

        // Si es el rol actual, actualizarlo tambiÃ©n
        if (role && role.id.value === id) {
          setRole(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar rol';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  const deleteRole = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const roleId = RoleId.fromString(id);
        await deleteRoleUseCase.execute(roleId);

        // Remover el rol de la lista
        setRoles((prev) => prev.filter((r) => r.id.value !== id));

        // Si es el rol actual, limpiarlo
        if (role && role.id.value === id) {
          setRole(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar rol';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  const getRolesDropdown = useCallback(async (): Promise<Array<{ id: string; name: string }>> => {
    try {
      setLoading(true);
      setError(null);

      const result = await getRolesDropdownUseCase.execute();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener roles dropdown';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    roles,
    role,
    loading,
    error,
    pagination,
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    getRolesDropdown,
    clearError,
    clearRole,
  };
};
