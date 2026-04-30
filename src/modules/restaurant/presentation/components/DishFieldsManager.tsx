'use client';

import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { CreateDishDto } from '../../domain/entities/Dish';
import { getDishCategoryOptions } from '../../domain/entities/DishCategory';

interface DishFieldsManagerProps {
  control: Control<CreateDishDto>;
  errors: FieldErrors<CreateDishDto>;
  isEditMode?: boolean;
}

export const DishFieldsManager: React.FC<DishFieldsManagerProps> = ({
  control,
  errors,
  isEditMode = false,
}) => {
  const categoryOptions = getDishCategoryOptions();

  return (
    <>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre del Plato"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            placeholder="Ej: Bandeja Paisa"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            placeholder="Describe los ingredientes y características del plato"
          />
        )}
      />

      <Controller
        name="price"
        control={control}
        defaultValue={0}
        rules={{
          required: 'El precio es obligatorio',
          min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Precio"
            type="number"
            fullWidth
            error={!!errors.price}
            helperText={errors.price?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{
              step: '0.01',
              min: '0',
            }}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        defaultValue={1}
        rules={{ required: 'La categoría es obligatoria' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Categoría</InputLabel>
            <Select {...field} label="Categoría">
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="isAvailable"
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label="Disponible para venta"
          />
        )}
      />
    </>
  );
};
