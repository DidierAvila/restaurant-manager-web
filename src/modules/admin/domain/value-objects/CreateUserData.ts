/**
 * CreateUserData Value Object - Datos para crear un nuevo usuario
 */

import { Email } from './Email';
import { UserTypeId } from './UserTypeId';

export interface CreateUserDataProps {
  name: string;
  email: Email;
  password: string;
  image?: string;
  phone?: string;
  userTypeId: UserTypeId;
  address?: string;
  additionalData?: Record<string, unknown>;
  roleIds: string[];
  status?: boolean;
}

export class CreateUserData {
  private constructor(private readonly props: CreateUserDataProps) {
    this.validate();
  }

  static create(data: {
    name: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
    userTypeId: string;
    address?: string;
    additionalData?: Record<string, unknown>;
    roleIds: string[];
    status?: boolean;
  }): CreateUserData {
    return new CreateUserData({
      name: data.name,
      email: Email.fromString(data.email),
      password: data.password,
      image: data.image,
      phone: data.phone,
      userTypeId: UserTypeId.fromString(data.userTypeId),
      address: data.address,
      additionalData: data.additionalData,
      roleIds: data.roleIds,
      status: data.status,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get image(): string | undefined {
    return this.props.image;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get userTypeId(): UserTypeId {
    return this.props.userTypeId;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get additionalData(): Record<string, unknown> | undefined {
    return this.props.additionalData;
  }

  get roleIds(): string[] {
    return [...this.props.roleIds];
  }

  get status(): boolean | undefined {
    return this.props.status;
  }

  private validate(): void {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (!this.props.password || this.props.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!this.props.roleIds || this.props.roleIds.length === 0) {
      throw new Error('At least one role is required');
    }
  }

  // ConversiÃ³n a primitivos para API
  toPrimitives(): {
    name: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
    userTypeId: string;
    address?: string;
    additionalData?: Record<string, unknown>;
    roleIds: string[];
    status?: boolean;
  } {
    return {
      name: this.props.name,
      email: this.props.email.value,
      password: this.props.password,
      image: this.props.image,
      phone: this.props.phone,
      userTypeId: this.props.userTypeId.value,
      address: this.props.address,
      additionalData: this.props.additionalData,
      roleIds: [...this.props.roleIds],
      status: this.props.status,
    };
  }
}
