import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { SalesReport, ReportFilters } from '../../domain/entities/SalesReport';

export class GetSalesReport {
  constructor(private reportRepository: IReportRepository) {}

  async execute(filters: ReportFilters): Promise<SalesReport> {
    return await this.reportRepository.getSalesReport(filters);
  }
}
