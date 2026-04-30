import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order, CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/entities/OrderItem';
import { OrderFilters, PaginationResponseDto } from '../../domain/value-objects/OrderFilters';
import { OrderApiAdapter } from '../adapters/OrderApiAdapter';

export class ApiOrderRepository implements IOrderRepository {
  private adapter: OrderApiAdapter;

  constructor() {
    this.adapter = new OrderApiAdapter();
  }

  async getAll(filters?: OrderFilters): Promise<PaginationResponseDto<Order>> {
    return await this.adapter.getAll(filters);
  }

  async getById(id: number): Promise<Order> {
    return await this.adapter.getById(id);
  }

  async getActive(): Promise<Order[]> {
    return await this.adapter.getActive();
  }

  async getByTable(tableNumber: number): Promise<Order[]> {
    return await this.adapter.getByTable(tableNumber);
  }

  async create(order: CreateOrderDto): Promise<Order> {
    return await this.adapter.create(order);
  }

  async update(id: number, order: UpdateOrderDto): Promise<Order> {
    return await this.adapter.update(id, order);
  }

  async delete(id: number): Promise<void> {
    return await this.adapter.delete(id);
  }

  async addItem(orderId: number, item: AddOrderItemDto): Promise<Order> {
    return await this.adapter.addItem(orderId, item);
  }

  async getItems(orderId: number): Promise<OrderItem[]> {
    return await this.adapter.getItems(orderId);
  }

  async removeItem(orderId: number, itemId: number): Promise<Order> {
    return await this.adapter.removeItem(orderId, itemId);
  }

  async advanceStatus(id: number): Promise<Order> {
    return await this.adapter.advanceStatus(id);
  }
}
