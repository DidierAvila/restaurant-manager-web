/**
 * User Entity - Entidad de dominio para Usuario
 * Representa un usuario del sistema con sus propiedades y comportamientos
 */

import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';
import { UserTypeId } from '../value-objects/UserTypeId';

export interface UserProps {
  id: UserId;
  name: string;
  email: Email;
  phone?: string;
  address?: string;
  image?: string;
  userTypeId: UserTypeId;
  userTypeName: string;
  roleIds: string[];
  firstRoleName?: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  additionalData?: Record<string, unknown>;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(
    props: Omit<UserProps, 'id' | 'createdAt'> & {
      id?: UserId;
      createdAt?: Date;
    }
  ): User {
    return new User({
      id: props.id || UserId.generate(),
      createdAt: props.createdAt || new Date(),
      ...props,
    });
  }

  static fromPrimitives(data: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
    userTypeId: string;
    userTypeName: string;
    roleIds: string[];
    firstRoleName?: string | null;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
    additionalData?: Record<string, unknown>;
  }): User {
    return new User({
      id: UserId.fromString(data.id),
      name: data.name,
      email: Email.fromString(data.email),
      phone: data.phone,
      address: data.address,
      image: data.image,
      userTypeId: UserTypeId.fromString(data.userTypeId),
      userTypeName: data.userTypeName,
      roleIds: data.roleIds,
      firstRoleName: data.firstRoleName,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
      additionalData: data.additionalData,
    });
  }

  // Getters
  get id(): UserId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get image(): string | undefined {
    return this.props.image;
  }

  get userTypeId(): UserTypeId {
    return this.props.userTypeId;
  }

  get userTypeName(): string {
    return this.props.userTypeName;
  }

  get roleIds(): string[] {
    return [...this.props.roleIds];
  }

  get firstRoleName(): string | null | undefined {
    return this.props.firstRoleName;
  }

  get status(): boolean {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get additionalData(): Record<string, unknown> | undefined {
    return this.props.additionalData ? { ...this.props.additionalData } : undefined;
  }

  // MÃ©todos de negocio
  isActive(): boolean {
    return this.props.status;
  }

  hasRole(roleId: string): boolean {
    return this.props.roleIds.includes(roleId);
  }

  activate(): void {
    this.props.status = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = false;
    this.props.updatedAt = new Date();
  }

  updateProfile(data: { name?: string; phone?: string; address?: string; image?: string }): void {
    if (data.name) this.props.name = data.name;
    if (data.phone !== undefined) this.props.phone = data.phone;
    if (data.address !== undefined) this.props.address = data.address;
    if (data.image !== undefined) this.props.image = data.image;
    this.props.updatedAt = new Date();
  }

  assignRoles(roleIds: string[]): void {
    this.props.roleIds = [...roleIds];
    this.props.updatedAt = new Date();
  }

  recordLogin(): void {
    this.props.lastLogin = new Date();
  }

  // ConversiÃ³n a primitivos para persistencia
  toPrimitives(): {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
    userTypeId: string;
    userTypeName: string;
    roleIds: string[];
    firstRoleName?: string | null;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
    additionalData?: Record<string, any>;
  } {
    return {
      id: this.props.id.value,
      name: this.props.name,
      email: this.props.email.value,
      phone: this.props.phone,
      address: this.props.address,
      image: this.props.image,
      userTypeId: this.props.userTypeId.value,
      userTypeName: this.props.userTypeName,
      roleIds: [...this.props.roleIds],
      firstRoleName: this.props.firstRoleName,
      status: this.props.status,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt?.toISOString(),
      lastLogin: this.props.lastLogin?.toISOString(),
      additionalData: this.props.additionalData,
    };
  }
}
