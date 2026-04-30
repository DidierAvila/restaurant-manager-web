/**
 * Email Value Object - Dirección de correo electrónico válida
 */

export class Email {
  private constructor(private readonly _value: string) {
    this.ensureIsValid(_value);
  }

  static fromString(value: string): Email {
    return new Email(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  getDomain(): string {
    return this._value.split('@')[1];
  }

  getLocalPart(): string {
    return this._value.split('@')[0];
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Invalid email format: ${value}`);
    }
  }
}
