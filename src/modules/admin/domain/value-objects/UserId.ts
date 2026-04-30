/**
 * UserId Value Object - Identificador Ãºnico para Usuario
 */

import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private constructor(private readonly _value: string) {
    this.ensureIsValid(_value);
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }

  static fromString(value: string): UserId {
    return new UserId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }
}
