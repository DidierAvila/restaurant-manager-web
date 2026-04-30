'use client';

import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Order, AddOrderItemDto } from '../../domain/entities/Order';
import { Dish } from '../../domain/entities/Dish';
import { useDishes } from '../hooks/useDishes';
import { useForm, Controller } from 'react-hook-form';

interface OrderItemsManagerProps {
  order: Order;
  onAddItem: (orderId: number, item: AddOrderItemDto) => void;
  onRemoveItem: (orderId: number, itemId: number) => void;
  readOnly?: boolean;
}

export const OrderItemsManager: React.FC<OrderItemsManagerProps> = ({
  order,
  onAddItem,
  onRemoveItem,
  readOnly = false,
}) => {
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const { dishes, loading: dishesLoading, fetchAvailableDishes } = useDishes();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddOrderItemDto>();

  const selectedDishId = watch('dishId');
  const selectedDish = dishes.find(d => d.id === selectedDishId);

  const handleOpenAddItemDialog = () => {
    reset({ dishId: 0, quantity: 1, notes: '' });
    void fetchAvailableDishes();
    setAddItemDialogOpen(true);
  };

  const handleCloseAddItemDialog = () => {
    setAddItemDialogOpen(false);
    reset();
  };

  const onSubmit = (data: AddOrderItemDto) => {
    onAddItem(order.id, data);
    handleCloseAddItemDialog();
  };

  const availableDishes = dishes.filter((dish) => dish.isAvailable);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Platos del Pedido</Typography>
        {!readOnly && order.status === 'Abierto' && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenAddItemDialog}
          >
            Agregar Plato
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Plato</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio Unit.</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell>Notas</TableCell>
              {!readOnly && order.status === 'Abierto' && <TableCell align="center">Acción</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.dishName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    ${item.unitPrice.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell align="right">
                    ${item.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                  {!readOnly && order.status === 'Abierto' && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveItem(order.id, item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay platos en este pedido
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {order.items && order.items.length > 0 && (
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${order.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
                <TableCell colSpan={readOnly ? 1 : 2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addItemDialogOpen} onClose={handleCloseAddItemDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Agregar Plato al Pedido</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Controller
                name="dishId"
                control={control}
                defaultValue={0}
                rules={{ required: 'Debe seleccionar un plato', min: { value: 1, message: 'Debe seleccionar un plato' } }}
                render={({ field }) => {
                  const selectedOption = availableDishes.find((dish) => dish.id === field.value) || null;

                  return (
                    <Autocomplete
                      options={availableDishes}
                      value={selectedOption}
                      loading={dishesLoading}
                      onChange={(_, value) => field.onChange(value?.id ?? 0)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) =>
                        `${option.name} - $${option.price.toLocaleString('es-CO')}`
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Plato"
                          error={!!errors.dishId}
                          helperText={errors.dishId?.message}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {dishesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  );
                }}
              />

              <Controller
                name="quantity"
                control={control}
                defaultValue={1}
                rules={{
                  required: 'La cantidad es obligatoria',
                  min: { value: 1, message: 'La cantidad debe ser al menos 1' },
                  max: { value: 20, message: 'La cantidad no puede ser mayor a 20' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cantidad"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    inputProps={{ min: 1, max: 20 }}
                  />
                )}
              />

              <Controller
                name="notes"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas (opcional)"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Ej: Sin cebolla, término medio..."
                  />
                )}
              />

              {selectedDish && (
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Precio unitario: ${selectedDish.price.toLocaleString('es-CO')}
                  </Typography>
                  {watch('quantity') > 0 && (
                    <Typography variant="subtitle1" fontWeight="bold">
                      Subtotal: ${(selectedDish.price * watch('quantity')).toLocaleString('es-CO')}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddItemDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Agregar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
