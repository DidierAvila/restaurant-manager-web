'use client';

import React from 'react';
import { Box, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useReports } from '../hooks/useReports';
import { ReportFiltersForm } from '../components/ReportFiltersForm';
import { SalesReportView } from '../components/SalesReportView';
import { ReportFilters } from '../../domain/entities/SalesReport';
import { format, subDays } from 'date-fns';

export const ReportsPage: React.FC = () => {
  const { report, loading, error, fetchSalesReport } = useReports();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFilters>({
    defaultValues: {
      fromDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      toDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const onSubmit = (data: ReportFilters) => {
    fetchSalesReport(data);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reportes de Ventas
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ReportFiltersForm
            control={control}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && !error && !report && (
          <Alert severity="info">
            Seleccione un rango de fechas y haga clic en "Generar Reporte" para ver los resultados.
          </Alert>
        )}

        {!loading && report && <SalesReportView report={report} />}
      </Paper>
    </Box>
  );
};
