# Módulo Shared

## Descripción

El módulo **Shared** contiene código reutilizable entre los diferentes módulos del sistema (Admin, Platform, Reports). Incluye componentes de UI, contextos globales, hooks personalizados, servicios comunes y utilidades compartidas.

## Objetivo

Promover la reutilización de código y mantener consistencia en toda la aplicación, evitando duplicación y facilitando el mantenimiento.

## Estructura del Módulo

```
shared/
├── application/         # Capa de Aplicación
│   └── services/       # Servicios compartidos de aplicación
│       └── api.ts      # Cliente API configurado
├── domain/             # Capa de Dominio
│   ├── entities/       # Entidades compartidas
│   │   └── auth/      # Entidades de autenticación
│   └── utils/          # Utilidades de dominio
├── infrastructure/     # Capa de Infraestructura
│   └── auth/          # Servicios de autenticación
│       ├── authService.ts
│       └── sessionManager.ts
└── presentation/       # Capa de Presentación
    ├── components/     # Componentes React compartidos
    │   ├── auth/      # Componentes de autenticación
    │   ├── layout/    # Componentes de layout
    │   ├── profile/   # Componentes de perfil
    │   ├── providers/ # Providers de contexto
    │   └── ui/        # Componentes de UI base
    ├── contexts/       # Contextos de React
    │   ├── UserContext.tsx
    │   └── NotificationContext.tsx
    └── hooks/          # Custom hooks compartidos
        ├── useAuth.ts
        ├── useNotification.ts
        └── useSession.ts
```

## Componentes de Presentación

### Layout

**MainLayout**
Layout principal de la aplicación con navegación y sidebar.

```typescript
<MainLayout>
  <YourPageContent />
</MainLayout>
```

**Sidebar**
Barra lateral de navegación con menú dinámico basado en permisos.

**AppBar**
Barra superior con logo, notificaciones y perfil de usuario.

**Footer**
Pie de página de la aplicación.

### UI Components

**LoadingSpinner**
Indicador de carga reutilizable.

```typescript
<LoadingSpinner size="medium" />
```

**ErrorMessage**
Componente para mostrar mensajes de error.

```typescript
<ErrorMessage message="Error al cargar datos" />
```

**ConfirmDialog**
Diálogo de confirmación reutilizable.

```typescript
const { confirmDialog } = useConfirmDialog();

const handleDelete = async () => {
  const confirmed = await confirmDialog({
    title: '¿Eliminar usuario?',
    message: 'Esta acción no se puede deshacer',
  });

  if (confirmed) {
    // Proceder con eliminación
  }
};
```

**DataTable**
Tabla de datos configurable basada en Material-UI DataGrid.

```typescript
<DataTable
  rows={data}
  columns={columns}
  loading={loading}
  onRowClick={handleRowClick}
/>
```

**FormField**
Campo de formulario con validación integrada.

```typescript
<FormField
  name="email"
  label="Email"
  type="email"
  required
  validation={(value) => isValidEmail(value)}
/>
```

**SearchBar**
Barra de búsqueda con debounce.

```typescript
<SearchBar
  placeholder="Buscar usuarios..."
  onSearch={handleSearch}
  debounceMs={300}
/>
```

### Auth Components

**LoginForm**
Formulario de inicio de sesión.

**RegisterForm**
Formulario de registro.

**ProtectedRoute**
Componente que protege rutas según permisos.

```typescript
<ProtectedRoute requiredPermission="users:read">
  <UserList />
</ProtectedRoute>
```

**AuthGuard**
Guard de autenticación para páginas.

### Profile Components

**ProfileView**
Vista de perfil de usuario.

**ProfileEdit**
Formulario de edición de perfil.

**ChangePassword**
Formulario de cambio de contraseña.

## Contextos

### UserContext

Proporciona información del usuario autenticado en toda la aplicación.

```typescript
const { user, isAuthenticated, loading, updateUser } = useUserContext();
```

**Propiedades**:
- `user`: Usuario autenticado actual
- `isAuthenticated`: Boolean indicando si está autenticado
- `loading`: Boolean indicando si está cargando
- `updateUser`: Función para actualizar información del usuario
- `logout`: Función para cerrar sesión

### NotificationContext

Maneja notificaciones toast en la aplicación.

```typescript
const { showNotification } = useNotification();

showNotification('Usuario creado exitosamente', 'success');
showNotification('Error al guardar', 'error');
```

**Tipos de notificación**:
- `success`: Operación exitosa
- `error`: Error en operación
- `warning`: Advertencia
- `info`: Información general

## Hooks Personalizados

### useAuth

Proporciona funcionalidad de autenticación.

```typescript
const {
  login,
  logout,
  register,
  isAuthenticated,
  user,
  loading,
} = useAuth();

await login({ email, password });
await register({ name, email, password });
await logout();
```

### useNotification

Muestra notificaciones toast.

```typescript
const { showNotification, showSuccess, showError, showWarning } = useNotification();

showSuccess('Operación exitosa');
showError('Error en la operación');
showWarning('Ten cuidado');
```

### useSession

Maneja la sesión del usuario.

```typescript
const { session, refreshSession, clearSession } = useSession();
```

### useDebounce

Implementa debounce para búsquedas.

```typescript
const debouncedValue = useDebounce(searchTerm, 500);

useEffect(() => {
  // Buscar con debouncedValue
}, [debouncedValue]);
```

### useLocalStorage

Maneja datos en localStorage.

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

### usePermissions

Verifica permisos del usuario.

```typescript
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

if (hasPermission('users:write')) {
  // Mostrar botón de editar
}
```

### usePagination

Maneja paginación de listas.

```typescript
const {
  page,
  pageSize,
  totalPages,
  goToPage,
  nextPage,
  previousPage,
  setPageSize,
} = usePagination({ totalItems, initialPageSize: 10 });
```

### useForm

Maneja estado y validación de formularios.

```typescript
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  resetForm,
} = useForm({
  initialValues,
  validationSchema,
  onSubmit,
});
```

## Servicios

### API Service

Cliente API configurado con interceptores.

```typescript
import { apiClient } from '@/modules/shared/application/services/api';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', userData);

// PUT request
await apiClient.put(`/users/${id}`, userData);

// DELETE request
await apiClient.delete(`/users/${id}`);
```

**Características**:
- Interceptores para autenticación automática
- Manejo de errores centralizado
- Retry automático en caso de falla
- Timeout configurable

### Auth Service

Servicio de autenticación.

```typescript
import { authService } from '@/modules/shared/infrastructure/auth/authService';

await authService.login(email, password);
await authService.logout();
const isValid = await authService.validateSession();
const token = authService.getToken();
```

### Session Manager

Maneja tokens y sesiones.

```typescript
import { sessionManager } from '@/modules/shared/infrastructure/auth/sessionManager';

sessionManager.setToken(token);
const token = sessionManager.getToken();
sessionManager.clearSession();
const isExpired = sessionManager.isTokenExpired();
```

## Utilidades

### Date Utils

```typescript
import { formatDate, parseDate, isValidDate } from '@/modules/shared/domain/utils/date';

const formatted = formatDate(new Date(), 'DD/MM/YYYY');
const date = parseDate('2024-11-25');
```

### String Utils

```typescript
import { capitalize, truncate, slugify } from '@/modules/shared/domain/utils/string';

const title = capitalize('hello world'); // "Hello World"
const short = truncate('Long text...', 10); // "Long text..."
const slug = slugify('Hello World!'); // "hello-world"
```

### Validation Utils

```typescript
import { isValidEmail, isValidPhone, isValidURL } from '@/modules/shared/domain/utils/validation';

if (isValidEmail(email)) {
  // Email válido
}
```

### Number Utils

```typescript
import { formatCurrency, formatNumber } from '@/modules/shared/domain/utils/number';

const price = formatCurrency(1000000); // "$1,000,000"
const num = formatNumber(1234.56); // "1,234.56"
```

## Tipos Compartidos

### Auth Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

interface Session {
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}
```

### UI Types

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}
```

## Providers

### ThemeProvider

Proporciona tema de Material-UI.

```typescript
<ThemeProvider>
  <App />
</ThemeProvider>
```

### AuthProvider

Proporciona contexto de autenticación.

```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

### NotificationProvider

Proporciona contexto de notificaciones.

```typescript
<NotificationProvider>
  <App />
</NotificationProvider>
```

## Uso en Otros Módulos

### Importar Componentes

```typescript
import { LoadingSpinner, ErrorMessage } from '@/modules/shared/presentation/components/ui';
import { MainLayout } from '@/modules/shared/presentation/components/layout';
```

### Importar Hooks

```typescript
import { useAuth, useNotification } from '@/modules/shared/presentation/hooks';
```

### Importar Servicios

```typescript
import { apiClient } from '@/modules/shared/application/services/api';
```

### Importar Utilidades

```typescript
import { formatDate, formatCurrency } from '@/modules/shared/domain/utils';
```

## Convenciones

1. **Componentes**: Deben ser genéricos y reutilizables
2. **Hooks**: Deben encapsular lógica reutilizable
3. **Utilidades**: Deben ser funciones puras sin efectos secundarios
4. **Servicios**: Deben tener interfaces claras y bien documentadas

## Testing

Los componentes y utilidades shared deben tener alta cobertura de tests ya que son usados en múltiples módulos.

```
src/modules/shared/
├── presentation/
│   ├── components/
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx
│   │       └── __tests__/
│   │           └── LoadingSpinner.test.tsx
│   └── hooks/
│       ├── useAuth.ts
│       └── __tests__/
│           └── useAuth.test.ts
```

## Agregar Nuevos Elementos

### Agregar Componente Compartido

1. Crear componente en `presentation/components/{category}/`
2. Escribir tests
3. Exportar en `presentation/components/index.ts`
4. Documentar en este README

### Agregar Hook Compartido

1. Crear hook en `presentation/hooks/`
2. Escribir tests
3. Exportar en `presentation/hooks/index.ts`
4. Documentar en este README

### Agregar Utilidad

1. Crear función en `domain/utils/`
2. Escribir tests
3. Exportar en `domain/utils/index.ts`
4. Documentar en este README

## Principios

- **DRY**: No duplicar código entre módulos
- **SOLID**: Seguir principios de diseño orientado a objetos
- **Testeable**: Alto nivel de cobertura de tests
- **Documentado**: Código claro y bien documentado
- **Genérico**: Evitar lógica específica de módulos

## Próximos Desarrollos

- [ ] Implementar tema dark mode
- [ ] Agregar más componentes de UI reutilizables
- [ ] Implementar internacionalización (i18n)
- [ ] Agregar más hooks de utilidad
- [ ] Mejorar tipado con TypeScript genéricos

## Referencias

- [Arquitectura DDD](../../../docs/ARQUITECTURA_DDD.md)
- [Guía de Desarrollo](../../../docs/GUIA_DESARROLLO.md)
- [Estándares de Código](../../../docs/ESTANDARES_CODIGO.md)

---

**Última actualización**: Noviembre 2024
