export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  dishName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  subtotal: number;
}
