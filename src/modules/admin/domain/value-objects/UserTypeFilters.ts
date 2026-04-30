/**
 * UserFilters Value Object - Filtros para bÃºsqueda de usuarios
 */

export interface UserTypeFiltersProps {
  search?: string;
  name?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export class UserTypeFilters {
  private constructor(private readonly props: UserTypeFiltersProps) {}

  static create(props: UserTypeFiltersProps = {}): UserTypeFilters {
    return new UserTypeFilters({
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

  get status(): string | undefined {
    return this.props.status;
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
      Status: this.props.status,
      Page: this.props.page,
      PageSize: this.props.pageSize,
      SortBy: this.props.sortBy,
      SortDescending: this.props.sortDescending,
    };
  }
}
