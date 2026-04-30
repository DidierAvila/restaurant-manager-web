/**
 * RoleId Value Object - Identificador Ãºnico para Rol
 */

import { v4 as uuidv4 } from 'uuid';

export class RoleId {
  private constructor(private readonly _value: string) {
    this.ensureIsValid(_value);
  }

  static generate(): RoleId {
    return new RoleId(uuidv4());
  }

  static fromString(value: string): RoleId {
    return new RoleId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: RoleId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('RoleId cannot be empty');
    }
  }
}