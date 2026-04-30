import { v4 as uuidv4 } from 'uuid';

export class PermissionId {
  private constructor(private readonly _value: string) {
    this.ensureIsValid(_value);
  }

  static generate(): PermissionId {
    return new PermissionId(uuidv4());
  }

  static fromString(value: string): PermissionId {
    return new PermissionId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PermissionId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('PermissionId cannot be empty');
    }
  }
}