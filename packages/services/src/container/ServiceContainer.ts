import {
  ServiceToken
} from "./ServiceToken.js";

export class ServiceContainer {
  private readonly services =
    new Map<symbol, unknown>();

  /**
   * Registers a service instance.
   *
   * Throws if the token has already been registered.
   */
  register<T>(
    token: ServiceToken<T>,
    service: T
  ): void {
    if (this.services.has(token.id)) {
      throw new Error(
        `Service "${token.name}" is already registered.`
      );
    }

    this.services.set(
      token.id,
      service
    );
  }

  /**
   * Registers a service or replaces its existing instance.
   *
   * This is particularly useful when replacing real services
   * with test implementations.
   */
  replace<T>(
    token: ServiceToken<T>,
    service: T
  ): void {
    this.services.set(
      token.id,
      service
    );
  }

  /**
   * Retrieves a registered service.
   *
   * Throws when no service has been registered for the token.
   */
  resolve<T>(
    token: ServiceToken<T>
  ): T {
    if (!this.services.has(token.id)) {
      throw new Error(
        `Service "${token.name}" is not registered.`
      );
    }

    return this.services.get(
      token.id
    ) as T;
  }

  /**
   * Returns a registered service when available.
   *
   * Unlike resolve(), this does not throw.
   */
  tryResolve<T>(
    token: ServiceToken<T>
  ): T | undefined {
    return this.services.get(
      token.id
    ) as T | undefined;
  }

  has<T>(
    token: ServiceToken<T>
  ): boolean {
    return this.services.has(
      token.id
    );
  }

  remove<T>(
    token: ServiceToken<T>
  ): boolean {
    return this.services.delete(
      token.id
    );
  }

  clear(): void {
    this.services.clear();
  }

  get size(): number {
    return this.services.size;
  }
}