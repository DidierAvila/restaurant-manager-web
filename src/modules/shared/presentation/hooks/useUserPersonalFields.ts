import {
  CreateUserPersonalFieldDto,
  FieldValue,
  UpdateUserPersonalFieldDto,
  UserPersonalField,
} from '@/modules/shared/domain/entities/dynamic-fields';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gestionar campos dinÃ¡micos personales de usuario
 * VersiÃ³n simplificada - funcionalidad temporalmente deshabilitada
 */
export function useUserPersonalFields(userId: string) {
  const [personalFields, setPersonalFields] = useState<UserPersonalField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar campos personales - temporalmente deshabilitado
  const loadPersonalFields = useCallback(async () => {
    if (!userId) return;

    console.warn('Funcionalidad de campos personales temporalmente deshabilitada');
    setPersonalFields([]);
    setIsLoading(false);
    setError(null);
  }, [userId]);

  // Crear campo personal - temporalmente deshabilitado
  const createPersonalField = useCallback(
    async (fieldData: CreateUserPersonalFieldDto): Promise<UserPersonalField | undefined> => {
      console.warn('Funcionalidad de creaciÃ³n de campos personales temporalmente deshabilitada');
      return undefined;
    },
    []
  );

  // Actualizar campo personal - temporalmente deshabilitado
  const updatePersonalField = useCallback(
    async (
      fieldId: string,
      fieldData: UpdateUserPersonalFieldDto
    ): Promise<UserPersonalField | undefined> => {
      console.warn(
        'Funcionalidad de actualizaciÃ³n de campos personales temporalmente deshabilitada'
      );
      return undefined;
    },
    []
  );

  // Eliminar campo personal - temporalmente deshabilitado
  const deletePersonalField = useCallback(async (fieldId: string): Promise<boolean> => {
    console.warn('Funcionalidad de eliminaciÃ³n de campos personales temporalmente deshabilitada');
    return false;
  }, []);

  // Guardar valor de campo - temporalmente deshabilitado
  const saveFieldValue = useCallback(
    async (fieldName: string, value: FieldValue): Promise<boolean> => {
      console.warn('Funcionalidad de guardado de valores temporalmente deshabilitada');
      return false;
    },
    [userId]
  );

  // Cargar valores de campos - temporalmente deshabilitado
  const loadFieldValues = useCallback(async (): Promise<Record<string, any>> => {
    console.warn('Funcionalidad de carga de valores temporalmente deshabilitada');
    return {};
  }, [userId]);

  // Cargar datos iniciales
  useEffect(() => {
    loadPersonalFields();
  }, [loadPersonalFields]);

  return {
    personalFields,
    isLoading,
    error,
    createPersonalField,
    updatePersonalField,
    deletePersonalField,
    saveFieldValue,
    loadFieldValues,
    refresh: loadPersonalFields,
  };
}
