import { IDishRepository } from '../../domain/repositories/IDishRepository';
import { Dish } from '../../domain/entities/Dish';
import { DishFilters, PaginationResponseDto } from '../../domain/value-objects/DishFilters';

export class GetDishes {
  constructor(private dishRepository: IDishRepository) {}

  async execute(filters?: DishFilters): Promise<PaginationResponseDto<Dish>> {
    return await this.dishRepository.getAll(filters);
  }

  async getById(id: number): Promise<Dish> {
    return await this.dishRepository.getById(id);
  }

  async getAvailable(): Promise<Dish[]> {
    return await this.dishRepository.getAvailable();
  }

  async getByCategory(category: number): Promise<Dish[]> {
    return await this.dishRepository.getByCategory(category);
  }
}
