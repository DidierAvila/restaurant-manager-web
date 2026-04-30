export interface PermissionFilters {
  name?: string;
  status?: boolean;
  module?: string;
  action?: 'read' | 'create' | 'edit' | 'delete' | 'config';
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPermissionResult {
  permissions: any[]; // Se tiparÃ¡ con Permission[] cuando se use
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreatePermissionData {
  name: string;
  description: string;
  module: string;
  action: 'read' | 'create' | 'edit' | 'delete' | 'config';
  status: boolean;
}

export interface UpdatePermissionData {
  name?: string;
  description?: string;
  module?: string;
  action?: 'read' | 'create' | 'edit' | 'delete' | 'config';
  status?: boolean;
}