import { PermissionId } from '../value-objects/PermissionId';

export interface PermissionProps {
  id: PermissionId;
  name: string;
  description: string;
  module: string;
  action: 'read' | 'create' | 'edit' | 'delete' | 'config';
  status: boolean;
  rolesCount?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PermissionPrimitives {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'read' | 'create' | 'edit' | 'delete' | 'config';
  status: boolean;
  rolesCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export class Permission {
  private constructor(private readonly props: PermissionProps) {}

  static create(data: Omit<PermissionProps, 'id'> & { id?: PermissionId }): Permission {
    return new Permission({
      id: data.id || PermissionId.generate(),
      name: data.name,
      description: data.description,
      module: data.module,
      action: data.action,
      status: data.status,
      rolesCount: data.rolesCount || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static fromPrimitives(data: PermissionPrimitives): Permission {
    return new Permission({
      id: PermissionId.fromString(data.id),
      name: data.name,
      description: data.description,
      module: data.module,
      action: data.action,
      status: data.status,
      rolesCount: data.rolesCount || 0,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });
  }

  // Getters
  get id(): PermissionId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get module(): string {
    return this.props.module;
  }

  get action(): 'read' | 'create' | 'edit' | 'delete' | 'config' {
    return this.props.action;
  }

  get status(): boolean {
    return this.props.status;
  }

  get rolesCount(): number {
    return this.props.rolesCount || 0;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // Business methods
  isActive(): boolean {
    return this.props.status;
  }

  activate(): void {
    this.props.status = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = false;
    this.props.updatedAt = new Date();
  }

  updateInfo(data: {
    name?: string;
    description?: string;
    module?: string;
    action?: 'read' | 'create' | 'edit' | 'delete' | 'config';
  }): void {
    if (data.name !== undefined) {
      this.props.name = data.name;
    }
    if (data.description !== undefined) {
      this.props.description = data.description;
    }
    if (data.module !== undefined) {
      this.props.module = data.module;
    }
    if (data.action !== undefined) {
      this.props.action = data.action;
    }
    this.props.updatedAt = new Date();
  }

  updateRolesCount(count: number): void {
    this.props.rolesCount = count;
    this.props.updatedAt = new Date();
  }

  // Conversion methods
  toPrimitives(): PermissionPrimitives {
    return {
      id: this.props.id.value,
      name: this.props.name,
      description: this.props.description,
      module: this.props.module,
      action: this.props.action,
      status: this.props.status,
      rolesCount: this.props.rolesCount,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt?.toISOString(),
    };
  }

  equals(other: Permission): boolean {
    return this.props.id.equals(other.props.id);
  }
}
