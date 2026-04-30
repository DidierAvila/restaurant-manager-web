# Configuración del Módulo de Restaurante

## Módulos Implementados

Se han implementado los siguientes módulos siguiendo la arquitectura DDD (Domain-Driven Design):

### 1. **Dishes (Platos)**
- **Ruta**: `/restaurant/dishes`
- **Funcionalidades**:
  - Crear, editar y eliminar platos
  - Gestionar disponibilidad de platos
  - Filtrar por categoría y disponibilidad
  - Categorías: Entradas, Platos Fuertes, Sopas, Bebidas, Postres

### 2. **Orders (Pedidos)**
- **Ruta**: `/restaurant/orders`
- **Funcionalidades**:
  - Crear y editar pedidos
  - Agregar/remover platos a pedidos
  - Avanzar estado del pedido (Abierto → En Preparación → Listo → Entregado → Cerrado)
  - Filtrar por estado y mesa
  - Visualizar total del pedido

### 3. **Reports (Reportes)**
- **Ruta**: `/restaurant/reports`
- **Funcionalidades**:
  - Reporte de ventas por rango de fechas
  - Estadísticas de ventas totales, promedio, y cantidad de pedidos
  - Plato más vendido
  - Ventas por categoría
  - Pedidos por estado

## Estructura del Proyecto

```
src/modules/restaurant/
├── domain/
│   ├── entities/          # Entidades de negocio (Dish, Order, SalesReport)
│   ├── repositories/      # Interfaces de repositorios
│   └── value-objects/     # Objetos de valor (Filters)
├── application/
│   └── use-cases/         # Casos de uso (CreateDish, GetOrders, etc.)
├── infrastructure/
│   ├── adapters/          # Adaptadores de API
│   └── repositories/      # Implementaciones de repositorios
└── presentation/
    ├── components/        # Componentes React
    ├── hooks/            # Custom hooks
    └── pages/            # Páginas del módulo
```

## Configuración de Navegación

La navegación del módulo de restaurante es **dinámica** y se carga desde el backend a través del endpoint `/api/user/me`.

### Iconos Disponibles

Los siguientes iconos están configurados en el frontend para el módulo de restaurante:

- `restaurant` o `restaurante` → Icono de restaurante
- `dishes` o `platos` → Icono de comida
- `menu` → Icono de menú
- `orders` o `pedidos` → Icono de recibo
- `sales-report` o `reporte-ventas` → Icono de análisis
- `restaurant-reports` → Icono de gráficos

### Configuración en el Backend

Para que aparezcan los menús del restaurante en la navegación, necesitas:

1. **Crear registros en la tabla `Menu`** (schema: `access_control`)

   Ejemplo de estructura SQL:

   ```sql
   -- Menú principal de Restaurante
   INSERT INTO access_control."Menu" ("Id", "Label", "Icon", "Route", "Order", "ParentId", "Status", "CreatedAt", "UpdatedAt")
   VALUES
   (gen_random_uuid(), 'Restaurante', 'restaurant', NULL, 4, NULL, true, NOW(), NOW());

   -- Submenús (usando el Id del menú padre)
   INSERT INTO access_control."Menu" ("Id", "Label", "Icon", "Route", "Order", "ParentId", "Status", "CreatedAt", "UpdatedAt")
   VALUES
   (gen_random_uuid(), 'Platos', 'dishes', '/restaurant/dishes', 1, '<ID_MENU_PADRE>', true, NOW(), NOW()),
   (gen_random_uuid(), 'Pedidos', 'orders', '/restaurant/orders', 2, '<ID_MENU_PADRE>', true, NOW(), NOW()),
   (gen_random_uuid(), 'Reportes', 'restaurant-reports', '/restaurant/reports', 3, '<ID_MENU_PADRE>', true, NOW(), NOW());
   ```

2. **Asociar Menús a Permisos** (si se implementa la tabla MenuPermission)

   Actualmente está comentado en `GetUserMe.cs`, pero la estructura está preparada para:
   - Crear permisos para cada acción del restaurante
   - Asociar permisos a roles
   - Asociar menús a permisos
   - El sistema filtrará automáticamente los menús según los permisos del usuario

3. **Actualizar el UserType con la navegación**

   El sistema generará automáticamente la configuración de navegación basada en los permisos del usuario.

## Endpoints de la API

### Dishes (Platos)
- `GET /api/dishes` - Obtener todos los platos (con filtros opcionales)
- `GET /api/dishes/{id}` - Obtener un plato por ID
- `GET /api/dishes/available` - Obtener platos disponibles
- `GET /api/dishes/category/{category}` - Obtener platos por categoría
- `POST /api/dishes` - Crear un plato
- `PUT /api/dishes/{id}` - Actualizar un plato
- `DELETE /api/dishes/{id}` - Eliminar un plato
- `PATCH /api/dishes/{id}/toggle-availability` - Cambiar disponibilidad

### Orders (Pedidos)
- `GET /api/orders` - Obtener todos los pedidos (con filtros opcionales)
- `GET /api/orders/{id}` - Obtener un pedido por ID
- `GET /api/orders/active` - Obtener pedidos activos
- `GET /api/orders/table/{tableNumber}` - Obtener pedidos de una mesa
- `POST /api/orders` - Crear un pedido
- `PUT /api/orders/{id}` - Actualizar un pedido
- `DELETE /api/orders/{id}` - Eliminar un pedido
- `POST /api/orders/{orderId}/items` - Agregar plato a un pedido
- `DELETE /api/orders/{orderId}/items/{itemId}` - Remover plato de un pedido
- `PATCH /api/orders/{id}/advance-status` - Avanzar estado del pedido

### Reports (Reportes)
- `GET /api/reports/sales?fromDate={date}&toDate={date}` - Reporte de ventas

## Próximos Pasos

1. **Ejecutar las migraciones del backend** para crear las tablas necesarias
2. **Insertar datos de menús** en la base de datos usando los scripts SQL anteriores
3. **Configurar permisos** para las acciones del restaurante (opcional)
4. **Probar la navegación** iniciando sesión con un usuario que tenga acceso

## Tecnologías Utilizadas

### Frontend
- Next.js 15.5.2 (App Router)
- TypeScript 5.9.2
- Material-UI v7.3.2
- React Hook Form 7.63.0
- date-fns 4.1.0
- notistack 3.0.2 (notificaciones)

### Backend (API)
- .NET 10
- Entity Framework Core 10.0.7
- PostgreSQL (Npgsql)
- AutoMapper 12.0.1
- MediatR (CQRS)

## Validaciones Implementadas

Las mismas validaciones del sistema legacy fueron migradas:

### Dishes
- Nombre único (case-insensitive)
- Precio mayor a 0
- Categoría válida (1-5)

### Orders
- Número de mesa entre 1 y 50
- Nombre de mesero obligatorio (mínimo 3 caracteres)
- No se puede tener más de un pedido abierto en la misma mesa
- No se puede avanzar un pedido sin platos
- Cantidad de platos por ítem entre 1 y 20
- Solo pedidos en estado "Abierto" pueden ser editados/eliminados

### Reports
- Fechas válidas requeridas
- Solo incluye pedidos en estado "Entregado" o "Cerrado"
