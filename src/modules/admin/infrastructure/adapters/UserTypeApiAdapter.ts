/**
 * UserTypeApiAdapter - Adaptador para transformar datos entre API y dominio
 */

import { UserType } from '../../domain/entities/UserType';
import { UserTypeFilters } from '../../domain/value-objects/UserTypeFilters';
import { CreateUserTypeData } from '../../domain/value-objects/CreateUserTypeData';

// Tipos de la API (basados en el servicio existente)
export interface ApiUserType {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  userCount?: number;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
}

interface ApiCreateUserTypeData {
  name: string;
  description?: string;
  status?: boolean;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: {
    [key: string]: any;
  };
}

interface ApiUpdateUserTypeData {
  name?: string;
  description?: string;
  status?: boolean;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: {
    [key: string]: any;
  };
}

interface ApiUserTypeFilters {
  Search?: string;
  Name?: string;
  Status?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}

export class UserTypeApiAdapter {
  /**
   * Convierte datos de la API a entidad de dominio
   */
  fromApi(apiUserType: ApiUserType): UserType {
    // ValidaciÃ³n defensiva para evitar errores si apiUserType es undefined o null
    if (!apiUserType) {
      throw new Error('Los datos del tipo de usuario desde la API son undefined o null');
    }

    return UserType.fromPrimitives({
      id: apiUserType.id || '',
      name: apiUserType.name || '',
      description: apiUserType.description || '',
      status: apiUserType.status ?? false,
      userCount: apiUserType.userCount,
      theme: apiUserType.theme,
      defaultLandingPage: apiUserType.defaultLandingPage,
      logoUrl: apiUserType.logoUrl,
      language: apiUserType.language,
      additionalConfig: apiUserType.additionalConfig,
      createdAt: new Date(apiUserType.createdAt),
      updatedAt: apiUserType.updatedAt ? new Date(apiUserType.updatedAt) : undefined,
    });
  }

  /**
   * Convierte entidad de dominio a datos de la API
   */
  toApi(userType: UserType): ApiUserType {
    return {
      id: userType.id.value,
      name: userType.name,
      description: userType.description,
      status: userType.status,
      theme: userType.theme,
      defaultLandingPage: userType.defaultLandingPage,
      logoUrl: userType.logoUrl,
      language: userType.language,
      additionalConfig: userType.additionalConfig,
      createdAt: userType.createdAt.toISOString(),
      updatedAt: userType.updatedAt?.toISOString(),
    };
  }

  createDataToApi(data: CreateUserTypeData): ApiCreateUserTypeData {
    return {
      name: data.name,
      description: data.description,
      status: data.status ?? true,
      theme: data.theme,
      defaultLandingPage: data.defaultLandingPage,
      logoUrl: data.logoUrl,
      language: data.language,
      additionalConfig: data.additionalConfig,
    };
  }

  updateDataToApi(data: CreateUserTypeData): ApiUpdateUserTypeData {
    return {
      name: data.name,
      description: data.description,
      status: data.status,
      theme: data.theme,
      defaultLandingPage: data.defaultLandingPage,
      logoUrl: data.logoUrl,
      language: data.language,
      additionalConfig: data.additionalConfig,
    };
  }

  filtersToApi(filters: UserTypeFilters): ApiUserTypeFilters {
    const primitives = filters.toPrimitives();
    return {
      Search: primitives.Search as string,
      Name: primitives.Name as string,
      Status: primitives.Status as string,
      Page: primitives.Page as number,
      PageSize: primitives.PageSize as number,
      SortBy: primitives.SortBy as string,
      SortDescending: primitives.SortDescending as boolean,
    };
  }
}
