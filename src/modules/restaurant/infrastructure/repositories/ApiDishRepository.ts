import { IDishRepository } from '../../domain/repositories/IDishRepository';
import { Dish, CreateDishDto, UpdateDishDto } from '../../domain/entities/Dish';
import { DishFilters, PaginationResponseDto } from '../../domain/value-objects/DishFilters';
import { DishApiAdapter } from '../adapters/DishApiAdapter';

export class ApiDishRepository implements IDishRepository {
  private adapter: DishApiAdapter;

  constructor() {
    this.adapter = new DishApiAdapter();
  }

  async getAll(filters?: DishFilters): Promise<PaginationResponseDto<Dish>> {
    return await this.adapter.getAll(filters);
  }

  async getById(id: number): Promise<Dish> {
    return await this.adapter.getById(id);
  }

  async getAvailable(): Promise<Dish[]> {
    return await this.adapter.getAvailable();
  }

  async getByCategory(category: number): Promise<Dish[]> {
    return await this.adapter.getByCategory(category);
  }

  async create(dish: CreateDishDto): Promise<Dish> {
    return await this.adapter.create(dish);
  }

  async update(id: number, dish: UpdateDishDto): Promise<Dish> {
    return await this.adapter.update(id, dish);
  }

  async delete(id: number): Promise<void> {
    return await this.adapter.delete(id);
  }

  async toggleAvailability(id: number): Promise<Dish> {
    return await this.adapter.toggleAvailability(id);
  }
}
