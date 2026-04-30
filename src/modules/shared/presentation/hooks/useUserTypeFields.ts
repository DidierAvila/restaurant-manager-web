import {
  CreateUserTypeFieldDto,
  DynamicFieldsState,
  UpdateUserTypeFieldDto,
  UserTypeField,
  UserTypeFieldsConfig,
} from '@/modules/shared/domain/entities/dynamic-fields';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gestionar campos dinÃ¡micos de UserType
 * VersiÃ³n simplificada - funcionalidad temporalmente deshabilitada
 */
export function useUserTypeFields(userTypeId: string) {
  const [state, setState] = useState<DynamicFieldsState>({
    isLoading: false,
    isUpdating: false,
    error: null,
    lastSync: new Date(),
  });

  const [fields, setFields] = useState<UserTypeField[]>([]);
  const [config, setConfig] = useState<UserTypeFieldsConfig | null>(null);

  /**
   * Carga los campos del UserType
   * Temporalmente deshabilitado
   */
  const loadFields = useCallback(async () => {
    if (!userTypeId) return;

    console.warn('Funcionalidad de campos dinÃ¡micos de UserType temporalmente deshabilitada');
    setFields([]);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      lastSync: new Date(),
    }));
  }, [userTypeId]);

  /**
   * Carga la configuraciÃ³n completa del UserType
   * Temporalmente deshabilitado
   */
  const loadConfig = useCallback(async () => {
    if (!userTypeId) return;

    console.warn(
      'Funcionalidad de configuraciÃ³n de campos de UserType temporalmente deshabilitada'
    );
    setConfig(null);
    setFields([]);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      lastSync: new Date(),
    }));
  }, [userTypeId]);

  /**
   * Crea un nuevo campo
   * Temporalmente deshabilitado
   */
  const createField = useCallback(
    async (fieldData: CreateUserTypeFieldDto): Promise<UserTypeField | undefined> => {
      console.warn('Funcionalidad de creaciÃ³n de campos de UserType temporalmente deshabilitada');
      return undefined;
    },
    []
  );

  /**
   * Actualiza un campo existente
   * Temporalmente deshabilitado
   */
  const updateField = useCallback(
    async (fieldData: UpdateUserTypeFieldDto): Promise<UserTypeField | undefined> => {
      console.warn(
        'Funcionalidad de actualizaciÃ³n de campos de UserType temporalmente deshabilitada'
      );
      return undefined;
    },
    [userTypeId]
  );

  /**
   * Elimina un campo
   * Temporalmente deshabilitado
   */
  const deleteField = useCallback(
    async (fieldId: string): Promise<boolean> => {
      console.warn(
        'Funcionalidad de eliminaciÃ³n de campos de UserType temporalmente deshabilitada'
      );
      return false;
    },
    [userTypeId]
  );

  /**
   * Reordena campos
   * Temporalmente deshabilitado
   */
  const reorderFields = useCallback(
    async (fieldIds: string[]): Promise<UserTypeField[]> => {
      console.warn(
        'Funcionalidad de reordenamiento de campos de UserType temporalmente deshabilitada'
      );
      return [];
    },
    [userTypeId]
  );

  /**
   * Activa/desactiva un campo
   * Temporalmente deshabilitado
   */
  const toggleFieldStatus = useCallback(
    async (fieldId: string, isActive: boolean): Promise<UserTypeField | undefined> => {
      console.warn('Funcionalidad de toggle de campos de UserType temporalmente deshabilitada');
      return undefined;
    },
    [userTypeId]
  );

  /**
   * Duplica un campo
   * Temporalmente deshabilitado
   */
  const duplicateField = useCallback(
    async (fieldId: string, newName?: string): Promise<UserTypeField | undefined> => {
      console.warn(
        'Funcionalidad de duplicaciÃ³n de campos de UserType temporalmente deshabilitada'
      );
      return undefined;
    },
    [userTypeId]
  );

  // Cargar datos iniciales
  useEffect(() => {
    if (userTypeId) {
      loadFields();
    }
  }, [userTypeId, loadFields]);

  return {
    // Estado
    ...state,
    fields,
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
