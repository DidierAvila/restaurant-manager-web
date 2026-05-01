import { ApiService } from '@/modules/shared/application/services/api';
import { Dish, CreateDishDto, UpdateDishDto } from '../../domain/entities/Dish';
import { DishFilters, PaginationResponseDto } from '../../domain/value-objects/DishFilters';

export class DishApiAdapter {
  private apiService: ApiService;
  private baseUrl = '/api/Dishes';

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(filters?: DishFilters): Promise<PaginationResponseDto<Dish>> {
    const params = new URLSearchParams();

    // Filtros
    if (filters?.category) params.append('Category', filters.category.toString());
    if (filters?.isAvailable !== undefined) params.append('IsAvailable', filters.isAvailable.toString());
    if (filters?.search) params.append('Search', filters.search);

    // Paginación
    if (filters?.page) params.append('Page', filters.page.toString());
    if (filters?.pageSize) params.append('PageSize', filters.pageSize.toString());

    // Ordenamiento
    if (filters?.sortBy) params.append('SortBy', filters.sortBy);
    if (filters?.sortDescending !== undefined) params.append('SortDescending', filters.sortDescending.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return await this.apiService.get<PaginationResponseDto<Dish>>(url);
  }

  async getById(id: number): Promise<Dish> {
    return await this.apiService.get<Dish>(`${this.baseUrl}/${id}`);
  }

  async getAvailable(): Promise<Dish[]> {
    return await this.apiService.get<Dish[]>(`${this.baseUrl}/available`);
  }

  async getByCategory(category: number): Promise<Dish[]> {
    return await this.apiService.get<Dish[]>(`${this.baseUrl}/category/${category}`);
  }

  async create(dish: CreateDishDto): Promise<Dish> {
    return await this.apiService.post<Dish>(this.baseUrl, dish);
  }

  async update(id: number, dish: UpdateDishDto): Promise<Dish> {
    return await this.apiService.put<Dish>(`${this.baseUrl}/${id}`, dish);
  }

  async delete(id: number): Promise<void> {
    return await this.apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async toggleAvailability(id: number): Promise<Dish> {
    return await this.apiService.patch<Dish>(`${this.baseUrl}/${id}/toggle-availability`);
  }
}
