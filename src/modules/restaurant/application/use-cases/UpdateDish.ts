import { IDishRepository } from '../../domain/repositories/IDishRepository';
import { UpdateDishDto, Dish } from '../../domain/entities/Dish';

export class UpdateDish {
  constructor(private dishRepository: IDishRepository) {}

  async execute(id: number, dish: UpdateDishDto): Promise<Dish> {
    return await this.dishRepository.update(id, dish);
  }
}
