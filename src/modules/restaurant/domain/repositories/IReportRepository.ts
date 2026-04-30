import { SalesReport, ReportFilters } from '../entities/SalesReport';

export interface IReportRepository {
  getSalesReport(filters: ReportFilters): Promise<SalesReport>;
}
