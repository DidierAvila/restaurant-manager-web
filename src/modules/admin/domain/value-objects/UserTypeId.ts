/**
 * UserTypeId Value Object - Identificador Ãºnico para Tipo de Usuario
 */

import { v4 as uuidv4 } from 'uuid';

export class UserTypeId {
  private constructor(private readonly _value: string) {
    this.ensureIsValid(_value);
  }

  static generate(): UserTypeId {
    return new UserTypeId(uuidv4());
  }

  static fromString(value: string): UserTypeId {
    return new UserTypeId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserTypeId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('UserTypeId cannot be empty');
    }
  }
}
