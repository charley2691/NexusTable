import {
  ServiceContainer
} from "../container/index.js";

import {
  AssetRepositoryToken,
  AssetService,
  AssetServiceToken,
  MemoryAssetRepository
} from "../assets/index.js";

export function createServiceContainer():
  ServiceContainer {
  const container =
    new ServiceContainer();

  const assetRepository =
    new MemoryAssetRepository();

  const assetService =
    new AssetService(
      assetRepository
    );

  container.register(
    AssetRepositoryToken,
    assetRepository
  );

  container.register(
    AssetServiceToken,
    assetService
  );

  return container;
}