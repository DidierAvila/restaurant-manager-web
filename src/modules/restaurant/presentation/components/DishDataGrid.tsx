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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Dish } from '../../domain/entities/Dish';
import { DishCategoryLabels, DishCategory } from '../../domain/entities/DishCategory';

interface DishDataGridProps {
  dishes: Dish[];
  loading: boolean;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export const DishDataGrid: React.FC<DishDataGridProps> = ({
  dishes,
  loading,
  onEdit,
  onDelete,
  onToggleAvailability,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedDishId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDishId !== null) {
      onDelete(selectedDishId);
    }
    setDeleteDialogOpen(false);
    setSelectedDishId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDishId(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 1.5,
      minWidth: 250,
    },
    {
      field: 'price',
      headerName: 'Precio',
      width: 120,
      valueFormatter: (value) => {
        return `$${Number(value).toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: 'category',
      headerName: 'Categoría',
      width: 150,
      renderCell: (params) => {
        const categoryKey = params.value as DishCategory;
        return (
          <Chip
            label={DishCategoryLabels[categoryKey] || params.value}
            size="small"
            color="primary"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'isAvailable',
      headerName: 'Disponible',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Disponible' : 'No disponible'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="toggle"
          icon={
            <Tooltip
              title={params.row.isAvailable ? 'Marcar plato no disponible' : 'Marcar plato disponible'}
              arrow
            >
              {params.row.isAvailable ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Tooltip>
          }
          label={params.row.isAvailable ? 'Marcar no disponible' : 'Marcar disponible'}
          onClick={() => onToggleAvailability(params.row.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Editar plato" arrow>
              <EditIcon />
            </Tooltip>
          }
          label="Editar"
          onClick={() => onEdit(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Eliminar plato" arrow>
              <DeleteIcon />
            </Tooltip>
          }
          label="Eliminar"
          onClick={() => handleDeleteClick(params.row.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <DataGrid
        rows={dishes}
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
        pageSizeOptions={[5, 10, 25, 50, 100]}
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
            ¿Está seguro de que desea eliminar este plato? Esta acción no se puede deshacer.
            {selectedDishId && (
              <strong>
                {' '}
                No podrá eliminar el plato si tiene pedidos asociados.
              </strong>
            )}
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
