import assert from "node:assert/strict";

import {
  createServiceToken,
  ServiceContainer
} from "./index.js";

interface TestService {
  getMessage(): string;
}

const TestServiceToken =
  createServiceToken<TestService>(
    "TestService"
  );

const container =
  new ServiceContainer();

const originalService: TestService = {
  getMessage: () => "original"
};

container.register(
  TestServiceToken,
  originalService
);

assert.equal(
  container.has(TestServiceToken),
  true
);

console.log(
  "✓ registered service is available"
);

assert.equal(
  container.resolve(
    TestServiceToken
  ).getMessage(),
  "original"
);

console.log(
  "✓ registered service can be resolved"
);

assert.equal(
  container.size,
  1
);

console.log(
  "✓ container reports its size"
);

assert.throws(
  () => {
    container.register(
      TestServiceToken,
      originalService
    );
  },
  /already registered/
);

console.log(
  "✓ duplicate registration is rejected"
);

const replacementService: TestService = {
  getMessage: () => "replacement"
};

container.replace(
  TestServiceToken,
  replacementService
);

assert.equal(
  container.resolve(
    TestServiceToken
  ).getMessage(),
  "replacement"
);

console.log(
  "✓ registered service can be replaced"
);

container.remove(
  TestServiceToken
);

assert.equal(
  container.has(TestServiceToken),
  false
);

console.log(
  "✓ registered service can be removed"
);

assert.throws(
  () => {
    container.resolve(
      TestServiceToken
    );
  },
  /not registered/
);

console.log(
  "✓ resolving a missing service throws"
);

assert.equal(
  container.tryResolve(
    TestServiceToken
  ),
  undefined
);

console.log(
  "✓ missing service can be queried safely"
);

container.register(
  TestServiceToken,
  originalService
);

container.clear();

assert.equal(
  container.size,
  0
);

console.log(
  "✓ container can be cleared"
);

console.log(
  "\nAll ServiceContainer tests passed."
);