# El Buen Sazon Web Frontend

Aplicacion web frontend para el sistema de gestion del restaurante **El Buen Sazon**.

El proyecto esta construido con Next.js, TypeScript, Material UI y una organizacion modular inspirada en Domain-Driven Design (DDD).

## Documentacion

### General

- [Arquitectura DDD](./docs/ARQUITECTURA_DDD.md) - Arquitectura Domain-Driven Design del proyecto.
- [Arquitectura Modular](./arquitectura_modular.md) - Organizacion por modulos.
- [Guia de Desarrollo](./docs/GUIA_DESARROLLO.md) - Guia para nuevos desarrolladores.
- [Estandares de Codigo](./docs/ESTANDARES_CODIGO.md) - Convenciones y buenas practicas.
- [Configuracion del Modulo Restaurante](./RESTAURANT_MODULE_SETUP.md) - Detalles del modulo principal del restaurante.

### Modulos

- [Documentacion Admin](./docs/admin/README.md) - Guia del modulo administrativo.
- [Gestion de Usuarios](./docs/admin/USERS.md) - CRUD de usuarios y campos dinamicos.
- [Gestion de Roles](./docs/admin/ROLES.md) - Sistema de roles.
- [Gestion de Permisos](./docs/admin/PERMISSIONS.md) - Sistema RBAC.
- [Gestion de Tipos de Usuario](./docs/admin/USER_TYPES.md) - Configuracion de tipos y campos.

## Tecnologias

- **Framework**: Next.js 15.5.2 con App Router.
- **React**: 19.1.1.
- **TypeScript**: 5.9.2.
- **UI**: Material UI v7.3.2 y MUI X Data Grid.
- **Formularios**: React Hook Form.
- **Autenticacion**: NextAuth.js.
- **Notificaciones**: Notistack.
- **Arquitectura**: Modulos DDD por dominio.

## Requisitos Previos

- Node.js 18 o superior.
- npm.
- Backend API de El Buen Sazon ejecutandose localmente.

## Instalacion

1. Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd restaurant-manager-web
```

2. Instala dependencias:

```bash
npm install
```

3. Configura `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://localhost:7044
NEXT_PUBLIC_BACKEND_API_URL=https://localhost:7044
PORT=3001
NODE_TLS_REJECT_UNAUTHORIZED=0
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=[SECRET]
JWT_SECRET=[JWT_SECRET]
```

## Scripts

### Desarrollo

- `npm run dev` - Inicia el servidor en `http://localhost:3001`.
- `npm run build` - Construye la aplicacion para produccion.
- `npm start` - Inicia el servidor de produccion en el puerto 3001.

### Calidad

- `npm run type-check` - Valida tipos de TypeScript.
- `npm run lint` - Ejecuta ESLint.
- `npm run lint:fix` - Corrige problemas de ESLint cuando es posible.
- `npm run format` - Formatea archivos con Prettier.
- `npm run format:check` - Verifica formato.
- `npm run check-all` - Ejecuta type-check, lint y format:check.

## Estructura del Proyecto

```text
src/
├── app/                         # Next.js App Router
│   ├── api/                     # API routes
│   ├── auth/                    # Autenticacion y administracion de usuarios
│   ├── dashboard/               # Dashboard principal/admin
│   ├── profile/                 # Perfil de usuario
│   ├── restaurant/              # Rutas del modulo restaurante
│   ├── unauthorized/            # Acceso no autorizado
│   ├── layout.tsx
│   └── page.tsx
├── lib/                         # Utilidades especificas de Next.js
├── middleware.ts                # Middleware de Next.js
└── modules/
    ├── admin/                   # Modulo administrativo
    │   ├── application/
    │   ├── domain/
    │   ├── infrastructure/
    │   └── presentation/
    ├── restaurant/              # Modulo principal del restaurante
    │   ├── application/         # Casos de uso
    │   ├── domain/              # Entidades, repositorios y value objects
    │   ├── infrastructure/      # Adaptadores y repositorios API
    │   └── presentation/        # Paginas, componentes y hooks
    └── shared/                  # Componentes, hooks y servicios compartidos
        ├── application/
        ├── domain/
        ├── infrastructure/
        └── presentation/
```

## Modulo Restaurante

El modulo `restaurant` contiene las funcionalidades principales del sistema:

- Gestion de platos.
- Gestion de pedidos.
- Detalle de platos por pedido.
- Reportes de ventas.
- Filtros, paginacion y acciones por estado.
- Consumo del backend mediante endpoints `https://localhost:7044/api`.

Rutas principales:

- `/restaurant/dishes` - Gestion de platos.
- `/restaurant/orders` - Gestion de pedidos.
- `/restaurant/reports` - Reportes del restaurante.

## Modulo Administrativo

El modulo `admin` contiene la gestion operativa del sistema:

- Usuarios.
- Roles.
- Permisos.
- Tipos de usuario.
- Dashboard administrativo.
- Campos dinamicos configurables.

## API Backend

La aplicacion se conecta al backend de El Buen Sazon en:

```text
https://localhost:7044/api
```

Endpoints usados por el modulo restaurante incluyen:

- `GET /api/Dishes`
- `GET /api/Dishes/available`
- `POST /api/Dishes`
- `PUT /api/Dishes/{id}`
- `PATCH /api/Dishes/{id}/toggle-availability`
- `GET /api/Orders`
- `GET /api/Orders/{orderId}/items`
- `POST /api/Orders/{orderId}/items`
- `DELETE /api/Orders/{orderId}/items/{itemId}`
- `PATCH /api/Orders/{id}/advance-status`

## Autenticacion

El sistema utiliza NextAuth.js con soporte para:

- Google OAuth 2.0.
- Credenciales personalizadas.
- Validacion de token JWT contra el backend.
- Middleware de autenticacion y autorizacion.

## Despliegue

1. Construye la aplicacion:

```bash
npm run build
```

2. Inicia el servidor:

```bash
npm start
```

## Notas de Mantenimiento

- El modulo `platform` fue retirado porque no es requerido para este proyecto.
- Mantener las rutas y documentacion alineadas con los modulos reales (`admin`, `restaurant`, `shared`).
- Antes de entregar cambios, ejecutar al menos `npm run type-check`.

## Licencia

Este proyecto es privado.
