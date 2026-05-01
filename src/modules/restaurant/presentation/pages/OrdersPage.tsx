'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { useOrders } from '../hooks/useOrders';
import { OrderDataGrid } from '../components/OrderDataGrid';
import { OrderFieldsManager } from '../components/OrderFieldsManager';
import { OrderItemsManager } from '../components/OrderItemsManager';
import { Order, CreateOrderDto, AddOrderItemDto } from '../../domain/entities/Order';
import { OrderStatusLabels, OrderStatus } from '../../domain/entities/OrderStatus';

export const OrdersPage: React.FC = () => {
  const {
    orders,
    pagination,
    loading,
    itemsLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    addItem,
    removeItem,
    getOrderItems,
    advanceStatus,
    fetchOrders,
  } = useOrders();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrderDto>();

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      reset({
        tableNumber: order.tableNumber,
        waiter: order.waiter,
      });
    } else {
      setEditingOrder(null);
      reset({
        tableNumber: 1,
        waiter: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
    reset();
  };

  const handleOpenViewDialog = async (order: Order) => {
    setViewingOrder({ ...order, items: [] });
    setViewDialogOpen(true);

    const items = await getOrderItems(order.id);
    setViewingOrder((currentOrder) => {
      if (!currentOrder || currentOrder.id !== order.id) return currentOrder;

      return {
        ...currentOrder,
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0),
      };
    });
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingOrder(null);
  };

  const buildFilters = () => {
    const filters: any = {
      page: page + 1, // MUI DataGrid usa 0-indexed, backend usa 1-indexed
      pageSize: pageSize,
    };
    if (statusFilter !== '') filters.status = statusFilter;
    return filters;
  };

  const onSubmit = async (data: CreateOrderDto) => {
    let success = false;
    if (editingOrder) {
      const result = await updateOrder(editingOrder.id, data);
      success = result !== null;
    } else {
      const result = await createOrder(data);
      success = result !== null;
    }
    if (success) {
      handleCloseDialog();
      fetchOrders(buildFilters());
    }
  };

  const handleEdit = (order: Order) => {
    handleOpenDialog(order);
  };

  const handleView = (order: Order) => {
    handleOpenViewDialog(order).catch(() => {
      // error visible via el estado `error` del hook useOrders
    });
  };

  const handleDelete = async (id: number) => {
    const success = await deleteOrder(id);
    if (success) {
      fetchOrders(buildFilters());
    }
  };

  const handleAdvanceStatus = async (id: number) => {
    const result = await advanceStatus(id);
    if (result) {
      fetchOrders(buildFilters());
    }
  };

  const handleAddItem = async (orderId: number, item: AddOrderItemDto) => {
    const result = await addItem(orderId, item);
    if (result && viewingOrder) {
      setViewingOrder(result);
    }
  };

  const handleRemoveItem = async (orderId: number, itemId: number) => {
    const result = await removeItem(orderId, itemId);
    if (result && viewingOrder) {
      setViewingOrder(result);
    }
  };

  const handleApplyFilters = () => {
    setPage(0); // Reset a la primera página al aplicar filtros
    fetchOrders(buildFilters());
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setPage(0);
    fetchOrders({ page: 1, pageSize: pageSize });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchOrders({ ...buildFilters(), page: newPage + 1 });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
    fetchOrders({ ...buildFilters(), page: 1, pageSize: newPageSize });
  };

  useEffect(() => {
    fetchOrders({ page: 1, pageSize: 10 });
  }, [fetchOrders]);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Gestión de Pedidos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Pedido
          </Button>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as number)}
              label="Estado"
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(OrderStatusLabels).map(([key, label]) => (
                <MenuItem key={key} value={OrderStatus[key as keyof typeof OrderStatus]}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
          <Button variant="text" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </Stack>

        <OrderDataGrid
          orders={orders}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          totalCount={pagination.totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onAdvanceStatus={handleAdvanceStatus}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <OrderFieldsManager
                control={control}
                errors={errors}
                isEditMode={!!editingOrder}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {editingOrder ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles del Pedido #{viewingOrder?.id}
        </DialogTitle>
        <DialogContent>
          {viewingOrder && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mesa
                </Typography>
                <Typography variant="body1">{viewingOrder.tableNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mesero
                </Typography>
                <Typography variant="body1">{viewingOrder.waiter}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Typography variant="body1">
                  {OrderStatusLabels[viewingOrder.status as OrderStatus]}
                </Typography>
              </Box>
              <Divider />
              {itemsLoading ? (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando platos del pedido...
                  </Typography>
                </Stack>
              ) : (
                <OrderItemsManager
                  order={viewingOrder}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  readOnly={viewingOrder.status !== 'Abierto'}
                />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
