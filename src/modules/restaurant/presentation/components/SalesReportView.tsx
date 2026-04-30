'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { SalesReport } from '../../domain/entities/SalesReport';
import { format } from 'date-fns';

interface SalesReportViewProps {
  report: SalesReport;
}

export const SalesReportView: React.FC<SalesReportViewProps> = ({ report }) => {
  const salesByCategory = report.salesByCategory ?? [];
  const salesByDish = report.salesByDish ?? [];
  const ordersByStatus = report.ordersByStatus ?? [];
  const topDishName = report.topDish?.name || report.topDish?.dishName || 'N/A';
  const topDishQuantity = report.topDish?.quantitySold ?? report.topDish?.totalQuantity ?? 0;

  const formatCurrency = (value: number) => {
    return `$${Number(value || 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reporte de Ventas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Período: {format(new Date(report.fromDate), 'dd/MM/yyyy')} -{' '}
          {format(new Date(report.toDate), 'dd/MM/yyyy')}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Pedidos
                </Typography>
              </Box>
              <Typography variant="h4">{report.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Ventas Totales
                </Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(report.totalSales)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Ticket Promedio
                </Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(report.averageTicket)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Plato Más Vendido
                </Typography>
              </Box>
              <Typography variant="h6" noWrap>
                {topDishName}
              </Typography>
              {report.topDish && (
                <Typography variant="body2" color="text.secondary">
                  {topDishQuantity} unidades · {formatCurrency(report.topDish.totalRevenue)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {ordersByStatus.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pedidos por Estado
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersByStatus.map((status, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip label={status.status} size="small" />
                        </TableCell>
                        <TableCell align="right">{status.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Sales by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Categoría
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Total Ventas</TableCell>
                    <TableCell align="right">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesByCategory.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip label={category.category} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{category.quantitySold ?? category.orderCount ?? 0}</TableCell>
                      <TableCell align="right">{formatCurrency(category.totalSales)}</TableCell>
                      <TableCell align="right">{Number(category.percentage ?? 0).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                  {salesByCategory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No hay datos para mostrar
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Sales by Dish */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Plato
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plato</TableCell>
                    <TableCell>CategorÃ­a</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Total Ventas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesByDish.map((dish, index) => (
                    <TableRow key={index}>
                      <TableCell>{dish.dishName}</TableCell>
                      <TableCell>
                        <Chip label={dish.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{dish.quantitySold}</TableCell>
                      <TableCell align="right">{formatCurrency(dish.totalSales)}</TableCell>
                    </TableRow>
                  ))}
                  {salesByDish.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No hay datos para mostrar
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
