import { OrderStatus } from './OrderStatus';
import { OrderItem } from './OrderItem';

export interface Order {
  id: number;
  tableNumber: number;
  waiter: string;
  orderDate: string;
  status: OrderStatus;
  statusEnum: number;
  total: number;
  itemCount: number;
  items: OrderItem[];
}

export interface CreateOrderDto {
  tableNumber: number;
  waiter: string;
}

export interface UpdateOrderDto {
  tableNumber?: number;
  waiter?: string;
}

export interface AddOrderItemDto {
  dishId: number;
  quantity: number;
  notes?: string;
}
