# El Buen Sazón - Web Frontend

Aplicación web frontend para el sistema de gestión del restaurante **El Buen Sazón**.

Construida con Next.js, TypeScript, Material UI v7 y arquitectura modular inspirada en Domain-Driven Design (DDD).

## Documentación

### General

- [Arquitectura DDD](./docs/ARQUITECTURA_DDD.md) - Arquitectura Domain-Driven Design del proyecto.
- [Arquitectura Modular](./arquitectura_modular.md) - Organización por módulos.
- [Guía de Desarrollo](./docs/GUIA_DESARROLLO.md) - Guía para nuevos desarrolladores.
- [Estándares de Código](./docs/ESTANDARES_CODIGO.md) - Convenciones y buenas prácticas.
- [Configuración del Módulo Restaurante](./RESTAURANT_MODULE_SETUP.md) - Detalles del módulo principal.

### Módulos

- [Documentación Admin](./docs/admin/README.md) - Guía del módulo administrativo.
- [Gestión de Usuarios](./docs/admin/USERS.md) - CRUD de usuarios y campos dinámicos.
- [Gestión de Roles](./docs/admin/ROLES.md) - Sistema de roles.
- [Gestión de Permisos](./docs/admin/PERMISSIONS.md) - Sistema RBAC.
- [Gestión de Tipos de Usuario](./docs/admin/USER_TYPES.md) - Configuración de tipos y campos.

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 15.5.2 | Framework principal con App Router |
| React | 19.1.1 | UI base |
| TypeScript | 5.9.2 | Tipado estático |
| Material UI | 7.3.2 | Componentes de interfaz |
| MUI X Data Grid | 8.11.0 | Tablas de datos con paginación servidor |
| MUI Icons | 7.3.2 | Iconografía (incluye íconos de restaurante) |
| NextAuth.js | 4.24.11 | Autenticación con credenciales |
| React Hook Form | 7.63.0 | Manejo de formularios |
| date-fns | 4.1.0 | Manejo de fechas |
| Notistack | 3.0.2 | Notificaciones |

## Requisitos Previos

- Node.js 18 o superior.
- npm.
- Backend de El Buen Sazón ejecutándose en `https://localhost:7044`.

## Instalación

1. Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd restaurant-manager-web
```

2. Instala dependencias:

```bash
npm install
```

3. Crea el archivo `.env.local` en la raíz del proyecto:

```env
# URL del backend
NEXT_PUBLIC_API_URL=https://localhost:7044
NEXT_PUBLIC_BACKEND_API_URL=https://localhost:7044

# Puerto del servidor de desarrollo
PORT=3001

# Entorno
NEXT_PUBLIC_ENVIRONMENT=development

# Necesario para aceptar el certificado SSL autofirmado del backend en desarrollo
NODE_TLS_REJECT_UNAUTHORIZED=0

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=[GENERAR_CON: openssl rand -base64 32]
JWT_SECRET=[MISMO_SECRETO_QUE_EL_BACKEND]
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`.

> **Importante:** Al cambiar variables en `.env.local`, reinicia el servidor con `rm -rf .next && npm run dev` para que Next.js recompile el bundle con los nuevos valores.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3001 |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia el servidor de producción |
| `npm run type-check` | Valida tipos de TypeScript |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige problemas de ESLint automáticamente |
| `npm run format` | Formatea archivos con Prettier |
| `npm run format:check` | Verifica el formato sin modificar archivos |
| `npm run check-all` | Ejecuta type-check, lint y format:check |

## Estructura del Proyecto

```text
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # Handler de NextAuth (GET + POST)
│   │   │   └── me/               # Proxy al endpoint /Auth/me del backend
│   │   └── backend/              # Proxy genérico al backend
│   ├── auth/
│   │   └── signin/               # Página de inicio de sesión
│   ├── dashboard/                # Dashboard principal
│   ├── profile/                  # Perfil de usuario
│   ├── restaurant/               # Rutas del módulo restaurante
│   │   ├── dishes/               # Gestión de platos
│   │   ├── orders/               # Gestión de pedidos
│   │   └── reports/              # Reportes de ventas
│   ├── unauthorized/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                   # Configuración de NextAuth (solo credenciales)
│   ├── ssl-config.ts             # fetch con soporte SSL autofirmado
│   └── cookieUtils.ts
├── middleware.ts                 # Protección de rutas y redirecciones
└── modules/
    ├── admin/                    # Módulo administrativo
    │   ├── application/
    │   ├── domain/
    │   ├── infrastructure/
    │   └── presentation/
    ├── restaurant/               # Módulo principal del restaurante
    │   ├── application/          # Casos de uso (platos, pedidos, reportes)
    │   ├── domain/               # Entidades y value objects
    │   │   └── entities/         # Dish, Order, OrderItem, SalesReport...
    │   ├── infrastructure/
    │   │   └── adapters/         # DishApiAdapter, OrderApiAdapter
    │   └── presentation/
    │       ├── components/       # DishDataGrid, OrderDataGrid, SalesReportView
    │       ├── hooks/            # useDishes, useOrders, useReports
    │       └── pages/
    └── shared/                   # Transversal a todos los módulos
        ├── application/
        │   └── services/         # ApiService, AuthService, backendApiService
        ├── domain/
        ├── infrastructure/
        └── presentation/
            ├── components/
            │   └── layout/       # MainLayout con sidebar y navegación dinámica
            ├── contexts/         # UserContext, SessionContext
            └── hooks/            # useAuth, useApiAuth, useEnhancedUser
```

## Módulo Restaurante

El módulo `restaurant` contiene las funcionalidades principales del sistema:

- **Gestión de platos**: CRUD completo con filtros por categoría, disponibilidad y paginación servidor.
- **Gestión de pedidos**: Creación, edición, avance de estado y eliminación con paginación servidor.
- **Detalle de pedidos**: Agregar y remover ítems por pedido.
- **Reportes de ventas**: Ventas por categoría, por plato, pedidos por estado y métricas generales.

Rutas:

| Ruta | Descripción |
|---|---|
| `/restaurant/dishes` | Gestión de platos |
| `/restaurant/orders` | Gestión de pedidos |
| `/restaurant/reports` | Reportes de ventas |

### Iconos del módulo en el menú

El `MainLayout` resuelve íconos dinámicamente desde la configuración de navegación del backend. Claves disponibles para el módulo restaurante:

| Clave | Ícono |
|---|---|
| `Restaurant`, `restaurant`, `restaurante` | RestaurantIcon |
| `DinnerDining`, `DinnerDiningIcon`, `dinner-dining` | DinnerDiningIcon |
| `MenuBook`, `MenuBookIcon`, `menu-book`, `carta` | MenuBookIcon |
| `dishes`, `platos` | FastfoodIcon |
| `menu` | RestaurantMenuIcon |
| `orders`, `pedidos` | ReceiptIcon |
| `sales-report`, `reporte-ventas` | AssessmentIcon |

## Módulo Administrativo

El módulo `admin` gestiona la configuración operativa del sistema:

- Usuarios y campos dinámicos.
- Roles y permisos (RBAC).
- Tipos de usuario.
- Dashboard administrativo.

## Usuarios por Defecto

El sistema incluye dos usuarios de prueba precargados en el backend:

| Usuario | Contraseña | Rol |
|---|---|---|
| admin@gmail.com | admin123 | Administrador |
| usuario@gmail.com | usuario123 | Empleado |

> Estos usuarios son solo para entornos de desarrollo y pruebas. Deben ser removidos o cambiados antes de pasar a producción.

## Autenticación

El sistema utiliza **NextAuth.js v4** con autenticación por credenciales (email/contraseña):

1. El frontend envía credenciales al provider `credentials` de NextAuth.
2. NextAuth llama al backend: `POST https://localhost:7044/Api/Auth/Login`.
3. El backend devuelve un JWT que se decodifica para extraer los datos del usuario.
4. NextAuth crea una sesión con el token almacenado en cookie `auth.s` (httpOnly, 1 hora).
5. El middleware protege todas las rutas excepto `/auth/signin` y `/unauthorized`.

> Los proveedores OAuth (Google, Facebook, Microsoft, LinkedIn) están desactivados. Solo está activo el login con credenciales.

## API Backend

La aplicación se conecta al backend en `https://localhost:7044`. Todos los servicios leen la URL base desde `NEXT_PUBLIC_BACKEND_API_URL`.

Endpoints principales del módulo restaurante:

```text
GET    /api/Dishes
GET    /api/Dishes/{id}
GET    /api/Dishes/available
POST   /api/Dishes
PUT    /api/Dishes/{id}
DELETE /api/Dishes/{id}
PATCH  /api/Dishes/{id}/toggle-availability

GET    /api/Orders
GET    /api/Orders/{id}
POST   /api/Orders
PUT    /api/Orders/{id}
DELETE /api/Orders/{id}
POST   /api/Orders/{orderId}/items
DELETE /api/Orders/{orderId}/items/{itemId}
PATCH  /api/Orders/{id}/advance-status

GET    /api/Auth/Login (POST)
GET    /api/Auth/me
GET    /api/Auth/Roles
GET    /api/Auth/Permissions/dropdown
```

## Compatibilidad con MUI v7

Este proyecto usa **Material UI v7** y **MUI X Data Grid v8**. Puntos clave al trabajar con estas versiones:

- `Grid`: usar `size={{ xs, sm, md }}` en lugar de `item xs={} sm={} md={}`.
- `DataGrid` con paginación servidor: usar `paginationModel={{ page, pageSize }}` en lugar de los props separados `page` y `pageSize`.
- `DataGrid` `valueGetter`: tipar explícitamente el parámetro `value` para evitar inferencia como `never`.

## Despliegue

1. Construye la aplicación:

```bash
npm run build
```

2. Inicia el servidor:

```bash
npm start
```

> En producción, reemplaza `NODE_TLS_REJECT_UNAUTHORIZED=0` por un certificado SSL válido y establece `secure: true` en la configuración de cookies de NextAuth.

## Notas de Mantenimiento

- El módulo `platform` fue retirado porque no es requerido para este proyecto.
- Mantener `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_BACKEND_API_URL` apuntando al mismo backend.
- Antes de entregar cambios, ejecutar `npm run check-all`.
- Al agregar un ícono nuevo al menú, registrarlo en el `iconMap` de [MainLayout.tsx](src/modules/shared/presentation/components/layout/MainLayout.tsx).

## Licencia

Este proyecto es privado.
