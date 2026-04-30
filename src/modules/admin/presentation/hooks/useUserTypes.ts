'use client';

/**
 * useUserTypes - Hook para gestionar tipos de usuario
 */

import { useCallback, useState } from 'react';
import { UserType } from '../../domain/entities/UserType';
import { UserTypeFilters } from '../../domain/value-objects/UserTypeFilters';
import type { UserTypeFiltersProps } from '../../domain/value-objects/UserTypeFilters';
import { UserTypeId } from '../../domain/value-objects/UserTypeId';
// Use Cases
import {
  CreateUserTypeUseCase,
  DeleteUserTypeUseCase,
  GetUserTypeByIdUseCase,
  GetUserTypesDropdownUseCase,
  GetUserTypesUseCase,
  UpdateUserTypeUseCase,
} from '../../application/use-cases/user-types';

// Interfaces
import { UserTypeDropdownItem } from '../../application/interfaces/DropdownInterfaces';

// Infrastructure
import { PaginatedResult } from '../../domain/repositories/IUserTypeRepository';
import { CreateUserTypeData } from '../../domain/value-objects/CreateUserTypeData';
import { ApiUserTypeRepository } from '../../infrastructure/repositories/ApiUserTypeRepository';

// Instancias de repositorios y casos de uso
const userTypeRepository = new ApiUserTypeRepository();
const getUserTypesUseCase = new GetUserTypesUseCase(userTypeRepository);
const getUserTypeByIdUseCase = new GetUserTypeByIdUseCase(userTypeRepository);
const createUserTypeUseCase = new CreateUserTypeUseCase(userTypeRepository);
const updateUserTypeUseCase = new UpdateUserTypeUseCase(userTypeRepository);
const deleteUserTypeUseCase = new DeleteUserTypeUseCase(userTypeRepository);
const getUserTypesDropdownUseCase = new GetUserTypesDropdownUseCase(userTypeRepository);

export interface UseUserTypesReturn {
  // Estado
  userTypes: UserType[];
  userType: UserType | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    sortBy?: string;
  };

  // Funciones CRUD bÃ¡sicas
  getUserTypes: (filters?: Partial<UserTypeFiltersProps>) => Promise<void>;
  getUserTypeById: (id: string) => Promise<void>;
  createUserType: (userTypeData: CreateUserTypeData) => Promise<UserType>;
  updateUserType: (id: string, updateData: CreateUserTypeData) => Promise<UserType>;
  deleteUserType: (id: string) => Promise<void>;
  getUserTypesDropdown: () => Promise<UserTypeDropdownItem[]>;

  // Utilidades
  clearError: () => void;
  clearUserType: () => void;
}

export const useUserTypes = (): UseUserTypesReturn => {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    sortBy: undefined as string | undefined,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearUserType = useCallback(() => {
    setUserType(null);
  }, []);

  const getUserTypes = useCallback(async (filters?: Partial<UserTypeFiltersProps>) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersVO = UserTypeFilters.create(filters || {});
      const result = await getUserTypesUseCase.execute(filtersVO);
      setUserTypes(result.data);
      setPagination({
        totalRecords: result.totalRecords,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
        sortBy: result.sortBy,
      });
    } catch (err) {
      console.error('Error in getUserTypes:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener tipos de usuario');
    } finally {
      setLoading(false);
    }
  }, [getUserTypesUseCase]);

  const getUserTypeById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const userTypeId = UserTypeId.fromString(id);
      const result = await getUserTypeByIdUseCase.execute(userTypeId);

      setUserType(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener tipo de usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUserType = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const createData = CreateUserTypeData.create(data);
      const result = await createUserTypeUseCase.execute(createData);
      return result;
    } catch (err) {
      console.error('Error creating userType:', err);
      setError(err instanceof Error ? err.message : 'Error al crear tipo de usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createUserTypeUseCase]);

  const updateUserType = useCallback(
    async (id: string, updateData: CreateUserTypeData): Promise<UserType> => {
      try {
        setLoading(true);
        setError(null);

        const userTypeId = UserTypeId.fromString(id);
        const result = await updateUserTypeUseCase.execute(userTypeId, updateData);

        // Refrescar la lista de tipos de usuario
        await getUserTypes();

        // Si estamos viendo el detalle del tipo de usuario actualizado, actualizarlo tambiÃ©n
        if (userType && userType.id.value === id) {
          setUserType(result);
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al actualizar tipo de usuario';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getUserTypes, userType]
  );

  const deleteUserType = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userTypeId = UserTypeId.fromString(id);
      await deleteUserTypeUseCase.execute(userTypeId);
    } catch (err) {
      console.error('Error deleting userType:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar tipo de usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteUserTypeUseCase]);

  const getUserTypesDropdown = useCallback(async (): Promise<UserTypeDropdownItem[]> => {
    try {
      setError(null);
      return await getUserTypesDropdownUseCase.execute();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener tipos de usuario para dropdown';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    // Estado
    userTypes,
    userType,
    loading,
    error,
    pagination,

    // Funciones CRUD bÃ¡sicas
    getUserTypes,
    getUserTypeById,
    createUserType,
    updateUserType,
    deleteUserType,

    // Funciones adicionales
    getUserTypesDropdown,
    // Utilidades
    clearError,
    clearUserType,
  };
};
