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

    setPersonalFields([]);
    setIsLoading(false);
    setError(null);
  }, [userId]);

  // Crear campo personal - temporalmente deshabilitado
  const createPersonalField = useCallback(
    async (fieldData: CreateUserPersonalFieldDto): Promise<UserPersonalField | undefined> => {
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
      return undefined;
    },
    []
  );

  // Eliminar campo personal - temporalmente deshabilitado
  const deletePersonalField = useCallback(async (fieldId: string): Promise<boolean> => {
    return false;
  }, []);

  // Guardar valor de campo - temporalmente deshabilitado
  const saveFieldValue = useCallback(
    async (fieldName: string, value: FieldValue): Promise<boolean> => {
      return false;
    },
    [userId]
  );

  // Cargar valores de campos - temporalmente deshabilitado
  const loadFieldValues = useCallback(async (): Promise<Record<string, any>> => {
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
