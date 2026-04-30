/**
 * CreateUserTypeData Value Object - Datos para crear un nuevo tipo de usuario
 */

export interface CreateUserTypeDataProps {
  name: string;
  description: string;
  status: boolean;
  theme?: string;
  defaultLandingPage?: string;
  logoUrl?: string;
  language?: string;
  additionalConfig?: Record<string, unknown>;
}

export class CreateUserTypeData {
  private constructor(private readonly props: CreateUserTypeDataProps) {
    this.validate();
  }

  static create(data: {
    name: string;
    description: string;
    status: boolean;
    additionalConfig: Record<string, unknown> | undefined;
    language: string | undefined;
    logoUrl: string | undefined;
    defaultLandingPage: string | undefined;
    theme: string | undefined;
  }): CreateUserTypeData {
    return new CreateUserTypeData({
      name: data.name,
      description: data.description,
      status: data.status,
      theme: data.theme,
      defaultLandingPage: data.defaultLandingPage,
      logoUrl: data.logoUrl,
      language: data.language,
      additionalConfig: data.additionalConfig,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
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

  get additionalConfig(): Record<string, unknown> | undefined {
    return this.props.additionalConfig;
  }

  get status(): boolean | undefined {
    return this.props.status;
  }

  private validate(): void {
    if (!this.props.name || typeof this.props.name !== 'string' || this.props.name.trim().length === 0) {
      throw new Error('Name is required');
    }
  }

  // ConversiÃ³n a primitivos para API
  toPrimitives(): {
    name: string;
    description: string;
    status: boolean;
    theme?: string;
    defaultLandingPage?: string;
    logoUrl?: string;
    language?: string;
    additionalConfig?: Record<string, unknown>;
  } {
    return {
      name: this.props.name,
      description: this.props.description,
      status: this.props.status,
      theme: this.props.theme,
      defaultLandingPage: this.props.defaultLandingPage,
      logoUrl: this.props.logoUrl,
      language: this.props.language,
      additionalConfig: this.props.additionalConfig,
    };
  }
}
