/**
 * Restaurant Module - DDD Architecture
 *
 * Este módulo sigue los principios de Domain-Driven Design (DDD) con las siguientes capas:
 *
 * - Domain: Entidades, Value Objects, Repositorios (interfaces)
 * - Application: Casos de Uso (Use Cases)
 * - Infrastructure: Implementaciones de repositorios, adaptadores de API
 * - Presentation: Hooks, componentes de UI, páginas
 */

// DDD Layers
export * from './application';
export * from './domain';
export * from './infrastructure';
export * from './presentation';
