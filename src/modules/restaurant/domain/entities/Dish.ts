import { DishCategory } from './DishCategory';

export interface Dish {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: DishCategory;
  categoryEnum: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDishDto {
  name: string;
  description?: string;
  price: number;
  category: number;
  isAvailable?: boolean;
}

export interface UpdateDishDto {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  category?: number;
  isAvailable?: boolean;
}
