'use client';

/**
 * useUsers - Hook de presentación para gestión de usuarios
 */

import { useCallback, useState } from 'react';
import { User } from '../../domain/entities/User';
import { PaginatedResult } from '../../domain/repositories/IUserRepository';
import { CreateUserData } from '../../domain/value-objects/CreateUserData';
import { UserFilters } from '../../domain/value-objects/UserFilters';
import { UserId } from '../../domain/value-objects/UserId';

// Use Cases
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  GetUsersUseCase,
  UpdateUserUseCase,
} from '../../application/use-cases/users';

// Infrastructure
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';

// Instancias de repositorios y casos de uso
const userRepository = new ApiUserRepository();
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export interface UseUsersReturn {
  // Estado
  users: User[];
  user: User | null;
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
  getUsers: (filters?: Partial<UserFilters>) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (id: string, updateData: CreateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  // Utilidades
  clearError: () => void;
  clearUser: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
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

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const getUsers = useCallback(async (filters: Partial<UserFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const userFilters = UserFilters.create({
        page: 1,
        pageSize: 10,
        ...filters,
      });

      const result: PaginatedResult<User> = await getUsersUseCase.execute(userFilters);

      setUsers(result.data);
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
      setError(err instanceof Error ? err.message : 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);

      const userId = UserId.fromString(id);
      const result = await getUserByIdUseCase.execute(userId);

      setUser(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (userData: CreateUserData): Promise<User> => {
      try {
        setLoading(true);
        setError(null);

        const result = await createUserUseCase.execute(userData);

        // Refrescar la lista de usuarios
        await getUsers();

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getUsers]
  );

  const updateUser = useCallback(
    async (id: string, updateData: CreateUserData): Promise<User> => {
      try {
        setLoading(true);
        setError(null);

        const userId = UserId.fromString(id);
        const result = await updateUserUseCase.execute(userId, updateData);

        // Actualizar el usuario en la lista
        setUsers((prev) => prev.map((u) => (u.id.value === id ? result : u)));

        // Si es el usuario actual, actualizarlo tambiÃ©n
        if (user && user.id.value === id) {
          setUser(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const userId = UserId.fromString(id);
        await deleteUserUseCase.execute(userId);

        // Remover el usuario de la lista
        setUsers((prev) => prev.filter((u) => u.id.value !== id));

        // Si es el usuario actual, limpiarlo
        if (user && user.id.value === id) {
          setUser(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    users,
    user,
    loading,
    error,
    pagination,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    clearUser,
  };
};
