export interface SalesReport {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  totalSales: number;
  averageTicket: number;
  topDish: TopDishInfo | null;
  salesByCategory: CategorySales[];
  ordersByStatus: StatusCount[];
}

export interface TopDishInfo {
  dishId: number;
  dishName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CategorySales {
  category: string;
  totalSales: number;
  orderCount: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface ReportFilters {
  fromDate: string;
  toDate: string;
}
