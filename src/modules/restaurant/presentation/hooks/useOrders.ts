'use client';

import { useState, useCallback } from 'react';
import { Order, CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/entities/OrderItem';
import { OrderFilters, PaginationResponseDto } from '../../domain/value-objects/OrderFilters';
import { ApiOrderRepository } from '../../infrastructure/repositories/ApiOrderRepository';
import { CreateOrder } from '../../application/use-cases/CreateOrder';
import { UpdateOrder } from '../../application/use-cases/UpdateOrder';
import { DeleteOrder } from '../../application/use-cases/DeleteOrder';
import { GetOrders } from '../../application/use-cases/GetOrders';
import { ManageOrderItems } from '../../application/use-cases/ManageOrderItems';
import { AdvanceOrderStatus } from '../../application/use-cases/AdvanceOrderStatus';
import { useSnackbar } from 'notistack';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginationResponseDto<Order>, 'data'>>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const repository = new ApiOrderRepository();
  const getOrdersUseCase = new GetOrders(repository);
  const createOrderUseCase = new CreateOrder(repository);
  const updateOrderUseCase = new UpdateOrder(repository);
  const deleteOrderUseCase = new DeleteOrder(repository);
  const manageItemsUseCase = new ManageOrderItems(repository);
  const advanceStatusUseCase = new AdvanceOrderStatus(repository);

  const fetchOrders = useCallback(async (filters?: OrderFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrdersUseCase.execute(filters);
      setOrders(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar los pedidos';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = async (id: number): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const order = await getOrdersUseCase.getById(id);
      return order;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar el pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (order: CreateOrderDto): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrderUseCase.execute(order);
      enqueueSnackbar('Pedido creado exitosamente', { variant: 'success' });
      return newOrder;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al crear el pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: number, order: UpdateOrderDto): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await updateOrderUseCase.execute(id, order);
      enqueueSnackbar('Pedido actualizado exitosamente', { variant: 'success' });
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al actualizar el pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteOrderUseCase.execute(id);
      enqueueSnackbar('Pedido eliminado exitosamente', { variant: 'success' });
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al eliminar el pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (orderId: number, item: AddOrderItemDto): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await manageItemsUseCase.addItem(orderId, item);
      enqueueSnackbar('Plato agregado al pedido', { variant: 'success' });
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al agregar plato al pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    setItemsLoading(true);
    setError(null);
    try {
      return await manageItemsUseCase.getItems(orderId);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar los platos del pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return [];
    } finally {
      setItemsLoading(false);
    }
  };

  const removeItem = async (orderId: number, itemId: number): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await manageItemsUseCase.removeItem(orderId, itemId);
      enqueueSnackbar('Plato removido del pedido', { variant: 'success' });
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al remover plato del pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (id: number): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await advanceStatusUseCase.execute(id);
      enqueueSnackbar('Estado del pedido avanzado', { variant: 'success' });
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al avanzar estado del pedido';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    pagination,
    loading,
    itemsLoading,
    error,
    fetchOrders,
    getOrderById,
    getOrderItems,
    createOrder,
    updateOrder,
    deleteOrder,
    addItem,
    removeItem,
    advanceStatus,
  };
};
