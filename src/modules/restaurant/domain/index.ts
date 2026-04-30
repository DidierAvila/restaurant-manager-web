/**
 * Domain Layer - Barrel exports
 */

export * from './entities/Dish';
export * from './entities/DishCategory';
export * from './entities/Order';
export * from './entities/OrderStatus';
export * from './entities/OrderItem';
export * from './entities/SalesReport';
export * from './repositories/IDishRepository';
export * from './repositories/IOrderRepository';
export * from './repositories/IReportRepository';
export * from './value-objects/DishFilters';
export * from './value-objects/OrderFilters';

// Re-export PaginationResponseDto for convenience
export type { PaginationResponseDto } from './value-objects/DishFilters';
