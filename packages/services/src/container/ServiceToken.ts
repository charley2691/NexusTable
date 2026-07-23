export interface ServiceToken<T> {
  readonly id: symbol;
  readonly name: string;
}

/**
 * Creates a strongly typed identifier for a service.
 *
 * The generic type prevents a token from resolving to the
 * wrong kind of service at compile time.
 */
export function createServiceToken<T>(
  name: string
): ServiceToken<T> {
  if (name.trim().length === 0) {
    throw new Error(
      "Service token name cannot be empty."
    );
  }

  return {
    id: Symbol(name),
    name
  };
}