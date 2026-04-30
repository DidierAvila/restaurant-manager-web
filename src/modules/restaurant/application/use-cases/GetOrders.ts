import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';
import { OrderFilters, PaginationResponseDto } from '../../domain/value-objects/OrderFilters';

export class GetOrders {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(filters?: OrderFilters): Promise<PaginationResponseDto<Order>> {
    return await this.orderRepository.getAll(filters);
  }

  async getById(id: number): Promise<Order> {
    return await this.orderRepository.getById(id);
  }

  async getActive(): Promise<Order[]> {
    return await this.orderRepository.getActive();
  }

  async getByTable(tableNumber: number): Promise<Order[]> {
    return await this.orderRepository.getByTable(tableNumber);
  }
}
