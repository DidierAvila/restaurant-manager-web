import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { SalesReport, ReportFilters } from '../../domain/entities/SalesReport';
import { ReportApiAdapter } from '../adapters/ReportApiAdapter';

export class ApiReportRepository implements IReportRepository {
  private adapter: ReportApiAdapter;

  constructor() {
    this.adapter = new ReportApiAdapter();
  }

  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    return await this.adapter.getSalesReport(filters);
  }
}
