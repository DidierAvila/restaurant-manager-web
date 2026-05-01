import { apiService } from '@/modules/shared/application/services/api';
import { SalesReport, ReportFilters } from '../../domain/entities/SalesReport';

export class ReportApiAdapter {
  private salesReportUrl = '/api/Reports/sales';

  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    const params = new URLSearchParams();
    params.append('fromDate', filters.fromDate);
    params.append('toDate', filters.toDate);

    const url = `${this.salesReportUrl}?${params.toString()}`;
    return await apiService.get<SalesReport>(url);
  }
}
