import assert from "node:assert/strict";

import {
  AssetBlobStoreToken,
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
    AssetBlobStoreToken
  ),
  true
);

console.log(
  "✓ asset blob store is registered"
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

const fileData =
  new TextEncoder().encode(
    "fake image data"
  );

const asset =
  await assetService.upload({
    name: "Dungeon Map.png",
    kind: "map",
    mimeType: "image/png",
    sizeBytes: fileData.byteLength,
    data: fileData,
    tags: [
      "Dungeon",
      "Map",
      "dungeon"
    ],
    width: 1920,
    height: 1080
  });

assert.equal(
  asset.name,
  "Dungeon Map.png"
);

assert.equal(
  asset.kind,
  "map"
);

assert.equal(
  asset.extension,
  "png"
);

assert.equal(
  asset.sha256.length,
  64
);

assert.deepEqual(
  asset.tags,
  [
    "dungeon",
    "map"
  ]
);

console.log(
  "✓ validated asset can be uploaded and hashed"
);

const storedContent =
  await assetService.getContent(
    asset.id
  );

assert.notEqual(
  storedContent,
  undefined
);

assert.deepEqual(
  Array.from(storedContent ?? []),
  Array.from(fileData)
);

console.log(
  "✓ asset content can be retrieved"
);

if (storedContent !== undefined) {
  storedContent[0] = 255;
}

const unchangedContent =
  await assetService.getContent(
    asset.id
  );

assert.deepEqual(
  Array.from(unchangedContent ?? []),
  Array.from(fileData)
);

console.log(
  "✓ stored asset content cannot be mutated externally"
);

const duplicate =
  await assetService.upload({
    name: "Duplicate Name.png",
    kind: "map",
    mimeType: "image/png",
    sizeBytes: fileData.byteLength,
    data: fileData
  });

assert.equal(
  duplicate.id,
  asset.id
);

console.log(
  "✓ duplicate asset data is detected"
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
  await assetService.getContent(
    asset.id
  ),
  undefined
);

console.log(
  "✓ asset content is deleted with its metadata"
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