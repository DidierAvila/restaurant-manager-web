'use client';

/**
 * usePermissionForm - Hook para manejar formularios de permisos
 */

import { useCallback, useState } from 'react';
import { Permission } from '../../domain/entities/Permission';
import {
  CreatePermissionData,
  UpdatePermissionData,
} from '../../domain/value-objects/PermissionFilters';

export interface PermissionFormData {
  name: string;
  description: string;
  module: string;
  action: 'read' | 'create' | 'edit' | 'delete' | 'config';
  status: boolean;
}

export interface UsePermissionFormReturn {
  // Estado del formulario
  formData: PermissionFormData;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;

  // Operaciones del formulario
  setFormData: (data: Partial<PermissionFormData>) => void;
  setFieldValue: (field: keyof PermissionFormData, value: any) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  loadPermission: (permission: Permission) => void;

  // Datos para envÃ­o
  getCreateData: () => CreatePermissionData;
  getUpdateData: () => UpdatePermissionData;
}

const initialFormData: PermissionFormData = {
  name: '',
  description: '',
  module: '',
  action: 'read',
  status: true,
};

const moduleOptions = [
  'users',
  'roles',
  'permissions',
  'user-types',
  'reports',
  'dashboard',
  'settings',
  'audit',
];

const actionOptions: Array<'read' | 'create' | 'edit' | 'delete' | 'config'> = [
  'read',
  'create',
  'edit',
  'delete',
  'config',
];

export const usePermissionForm = (
  initialData?: Partial<PermissionFormData>
): UsePermissionFormReturn => {
  const [formData, setFormDataState] = useState<PermissionFormData>({
    ...initialFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback((field: keyof PermissionFormData, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'El nombre es requerido';
        }
        if (value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        if (value.trim().length > 100) {
          return 'El nombre no puede exceder 100 caracteres';
        }
        if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(value.trim())) {
          return 'El nombre solo puede contener letras, nÃºmeros, espacios, guiones y puntos';
        }
        return '';

      case 'description':
        if (!value || value.trim().length === 0) {
          return 'La descripción es requerida';
        }
        if (value.trim().length < 10) {
          return 'La descripción debe tener al menos 10 caracteres';
        }
        if (value.trim().length > 500) {
          return 'La descripción no puede exceder 500 caracteres';
        }
        return '';

      case 'module':
        if (!value || value.trim().length === 0) {
          return 'El módulo es requerido';
        }
        if (!moduleOptions.includes(value)) {
          return 'Debe seleccionar un módulo válido';
        }
        return '';

      case 'action':
        if (!value) {
          return 'La acción es requerida';
        }
        if (!actionOptions.includes(value)) {
          return 'Debe seleccionar una acción válida';
        }
        return '';

      case 'status':
        // El status siempre es válido ya que es un boolean
        return '';

      default:
        return '';
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar todos los campos
    Object.keys(formData).forEach((key) => {
      const field = key as keyof PermissionFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const setFormData = useCallback(
    (data: Partial<PermissionFormData>) => {
      setFormDataState((prev) => {
        const newData = { ...prev, ...data };

        // Validar campos modificados
        const newErrors = { ...errors };
        Object.keys(data).forEach((key) => {
          const field = key as keyof PermissionFormData;
          const error = validateField(field, newData[field]);
          if (error) {
            newErrors[field] = error;
          } else {
            delete newErrors[field];
          }
        });
        setErrors(newErrors);

        setIsDirty(true);
        return newData;
      });
    },
    [errors, validateField]
  );

  const setFieldValue = useCallback(
    (field: keyof PermissionFormData, value: any) => {
      setFormData({ [field]: value });
    },
    [setFormData]
  );

  const resetForm = useCallback(() => {
    setFormDataState({ ...initialFormData, ...initialData });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  const loadPermission = useCallback((permission: Permission) => {
    const primitives = permission.toPrimitives();
    setFormDataState({
      name: primitives.name,
      description: primitives.description,
      module: primitives.module,
      action: primitives.action,
      status: primitives.status,
    });
    setErrors({});
    setIsDirty(false);
  }, []);

  const getCreateData = useCallback((): CreatePermissionData => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      module: formData.module,
      action: formData.action,
      status: formData.status,
    };
  }, [formData]);

  const getUpdateData = useCallback((): UpdatePermissionData => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      module: formData.module,
      action: formData.action,
      status: formData.status,
    };
  }, [formData]);

  const isValid =
    Object.keys(errors).length === 0 &&
    formData.name.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.module.length > 0;

  return {
    // Estado del formulario
    formData,
    errors,
    isValid,
    isDirty,

    // Operaciones del formulario
    setFormData,
    setFieldValue,
    validateForm,
    resetForm,
    loadPermission,

    // Datos para envÃ­o
    getCreateData,
    getUpdateData,
  };
};

// Exportar opciones para uso en componentes
export { actionOptions, moduleOptions };

