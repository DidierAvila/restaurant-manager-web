'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dish, CreateDishDto, UpdateDishDto } from '../../domain/entities/Dish';
import { DishFilters, PaginationResponseDto } from '../../domain/value-objects/DishFilters';
import { ApiDishRepository } from '../../infrastructure/repositories/ApiDishRepository';
import { CreateDish } from '../../application/use-cases/CreateDish';
import { UpdateDish } from '../../application/use-cases/UpdateDish';
import { DeleteDish } from '../../application/use-cases/DeleteDish';
import { GetDishes } from '../../application/use-cases/GetDishes';
import { ToggleDishAvailability } from '../../application/use-cases/ToggleDishAvailability';
import { useSnackbar } from 'notistack';

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginationResponseDto<Dish>, 'data'>>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const repository = new ApiDishRepository();
  const getDishesUseCase = new GetDishes(repository);
  const createDishUseCase = new CreateDish(repository);
  const updateDishUseCase = new UpdateDish(repository);
  const deleteDishUseCase = new DeleteDish(repository);
  const toggleAvailabilityUseCase = new ToggleDishAvailability(repository);

  const fetchDishes = useCallback(async (filters?: DishFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDishesUseCase.execute(filters);
      setDishes(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar los platos';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const availableDishes = await getDishesUseCase.getAvailable();
      setDishes(availableDishes);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar los platos disponibles';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const createDish = async (dish: CreateDishDto): Promise<Dish | null> => {
    setLoading(true);
    setError(null);
    try {
      const newDish = await createDishUseCase.execute(dish);
      enqueueSnackbar('Plato creado exitosamente', { variant: 'success' });
      return newDish;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al crear el plato';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDish = async (id: number, dish: UpdateDishDto): Promise<Dish | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedDish = await updateDishUseCase.execute(id, dish);
      enqueueSnackbar('Plato actualizado exitosamente', { variant: 'success' });
      return updatedDish;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al actualizar el plato';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDish = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDishUseCase.execute(id);
      enqueueSnackbar('Plato eliminado exitosamente', { variant: 'success' });
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al eliminar el plato';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: number): Promise<Dish | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedDish = await toggleAvailabilityUseCase.execute(id);
      enqueueSnackbar('Disponibilidad actualizada exitosamente', { variant: 'success' });
      return updatedDish;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cambiar disponibilidad';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    dishes,
    pagination,
    loading,
    error,
    fetchDishes,
    fetchAvailableDishes,
    createDish,
    updateDish,
    deleteDish,
    toggleAvailability,
  };
};
