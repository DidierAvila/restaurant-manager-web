/**
 * API Service - ConfiguraciÃ³n base para comunicaciÃ³n con el backend
 * Platform Web Frontend - Next.js TypeScript
 */

import { fetchWithSSL } from '@/lib/ssl-config';

// Tipos bÃ¡sicos
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

type OperationResultPayload = Record<string, unknown>;

export interface PaginatedResponse<T = unknown> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  sortBy: string | null;
}

// Tipos para autenticaciÃ³n
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: string; // Token JWT
  errors?: string[];
}

// ConfiguraciÃ³n base de la API para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7044/api';
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://localhost:7044';

/**
 * Clase para manejo de errores de API
 */
export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: string[];
  validationErrors?: Record<string, string[]>;
  endpoint?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status = 500,
    code?: string,
    errors?: string[],
    validationErrors?: Record<string, string[]>,
    endpoint?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.validationErrors = validationErrors;
    this.endpoint = endpoint;
    this.details = details;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

/**
 * Servicio base de API con mÃ©todos genÃ©ricos
 */
export class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = parseInt(process.env.API_TIMEOUT || '30000');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Establece el token de autenticaciÃ³n
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Elimina el token de autenticaciÃ³n
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Obtiene el token de autenticaciÃ³n actual
   */
  private getAuthToken(): string | null {
    return this.defaultHeaders['Authorization']?.replace('Bearer ', '') || null;
  }

  private isRecord(value: unknown): value is OperationResultPayload {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private getBooleanFlag(payload: OperationResultPayload, keys: string[]): boolean | undefined {
    for (const key of keys) {
      if (typeof payload[key] === 'boolean') {
        return payload[key] as boolean;
      }
    }

    return undefined;
  }

  private getResultValue(payload: OperationResultPayload): unknown {
    if ('data' in payload) return payload.data;
    if ('value' in payload) return payload.value;
    if ('result' in payload) return payload.result;
    return undefined;
  }

  private getErrorMessage(payload: OperationResultPayload, fallback: string): string {
    const directMessage = payload.message || payload.errorMessage || payload.title || payload.detail;
    if (typeof directMessage === 'string' && directMessage.trim()) {
      return directMessage;
    }

    const error = payload.error;
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    if (this.isRecord(error)) {
      const nestedMessage = error.message || error.description || error.title || error.code;
      if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
        return nestedMessage;
      }
    }

    return fallback;
  }

  private getErrorList(payload: OperationResultPayload): string[] {
    const errors = payload.errors || payload.validationErrors || payload.details;

    if (Array.isArray(errors)) {
      return errors
        .map((error) => {
          if (typeof error === 'string') return error;
          if (this.isRecord(error)) return this.getErrorMessage(error, '');
          return '';
        })
        .filter(Boolean);
    }

    if (this.isRecord(errors)) {
      return Object.values(errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
    }

    return [];
  }

  private unwrapOperationResult<T>(payload: unknown, endpoint: string): T {
    if (!this.isRecord(payload)) {
      return payload as T;
    }

    if (
      typeof payload.code === 'string' &&
      typeof payload.message === 'string' &&
      !('data' in payload) &&
      !('value' in payload) &&
      !('result' in payload)
    ) {
      throw new ApiError(
        payload.message,
        400,
        payload.code as string | undefined,
        this.getErrorList(payload),
        undefined,
        endpoint,
        payload
      );
    }

    const success = this.getBooleanFlag(payload, ['success', 'isSuccess', 'succeeded', 'ok']);
    const failure = this.getBooleanFlag(payload, ['failure', 'isFailure', 'failed']);
    const isOperationResult = success !== undefined || failure !== undefined;

    if (!isOperationResult) {
      return payload as T;
    }

    const operationSucceeded = success ?? !failure;
    if (!operationSucceeded) {
      throw new ApiError(
        this.getErrorMessage(payload, 'La operacion no se pudo completar.'),
        400,
        undefined,
        this.getErrorList(payload),
        undefined,
        endpoint,
        payload
      );
    }

    const value = this.getResultValue(payload);
    return (value === undefined ? {} : value) as T;
  }

  /**
   * Parsea la respuesta de error del servidor
   */
  private async parseErrorResponse(response: Response): Promise<Record<string, unknown>> {
    try {
      const contentType = response.headers.get('content-type');

      // Si la respuesta es JSON, intentar parsearlo
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();

        // Manejar diferentes formatos de respuesta del backend
        if (typeof errorData === 'string') {
          return { message: errorData };
        }

        // NUEVO: Formato del patrón Result con Code, Message y Errors
        if (errorData.Code && errorData.Message) {
          return {
            code: errorData.Code,
            message: errorData.Message,
            errors: this.getErrorList(errorData),
            validationErrors: errorData.Errors, // Errores de validación por campo
            ...errorData,
          };
        }

        // Si el backend envÃ­a un formato estructurado (retrocompatibilidad)
        if (errorData.message || errorData.error || errorData.title || errorData.errors) {
          return {
            message: this.getErrorMessage(errorData, response.statusText || 'Error desconocido'),
            errors: this.getErrorList(errorData),
            ...errorData,
          };
        }

        return errorData;
      }

      // Si no es JSON, intentar obtener el texto plano
      const textError = await response.text();
      if (textError.trim()) {
        return { message: textError };
      }

      // Fallback al statusText
      return { message: response.statusText };
    } catch {
      // Si todo falla, usar mensajes por defecto segÃºn el cÃ³digo de estado
      if (response.status === 403) {
        return { message: 'No tienes permisos para realizar esta acciÃ³n.' };
      } else if (response.status === 401) {
        return { message: 'Tu sesiÃ³n ha expirado. Por favor, inicia sesiÃ³n nuevamente.' };
      }

      return { message: response.statusText || 'Error desconocido' };
    }
  }

  /**
   * Construye la URL completa
   */
  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanBaseURL = this.baseURL.replace(/\/$/, '');

    if (cleanBaseURL.toLowerCase().endsWith('/api') && cleanEndpoint.toLowerCase().startsWith('/api/')) {
      return `${cleanBaseURL}${cleanEndpoint.slice(4)}`;
    }

    return `${cleanBaseURL}${cleanEndpoint}`;
  }

  /**
   * Realiza una peticiÃ³n HTTP genÃ©rica
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildURL(endpoint);

    const isFormData = options.body instanceof FormData;
    const headers = { ...this.defaultHeaders, ...options.headers };
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new ApiError(
          (errorData.message as string) || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code as string | undefined,
          errorData.errors as string[] | undefined,
          errorData.validationErrors as Record<string, string[]> | undefined,
          endpoint,
          errorData
        );
      }

      // Si la respuesta estÃ¡ vacÃ­a (204 No Content), retornar objeto vacÃ­o
      if (response.status === 204) {
        return {} as T;
      }

      // Verificar si hay contenido antes de intentar parsear JSON
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');

      // Si no hay content-type de JSON o content-length es 0, retornar objeto vacÃ­o
      if (!contentType?.includes('application/json') || contentLength === '0') {
        return {} as T;
      }

      // Intentar obtener el texto de la respuesta primero
      const responseText = await response.text();

      // Si el texto estÃ¡ vacÃ­o, retornar objeto vacÃ­o
      if (!responseText.trim()) {
        return {} as T;
      }

      // Intentar parsear el JSON
      let data: unknown;
      try {
        data = JSON.parse(responseText);
      } catch {
        return {} as T;
      }

      return this.unwrapOperationResult<T>(data, endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Error de red, timeout o parsing
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        undefined,
        [],
        undefined,
        endpoint
      );
    }
  }

  /**
   * PeticiÃ³n GET genÃ©rica
   */
  async get<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * PeticiÃ³n POST genÃ©rica
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  /**
   * PeticiÃ³n PUT genÃ©rica
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  /**
   * PeticiÃ³n PATCH genÃ©rica
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  /**
   * PeticiÃ³n DELETE genÃ©rica
   */
  async delete<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * Construye parÃ¡metros de URL para paginaciÃ³n y filtros
   */
  buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * PeticiÃ³n GET con parÃ¡metros de consulta
   */
  async getWithParams<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {},
    config?: RequestInit
  ): Promise<T> {
    const queryString = this.buildQueryParams(params);
    return this.get<T>(`${endpoint}${queryString}`, config);
  }

  /**
   * PeticiÃ³n GET que retorna Blob (para descargas/exportaciones)
   */
  async getBlob(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {},
    config: RequestInit = {}
  ): Promise<Blob> {
    const queryString = this.buildQueryParams(params);
    const url = this.buildURL(`${endpoint}${queryString}`);

    const requestConfig: RequestInit = {
      ...config,
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
        // Aceptar cualquier tipo de contenido, especialmente binario
        Accept: 'application/octet-stream',
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        undefined,
        [],
        undefined,
        endpoint
      );
    }

    return await response.blob();
  }
}

// Instancia por defecto del servicio API
export const apiService = new ApiService();
export const backendApiService = new ApiService(BACKEND_API_URL);

// Funciones de utilidad exportadas (compatibilidad con cÃ³digo existente)
/**
 * Servicio de autenticaciÃ³n para comunicaciÃ³n con el backend
 */

export class AuthService {
  private baseURL: string;

  constructor(baseURL: string = BACKEND_API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Realiza login con email y contraseÃ±a
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const url = `${this.baseURL}/Api/Auth/Login`;

      // Intento de login a la API de autenticaciÃ³n
      const response = await fetchWithSSL(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Respuesta recibida del servidor de autenticaciÃ³n

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        return {
          success: false,
          message:
            errorData.message ||
            `Error de autenticaciÃ³n: ${response.statusText || 'Verifique sus credenciales'}`,
          errors: errorData.errors,
        };
      }

      // Obtener el texto de la respuesta
      const responseText = await response.text();

      // El backend devuelve el token directamente como texto
      if (responseText && responseText.startsWith('eyJ')) {
        // Decodificar el token JWT para extraer informaciÃ³n del usuario
        const tokenPayload = this.decodeJWT(responseText);

        // Mapear userTypeName a un rol del sistema
        let userRole = 'employee';
        if (tokenPayload.userTypeName) {
          const userTypeName = tokenPayload.userTypeName as string;

          // Mapear userTypeName a roles del sistema
          if (userTypeName === 'Administrador') {
            userRole = 'admin';
          } else if (userTypeName === 'Supervisor') {
            userRole = 'supervisor';
          } else if (userTypeName === 'Asesor') {
            userRole = 'advisor';
          } else {
            userRole = 'employee';
          }
        } else if (credentials.email === 'admin@platform.com') {
          // Fallback para el usuario administrador
          userRole = 'admin';
        }

        // Crear objeto de usuario a partir del payload del token
        const user = {
          id: (tokenPayload.userId as string) || '10000000-0000-0000-0000-000000000001',
          email: (tokenPayload.userEmail as string) || credentials.email,
          name: (tokenPayload.userName as string) || 'Super Admin',
          role: (tokenPayload.userTypeName as string) || 'Administrador',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${(tokenPayload.userName as string) || credentials.email}`,
          department: 'Administración',
          position: (tokenPayload.userTypeName as string) || 'Administrador',
          permissions: (tokenPayload.permission as string[]) || [],
        };


        return {
          success: true,
          data: responseText, // Devolvemos directamente el token como string
          message: 'Login exitoso',
        };
      }

      // Intentar parsear como JSON si no es un token JWT
      try {
        const data = JSON.parse(responseText);
        return {
          success: true,
          data: data,
          message: data.message || 'Login exitoso',
        };
      } catch {
        throw new ApiError('Respuesta inesperada del servidor', 500, undefined, [], undefined, '/Auth/Login');
      }
    } catch (error) {
      // Error durante el proceso de login

      if (error instanceof ApiError) {
        throw error;
      }

      // Proporcionar mÃ¡s detalles sobre el error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      throw new ApiError(
        `Error de conexión con el servidor: ${errorMessage}`,
        500,
        undefined,
        [],
        undefined,
        '/Auth/Login',
        error as Record<string, unknown>
      );
    }
  }

  /**
   * Decodifica un token JWT para extraer su payload
   */
  private decodeJWT(token: string): Record<string, unknown> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  /**
   * Valida token de autenticaciÃ³n
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Api/Auth/ValidateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // En desarrollo, ignorar errores de certificado SSL
        ...(process.env.NODE_ENV === 'development' && {
          agent: false,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia del servicio de autenticaciÃ³n
export const authService = new AuthService();

export const api = {
  get: <T>(endpoint: string, config?: RequestInit) => apiService.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: RequestInit) =>
    apiService.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestInit) => apiService.delete<T>(endpoint, config),
  getWithParams: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    config?: RequestInit
  ) => apiService.getWithParams<T>(endpoint, params, config),
};

export default apiService;

