import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export class DeleteOrder {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<void> {
    return await this.orderRepository.delete(id);
  }
}
