/**
 * Role Entity - Entidad de dominio para Rol
 * Representa un rol del sistema con sus permisos y comportamientos
 */

import { RoleId } from '../value-objects/RoleId';

export interface RolePermission {
  id: string;
  name: string;
}

export interface RoleProps {
  id: RoleId;
  name: string;
  description: string;
  permissions: RolePermission[];
  status: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Role {
  private constructor(private props: RoleProps) {}

  static create(
    props: Omit<RoleProps, 'id' | 'createdAt'> & {
      id?: RoleId;
      createdAt?: Date;
    }
  ): Role {
    return new Role({
      id: props.id || RoleId.generate(),
      createdAt: props.createdAt || new Date(),
      ...props,
    });
  }

  static fromPrimitives(data: {
    id: string;
    name: string;
    description: string;
    permissions: RolePermission[];
    status: boolean;
    createdAt: string;
    updatedAt?: string;
  }): Role {
    return new Role({
      id: RoleId.fromString(data.id),
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });
  }

  // Getters
  get id(): RoleId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): RolePermission[] {
    return [...this.props.permissions];
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

  // MÃ©todos de negocio
  isActive(): boolean {
    return this.props.status;
  }

  hasPermission(permissionId: string): boolean {
    return this.props.permissions.some((permission) => permission.id === permissionId);
  }

  activate(): void {
    this.props.status = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = false;
    this.props.updatedAt = new Date();
  }

  updateInfo(data: { name?: string; description?: string }): void {
    if (data.name) this.props.name = data.name;
    if (data.description) this.props.description = data.description;
    this.props.updatedAt = new Date();
  }

  assignPermissions(permissions: RolePermission[]): void {
    this.props.permissions = [...permissions];
    this.props.updatedAt = new Date();
  }

  addPermission(permission: RolePermission): void {
    if (!this.hasPermission(permission.id)) {
      this.props.permissions.push(permission);
      this.props.updatedAt = new Date();
    }
  }

  removePermission(permissionId: string): void {
    this.props.permissions = this.props.permissions.filter(
      (permission) => permission.id !== permissionId
    );
    this.props.updatedAt = new Date();
  }

  // ConversiÃ³n a primitivos para persistencia
  toPrimitives(): {
    id: string;
    name: string;
    description: string;
    permissions: RolePermission[];
    status: boolean;
    createdAt: string;
    updatedAt?: string;
  } {
    return {
      id: this.props.id.value,
      name: this.props.name,
      description: this.props.description,
      permissions: [...this.props.permissions],
      status: this.props.status,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt?.toISOString(),
    };
  }
}
