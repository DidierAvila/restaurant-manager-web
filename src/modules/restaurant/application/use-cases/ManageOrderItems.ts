import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { AddOrderItemDto, Order } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/entities/OrderItem';

export class ManageOrderItems {
  constructor(private orderRepository: IOrderRepository) {}

  async addItem(orderId: number, item: AddOrderItemDto): Promise<Order> {
    return await this.orderRepository.addItem(orderId, item);
  }

  async getItems(orderId: number): Promise<OrderItem[]> {
    return await this.orderRepository.getItems(orderId);
  }

  async removeItem(orderId: number, itemId: number): Promise<Order> {
    return await this.orderRepository.removeItem(orderId, itemId);
  }
}
