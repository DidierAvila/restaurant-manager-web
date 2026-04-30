import { Order, CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { OrderFilters, PaginationResponseDto } from '../value-objects/OrderFilters';

export interface IOrderRepository {
  getAll(filters?: OrderFilters): Promise<PaginationResponseDto<Order>>;
  getById(id: number): Promise<Order>;
  getActive(): Promise<Order[]>;
  getByTable(tableNumber: number): Promise<Order[]>;
  create(order: CreateOrderDto): Promise<Order>;
  update(id: number, order: UpdateOrderDto): Promise<Order>;
  delete(id: number): Promise<void>;
  addItem(orderId: number, item: AddOrderItemDto): Promise<Order>;
  getItems(orderId: number): Promise<OrderItem[]>;
  removeItem(orderId: number, itemId: number): Promise<Order>;
  advanceStatus(id: number): Promise<Order>;
}
