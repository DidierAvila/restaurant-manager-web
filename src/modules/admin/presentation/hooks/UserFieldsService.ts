import { ApiResponse } from '@/modules/shared/application/services/api';
import {
  CreateUserFieldDto,
  UpdateUserFieldDto,
  UserField,
  UserFieldsConfig,
} from '@/modules/shared/domain/entities/dynamic-fields';

/**
 * Servicio para gestiÃ³n de campos dinÃ¡micos a nivel de Usuario
 * Estos campos se almacenan en el additionalData del Usuario
 *
 * NOTA: Temporalmente deshabilitado durante la migraciÃ³n de usersService a useUsers hook
 */

export class UserFieldsService {
  /**
   * Helper para actualizar un Usuario con todos los campos requeridos
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  private static async updateUserWithRequiredFields(
    userId: string,
    updatedFields: UserField[]
  ): Promise<void> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    throw new Error(
      'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n'
    );

    /*
    // TODO: Implementar lÃ³gica para obtener usuario por ID usando useUsers hook
    // TODO: Actualizar usuario con campos dinÃ¡micos usando useUsers hook
    */
  }

  /**
   * Obtiene todos los campos definidos para un Usuario desde su additionalData
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async getUserFields(userId: string): Promise<UserField[]> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    console.warn(
      'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n'
    );
    return [];

    /*
    // TODO: Implementar lÃ³gica para obtener campos dinÃ¡micos usando useUsers hook
    */
  }

  /**
   * Obtiene la configuraciÃ³n completa de campos para un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async getUserFieldsConfig(userId: string): Promise<UserFieldsConfig> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    throw new Error(
      'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n'
    );

    /*
    // TODO: Implementar lÃ³gica para obtener configuraciÃ³n de campos usando useUsers hook

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userTypeId: user.userTypeId,
        userTypeName: user.userTypeName,
        fields: fields,
        isActive: user.status,
        totalFields: fields.length,
        lastUpdated: new Date(user.updatedAt || user.createdAt),
      };
    } catch (error) {
      console.error('Error loading User fields config:', error);
      throw error;
    }
    */
  }

  /**
   * Obtiene todos los Usuarios con sus campos configurados
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async getAllUsersWithFields(): Promise<UserFieldsConfig[]> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    console.warn(
      'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n'
    );
    return [];
  }

  /**
   * Crea un nuevo campo dinÃ¡mico para un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async createUserField(fieldData: CreateUserFieldDto): Promise<ApiResponse<UserField>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: {} as UserField,
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }

  /**
   * Actualiza un campo existente de un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async updateUserField(
    userId: string,
    fieldData: UpdateUserFieldDto
  ): Promise<ApiResponse<UserField>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: {} as UserField,
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }

  /**
   * Elimina un campo de un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async deleteUserField(userId: string, fieldId: string): Promise<ApiResponse<boolean>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: false,
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }

  /**
   * Reordena los campos de un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async reorderUserFields(
    userId: string,
    fieldIds: string[]
  ): Promise<ApiResponse<UserField[]>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: [],
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }

  /**
   * Activa/desactiva un campo de un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async toggleUserFieldStatus(
    userId: string,
    fieldId: string,
    isActive: boolean
  ): Promise<ApiResponse<UserField>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: {} as UserField,
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }

  /**
   * Duplica un campo existente de un Usuario
   * TODO: Migrar a usar useUsers hook cuando se implemente la funcionalidad de campos dinÃ¡micos
   */
  static async duplicateUserField(
    userId: string,
    fieldId: string,
    newName?: string
  ): Promise<ApiResponse<UserField>> {
    // TODO: Implementar usando el hook useUsers cuando se requiera esta funcionalidad
    return {
      success: false,
      data: {} as UserField,
      message: 'Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada durante la migraciÃ³n',
    };
  }
}

/**
 * Helpers para crear DTOs comunes
 */

/**
 * Crea un DTO bÃ¡sico para un campo de texto
 */
export function createTextFieldDto(
  userId: string,
  name: string,
  label: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    defaultValue?: string;
    description?: string;
  } = {}
): CreateUserFieldDto {
  return {
    userId,
    name,
    label,
    type: 'text',
    description: options.description,
    defaultValue: options.defaultValue,
    validation: {
      required: options.required ?? false,
      minLength: options.minLength,
      maxLength: options.maxLength,
    },
    isInheritable: true,
  };
}

/**
 * Crea un DTO bÃ¡sico para un campo de selecciÃ³n
 */
export function createSelectFieldDto(
  userId: string,
  name: string,
  label: string,
  config: {
    options: Array<{ value: string; label: string }>;
    required?: boolean;
    defaultValue?: string;
    description?: string;
  }
): CreateUserFieldDto {
  const { options, ...rest } = config;

  return {
    userId,
    name,
    label,
    type: 'select',
    description: config.description,
    options,
    defaultValue: config.defaultValue,
    validation: {
      required: config.required ?? false,
    },
    isInheritable: true,
  };
}

/**
 * Crea un DTO bÃ¡sico para un campo numÃ©rico
 */
export function createNumberFieldDto(
  userId: string,
  name: string,
  label: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    defaultValue?: number;
    description?: string;
  } = {}
): CreateUserFieldDto {
  return {
    userId,
    name,
    label,
    type: 'number',
    description: options.description,
    defaultValue: options.defaultValue,
    validation: {
      required: options.required ?? false,
      min: options.min,
      max: options.max,
    },
    isInheritable: true,
  };
}
