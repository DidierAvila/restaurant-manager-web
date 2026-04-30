/**
 * Sistema de campos dinÃ¡micos de dos niveles
 * - Nivel 1: Campos definidos en UserType (aplicables a todos los usuarios de ese tipo)
 * - Nivel 2: Campos personales por usuario (individuales)
 */

// Tipos especÃ­ficos para valores de campos dinÃ¡micos
export type FieldValue = string | number | boolean | Date | string[] | number[] | null | undefined;

// Tipos de campo soportados
export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'url'
  | 'file';

// ConfiguraciÃ³n de validaciÃ³n para campos
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; // regex pattern
  customMessage?: string;
}

// Opciones para campos de selecciÃ³n
export interface FieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// DefiniciÃ³n base de un campo dinÃ¡mico
export interface DynamicFieldDefinition {
  id: string;
  name: string; // nombre tÃ©cnico del campo
  label: string; // etiqueta visible al usuario
  description?: string;
  type: FieldType;
  validation?: FieldValidation;
  options?: FieldOption[]; // para select, multiselect, radio
  defaultValue?: FieldValue;
  placeholder?: string;
  isActive: boolean;
  order: number; // orden de visualizaciÃ³n
  metadata?: Record<string, string | number | boolean>; // datos adicionales especÃ­ficos del campo
}

// Campo a nivel de UserType (grupal)
export interface UserTypeField extends DynamicFieldDefinition {
  userTypeId: string;
  isInheritable: boolean; // si se puede heredar/sobrescribir a nivel individual
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Campo personal de usuario (individual)
export interface UserPersonalField extends DynamicFieldDefinition {
  userId: string;
  parentFieldId?: string; // referencia al campo de UserType si es una sobrescritura
  isOverride: boolean; // true si sobrescribe un campo de UserType
  createdAt: Date;
  updatedAt: Date;
}

// Valor de un campo dinÃ¡mico
export interface DynamicFieldValue {
  fieldId: string;
  fieldName: string;
  value: FieldValue;
  fieldType: FieldType;
  lastUpdated: Date;
}

// Estructura completa de datos adicionales de un usuario
export interface UserAdditionalData {
  // Valores de campos heredados del UserType
  userTypeFields: Record<string, DynamicFieldValue>;
  // Valores de campos personales del usuario
  personalFields: Record<string, DynamicFieldValue>;
  // Metadatos
  lastSyncAt?: Date;
  version: number;
}

// ConfiguraciÃ³n completa de campos para un UserType
export interface UserTypeFieldsConfig {
  userTypeId: string;
  userTypeName: string;
  fields: UserTypeField[];
  isActive: boolean;
  totalFields: number;
  lastUpdated: Date;
}

// ConfiguraciÃ³n completa de campos personales para un usuario
export interface UserPersonalFieldsConfig {
  userId: string;
  personalFields: UserPersonalField[];
  inheritedFields: UserTypeField[]; // campos del UserType
  totalPersonalFields: number;
  totalInheritedFields: number;
  lastUpdated: Date;
}

// DTOs para operaciones CRUD
export interface CreateUserTypeFieldDto {
  userTypeId: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: FieldValue;
  placeholder?: string;
  isInheritable?: boolean;
  isActive?: boolean;
  order?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface UpdateUserTypeFieldDto extends Partial<CreateUserTypeFieldDto> {
  id: string;
  isActive?: boolean;
}

export interface CreateUserPersonalFieldDto {
  userId: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: FieldValue;
  placeholder?: string;
  order?: number;
  metadata?: Record<string, string | number | boolean>;
  parentFieldId?: string; // si es sobrescritura de campo de UserType
}

export interface UpdateUserPersonalFieldDto extends Partial<CreateUserPersonalFieldDto> {
  id: string;
  isActive?: boolean;
}

// DTO para actualizar valores de campos
export interface UpdateFieldValuesDto {
  userId: string;
  values: {
    fieldId: string;
    value: FieldValue;
  }[];
}

// Respuesta de la API
export interface DynamicFieldsResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Estados de carga para hooks
export interface DynamicFieldsState {
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  lastSync: Date | null;
}

// ConfiguraciÃ³n de renderizado para componentes
export interface FieldRenderConfig {
  showDescription: boolean;
  showRequired: boolean;
  compactMode: boolean;
  readOnly: boolean;
  showFieldOrder: boolean;
  groupBySection: boolean;
}

// SecciÃ³n/agrupaciÃ³n de campos
export interface FieldSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  isCollapsible: boolean;
  isExpanded: boolean;
  fields: string[]; // IDs de campos en esta secciÃ³n
}

// ConfiguraciÃ³n completa de renderizado
export interface DynamicFieldsRenderConfig {
  sections: FieldSection[];
  renderConfig: FieldRenderConfig;
  theme?: 'default' | 'compact' | 'cards';
}

// === TIPOS ESPECÃFICOS PARA CAMPOS DE USUARIOS ===

// Campo dinÃ¡mico especÃ­fico para usuarios (almacenado en additionalData)
export interface UserField extends DynamicFieldDefinition {
  userId: string;
  isInheritable: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// ConfiguraciÃ³n completa de campos para un Usuario
export interface UserFieldsConfig {
  userId: string;
  userName: string;
  userEmail: string;
  userTypeId: string;
  userTypeName: string;
  fields: UserField[];
  isActive?: boolean;
  totalFields: number;
  lastUpdated: Date;
}

// DTO para crear un nuevo campo de usuario
export interface CreateUserFieldDto {
  userId: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: FieldValue;
  placeholder?: string;
  order?: number;
  isActive?: boolean;
  isInheritable?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

// DTO para actualizar un campo de usuario existente
export interface UpdateUserFieldDto {
  id: string;
  name?: string;
  label?: string;
  description?: string;
  type?: FieldType;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: FieldValue;
  placeholder?: string;
  order?: number;
  isActive?: boolean;
  isInheritable?: boolean;
  metadata?: Record<string, string | number | boolean>;
}
