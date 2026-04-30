'use client';

import { User } from '@/modules/admin/domain/entities/User';
import { CreateUserData } from '@/modules/admin/domain/value-objects/CreateUserData';
import { useRoles } from '@/modules/admin/presentation/hooks/useRoles';
import { useUserTypes } from '@/modules/admin/presentation/hooks/useUserTypes';
import { useUsers } from '@/modules/admin/presentation/hooks/useUsers';
import { useApiAuth } from '@/modules/shared/presentation/hooks/useApiAuth';
import {
  ArrowDownward,
  ArrowUpward,
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  Email,
  FilterList,
  MoreVert,
  PersonAdd,
  Phone,
  Search,
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { TempUserFieldsManager } from './TempUserFieldsManager';
import { UserFieldsManager } from './UserFieldsManager';

// Componente TabPanel para manejar contenido de tabs
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Usar el tipo de la entidad del dominio y mapear los estados
type UserDisplay = User & {
  company?: string;
  lastLogin?: string;
  role?: string; // Para mostrar el primer rol
  firstRoleName: string | null; // Nombre del primer rol del usuario
};

// Ya no necesitamos funciones de mapeo porque tanto frontend como backend usan boolean

interface UserFormData {
  name: string;
  email: string;
  password: string;
  image: string;
  phone: string;
  address: string;
  userTypeId: string;
  roleIds: string[];
  status: boolean; // true = Activo, false = Inactivo
  additionalData: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}

const UsersManagement: React.FC = () => {
  // Hook para autenticación automática
  const authData = useApiAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Hook DDD para gestión de usuarios
  const {
    users: dddUsers,
    user: currentUser,
    loading: dddLoading,
    error: dddError,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    pagination: dddPagination,
  } = useUsers();

  // Hook DDD para gestión de roles
  const { getRolesDropdown } = useRoles();

  // Hook DDD para gestión de tipos de usuario
  const { getUserTypesDropdown } = useUserTypes();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Todos');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('Todos');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Estados para ordenamiento
  const [sortBy, setSortBy] = useState<
    'name' | 'email' | 'userTypeName' | 'firstRoleName' | 'status' | 'createdAt' | null
  >(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados para el diÃ¡logo con pestaÃ±as
  const [dialogTab, setDialogTab] = useState(0);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    image: '',
    phone: '',
    address: '',
    userTypeId: '',
    roleIds: [],
    status: true, // true = Activo
    additionalData: {
      additionalProp1: '',
      additionalProp2: '',
      additionalProp3: '',
    },
  });

  const [userTypes, setUserTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const statuses = ['Activo', 'Inactivo'];

  // Estado para campos dinámicos temporales durante la creación
  const [tempDynamicFields, setTempDynamicFields] = useState<Record<string, any>>({});

  // Cargar datos iniciales (roles y tipos de usuario)
  useEffect(() => {
    loadRoles();
    loadUserTypes();
  }, []);

  // Cargar usuarios inicialmente y cuando cambien los filtros
  useEffect(() => {
    if (dddPagination && dddPagination.currentPage !== undefined) {
      loadUsers(dddPagination.currentPage, dddPagination.pageSize);
    }
  }, [searchTerm, roleFilter, userTypeFilter, dddPagination?.currentPage]);

  const loadUsers = async (page = 1, pageSize = 10) => {
    try {
      // Usar el hook DDD para cargar usuarios
      await getUsers({
        search: searchTerm || undefined,
        roleId: roleFilter !== 'Todos' ? roleFilter : undefined,
        userTypeId: userTypeFilter !== 'Todos' ? userTypeFilter : undefined,
        page,
        pageSize,
      });
    } catch (err) {
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await getRolesDropdown();

      // ValidaciÃ³n defensiva para asegurar que siempre sea un array
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        setRoles([]);
      }
    } catch (err) {
      setRoles([]);
      setError('Error al cargar los roles. Por favor, intente nuevamente.');
    }
  };

  const loadUserTypes = async () => {
    try {
      const userTypesData = await getUserTypesDropdown();

      // ValidaciÃ³n defensiva para asegurar que siempre sea un array
      if (Array.isArray(userTypesData)) {
        setUserTypes(userTypesData);
      } else {
        setUserTypes([]);
      }
    } catch (err) {
      setError('Error al cargar los tipos de usuario. Por favor, intente nuevamente.');
      // Asegurar que userTypes sea un array vacÃ­o en caso de error
      setUserTypes([]);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError(null); // Limpiar errores previos

      // Validar campos requeridos
      if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) {
        setError('El nombre es requerido');
        return;
      }
      if (!formData.email || typeof formData.email !== 'string' || !formData.email.trim()) {
        setError('El email es requerido');
        return;
      }
      if (!formData.userTypeId) {
        setError('El tipo de usuario es requerido');
        return;
      }
      if (!formData.roleIds || formData.roleIds.length === 0) {
        setError('Debe seleccionar al menos un rol');
        return;
      }

      // Convertir campos dinÃ¡micos temporales a additionalData
      const dynamicFieldsData: Record<string, any> = {};
      Object.entries(tempDynamicFields).forEach(([fieldId, field]) => {
        dynamicFieldsData[field.name] = field.value;
      });

      const userData = CreateUserData.create({
        name: (formData.name || '').trim(),
        email: (formData.email || '').trim(),
        password: formData.password || 'temporal123', // Usar password del formulario o temporal
        image: formData.image || '',
        phone: formData.phone || '',
        userTypeId: formData.userTypeId,
        address: formData.address || '',
        additionalData: {
          ...dynamicFieldsData, // Incluir campos dinÃ¡micos
          additionalProp1: formData.additionalData.additionalProp1 || '',
          additionalProp2: formData.additionalData.additionalProp2 || '',
          additionalProp3: formData.additionalData.additionalProp3 || '',
        },
        roleIds: formData.roleIds,
        status: formData.status,
      });


      // Usar el hook DDD para crear el usuario
      const result = await createUser(userData);

      if (result) {
        setUserCreatedSuccessfully(true);
        setSearchTerm((formData.email || '').trim()); // Filtrar por el email del usuario creado
        await loadUsers(); // Recargar la lista
        setTempDynamicFields({}); // Limpiar campos dinÃ¡micos temporales
        setOpenDialog(false);
        enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
      } else {
        const errorMessage = dddError || 'Error al crear el usuario';
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error de conexión al crear el usuario';
      setError(errorMessage);
    }
  };

  const handleUpdateUser = async (): Promise<void> => {

    if (!selectedUser) {
      setError('No hay usuario seleccionado para actualizar');
      return;
    }

    try {
      // El formulario usa string para email; tomar el valor directamente
      const emailValue = formData.email;


      // Preparar datos para enviar al backend - solo incluir campos que no sean null/undefined
      const userData: any = {
        name: formData.name,
        email: emailValue,
        userTypeId: formData.userTypeId,
        roleIds: formData.roleIds,
        status: formData.status,
        phone: formData.phone,
        address: formData.address,
      };

      // Solo incluir image si existe y no es null/undefined - usar formData.image (valor actualizado)
      if (formData.image && typeof formData.image === 'string' && formData.image.trim() !== '') {
        userData.image = formData.image;
      }

      // Solo incluir additionalData si existe
      if (selectedUser.additionalData) {
        userData.additionalData = selectedUser.additionalData;
      }

      // Extraer el valor del ID correctamente (puede ser un objeto UserId o un string)

      const userIdValue: string =
        typeof selectedUser.id === 'string' ? selectedUser.id : selectedUser.id.value;


      if (!userIdValue) {
        setError('Error: ID del usuario no válido');
        return;
      }

      try {
        const updatedUser = await updateUser(userIdValue, userData);

        setOpenDialog(false);
        setSelectedUser(null);
        setError(null);

        // Mostrar mensaje de éxito
        enqueueSnackbar('Usuario actualizado correctamente', { variant: 'success' });

        // Recargar la lista de usuarios para reflejar los cambios
        await loadUsers();
      } catch (error: any) {
        setError(`Error al actualizar el usuario: ${error?.message || 'Error desconocido'}`);
      }
    } catch (error: any) {
      setError(`Error inesperado: ${error?.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abrir diÃ¡logo de confirmación para eliminar usuario
   */
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    // NO llamamos handleMenuClose() aquí para mantener selectedUser
    setAnchorEl(null); // Solo cerramos el menú, pero mantenemos selectedUser
  };

  /**
   * Cerrar diálogo de confirmación para eliminar usuario
   */
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    // NO limpiar selectedUser aquí - se limpiarán después de la eliminación exitosa
  };

  /**
   * Cancelar eliminación de usuario
   */
  const handleCancelDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null); // Limpiar selectedUser al cancelar
  };

  /**
   * Manejar eliminación de usuario
   */
  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      setError(null); // Limpiar errores previos
      setLoading(true); // Mostrar indicador de carga

      // Extraer el valor del ID correctamente (puede ser un objeto UserId o un string)
      const userIdValue: string =
        typeof selectedUser.id === 'string' ? selectedUser.id : selectedUser.id.value;

      if (!userIdValue) {
        throw new Error('ID de usuario no vÃ¡lido');
      }

      // Usar el hook useUsers para eliminar el usuario
      await deleteUser(userIdValue);

      // Recargar la lista de usuarios
      await loadUsers();

      handleCloseDeleteDialog(); // Cerrar el diálogo de confirmación
      setSelectedUser(null); // Limpiar selectedUser después de eliminación exitosa
      enqueueSnackbar('Usuario eliminado correctamente', { variant: 'success' });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: UserDisplay) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // NO limpiar selectedUser aquí - se mantiene hasta que se complete la acción
  };

  // Manejador para cambio de tabs en el modal
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDialogTab(newValue);
  };

  // Funciones de ordenamiento
  const handleSort = (
    column: 'name' | 'email' | 'userTypeName' | 'firstRoleName' | 'status' | 'createdAt'
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (
    column: 'name' | 'email' | 'userTypeName' | 'firstRoleName' | 'status' | 'createdAt'
  ) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? (
      <ArrowUpward fontSize="small" />
    ) : (
      <ArrowDownward fontSize="small" />
    );
  };

  const handleOpenDialog = async (mode: 'create' | 'edit' | 'view', user?: UserDisplay) => {
    setDialogMode(mode);
    setFormErrors({}); // Limpiar errores de validación

    if (user) {
      if (mode === 'view' || mode === 'edit') {
        // En modo 'view' o 'edit', SIEMPRE obtener la información completa del usuario desde el backend

        const fullUser = await getUserById(typeof user.id === 'string' ? user.id : user.id.value);

        // Extraer los IDs de los roles del usuario completo
        const userRoleIds = fullUser.roleIds || [];

        // Extraer el email correctamente (puede ser un objeto con propiedad value o un string)
        const emailValue =
          typeof fullUser.email === 'string' ? fullUser.email : (fullUser.email?.value ?? '');

        setFormData({
          name: fullUser.name || '',
          email: emailValue,
          password: '', // No mostrar password en visualización/edición
          image: fullUser.image || '',
          phone: fullUser.phone || '',
          address: fullUser.address || '',
          userTypeId:
            typeof fullUser.userTypeId === 'string'
              ? fullUser.userTypeId
              : fullUser.userTypeId?.value || '',
          roleIds: userRoleIds, // Cargar los roles reales del usuario completo
          status: typeof fullUser.status === 'boolean' ? fullUser.status : true,
          additionalData: {
            additionalProp1: '',
            additionalProp2: '',
            additionalProp3: '',
          },
        });
        setSelectedUser({
          ...fullUser,
          id: fullUser.id,
          company: fullUser.userTypeName || '',
          role: fullUser.firstRoleName || 'Sin rol',
          firstRoleName: fullUser.firstRoleName || 'Sin rol',
          lastLogin:
            (fullUser.lastLogin ? fullUser.lastLogin.toISOString() : undefined) ||
            (fullUser.updatedAt ? fullUser.updatedAt.toISOString() : undefined),
        } as unknown as UserDisplay);
      }
    } else {
      // Modo 'create'
      setFormData({
        name: '',
        email: '',
        password: '',
        image: '',
        phone: '',
        address: '',
        userTypeId: '',
        roleIds: [],
        status: true, // true = Activo por defecto
        additionalData: {
          additionalProp1: '',
          additionalProp2: '',
          additionalProp3: '',
        },
      });
    }
    setDialogTab(0); // Reset to first tab
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    // Si no se creÃ³ un usuario exitosamente, limpiar el filtro de bÃºsqueda
    if (!userCreatedSuccessfully) {
      setSearchTerm('');
    }

    setOpenDialog(false);
    setSelectedUser(null);
    setUserCreatedSuccessfully(false); // Resetear el estado para la prÃ³xima vez
    setDialogTab(0); // Reset to first tab
    setTempDynamicFields({}); // Limpiar campos dinÃ¡micos temporales
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};


    if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    // El formulario usa string para email; tomar el valor directamente
    const emailValue = formData.email;


    if (!emailValue || typeof emailValue !== 'string' || !emailValue.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = 'El email no tiene un formato vÃ¡lido';
    } else {
    }

    if (!formData.userTypeId) {
      errors.userTypeId = 'El tipo de usuario es requerido';
    }

    if (formData.roleIds.length === 0) {
      errors.roleIds = 'Debe seleccionar al menos un rol';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }


    if (dialogMode === 'create') {
      await handleCreateUser();
    } else if (dialogMode === 'edit') {
      await handleUpdateUser();
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'success' : 'error';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle /> : <Cancel />;
  };

  // Mapear usuarios del hook DDD al formato del frontend
  const mappedUsers: UserDisplay[] = dddUsers.map(
    (user) =>
      ({
        ...user,
        id: user.id, // Mantener UserId VO
        name: user.name || 'Sin nombre',
        email: typeof user.email === 'string' ? user.email : user.email?.value || 'Sin email',
        phone: user.phone || '',
        image: user.image || '',
        status: user.status ?? true,
        address: user.address || '',
        company: user.userTypeName || '',
        userTypeName: user.userTypeName || '',
        role: user.firstRoleName || 'Sin rol',
        firstRoleName: user.firstRoleName || 'Sin rol',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin:
          (user.lastLogin ? user.lastLogin.toISOString() : undefined) ||
          (user.updatedAt ? user.updatedAt.toISOString() : undefined),
      }) as unknown as UserDisplay
  );

  // Aplicar ordenamiento si estÃ¡ configurado
  const sortedUsers = sortBy
    ? [...mappedUsers].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
            break;
          case 'email':
            aValue =
              (a as any).email?.toLowerCase?.() ?? (a as any).email?.value?.toLowerCase?.() ?? '';
            bValue =
              (b as any).email?.toLowerCase?.() ?? (b as any).email?.value?.toLowerCase?.() ?? '';
            break;
          case 'userTypeName':
            aValue = a.userTypeName?.toLowerCase() || '';
            bValue = b.userTypeName?.toLowerCase() || '';
            break;
          case 'firstRoleName':
            aValue = a.firstRoleName?.toLowerCase() || '';
            bValue = b.firstRoleName?.toLowerCase() || '';
            break;
          case 'status':
            aValue = a.status ? 1 : 0;
            bValue = b.status ? 1 : 0;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : mappedUsers;

  // Los usuarios ya vienen paginados del backend
  const paginatedUsers = sortedUsers;

  return (
    <Box sx={{ flexGrow: 1, pt: 1, px: 3, pb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => handleOpenDialog('create')}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Box>

      {/* Mostrar errores */}
      {dddError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {dddError}
        </Alert>
      )}

      {/* Filtros y tabla de usuarios */}
      <Card>
        <CardContent>
          {/* Filtros */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Buscar usuarios..."
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
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Usuario</InputLabel>
                <Select
                  value={userTypeFilter}
                  label="Tipo de Usuario"
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  {userTypes && Array.isArray(userTypes)
                    ? userTypes.map((userType) => (
                        <MenuItem key={userType.id} value={userType.id}>
                          {userType.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={roleFilter}
                  label="Rol"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  {roles && Array.isArray(roles)
                    ? roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setUserTypeFilter('Todos');
                  setRoleFilter('Todos');
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>

          {/* Tabla */}
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('name')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Usuario
                      {getSortIcon('name')}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('email')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Contacto
                      {getSortIcon('email')}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('userTypeName')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Tipo de Usuario
                      {getSortIcon('userTypeName')}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('firstRoleName')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Rol Principal
                      {getSortIcon('firstRoleName')}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                  >
                    Dirección
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('status')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Estado
                      {getSortIcon('status')}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight: 600,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                    }}
                    onClick={() => handleSort('createdAt')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Fechas
                      {getSortIcon('createdAt')}
                    </Box>
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
                {dddLoading ? (
                  <TableRow key="loading">
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Cargando usuarios...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow key="no-users">
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        No se encontraron usuarios
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={
                        typeof user.id === 'string'
                          ? user.id
                          : (user.id as any)?.value || `user-${index}`
                      }
                      hover
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={
                              user.image &&
                              typeof user.image === 'string' &&
                              user.image.trim() !== ''
                                ? user.image
                                : undefined
                            }
                            sx={{
                              mr: 2,
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.name && user.name.length > 0
                              ? user.name.charAt(0).toUpperCase()
                              : '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.id ? String(user.id).slice(-6) : 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {typeof user.email === 'string'
                                ? user.email
                                : (user.email as any)?.value || ''}
                            </Typography>
                          </Box>
                          {user.phone && (
                            <Box display="flex" alignItems="center">
                              <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{user.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={user.userTypeName}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={user.firstRoleName || 'Sin rol'}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {user.address || 'No especificada'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={(user.status ?? false) ? 'Activo' : 'Inactivo'}
                          size="small"
                          color={getStatusColor(user.status ?? false) as any}
                          icon={getStatusIcon(user.status ?? false)}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            <strong>Creado:</strong> {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                          {user.updatedAt && (
                            <Typography variant="caption" color="textSecondary" display="block">
                              <strong>Actualizado:</strong>{' '}
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Tooltip title="MÃ¡s opciones">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, user)}
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PaginaciÃ³n */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Pagination
              count={dddPagination.totalPages}
              page={dddPagination.currentPage}
              onChange={(_, newPage) => loadUsers(newPage, dddPagination.pageSize)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* MenÃº contextual */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleOpenDialog('view', selectedUser!);
          }}
        >
          <Visibility sx={{ mr: 1 }} /> Ver Detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleOpenDialog('edit', selectedUser!);
          }}
        >
          <Edit sx={{ mr: 1 }} /> Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleOpenDeleteDialog();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog para crear/editar/ver usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Nuevo Usuario'}
          {dialogMode === 'edit' && 'Editar Usuario'}
          {dialogMode === 'view' && 'Detalles del Usuario'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={dialogTab} onChange={handleTabChange} aria-label="user configuration tabs">
              <Tab label="InformaciÃ³n General" />
              <Tab label="Campos DinÃ¡micos" />
            </Tabs>
          </Box>

          <TabPanel value={dialogTab} index={0}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={dialogMode === 'view'}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={dialogMode === 'view'}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  autoComplete="off"
                  inputProps={{
                    autoComplete: 'new-password', // Truco para deshabilitar autocompletado
                  }}
                />
              </Grid>
              {dialogMode === 'create' && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="ContraseÃ±a"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={!!formErrors.password}
                    helperText={formErrors.password || 'MÃ­nimo 6 caracteres'}
                    autoComplete="new-password"
                    inputProps={{
                      autoComplete: 'new-password',
                    }}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="TelÃ©fono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="URL de Imagen"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {dialogMode === 'view' ? (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tipo de Usuario
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.userTypeId ? (
                        (() => {
                          const userType = userTypes.find((ut) => ut.id === formData.userTypeId);
                          return userType ? (
                            <Chip
                              label={userType.name}
                              variant="outlined"
                              size="small"
                              color="secondary"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              Tipo de usuario no encontrado
                            </Typography>
                          );
                        })()
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Sin tipo de usuario asignado
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <FormControl fullWidth error={!!formErrors.userTypeId}>
                    <InputLabel>Tipo de Usuario</InputLabel>
                    <Select
                      value={formData.userTypeId}
                      label="Tipo de Usuario"
                      onChange={(e) => setFormData({ ...formData, userTypeId: e.target.value })}
                    >
                      {userTypes && Array.isArray(userTypes)
                        ? userTypes.map((userType) => (
                            <MenuItem key={userType.id} value={userType.id}>
                              {userType.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                    {formErrors.userTypeId && (
                      <FormHelperText>{formErrors.userTypeId}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {dialogMode === 'view' ? (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Roles
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.roleIds.length > 0 ? (
                        formData.roleIds.map((roleId) => {
                          const role = roles.find((r) => r.id === roleId);
                          return role ? (
                            <Chip
                              key={roleId}
                              label={role.name}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          ) : null;
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Sin roles asignados
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <FormControl fullWidth error={!!formErrors.roleIds}>
                    <InputLabel>Roles</InputLabel>
                    <Select
                      multiple
                      value={formData.roleIds}
                      label="Roles"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          roleIds:
                            typeof e.target.value === 'string'
                              ? e.target.value.split(',')
                              : e.target.value,
                        })
                      }
                    >
                      {roles && Array.isArray(roles)
                        ? roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                    {formErrors.roleIds && <FormHelperText>{formErrors.roleIds}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status}
                        onChange={(e) => {
                          if (dialogMode !== 'view') {
                            setFormData({ ...formData, status: e.target.checked });
                          }
                        }}
                        disabled={dialogMode === 'view'}
                        color="success"
                      />
                    }
                    label=""
                  />
                  <Chip
                    label={formData.status ? 'Activo' : 'Inactivo'}
                    color={formData.status ? 'success' : 'error'}
                    variant="filled"
                    icon={formData.status ? <CheckCircle /> : <Cancel />}
                    sx={{
                      fontWeight: 'medium',
                      opacity: dialogMode === 'view' ? 0.7 : 1,
                    }}
                  />
                </Box>
                {dialogMode !== 'view' && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Usa el interruptor para cambiar entre Activo e Inactivo
                  </Typography>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={dialogTab} index={1}>
            {dialogMode === 'create' ? (
              <TempUserFieldsManager
                dynamicFields={tempDynamicFields}
                onFieldsChange={setTempDynamicFields}
              />
            ) : (
              selectedUser && (
                <UserFieldsManager
                  userId={
                    typeof selectedUser.id === 'string'
                      ? selectedUser.id
                      : (selectedUser.id as any)?.value
                  }
                />
              )
            )}
          </TabPanel>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{
              minWidth: 120,
              fontWeight: 'medium',
            }}
          >
            {dialogMode === 'view' ? 'Cerrar' : 'Cancelar'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={() => {
                handleSaveUser();
              }}
              variant="contained"
              sx={{
                minWidth: 120,
                fontWeight: 'medium',
              }}
            >
              {dialogMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* DiÃ¡logo de confirmaciÃ³n para eliminar usuario */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Confirmar eliminaciÃ³n
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Â¿EstÃ¡ seguro que desea eliminar al usuario <strong>{selectedUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error">
            Esta acciÃ³n no se puede deshacer y eliminarÃ¡ permanentemente todos los datos del
            usuario.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDeleteDialog}
            variant="outlined"
            disabled={dddLoading}
            startIcon={<Cancel />}
            sx={{
              minWidth: 120,
              fontWeight: 'medium',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={dddLoading}
            startIcon={dddLoading ? <CircularProgress size={16} /> : <Delete />}
          >
            {dddLoading ? 'Eliminando...' : 'Eliminar Usuario'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
