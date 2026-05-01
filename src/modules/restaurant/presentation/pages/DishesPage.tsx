'use client';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateDishDto, Dish } from '../../domain/entities/Dish';
import { getDishCategoryOptions } from '../../domain/entities/DishCategory';
import { DishDataGrid } from '../components/DishDataGrid';
import { DishFieldsManager } from '../components/DishFieldsManager';
import { useDishes } from '../hooks/useDishes';

export const DishesPage: React.FC = () => {
  const {
    dishes,
    pagination,
    loading,
    createDish,
    updateDish,
    deleteDish,
    toggleAvailability,
    fetchDishes,
  } = useDishes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDishDto>();

  const categoryOptions = getDishCategoryOptions();

  const handleOpenDialog = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      reset({
        name: dish.name,
        description: dish.description || '',
        price: dish.price,
        category: dish.categoryEnum,
        isAvailable: dish.isAvailable,
      });
    } else {
      setEditingDish(null);
      reset({
        name: '',
        description: '',
        price: 0,
        category: 1,
        isAvailable: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDish(null);
    reset();
  };

  const onSubmit = async (data: CreateDishDto) => {
    let success = false;
    if (editingDish) {
      const updateData = {
        id: editingDish.id,
        ...data,
      };
      const result = await updateDish(editingDish.id, updateData);
      success = result !== null;
    } else {
      const result = await createDish(data);
      success = result !== null;
    }
    if (success) {
      handleCloseDialog();
      fetchDishes(buildFilters());
    }
  };

  const handleEdit = (dish: Dish) => {
    handleOpenDialog(dish);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteDish(id);
    if (success) {
      fetchDishes(buildFilters());
    }
  };

  const handleToggleAvailability = async (id: number) => {
    const result = await toggleAvailability(id);
    if (result) {
      fetchDishes(buildFilters());
    }
  };

  const buildFilters = () => {
    const filters: any = {
      page: page + 1, // MUI DataGrid usa 0-indexed, backend usa 1-indexed
      pageSize: pageSize,
    };

    if (categoryFilter !== '') filters.category = categoryFilter;
    if (availabilityFilter !== 'all') {
      filters.isAvailable = availabilityFilter === 'available';
    }
    if (searchText.trim()) filters.search = searchText.trim();

    return filters;
  };

  const handleApplyFilters = () => {
    setPage(0); // Reset a la primera página al aplicar filtros
    fetchDishes(buildFilters());
  };

  const handleClearFilters = () => {
    setCategoryFilter('');
    setAvailabilityFilter('all');
    setSearchText('');
    setPage(0);
    fetchDishes({ page: 1, pageSize: pageSize });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchDishes({ ...buildFilters(), page: newPage + 1 });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
    fetchDishes({ ...buildFilters(), page: 1, pageSize: newPageSize });
  };

  useEffect(() => {
    fetchDishes({ page: 1, pageSize: 10 });
  }, [fetchDishes]);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Gestión de Platos
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Nuevo Plato
          </Button>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Buscar platos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as number)}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Disponibilidad</InputLabel>
            <Select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              label="Disponibilidad"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="available">Disponibles</MenuItem>
              <MenuItem value="unavailable">No disponibles</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={handleApplyFilters}>
            Buscar
          </Button>
          <Button variant="text" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </Stack>

        <DishDataGrid
          dishes={dishes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
          page={page}
          pageSize={pageSize}
          totalCount={pagination.totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingDish ? 'Editar Plato' : 'Nuevo Plato'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <DishFieldsManager control={control} errors={errors} isEditMode={!!editingDish} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {editingDish ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
