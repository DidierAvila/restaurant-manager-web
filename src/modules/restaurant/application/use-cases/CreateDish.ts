import { IDishRepository } from '../../domain/repositories/IDishRepository';
import { CreateDishDto, Dish } from '../../domain/entities/Dish';

export class CreateDish {
  constructor(private dishRepository: IDishRepository) {}

  async execute(dish: CreateDishDto): Promise<Dish> {
    return await this.dishRepository.create(dish);
  }
}
