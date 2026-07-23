import assert from "node:assert/strict";

import {
  AssetRepositoryToken,
  AssetServiceToken
} from "../assets/index.js";

import {
  createServiceContainer
} from "./createServiceContainer.js";

const container =
  createServiceContainer();

assert.equal(
  container.has(
    AssetRepositoryToken
  ),
  true
);

console.log(
  "✓ asset repository is registered"
);

assert.equal(
  container.has(
    AssetServiceToken
  ),
  true
);

console.log(
  "✓ asset service is registered"
);

const assetService =
  container.resolve(
    AssetServiceToken
  );

const asset =
  await assetService.create({
    name: "Dungeon Map",
    kind: "map",
    mimeType: "image/png",
    sizeBytes: 2048
  });

assert.equal(
  asset.name,
  "Dungeon Map"
);

assert.equal(
  asset.kind,
  "map"
);

console.log(
  "✓ asset can be created"
);

const storedAsset =
  await assetService.getById(
    asset.id
  );

assert.equal(
  storedAsset?.id,
  asset.id
);

console.log(
  "✓ asset can be retrieved"
);

const assets =
  await assetService.getAll();

assert.equal(
  assets.length,
  1
);

console.log(
  "✓ assets can be listed"
);

const deleted =
  await assetService.delete(
    asset.id
  );

assert.equal(
  deleted,
  true
);

assert.equal(
  await assetService.getById(
    asset.id
  ),
  undefined
);

console.log(
  "✓ asset can be deleted"
);

console.log(
  "\nComposition root and asset service tests passed."
);