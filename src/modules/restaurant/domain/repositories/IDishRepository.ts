import { Dish, CreateDishDto, UpdateDishDto } from '../entities/Dish';
import { DishFilters, PaginationResponseDto } from '../value-objects/DishFilters';

export interface IDishRepository {
  getAll(filters?: DishFilters): Promise<PaginationResponseDto<Dish>>;
  getById(id: number): Promise<Dish>;
  getAvailable(): Promise<Dish[]>;
  getByCategory(category: number): Promise<Dish[]>;
  create(dish: CreateDishDto): Promise<Dish>;
  update(id: number, dish: UpdateDishDto): Promise<Dish>;
  delete(id: number): Promise<void>;
  toggleAvailability(id: number): Promise<Dish>;
}
