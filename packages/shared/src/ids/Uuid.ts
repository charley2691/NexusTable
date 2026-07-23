/**
 * UUIDs remain strings at runtime.
 *
 * This alias documents where globally unique identifiers
 * are expected without forcing a disruptive migration of
 * every existing interface immediately.
 */
export type UUID = string;

interface CryptoWithRandomUuid {
    randomUUID?: () => string;
}

/**
 * Generates a cryptographically secure UUID v4.
 *
 * This uses the Web Crypto-compatible API available in
 * modern browsers and current versions of Node.js.
 */
export function createUuid(): UUID {
    const runtime = globalThis as typeof globalThis & {
        crypto?: CryptoWithRandomUuid;
    };

    if (
        !runtime.crypto ||
        typeof runtime.crypto.randomUUID !== "function"
    ) {
        throw new Error(
            "Secure UUID generation is unavailable in this runtime.",
        );
    }

    return runtime.crypto.randomUUID();
}

/**
 * Checks whether a value is a valid UUID v4 string.
 */
export function isUuid(
    value: unknown,
): value is UUID {
    if (typeof value !== "string") {
        return false;
    }

    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(value);
}