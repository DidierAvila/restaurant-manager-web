'use client';

import { UserType } from '@/modules/admin/domain/entities/UserType';
// ImportaciÃ³n removida: los filtros se construyen como objeto plano y el hook crea el VO
import { CreateUserTypeData } from '@/modules/admin/domain/value-objects/CreateUserTypeData';
import type { UserTypeFiltersProps } from '@/modules/admin/domain/value-objects/UserTypeFilters';
import { useUserTypes } from '@/modules/admin/presentation/hooks/useUserTypes';
import { useApiAuth } from '@/modules/shared/presentation/hooks/useApiAuth';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { UserTypeFieldsManager } from './UserTypeFieldsManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-type-tabpanel-${index}`}
      aria-labelledby={`user-type-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

import {
  AdminPanelSettings,
  Assignment,
  Business,
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  FilterList,
  Group,
  MoreVert,
  People,
  PersonAdd,
  Search,
  Shield,
  SupervisorAccount,
  Visibility,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  GridLegacy as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

interface PortalConfig {
  theme: string;
  defaultLandingPage: string;
  logoUrl?: string;
  language: string;
  customLabel?: string;
  customIcon?: string;
  customRoute?: string;
}

// Mapear el tipo de la entidad al tipo del componente
type ComponentUserType = {
  id: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
  portalConfig?: PortalConfig;
  userCount: number;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
  additionalConfig?: Record<string, any>;
};

interface UserTypeFormData {
  name: string;
  description: string;
  portalConfig: PortalConfig;
  status: 'Activo' | 'Inactivo';
  isDefault: boolean;
  additionalConfig?: Record<string, any>;
}

// FunciÃ³n para formatear fechas
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'No disponible';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Fecha invÃ¡lida';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

// FunciÃ³n para formatear fechas unificadas (creaciÃ³n y actualizaciÃ³n)
const formatUnifiedDates = (
  createdAt: Date | string | undefined,
  updatedAt: Date | string | undefined
): React.ReactElement => {
  const createdFormatted = formatDate(createdAt);
  const updatedFormatted = formatDate(updatedAt);

  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        <strong>Creado:</strong> {createdFormatted}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        <strong>Actualizado:</strong> {updatedFormatted}
      </Typography>
    </Box>
  );
};

// FunciÃ³n para mapear la entidad del dominio al formato del componente
const mapUserTypeToComponent = (userType: UserType): ComponentUserType => {
  return {
    id: userType.id.value,
    name: userType.name,
    description: userType.description,
    status: userType.status ? 'Activo' : 'Inactivo',
    portalConfig: {
      theme: userType.theme || 'default',
      defaultLandingPage: userType.defaultLandingPage || '/dashboard',
      logoUrl: userType.logoUrl,
      language: userType.language || 'es',
    },
    userCount: userType.userCount || 0,
    isDefault: false, // TODO: Obtener del backend cuando estÃ© disponible
    createdAt: userType.createdAt ? userType.createdAt.toISOString() : '',
    updatedAt: userType.updatedAt ? userType.updatedAt.toISOString() : undefined,
    additionalConfig: userType.additionalConfig,
  };
};

const UserTypesManagement: React.FC = () => {
  // Configurar autenticaciÃ³n
  const authData = useApiAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Usar el hook useUserTypes
  const {
    userTypes,
    loading,
    error,
    pagination,
    getUserTypes,
    createUserType,
    updateUserType,
    deleteUserType,
    clearError,
  } = useUserTypes();

  // FunciÃ³n helper para encontrar el UserType original por ID
  const findOriginalUserType = (id: string): UserType | undefined => {
    return userTypes.find((ut) => ut.id.value === id);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Estados para el diÃ¡logo con pestaÃ±as
  const [dialogTab, setDialogTab] = useState(0);
  const [selectedUserTypeForFields, setSelectedUserTypeForFields] = useState<UserType | null>(null);

  // Mapear datos del hook al formato del componente usando useMemo
  const mappedUserTypes = useMemo(() => {
    return userTypes.map(mapUserTypeToComponent);
  }, [userTypes]);

  // FunciÃ³n para cargar tipos de usuario
  const loadUserTypes = async () => {
    try {
      const filters: Partial<UserTypeFiltersProps> = {
        page: page,
        pageSize: rowsPerPage,
      };

      // Agregar filtros si estÃ¡n definidos
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      if (statusFilter !== 'Todos') {
        filters.status = statusFilter;
      }

      await getUserTypes(filters);
    } catch (err) {
      enqueueSnackbar('Error al cargar tipos de usuario', { variant: 'error' });
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadUserTypes();
  }, []); // Ejecutar solo al montar

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    loadUserTypes();
  }, [page, searchTerm, statusFilter]);

  // Funciones de manejo de paginación
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1); // MUI usa base 0, convertir a base 1
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setPage(1); // Resetear a la primera página
    // Aquí podrías actualizar el límite si el hook useUserTypes lo soporta
    // Por ahora solo reseteamos la página
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userType: UserType | null;
  }>({
    open: false,
    userType: null,
  });
  const [formData, setFormData] = useState<UserTypeFormData>({
    name: '',
    description: '',
    portalConfig: {
      theme: 'default',
      defaultLandingPage: '/dashboard',
      language: 'es',
    },
    status: 'Activo',
    isDefault: false,
    additionalConfig: {},
  });

  const themes = ['default', 'admin', 'supervisor', 'consultant', 'client', 'auditor', 'guest'];
  const languages = ['es', 'en', 'pt'];
  const landingPages = [
    '/dashboard',
    '/evaluations',
    '/reports',
    '/clients',
    '/audit-dashboard',
    '/guest-dashboard',
  ];
  const statuses = ['Activo', 'Inactivo'];

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    componentUserType: ComponentUserType
  ) => {
    setAnchorEl(event.currentTarget);
    const originalUserType = findOriginalUserType(componentUserType.id);
    if (originalUserType) {
      setSelectedUserType(originalUserType);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserType(null);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', userType?: UserType) => {
    setDialogMode(mode);
    setDialogTab(0); // Reset to first tab
    if (userType) {
      // Validaciones defensivas para asegurar que los valores sean strings
      const safeName = typeof userType.name === 'string' ? userType.name : '';
      const safeDescription = typeof userType.description === 'string' ? userType.description : '';

      setFormData({
        name: safeName || '',
        description: safeDescription || '',
        portalConfig: {
          theme: userType.theme || 'default',
          defaultLandingPage: userType.defaultLandingPage || '/dashboard',
          logoUrl: userType.logoUrl,
          language: userType.language || 'es',
        },
        status: userType.status ? 'Activo' : 'Inactivo',
        isDefault: false, // TODO: Obtener del backend cuando estÃ© disponible
        additionalConfig: userType.additionalConfig || {},
      });
      setSelectedUserType(userType);
      setSelectedUserTypeForFields(userType);
    } else {
      setFormData({
        name: '',
        description: '',
        portalConfig: {
          theme: 'default',
          defaultLandingPage: '/dashboard',
          language: 'es',
        },
        status: 'Activo',
        isDefault: false,
        additionalConfig: {},
      });
      setSelectedUserType(null);
      setSelectedUserTypeForFields(null);
    }
    setOpenDialog(true);
    // Solo cerrar el menÃº, no limpiar selectedUserType
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserType(null);
    setSelectedUserTypeForFields(null);
    setDialogTab(0);
    clearError(); // Limpiar errores al cerrar
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDialogTab(newValue);
  };

  const handleDynamicFieldsUpdate = (updatedFields: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      additionalConfig: {
        ...prev.additionalConfig,
        dynamicFields: updatedFields,
      },
    }));
  };

  const handleSaveUserType = async () => {
    try {
      clearError();

      // Validaciones defensivas para prevenir errores de trim
      const safeName = typeof formData.name === 'string' ? formData.name : '';
      const safeDescription = typeof formData.description === 'string' ? formData.description : '';

      // Preparar datos para el backend segÃºn el formato esperado
      const userTypeData = {
        name: safeName.trim(),
        description: safeDescription.trim(),
        status: formData.status === 'Activo', // Convertir string a boolean
        additionalConfig: (formData.additionalConfig as Record<string, unknown>) || {},
        theme: formData.portalConfig?.theme || 'default',
        defaultLandingPage: formData.portalConfig?.defaultLandingPage || '/dashboard',
        logoUrl: formData.portalConfig?.logoUrl,
        language: formData.portalConfig?.language || 'es',
      };

      const userTypeVO = CreateUserTypeData.create(userTypeData);

      if (dialogMode === 'create') {
        await createUserType(userTypeVO);
        enqueueSnackbar('Tipo de usuario creado exitosamente', { variant: 'success' });
      } else if (dialogMode === 'edit' && selectedUserType) {
        await updateUserType(selectedUserType.id.value, userTypeVO);
        enqueueSnackbar('Tipo de usuario actualizado exitosamente', { variant: 'success' });
      } else {
        enqueueSnackbar('Error: No se pudo identificar el tipo de usuario a editar', {
          variant: 'error',
        });
        return;
      }

      // Recargar la lista de tipos de usuario despuÃ©s de cualquier operaciÃ³n exitosa
      await loadUserTypes();
      handleCloseDialog();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error al guardar el tipo de usuario';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleDeleteClick = (userType: UserType) => {
    setDeleteDialog({
      open: true,
      userType: userType,
    });
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      userType: null,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteDialog.userType) {
        clearError();

        await deleteUserType(deleteDialog.userType.id.value);
        enqueueSnackbar('Tipo de usuario eliminado exitosamente', { variant: 'success' });

        // Recargar la lista de tipos de usuario
        await loadUserTypes();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error al eliminar el tipo de usuario';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }

    setDeleteDialog({
      open: false,
      userType: null,
    });
  };

  const handleDeleteUserType = async (userTypeId: string) => {
    try {
      await deleteUserType(userTypeId);
      enqueueSnackbar('Tipo de usuario eliminado exitosamente', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al eliminar el tipo de usuario', { variant: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Activo' ? 'success' : 'default';
  };

  const getUserTypeIcon = (userTypeName: string) => {
    switch (userTypeName) {
      case 'Administrador':
        return <AdminPanelSettings />;
      case 'Supervisor SST':
        return <SupervisorAccount />;
      case 'Consultor':
        return <Shield />;
      case 'Cliente':
        return <Business />;
      case 'Auditor Externo':
        return <Assignment />;
      case 'Invitado':
        return <People />;
      default:
        return <Group />;
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'admin':
        return '#1976d2';
      case 'supervisor':
        return '#388e3c';
      case 'consultant':
        return '#f57c00';
      case 'client':
        return '#7b1fa2';
      case 'auditor':
        return '#d32f2f';
      case 'guest':
        return '#616161';
      default:
        return '#424242';
    }
  };

  // Los datos ya vienen filtrados y paginados del servidor

  return (
    <Box sx={{ flexGrow: 1, pt: 1, px: 3, pb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">GestiÃ³n de Tipos de Usuario</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpenDialog('create')}
        >
          Nuevo Tipo de Usuario
        </Button>
      </Box>

      {/* Mostrar errores si existen */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtros y bÃºsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6} component="div">
              <TextField
                fullWidth
                placeholder="Buscar tipos de usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} component="div">
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} component="div">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('Todos');
                }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de tipos de usuario */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Tipo de Usuario
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Descripción
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Configuración Portal
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Usuarios
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Fechas
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappedUserTypes.map((userType) => (
                <TableRow key={userType.id} hover sx={{ '& td': { py: 1 } }}>
                  <TableCell sx={{ minWidth: 220, py: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          mr: 1.5,
                          bgcolor: 'secondary.main',
                          width: 36,
                          height: 36,
                          fontSize: '1rem',
                        }}
                      >
                        {getUserTypeIcon(userType.name)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{ fontSize: '0.95rem', lineHeight: 1.3 }}
                        >
                          {userType.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                          }}
                        >
                          ID: ...{userType.id.slice(-6)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {userType.description}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box>
                      <Chip
                        label={userType.portalConfig?.theme || 'light'}
                        size="small"
                        sx={{
                          bgcolor: getThemeColor(userType.portalConfig?.theme || 'light'),
                          color: 'white',
                          mb: 0.5,
                          height: 22,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                        sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}
                      >
                        {userType.portalConfig?.defaultLandingPage || '/dashboard'}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                        sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}
                      >
                        {(userType.portalConfig?.language || 'es').toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Chip
                        label={`${userType.userCount}`}
                        size="small"
                        variant="outlined"
                        color={userType.userCount > 0 ? 'primary' : 'default'}
                        sx={{ height: 22, fontSize: '0.75rem' }}
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 0.5, fontSize: '0.8rem' }}
                      >
                        {userType.userCount === 1 ? 'usuario' : 'usuarios'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    <Chip
                      label={userType.status}
                      size="small"
                      color={getStatusColor(userType.status) as any}
                      icon={
                        userType.status === 'Activo' ? (
                          <CheckCircle sx={{ fontSize: '1rem' }} />
                        ) : (
                          <Cancel sx={{ fontSize: '1rem' }} />
                        )
                      }
                      sx={{ height: 24, fontSize: '0.8rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ '& .MuiTypography-root': { fontSize: '0.8rem', lineHeight: 1.2 } }}>
                      {formatUnifiedDates(userType.createdAt, userType.updatedAt)}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    <Tooltip title="MÃ¡s opciones">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, userType)}
                        sx={{ padding: '6px' }}
                      >
                        <MoreVert sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PaginaciÃ³n */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination?.totalRecords || mappedUserTypes.length || 0}
          rowsPerPage={pagination?.pageSize || rowsPerPage}
          page={Math.max(0, (page || 1) - 1)} // MUI usa base 0, asegurar valor vÃ¡lido
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Filas por pÃ¡gina:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}â€“${to} de ${count !== -1 ? count : `mÃ¡s de ${to}`}`
          }
        />
      </Paper>

      {/* MenÃº contextual */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOpenDialog('view', selectedUserType!)}>
          <Visibility sx={{ mr: 1 }} /> Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('edit', selectedUserType!)}>
          <Edit sx={{ mr: 1 }} /> Editar
        </MenuItem>
        {selectedUserType?.userCount === 0 ? (
          <MenuItem
            onClick={() => handleDeleteClick(selectedUserType!)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} /> Eliminar
          </MenuItem>
        ) : selectedUserType ? (
          <Tooltip title="No se puede eliminar un tipo de usuario que tiene usuarios asignados">
            <MenuItem disabled sx={{ color: 'text.disabled' }}>
              <Delete sx={{ mr: 1 }} /> Eliminar
            </MenuItem>
          </Tooltip>
        ) : null}
      </Menu>

      {/* Dialog para crear/editar/ver tipo de usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Nuevo Tipo de Usuario'}
          {dialogMode === 'edit' && 'Editar Tipo de Usuario'}
          {dialogMode === 'view' && 'Detalles del Tipo de Usuario'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={dialogTab}
              onChange={handleTabChange}
              aria-label="user type configuration tabs"
            >
              <Tab label="InformaciÃ³n General" />
              <Tab label="Campos DinÃ¡micos" disabled={dialogMode === 'create'} />
            </Tabs>
          </Box>

          <TabPanel value={dialogTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} component="div">
                <Typography variant="h6" gutterBottom>
                  InformaciÃ³n General
                </Typography>
                <TextField
                  fullWidth
                  label="Nombre del tipo de usuario"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={dialogMode === 'view'}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={dialogMode === 'view'}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }} disabled={dialogMode === 'view'}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    label="Estado"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      disabled={dialogMode === 'view'}
                    />
                  }
                  label="Tipo de usuario por defecto"
                />
              </Grid>
              <Grid item xs={12} md={6} component="div">
                <Typography variant="h6" gutterBottom>
                  Configuración del Portal
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={dialogMode === 'view'}>
                  <InputLabel>Tema</InputLabel>
                  <Select
                    value={formData.portalConfig.theme}
                    label="Tema"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portalConfig: { ...formData.portalConfig, theme: e.target.value },
                      })
                    }
                  >
                    {themes.map((theme) => (
                      <MenuItem key={theme} value={theme}>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              bgcolor: getThemeColor(theme),
                              borderRadius: '50%',
                              mr: 1,
                            }}
                          />
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={dialogMode === 'view'}>
                  <InputLabel>Página de inicio</InputLabel>
                  <Select
                    value={formData.portalConfig.defaultLandingPage}
                    label="Página de inicio"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portalConfig: {
                          ...formData.portalConfig,
                          defaultLandingPage: e.target.value,
                        },
                      })
                    }
                  >
                    {landingPages.map((page) => (
                      <MenuItem key={page} value={page}>
                        {page}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={dialogMode === 'view'}>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    value={formData.portalConfig.language}
                    label="Idioma"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portalConfig: { ...formData.portalConfig, language: e.target.value },
                      })
                    }
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Etiqueta personalizada (opcional)"
                  value={formData.portalConfig.customLabel || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      portalConfig: { ...formData.portalConfig, customLabel: e.target.value },
                    })
                  }
                  disabled={dialogMode === 'view'}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Icono personalizado (opcional)"
                  value={formData.portalConfig.customIcon || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      portalConfig: { ...formData.portalConfig, customIcon: e.target.value },
                    })
                  }
                  disabled={dialogMode === 'view'}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="URL del logo (opcional)"
                  value={formData.portalConfig.logoUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      portalConfig: { ...formData.portalConfig, logoUrl: e.target.value },
                    })
                  }
                  disabled={dialogMode === 'view'}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={dialogTab} index={1}>
            {selectedUserTypeForFields && (
              <UserTypeFieldsManager userTypeId={selectedUserTypeForFields.id.value} />
            )}
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={loading}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{
              minWidth: 120,
              fontWeight: 'medium',
            }}
          >
            Cancelar
          </Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={handleSaveUserType}
              variant="contained"
              disabled={loading || !formData.name || !formData.description}
            >
              {loading
                ? 'Guardando...'
                : dialogMode === 'create'
                  ? 'Crear Tipo de Usuario'
                  : 'Guardar Cambios'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* DiÃ¡logo de confirmaciÃ³n de eliminaciÃ³n */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar eliminaciÃ³n</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Â¿EstÃ¡ seguro que desea eliminar el tipo de usuario "{deleteDialog.userType?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acciÃ³n no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{
              minWidth: 120,
              fontWeight: 'medium',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTypesManagement;
