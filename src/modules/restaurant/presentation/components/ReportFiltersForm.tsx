'use client';

import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { TextField, Stack, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ReportFilters } from '../../domain/entities/SalesReport';

interface ReportFiltersFormProps {
  control: Control<ReportFilters>;
  errors: FieldErrors<ReportFilters>;
  onSubmit: () => void;
  loading: boolean;
}

export const ReportFiltersForm: React.FC<ReportFiltersFormProps> = ({
  control,
  errors,
  onSubmit,
  loading,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Controller
        name="fromDate"
        control={control}
        defaultValue=""
        rules={{ required: 'La fecha inicial es obligatoria' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Fecha Inicial"
            type="date"
            InputLabelProps={{ shrink: true }}
            error={!!errors.fromDate}
            helperText={errors.fromDate?.message}
            sx={{ minWidth: 200 }}
          />
        )}
      />

      <Controller
        name="toDate"
        control={control}
        defaultValue=""
        rules={{ required: 'La fecha final es obligatoria' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Fecha Final"
            type="date"
            InputLabelProps={{ shrink: true }}
            error={!!errors.toDate}
            helperText={errors.toDate?.message}
            sx={{ minWidth: 200 }}
          />
        )}
      />

      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={onSubmit}
        disabled={loading}
        sx={{ height: 56 }}
      >
        Generar Reporte
      </Button>
    </Stack>
  );
};
