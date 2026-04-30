/**
 * UserType Entity - Entidad de dominio para Tipo de Usuario
 * Representa un tipo de usuario en el sistema con sus propiedades y comportamientos
 */

import { UserTypeId } from '../value-objects/UserTypeId';

export interface UserTypeProps {
  id: UserTypeId;
  name: string;
  description: string;
  status: boolean;
  userCount?: number;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: {
    navigation?: unknown[];
    dynamicFields?: any[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserTypeData {
  id: string;
  name: string;
  description: string;
  status: boolean;
  userCount?: number;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: {
    navigation?: any[];
    dynamicFields?: any[];
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
}

export class UserType {
  private constructor(private props: UserTypeProps) {}

  static create(
    props: Omit<UserTypeProps, 'id' | 'createdAt'> & {
      id?: UserTypeId;
      createdAt?: Date;
    }
  ): UserType {
    return new UserType({
      id: props.id || UserTypeId.generate(),
      createdAt: props.createdAt || new Date(),
      ...props,
    });
  }

  static fromPrimitives(data: {
    id: string;
    name: string;
    description: string;
    status: string | boolean;
    userCount?: number;
    theme?: string;
    defaultLandingPage?: string;
    logoUrl?: string;
    language?: string;
    additionalConfig?: Record<string, unknown>;
    createdAt: Date;
    updatedAt?: Date;
  }): UserType {
    return new UserType({
      id: UserTypeId.fromString(data.id),
      name: data.name,
      description: data.description,
      status: typeof data.status === 'string' ? data.status === 'true' : data.status,
      userCount: data.userCount,
      theme: data.theme,
      defaultLandingPage: data.defaultLandingPage,
      logoUrl: data.logoUrl,
      language: data.language,
      additionalConfig: data.additionalConfig,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // Getters
  get id(): UserTypeId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): boolean {
    return this.props.status;
  }

  get userCount(): number | undefined {
    return this.props.userCount;
  }

  get theme(): string | undefined {
    return this.props.theme;
  }

  get defaultLandingPage(): string | undefined {
    return this.props.defaultLandingPage;
  }

  get logoUrl(): string | undefined {
    return this.props.logoUrl;
  }

  get language(): string | undefined {
    return this.props.language;
  }

  get additionalConfig(): UserTypeProps['additionalConfig'] {
    return this.props.additionalConfig;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // MÃ©todos de negocio
  activate(): UserType {
    return new UserType({
      ...this.props,
      status: true,
      updatedAt: new Date(),
    });
  }

  deactivate(): UserType {
    return new UserType({
      ...this.props,
      status: false,
      updatedAt: new Date(),
    });
  }

  updateInfo(data: {
    name?: string;
    description?: string;
    theme?: string;
    defaultLandingPage?: string;
    logoUrl?: string;
    language?: string;
  }): UserType {
    return new UserType({
      ...this.props,
      name: data.name ?? this.props.name,
      description: data.description ?? this.props.description,
      theme: data.theme ?? this.props.theme,
      defaultLandingPage: data.defaultLandingPage ?? this.props.defaultLandingPage,
      logoUrl: data.logoUrl ?? this.props.logoUrl,
      language: data.language ?? this.props.language,
      updatedAt: new Date(),
    });
  }

  updateAdditionalConfig(config: UserTypeProps['additionalConfig']): UserType {
    return new UserType({
      ...this.props,
      additionalConfig: config,
      updatedAt: new Date(),
    });
  }

  // Validaciones
  private validate(): void {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('UserType name cannot be empty');
    }

    if (!this.props.description || this.props.description.trim().length === 0) {
      throw new Error('UserType description cannot be empty');
    }

    if (this.props.name.length > 100) {
      throw new Error('UserType name cannot exceed 100 characters');
    }

    if (this.props.description.length > 500) {
      throw new Error('UserType description cannot exceed 500 characters');
    }
  }

  // MÃ©todos de comparaciÃ³n
  equals(other: UserType): boolean {
    return this.props.id.equals(other.props.id);
  }

  // SerializaciÃ³n
  toData(): UserTypeData {
    return {
      id: this.props.id.value,
      name: this.props.name,
      description: this.props.description,
      status: this.props.status,
      theme: this.props.theme,
      defaultLandingPage: this.props.defaultLandingPage,
      logoUrl: this.props.logoUrl,
      language: this.props.language,
      additionalConfig: this.props.additionalConfig,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt?.toISOString(),
    };
  }
}
