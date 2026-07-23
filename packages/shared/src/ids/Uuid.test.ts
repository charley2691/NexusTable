import assert from "node:assert/strict";

import {
    createUuid,
    isUuid,
} from "./Uuid";

const firstId = createUuid();
const secondId = createUuid();

assert.equal(
    isUuid(firstId),
    true,
    "Generated ID should be a valid UUID v4.",
);

console.log(
    "✓ generated ID is a valid UUID v4",
);

assert.notEqual(
    firstId,
    secondId,
    "Separate UUID calls should produce different IDs.",
);

console.log(
    "✓ separate calls generate different IDs",
);

assert.equal(
    isUuid("asset-001"),
    false,
    "Legacy custom IDs should not be recognised as UUIDs.",
);

console.log(
    "✓ legacy custom ID is rejected by UUID validation",
);

assert.equal(
    isUuid("not-an-id"),
    false,
    "Invalid strings should not be recognised as UUIDs.",
);

console.log(
    "✓ invalid string is rejected",
);

assert.equal(
    isUuid(undefined),
    false,
    "Non-string values should be rejected.",
);

console.log(
    "✓ non-string values are rejected",
);

console.log(
    "\nAll UUID utility tests passed.",
);