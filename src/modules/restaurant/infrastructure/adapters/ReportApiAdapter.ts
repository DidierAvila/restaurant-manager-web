import { ApiService } from '@/modules/shared/application/services/api';
import { SalesReport, ReportFilters } from '../../domain/entities/SalesReport';

export class ReportApiAdapter {
  private apiService: ApiService;
  private salesReportUrl = '/api/Reports/sales';

  constructor() {
    this.apiService = new ApiService();
  }

  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    const params = new URLSearchParams();
    params.append('fromDate', filters.fromDate);
    params.append('toDate', filters.toDate);

    const url = `${this.salesReportUrl}?${params.toString()}`;
    return await this.apiService.get<SalesReport>(url);
  }
}
