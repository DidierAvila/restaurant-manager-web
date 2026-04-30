import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { UpdateOrderDto, Order } from '../../domain/entities/Order';

export class UpdateOrder {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number, order: UpdateOrderDto): Promise<Order> {
    return await this.orderRepository.update(id, order);
  }
}
