import {
  ServiceContainer
} from "../container/index.js";

import {
  AssetHasherToken,
  AssetRepositoryToken,
  AssetService,
  AssetServiceToken,
  AssetUploadValidator,
  AssetUploadValidatorToken,
  defaultAssetValidationRules,
  MemoryAssetRepository,
  WebCryptoAssetHasher
} from "../assets/index.js";

export function createServiceContainer():
  ServiceContainer {
  const container =
    new ServiceContainer();

  const assetRepository =
    new MemoryAssetRepository();

  const assetHasher =
    new WebCryptoAssetHasher();

  const assetUploadValidator =
    new AssetUploadValidator(
      defaultAssetValidationRules
    );

  const assetService =
    new AssetService(
      assetRepository,
      assetUploadValidator,
      assetHasher
    );

  container.register(
    AssetRepositoryToken,
    assetRepository
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