/**
 * CreateRoleData Value Object - Datos para crear/actualizar roles
 * Usa ids de permisos (string[]) para interoperar con la API
 */

export interface CreateRoleDataProps {
  name: string;
  description: string;
  permissions: string[];
  status: boolean;
}

export class CreateRoleData {
  private constructor(private readonly props: CreateRoleDataProps) {
    this.validate();
  }

  static create(data: {
    name: string;
    description: string;
    permissions: string[];
    status: boolean;
  }): CreateRoleData {
    return new CreateRoleData({
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      status: data.status,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): string[] {
    return this.props.permissions;
  }

  get status(): boolean {
    return this.props.status;
  }

  private validate(): void {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Name is required');
    }
  }

  // ConversiÃ³n a primitivos para API
  toPrimitives(): {
    name: string;
    description: string;
    permissions: string[];
    status: boolean;
  } {
    return {
      name: this.props.name,
      description: this.props.description,
      permissions: this.props.permissions,
      status: this.props.status,
    };
  }
}
