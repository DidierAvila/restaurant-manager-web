# Admin Module - Domain-Driven Design (DDD) Architecture

Este módulo ha sido migrado a una arquitectura basada en Domain-Driven Design (DDD) para mejorar la mantenibilidad, escalabilidad y separación de responsabilidades.

## Documentación Completa

Para documentación detallada del módulo admin, consulta:
- **[Documentación Principal](../../docs/admin/README.md)** - Guía completa del módulo
- **[Gestión de Usuarios](../../docs/admin/USERS.md)** - CRUD de usuarios y campos dinámicos
- **[Gestión de Roles](../../docs/admin/ROLES.md)** - Sistema de roles y asignación de permisos
- **[Gestión de Permisos](../../docs/admin/PERMISSIONS.md)** - Sistema RBAC completo
- **[Gestión de Tipos de Usuario](../../docs/admin/USER_TYPES.md)** - Configuración de tipos y campos personalizados

## Estructura del Módulo

```
src/modules/admin/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades del dominio
│   ├── value-objects/     # Objetos de valor
│   └── repositories/      # Interfaces de repositorios
├── application/           # Capa de Aplicación
│   └── use-cases/        # Casos de uso
├── infrastructure/        # Capa de Infraestructura
│   ├── repositories/     # Implementaciones de repositorios
│   └── adapters/         # Adaptadores para APIs externas
├── presentation/          # Capa de Presentación
│   ├── hooks/            # React hooks
│   └── components/       # Componentes de UI
├── components/           # Componentes legacy (compatibilidad)
└── services/            # Servicios legacy (compatibilidad)
```

## Capas de la Arquitectura

### 1. Domain Layer (Dominio)
Contiene la lógica de negocio pura, independiente de frameworks y tecnologías externas.

- **Entities**: Objetos con identidad única (User, Role)
- **Value Objects**: Objetos inmutables sin identidad (Email, UserId, RoleId)
- **Repository Interfaces**: Contratos para acceso a datos

### 2. Application Layer (Aplicación)
Contiene los casos de uso que orquestan la lógica de negocio.

- **Use Cases**: Operaciones específicas del negocio (CreateUser, UpdateRole, etc.)

### 3. Infrastructure Layer (Infraestructura)
Implementa los detalles técnicos y dependencias externas.

- **Repository Implementations**: Implementaciones concretas de los repositorios
- **API Adapters**: Transformadores de datos entre API y dominio

### 4. Presentation Layer (Presentación)
Contiene la interfaz de usuario y la lógica de presentación.

- **Hooks**: React hooks que encapsulan la lógica de estado
- **Components**: Componentes de React para la UI

## Cómo Usar la Nueva Arquitectura

### Usando los Hooks

```typescript
import { useUsers } from '@/modules/admin/presentation/hooks/useUsers';

const MyComponent = () => {
  const {
    users,
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  // Usar las funciones y estado según sea necesario
};
```

### Usando los Componentes

```typescript
import { UsersList, RolesList } from '@/modules/admin/presentation/components';

const AdminPage = () => {
  return (
    <div>
      <UsersList />
      <RolesList />
    </div>
  );
};
```

### Acceso Directo a Use Cases (Avanzado)

```typescript
import {
  CreateUserUseCase,
  GetUsersUseCase
} from '@/modules/admin/application/use-cases';
import { ApiUserRepository } from '@/modules/admin/infrastructure/repositories';

// Crear instancias
const userRepository = new ApiUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

// Usar el caso de uso
await createUserUseCase.execute({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  userTypeId: '1'
});
```

## Beneficios de la Nueva Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Testabilidad**: Fácil de testear cada capa por separado
3. **Mantenibilidad**: Código más organizado y fácil de mantener
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Independencia de Frameworks**: La lógica de negocio no depende de React o APIs específicas

## Migración Gradual

Durante la migración, se mantienen los exports legacy para compatibilidad:

```typescript
// Nuevo (recomendado)
import { useUsers } from '@/modules/admin/presentation/hooks';

// Legacy (migrado a hooks)
import { userTypesService } from '@/modules/admin/presentation/hooks';
```

## Próximos Pasos

1. Migrar componentes existentes para usar los nuevos hooks
2. Actualizar tests para usar la nueva arquitectura
3. Remover código legacy una vez completada la migración
4. Agregar más casos de uso según sea necesario

## Ejemplos de Uso

Ver los componentes de ejemplo en:
- `presentation/components/users/UsersList.tsx`
- `presentation/components/roles/RolesList.tsx`

Estos componentes muestran cómo integrar la nueva arquitectura DDD en componentes de React.