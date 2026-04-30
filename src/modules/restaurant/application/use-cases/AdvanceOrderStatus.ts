import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';

export class AdvanceOrderStatus {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<Order> {
    return await this.orderRepository.advanceStatus(id);
  }
}
