import { IDishRepository } from '../../domain/repositories/IDishRepository';

export class DeleteDish {
  constructor(private dishRepository: IDishRepository) {}

  async execute(id: number): Promise<void> {
    return await this.dishRepository.delete(id);
  }
}
