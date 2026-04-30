import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { CreateOrderDto, Order } from '../../domain/entities/Order';

export class CreateOrder {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(order: CreateOrderDto): Promise<Order> {
    return await this.orderRepository.create(order);
  }
}
