/**
 * UserFilters Value Object - Filtros para bÃºsqueda de usuarios
 */

export interface UserFiltersProps {
  search?: string;
  name?: string;
  email?: string;
  roleId?: string;
  userTypeId?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export class UserFilters {
  private constructor(private readonly props: UserFiltersProps) {}

  static create(props: UserFiltersProps = {}): UserFilters {
    return new UserFilters({
      page: props.page || 1,
      pageSize: props.pageSize || 10,
      ...props,
    });
  }

  get search(): string | undefined {
    return this.props.search;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get roleId(): string | undefined {
    return this.props.roleId;
  }

  get userTypeId(): string | undefined {
    return this.props.userTypeId;
  }

  get status(): string | undefined {
    return this.props.status;
  }

  get createdAfter(): Date | undefined {
    return this.props.createdAfter;
  }

  get createdBefore(): Date | undefined {
    return this.props.createdBefore;
  }

  get page(): number {
    return this.props.page || 1;
  }

  get pageSize(): number {
    return this.props.pageSize || 10;
  }

  get sortBy(): string | undefined {
    return this.props.sortBy;
  }

  get sortDescending(): boolean | undefined {
    return this.props.sortDescending;
  }

  // ConversiÃ³n a primitivos para API
  toPrimitives(): Record<string, string | number | boolean | undefined> {
    return {
      Search: this.props.search,
      Name: this.props.name,
      Email: this.props.email,
      RoleId: this.props.roleId,
      UserTypeId: this.props.userTypeId,
      Status: this.props.status,
      CreatedAfter: this.props.createdAfter?.toISOString(),
      CreatedBefore: this.props.createdBefore?.toISOString(),
      Page: this.props.page,
      PageSize: this.props.pageSize,
      SortBy: this.props.sortBy,
      SortDescending: this.props.sortDescending,
    };
  }
}