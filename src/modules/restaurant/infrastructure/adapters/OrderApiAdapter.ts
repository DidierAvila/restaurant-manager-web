import { ApiService } from '@/modules/shared/application/services/api';
import { Order, CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/entities/OrderItem';
import { OrderFilters, PaginationResponseDto } from '../../domain/value-objects/OrderFilters';

export class OrderApiAdapter {
  private apiService: ApiService;
  private baseUrl = '/api/Orders';

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(filters?: OrderFilters): Promise<PaginationResponseDto<Order>> {
    const params = new URLSearchParams();

    // Filtros
    if (filters?.status) params.append('Status', filters.status.toString());
    if (filters?.tableNumber) params.append('TableNumber', filters.tableNumber.toString());
    if (filters?.fromDate) params.append('FromDate', filters.fromDate);
    if (filters?.toDate) params.append('ToDate', filters.toDate);
    if (filters?.search) params.append('Search', filters.search);

    // Paginación
    if (filters?.page) params.append('Page', filters.page.toString());
    if (filters?.pageSize) params.append('PageSize', filters.pageSize.toString());

    // Ordenamiento
    if (filters?.sortBy) params.append('SortBy', filters.sortBy);
    if (filters?.sortDescending !== undefined) params.append('SortDescending', filters.sortDescending.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return await this.apiService.get<PaginationResponseDto<Order>>(url);
  }

  async getById(id: number): Promise<Order> {
    return await this.apiService.get<Order>(`${this.baseUrl}/${id}`);
  }

  async getActive(): Promise<Order[]> {
    return await this.apiService.get<Order[]>(`${this.baseUrl}/active`);
  }

  async getByTable(tableNumber: number): Promise<Order[]> {
    return await this.apiService.get<Order[]>(`${this.baseUrl}/table/${tableNumber}`);
  }

  async create(order: CreateOrderDto): Promise<Order> {
    return await this.apiService.post<Order>(this.baseUrl, order);
  }

  async update(id: number, order: UpdateOrderDto): Promise<Order> {
    return await this.apiService.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  async delete(id: number): Promise<void> {
    return await this.apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async addItem(orderId: number, item: AddOrderItemDto): Promise<Order> {
    return await this.apiService.post<Order>(`${this.baseUrl}/${orderId}/items`, item);
  }

  async getItems(orderId: number): Promise<OrderItem[]> {
    return await this.apiService.get<OrderItem[]>(`${this.baseUrl}/${orderId}/items`);
  }

  async removeItem(orderId: number, itemId: number): Promise<Order> {
    return await this.apiService.delete<Order>(`${this.baseUrl}/${orderId}/items/${itemId}`);
  }

  async advanceStatus(id: number): Promise<Order> {
    return await this.apiService.patch<Order>(`${this.baseUrl}/${id}/advance-status`);
  }
}
