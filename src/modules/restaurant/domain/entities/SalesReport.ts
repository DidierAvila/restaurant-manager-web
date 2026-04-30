export interface SalesReport {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  totalSales: number;
  averageTicket: number;
  topDish: TopDishInfo | null;
  salesByCategory: CategorySales[];
  salesByDish: DishSales[];
  ordersByStatus?: StatusCount[];
}

export interface TopDishInfo {
  dishId?: number;
  dishName?: string;
  name?: string;
  category?: string;
  totalQuantity?: number;
  quantitySold?: number;
  totalRevenue: number;
}

export interface CategorySales {
  category: string;
  totalSales: number;
  orderCount?: number;
  quantitySold: number;
  percentage: number;
}

export interface DishSales {
  dishName: string;
  category: string;
  quantitySold: number;
  totalSales: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface ReportFilters {
  fromDate: string;
  toDate: string;
}
