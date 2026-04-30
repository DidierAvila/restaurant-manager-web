import { IDishRepository } from '../../domain/repositories/IDishRepository';
import { Dish } from '../../domain/entities/Dish';

export class ToggleDishAvailability {
  constructor(private dishRepository: IDishRepository) {}

  async execute(id: number): Promise<Dish> {
    return await this.dishRepository.toggleAvailability(id);
  }
}
