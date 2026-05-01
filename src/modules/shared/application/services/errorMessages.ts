/**
 * Traducciones de códigos de error del backend
 * Platform Web Frontend - Next.js TypeScript
 */

export interface ErrorTranslation {
  [code: string]: string;
}

/**
 * Mapeo de códigos de error a mensajes en español
 * Los códigos siguen el patrón {Entity}.{ErrorType}
 */
export const errorMessages: ErrorTranslation = {
  // ===== User Errors =====
  'User.NotFound': 'Usuario no encontrado',
  'User.EmailRequired': 'El email es requerido',
  'User.EmailExists': 'El email ya está registrado',
  'User.UserTypeRequired': 'El tipo de usuario es requerido',
  'User.Validation': 'Error de validación en los datos del usuario',
  'User.Conflict': 'Conflicto con los datos del usuario',
  'User.Create': 'Error al crear el usuario',
  'User.Update': 'Error al actualizar el usuario',
  'User.Delete': 'Error al eliminar el usuario',
  'User.GetRoles': 'Error al obtener los roles del usuario',
  'User.AssignRoles': 'Error al asignar roles al usuario',
  'User.RemoveRoles': 'Error al remover roles del usuario',

  // ===== Role Errors =====
  'Role.NotFound': 'Rol no encontrado',
  'Role.NameRequired': 'El nombre del rol es requerido',
  'Role.NameExists': 'El nombre del rol ya existe',
  'Role.Validation': 'Error de validación en los datos del rol',
  'Role.Conflict': 'Conflicto con los datos del rol',
  'Role.Create': 'Error al crear el rol',
  'Role.Update': 'Error al actualizar el rol',
  'Role.Delete': 'Error al eliminar el rol',
  'Role.RemovePermissions': 'Error al remover permisos del rol',

  // ===== Permission Errors =====
  'Permission.NotFound': 'Permiso no encontrado',
  'Permission.NameExists': 'El nombre del permiso ya existe',
  'Permission.HasRoles':
    'No se puede eliminar el permiso porque tiene roles asociados. Por favor, remueve el permiso de todos los roles primero.',
  'Permission.Validation': 'Error de validación en los datos del permiso',
  'Permission.Conflict': 'Conflicto con los datos del permiso',
  'Permission.Create': 'Error al crear el permiso',
  'Permission.Update': 'Error al actualizar el permiso',
  'Permission.Delete': 'Error al eliminar el permiso',

  // ===== RolePermission Errors =====
  'RolePermission.AlreadyExists': 'El permiso ya está asignado a este rol',
  'RolePermission.NotFound': 'No se encontró la asignación del permiso al rol especificado',

  // ===== Authentication Errors =====
  'Login.InvalidCredentials': 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
  'Login.InactiveUser': 'Usuario inactivo. Por favor, contacta al administrador.',
  'Login.Error': 'Error al intentar iniciar sesión',

  // ===== Password Errors =====
  'Password.CurrentRequired': 'La contraseña actual es requerida',
  'Password.NewRequired': 'La nueva contraseña es requerida',
  'Password.TooShort': 'La nueva contraseña debe tener al menos 6 caracteres',
  'Password.Incorrect': 'La contraseña actual es incorrecta',

  // ===== UserType Errors =====
  'UserType.NotFound': 'Tipo de usuario no encontrado',
  'UserType.NameRequired': 'El nombre del tipo de usuario es requerido',
  'UserType.NameExists': 'El nombre del tipo de usuario ya existe',
  'UserType.Validation': 'Error de validación en los datos del tipo de usuario',
  'UserType.Conflict': 'Conflicto con los datos del tipo de usuario',

  // ===== Dish Errors (Restaurant Module) =====
  'Dish.NotFound': 'Plato no encontrado',
  'Dish.NameRequired': 'El nombre del plato es requerido',
  'Dish.NameExists': 'El nombre del plato ya existe',
  'Dish.PriceInvalid': 'El precio del plato debe ser mayor que 0',
  'Dish.HasOrders': 'No se puede eliminar el plato porque tiene pedidos asociados',

  // ===== Order Errors (Restaurant Module) =====
  'Order.NotFound': 'Pedido no encontrado',
  'Order.TableNumberRequired': 'El número de mesa es requerido',
  'Order.TableNumberInvalid': 'El número de mesa debe estar entre 1 y 50',
  'Order.QuantityInvalid': 'La cantidad de items debe estar entre 1 y 20',
  'Order.DuplicateTable': 'Ya existe un pedido pendiente en esta mesa',
  'Order.InvalidStatus': 'Estado del pedido inválido',

  // ===== Generic Errors =====
  'ServerError': 'Error del servidor. Por favor, intenta nuevamente más tarde.',
  'ValidationError': 'Error de validación en los datos enviados',
  'UnknownError': 'Ha ocurrido un error inesperado',
  'NetworkError': 'Error de conexión. Verifica tu conexión a internet.',
};

/**
 * Obtiene el mensaje traducido para un código de error
 * @param code - Código de error del backend
 * @param defaultMessage - Mensaje por defecto si no se encuentra traducción
 * @returns Mensaje traducido o mensaje por defecto
 */
export function getErrorMessage(code?: string, defaultMessage?: string): string {
  if (!code) {
    return defaultMessage || 'Ha ocurrido un error inesperado';
  }

  return errorMessages[code] || defaultMessage || code;
}

/**
 * Obtiene mensajes de error de validación formateados
 * @param validationErrors - Objeto con errores de validación por campo
 * @returns Array de mensajes de error formateados
 */
export function getValidationErrorMessages(
  validationErrors?: Record<string, string[]>
): string[] {
  if (!validationErrors) {
    return [];
  }

  return Object.entries(validationErrors).flatMap(([field, errors]) =>
    errors.map((error) => `${field}: ${error}`)
  );
}

/**
 * Verifica si un código de error es de autenticación
 * @param code - Código de error del backend
 * @returns true si es un error de autenticación
 */
export function isAuthenticationError(code?: string): boolean {
  if (!code) return false;
  return code.startsWith('Login.') || code.startsWith('Password.');
}

/**
 * Verifica si un código de error requiere acción del administrador
 * @param code - Código de error del backend
 * @returns true si requiere acción del administrador
 */
export function requiresAdminAction(code?: string): boolean {
  if (!code) return false;
  return code === 'Login.InactiveUser' || code === 'Permission.HasRoles';
}
