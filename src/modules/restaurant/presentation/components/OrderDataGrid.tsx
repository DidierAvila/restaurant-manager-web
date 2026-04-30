'use client';

import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Order } from '../../domain/entities/Order';
import { OrderStatusLabels, OrderStatusColors, canAdvanceStatus, OrderStatus } from '../../domain/entities/OrderStatus';
import { format } from 'date-fns';

interface OrderDataGridProps {
  orders: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  loading: boolean;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
  onAdvanceStatus: (id: number) => void;
}

export const OrderDataGrid: React.FC<OrderDataGridProps> = ({
  orders,
  loading,
  onView,
  onEdit,
  onDelete,
  onAdvanceStatus,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedOrderId !== null) {
      onDelete(selectedOrderId);
    }
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'tableNumber',
      headerName: 'Mesa',
      width: 80,
    },
    {
      field: 'waiter',
      headerName: 'Mesero',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'orderDate',
      headerName: 'Fecha',
      width: 180,
      valueFormatter: (value) => {
        return format(new Date(value), 'dd/MM/yyyy HH:mm');
      },
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => {
        const statusKey = params.value as OrderStatus;
        return (
          <Chip
            label={OrderStatusLabels[statusKey] || params.value}
            size="small"
            color={OrderStatusColors[statusKey]}
          />
        );
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      valueFormatter: (value) => {
        return `$${Number(value).toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: 'itemCount',
      headerName: '# Platos',
      width: 100,
      valueGetter: (value, row) => {
        if (typeof value === 'number') return value;
        return Array.isArray(row.items) ? row.items.length : 0;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 180,
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={
              <Tooltip title="Ver detalles del pedido" arrow>
                <VisibilityIcon />
              </Tooltip>
            }
            label="Ver detalles"
            onClick={() => onView(params.row)}
            showInMenu={false}
          />,
        ];

        if (params.row.status === 'Abierto') {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Editar pedido" arrow>
                  <EditIcon />
                </Tooltip>
              }
              label="Editar"
              onClick={() => onEdit(params.row)}
              showInMenu={false}
            />
          );
        }

        if (canAdvanceStatus(params.row.status as OrderStatus)) {
          actions.push(
            <GridActionsCellItem
              key="advance"
              icon={
                <Tooltip title="Avanzar estado del pedido" arrow>
                  <ArrowForwardIcon />
                </Tooltip>
              }
              label="Avanzar estado"
              onClick={() => onAdvanceStatus(params.row.id)}
              showInMenu={false}
            />
          );
        }

        if (params.row.status === 'Abierto') {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Eliminar pedido" arrow>
                  <DeleteIcon />
                </Tooltip>
              }
              label="Eliminar"
              onClick={() => handleDeleteClick(params.row.id)}
              showInMenu={false}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={totalCount || 0}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          if (model.page !== page) {
            onPageChange(model.page);
          }
          if (model.pageSize !== pageSize) {
            onPageSizeChange(model.pageSize);
          }
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este pedido? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
