export enum OrderStatus {
  Abierto = 'Abierto',
  EnPreparacion = 'EnPreparacion',
  Listo = 'Listo',
  Entregado = 'Entregado',
  Cerrado = 'Cerrado',
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Abierto]: 'Abierto',
  [OrderStatus.EnPreparacion]: 'En Preparación',
  [OrderStatus.Listo]: 'Listo',
  [OrderStatus.Entregado]: 'Entregado',
  [OrderStatus.Cerrado]: 'Cerrado',
};

export const OrderStatusValues: Record<OrderStatus, number> = {
  [OrderStatus.Abierto]: 1,
  [OrderStatus.EnPreparacion]: 2,
  [OrderStatus.Listo]: 3,
  [OrderStatus.Entregado]: 4,
  [OrderStatus.Cerrado]: 5,
};

export const OrderStatusColors: Record<OrderStatus, 'default' | 'primary' | 'warning' | 'success' | 'info'> = {
  [OrderStatus.Abierto]: 'default',
  [OrderStatus.EnPreparacion]: 'warning',
  [OrderStatus.Listo]: 'info',
  [OrderStatus.Entregado]: 'success',
  [OrderStatus.Cerrado]: 'primary',
};

export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const transitions: Record<OrderStatus, OrderStatus | null> = {
    [OrderStatus.Abierto]: OrderStatus.EnPreparacion,
    [OrderStatus.EnPreparacion]: OrderStatus.Listo,
    [OrderStatus.Listo]: OrderStatus.Entregado,
    [OrderStatus.Entregado]: OrderStatus.Cerrado,
    [OrderStatus.Cerrado]: null,
  };
  return transitions[currentStatus];
};

export const canAdvanceStatus = (currentStatus: OrderStatus): boolean => {
  return getNextStatus(currentStatus) !== null;
};
