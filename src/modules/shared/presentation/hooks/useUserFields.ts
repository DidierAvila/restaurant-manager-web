import {
  CreateUserFieldDto,
  DynamicFieldsState,
  UpdateUserFieldDto,
  UserField,
  UserFieldsConfig,
} from '@/modules/shared/domain/entities/dynamic-fields';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gestionar campos dinÃ¡micos de Usuario
 * VersiÃ³n simplificada - funcionalidad temporalmente deshabilitada
 */
export function useUserFields(userId: string) {
  const [state, setState] = useState<DynamicFieldsState>({
    isLoading: false,
    isUpdating: false,
    error: null,
    lastSync: new Date(),
  });

  const [fields, setFields] = useState<UserField[]>([]);
  const [config, setConfig] = useState<UserFieldsConfig | null>(null);

  /**
   * Carga los campos del Usuario
   * Temporalmente deshabilitado
   */
  const loadFields = useCallback(async () => {
    if (!userId) return;

    console.warn('Funcionalidad de campos dinÃ¡micos temporalmente deshabilitada');
    setFields([]);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      lastSync: new Date(),
    }));
  }, [userId]);

  /**
   * Carga la configuraciÃ³n completa del Usuario
   * Temporalmente deshabilitado
   */
  const loadConfig = useCallback(async () => {
    if (!userId) return;

    console.warn('Funcionalidad de configuraciÃ³n de campos temporalmente deshabilitada');
    setConfig(null);
    setFields([]);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      lastSync: new Date(),
    }));
  }, [userId]);

  /**
   * Crea un nuevo campo
   * Temporalmente deshabilitado
   */
  const createField = useCallback(
    async (fieldData: CreateUserFieldDto): Promise<UserField | undefined> => {
      console.warn('Funcionalidad de creaciÃ³n de campos temporalmente deshabilitada');
      return undefined;
    },
    []
  );

  /**
   * Actualiza un campo existente
   * Temporalmente deshabilitado
   */
  const updateField = useCallback(
    async (fieldData: UpdateUserFieldDto): Promise<UserField | undefined> => {
      console.warn('Funcionalidad de actualizaciÃ³n de campos temporalmente deshabilitada');
      return undefined;
    },
    [userId]
  );

  /**
   * Elimina un campo
   * Temporalmente deshabilitado
   */
  const deleteField = useCallback(
    async (fieldId: string): Promise<boolean> => {
      console.warn('Funcionalidad de eliminaciÃ³n de campos temporalmente deshabilitada');
      return false;
    },
    [userId]
  );

  /**
   * Reordena campos
   * Temporalmente deshabilitado
   */
  const reorderFields = useCallback(
    async (fieldIds: string[]): Promise<UserField[]> => {
      console.warn('Funcionalidad de reordenamiento de campos temporalmente deshabilitada');
      return [];
    },
    [userId]
  );

  /**
   * Activa/desactiva un campo
   * Temporalmente deshabilitado
   */
  const toggleFieldStatus = useCallback(
    async (fieldId: string, isActive: boolean): Promise<UserField | undefined> => {
      console.warn('Funcionalidad de toggle de campos temporalmente deshabilitada');
      return undefined;
    },
    [userId]
  );

  /**
   * Duplica un campo
   * Temporalmente deshabilitado
   */
  const duplicateField = useCallback(
    async (fieldId: string, newName?: string): Promise<UserField | undefined> => {
      console.warn('Funcionalidad de duplicaciÃ³n de campos temporalmente deshabilitada');
      return undefined;
    },
    [userId]
  );

  // Cargar datos iniciales
  useEffect(() => {
    if (userId) {
      loadFields();
    }
  }, [userId, loadFields]);

  // Campos activos (filtrados)
  const activeFields = fields.filter((field) => field.isActive !== false);

  // EstadÃ­sticas de campos
  const stats = {
    total: fields.length,
    active: activeFields.length,
    inactive: fields.length - activeFields.length,
    required: fields.filter((field) => field.validation?.required).length,
  };

  return {
    // Estado
    ...state,
    fields,
    activeFields,
    stats,
    config,

    // Acciones
    loadFields,
    loadConfig,
    createField,
    updateField,
    deleteField,
    reorderFields,
    toggleFieldStatus,
    duplicateField,

    // Utilidades
    refresh: loadFields,
    reset: () => {
      setFields([]);
      setConfig(null);
      setState({
        isLoading: false,
        isUpdating: false,
        error: null,
        lastSync: new Date(),
      });
    },
  };
}
