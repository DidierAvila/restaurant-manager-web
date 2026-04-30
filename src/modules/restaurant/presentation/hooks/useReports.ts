'use client';

import { useState } from 'react';
import { SalesReport, ReportFilters } from '../../domain/entities/SalesReport';
import { ApiReportRepository } from '../../infrastructure/repositories/ApiReportRepository';
import { GetSalesReport } from '../../application/use-cases/GetSalesReport';
import { useSnackbar } from 'notistack';

export const useReports = () => {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const repository = new ApiReportRepository();
  const getSalesReportUseCase = new GetSalesReport(repository);

  const fetchSalesReport = async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSalesReportUseCase.execute(filters);
      setReport(data);
      enqueueSnackbar('Reporte generado exitosamente', { variant: 'success' });
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al generar el reporte';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    fetchSalesReport,
  };
};
