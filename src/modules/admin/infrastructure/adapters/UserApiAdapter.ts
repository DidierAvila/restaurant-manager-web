/**
 * UserApiAdapter - Adaptador para transformar datos entre API y dominio
 */

import { User } from '../../domain/entities/User';
import { CreateUserData } from '../../domain/value-objects/CreateUserData';
import { Email } from '../../domain/value-objects/Email';
import { UserTypeId } from '../../domain/value-objects/UserTypeId';
import { UserFilters } from '../../domain/value-objects/UserFilters';

// Tipos de la API (basados en el servicio existente)
interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  firstRoleName?: string | null;
  userTypeId: string;
  userTypeName: string;
  roleIds?: string[];
  roles?: Array<{ id: string; name: string; description?: string }>;
  additionalData?: {
    profile?: string;
    [key: string]: any;
  };
  status?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface ApiCreateUserData {
  name: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  userTypeId: string;
  address?: string;
  additionalData?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
  roleIds: string[];
  status?: boolean;
}

interface ApiUserFilters {
  Search?: string;
  Name?: string;
  Email?: string;
  RoleId?: string;
  UserTypeId?: string;
  Status?: string;
  CreatedAfter?: string;
  CreatedBefore?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}

export class UserApiAdapter {
  /**
   * Convierte datos de la API a entidad de dominio
   */
  fromApi(apiUser: ApiUser): User {
    // ValidaciÃ³n defensiva para evitar errores si apiUser es undefined o null
    if (!apiUser) {
      throw new Error('Los datos del usuario desde la API son undefined o null');
    }
    // Extraer roleIds del array de roles si existe, sino usar roleIds directamente
    let roleIds: string[] = [];
    if (Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
      roleIds = apiUser.roles.map((role) => role.id);
    } else if (Array.isArray(apiUser.roleIds)) {
      roleIds = apiUser.roleIds;
    }

    // Obtener el primer nombre de rol si existe
    let firstRoleName: string | null = null;
    if (Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
      firstRoleName = apiUser.roles[0].name;
    } else if (apiUser.firstRoleName) {
      firstRoleName = apiUser.firstRoleName;
    }

    return User.fromPrimitives({
      id: apiUser.id || '',
      name: apiUser.name || '',
      email: apiUser.email || '',
      phone: apiUser.phone || '',
      address: apiUser.address || '',
      image: apiUser.image || '',
      userTypeId: apiUser.userTypeId || '',
      userTypeName: apiUser.userTypeName || '',
      roleIds: roleIds,
      firstRoleName: firstRoleName,
      additionalData: apiUser.additionalData || {},
      status: Boolean(apiUser.status !== undefined ? apiUser.status : true), // Por defecto true para nuevos usuarios
      createdAt: apiUser.createdAt || new Date().toISOString(),
      updatedAt: apiUser.updatedAt || new Date().toISOString(),
      lastLogin: apiUser.lastLogin || undefined,
    });
  }

  /**
   * Convierte entidad de dominio a datos de API
   */
  toApi(user: User): ApiUser {
    const primitives = user.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      email: primitives.email,
      phone: primitives.phone,
      address: primitives.address,
      image: primitives.image,
      userTypeId: primitives.userTypeId,
      userTypeName: primitives.userTypeName,
      roleIds: primitives.roleIds,
      firstRoleName: primitives.firstRoleName,
      additionalData: primitives.additionalData,
      status: primitives.status,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
      lastLogin: primitives.lastLogin,
    };
  }

  /**
   * Convierte CreateUserData a formato de API
   */
  createDataToApi(createData: CreateUserData): ApiCreateUserData {
    const primitives = createData.toPrimitives();
    return {
      name: primitives.name,
      email: primitives.email,
      password: primitives.password,
      image: primitives.image,
      phone: primitives.phone,
      userTypeId: primitives.userTypeId,
      address: primitives.address,
      additionalData: primitives.additionalData,
      roleIds: primitives.roleIds,
      status: primitives.status,
    };
  }

  /**
   * Convierte datos de actualizaciÃ³n a formato de API
   */
  updateDataToApi(updateData: Partial<CreateUserData>): Partial<ApiCreateUserData> {
    const primitives = updateData.toPrimitives ? updateData.toPrimitives() : (updateData as any);

    const normalizedEmail: string | undefined = primitives?.email instanceof Email
      ? primitives.email.value
      : (primitives?.email as string | undefined);

    const normalizedUserTypeId: string | undefined = primitives?.userTypeId instanceof UserTypeId
      ? primitives.userTypeId.value
      : (primitives?.userTypeId as string | undefined);

    return {
      name: primitives.name as string | undefined,
      email: normalizedEmail,
      userTypeId: normalizedUserTypeId,
      roleIds: primitives.roleIds as string[] | undefined,
      status: primitives.status as boolean | undefined,
      phone: primitives.phone as string | undefined,
      address: primitives.address as string | undefined,
      image: primitives.image as string | undefined,
      additionalData: primitives.additionalData as Record<string, unknown> | undefined,
    };
  }

  /**
   * Convierte filtros de dominio a formato de API
   */
  filtersToApi(filters: UserFilters): ApiUserFilters {
    const primitives = filters.toPrimitives();
    return {
      Search: primitives.Search as string,
      Name: primitives.Name as string,
      Email: primitives.Email as string,
      RoleId: primitives.RoleId as string,
      UserTypeId: primitives.UserTypeId as string,
      Status: primitives.Status as string,
      CreatedAfter: primitives.CreatedAfter as string,
      CreatedBefore: primitives.CreatedBefore as string,
      Page: primitives.Page as number,
      PageSize: primitives.PageSize as number,
      SortBy: primitives.SortBy as string,
      SortDescending: primitives.SortDescending as boolean,
    };
  }
}
