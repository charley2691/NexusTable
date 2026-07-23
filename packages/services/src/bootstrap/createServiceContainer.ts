import {
  ServiceContainer
} from "../container/index.js";

import {
  AssetBlobStoreToken,
  AssetHasherToken,
  AssetRepositoryToken,
  AssetService,
  AssetServiceToken,
  AssetUploadValidator,
  AssetUploadValidatorToken,
  defaultAssetValidationRules,
  MemoryAssetBlobStore,
  MemoryAssetRepository,
  WebCryptoAssetHasher
} from "../assets/index.js";

export function createServiceContainer():
  ServiceContainer {
  const container =
    new ServiceContainer();

  const assetRepository =
    new MemoryAssetRepository();

  const assetBlobStore =
    new MemoryAssetBlobStore();

  const assetHasher =
    new WebCryptoAssetHasher();

  const assetUploadValidator =
    new AssetUploadValidator(
      defaultAssetValidationRules
    );

  const assetService =
    new AssetService(
      assetRepository,
      assetBlobStore,
      assetUploadValidator,
      assetHasher
    );

  container.register(
    AssetRepositoryToken,
    assetRepository
  );

  container.register(
    AssetBlobStoreToken,
    assetBlobStore
  );

  container.register(
    AssetHasherToken,
    assetHasher
  );

  container.register(
    AssetUploadValidatorToken,
    assetUploadValidator
  );

  container.register(
    AssetServiceToken,
    assetService
  );

  return container;
}