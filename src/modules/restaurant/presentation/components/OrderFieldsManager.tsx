'use client';

import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { TextField } from '@mui/material';
import { CreateOrderDto } from '../../domain/entities/Order';

interface OrderFieldsManagerProps {
  control: Control<CreateOrderDto>;
  errors: FieldErrors<CreateOrderDto>;
  isEditMode?: boolean;
}

export const OrderFieldsManager: React.FC<OrderFieldsManagerProps> = ({
  control,
  errors,
  isEditMode = false,
}) => {
  return (
    <>
      <Controller
        name="tableNumber"
        control={control}
        defaultValue={1}
        rules={{
          required: 'El número de mesa es obligatorio',
          min: { value: 1, message: 'El número de mesa debe ser mayor a 0' },
          max: { value: 50, message: 'El número de mesa debe ser menor o igual a 50' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Número de Mesa"
            type="number"
            fullWidth
            error={!!errors.tableNumber}
            helperText={errors.tableNumber?.message}
            inputProps={{
              min: 1,
              max: 50,
            }}
          />
        )}
      />

      <Controller
        name="waiter"
        control={control}
        defaultValue=""
        rules={{
          required: 'El nombre del mesero es obligatorio',
          minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Mesero"
            fullWidth
            error={!!errors.waiter}
            helperText={errors.waiter?.message}
            placeholder="Nombre del mesero"
          />
        )}
      />
    </>
  );
};
