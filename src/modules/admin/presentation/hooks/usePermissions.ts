'use client';

/**
 * usePermissions - Hook para gestionar permisos
 */

import { useState, useCallback } from 'react';
import { Permission } from '../../domain/entities/Permission';
import { PermissionId } from '../../domain/value-objects/PermissionId';
import { 
  PermissionFilters, 
  PaginatedPermissionResult, 
  CreatePermissionData, 
  UpdatePermissionData 
} from '../../domain/value-objects/PermissionFilters';

// Casos de uso
import {
  GetAllPermissionsUseCase,
  GetPermissionByIdUseCase,
  CreatePermissionUseCase,
  UpdatePermissionUseCase,
  DeletePermissionUseCase,
  SearchPermissionsUseCase,
  GetPermissionsDropdownUseCase,
} from '../../application/use-cases/permissions';

// Repositorio
import { ApiPermissionRepository } from '../../infrastructure/repositories/ApiPermissionRepository';

// Instancia del repositorio
const permissionRepository = new ApiPermissionRepository();

// Instancias de casos de uso
const getAllPermissionsUseCase = new GetAllPermissionsUseCase(permissionRepository);
const getPermissionByIdUseCase = new GetPermissionByIdUseCase(permissionRepository);
const createPermissionUseCase = new CreatePermissionUseCase(permissionRepository);
const updatePermissionUseCase = new UpdatePermissionUseCase(permissionRepository);
const deletePermissionUseCase = new DeletePermissionUseCase(permissionRepository);
const searchPermissionsUseCase = new SearchPermissionsUseCase(permissionRepository);
const getPermissionsDropdownUseCase = new GetPermissionsDropdownUseCase(permissionRepository);

export interface UsePermissionsReturn {
  // Estado
  permissions: Permission[];
  permission: Permission | null;
  loading: boolean;
  error: string | null;
  paginationInfo: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  // Operaciones CRUD
  getAllPermissions: (filters?: PermissionFilters) => Promise<void>;
  getPermissionById: (id: string) => Promise<void>;
  createPermission: (data: CreatePermissionData) => Promise<Permission | null>;
  updatePermission: (id: string, data: UpdatePermissionData) => Promise<Permission | null>;
  deletePermission: (id: string) => Promise<boolean>;
  searchPermissions: (searchTerm: string, filters?: PermissionFilters) => Promise<void>;
  getPermissionsDropdown: () => Promise<Array<{ id: string; name: string; description: string; module: string }>>;

  // Utilidades
  clearError: () => void;
  clearPermission: () => void;
  refreshPermissions: () => Promise<void>;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<PermissionFilters | undefined>();
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPermission = useCallback(() => {
    setPermission(null);
  }, []);

  const getAllPermissions = useCallback(async (filters?: PermissionFilters) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);

      const result: PaginatedPermissionResult = await getAllPermissionsUseCase.execute(filters);
      
      setPermissions(result.permissions);
      setPaginationInfo({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPermissionById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const permissionId = PermissionId.fromString(id);
      const result = await getPermissionByIdUseCase.execute(permissionId.value);
      
      setPermission(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permiso');
      setPermission(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPermission = useCallback(async (data: CreatePermissionData): Promise<Permission | null> => {
    try {
      setLoading(true);
      setError(null);

      const newPermission = await createPermissionUseCase.execute(data);
      
      // Refrescar la lista de permisos
      await getAllPermissions(currentFilters);
      
      return newPermission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear permiso');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentFilters, getAllPermissions]);

  const updatePermission = useCallback(async (id: string, data: UpdatePermissionData): Promise<Permission | null> => {
    try {
      setLoading(true);
      setError(null);

      const permissionId = PermissionId.fromString(id);
      const updatedPermission = await updatePermissionUseCase.execute(permissionId.value, data);
      
      // Actualizar el permiso en el estado local
      setPermissions(prev => 
        prev.map(p => p.id.equals(permissionId) ? updatedPermission : p)
      );
      
      // Si es el permiso actual, actualizarlo tambiÃ©n
      if (permission && permission.id.equals(permissionId)) {
        setPermission(updatedPermission);
      }
      
      return updatedPermission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar permiso');
      return null;
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const deletePermission = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const permissionId = PermissionId.fromString(id);
      await deletePermissionUseCase.execute(permissionId.value);
      
      // Remover el permiso del estado local
      setPermissions(prev => prev.filter(p => !p.id.equals(permissionId)));
      
      // Si es el permiso actual, limpiarlo
      if (permission && permission.id.equals(permissionId)) {
        setPermission(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar permiso');
      return false;
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const searchPermissions = useCallback(async (searchTerm: string, filters?: PermissionFilters) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);

      const result: PaginatedPermissionResult = await searchPermissionsUseCase.execute(searchTerm, filters);
      
      setPermissions(result.permissions);
      setPaginationInfo({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar permisos');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPermissionsDropdown = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPermissionsDropdownUseCase.execute();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos para dropdown');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPermissions = useCallback(async () => {
    await getAllPermissions(currentFilters);
  }, [currentFilters, getAllPermissions]);

  return {
    // Estado
    permissions,
    permission,
    loading,
    error,
    paginationInfo,

    // Operaciones CRUD
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    searchPermissions,
    getPermissionsDropdown,

    // Utilidades
    clearError,
    clearPermission,
    refreshPermissions,
  };
};