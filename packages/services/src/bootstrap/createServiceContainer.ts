import {
  resolve
} from "node:path";

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
  FileSystemAssetBlobStore,
  SQLiteAssetRepository,
  WebCryptoAssetHasher
} from "../assets/index.js";

import {
  createDatabase
} from "../database/index.js";

export function createServiceContainer():
  ServiceContainer {
  const container =
    new ServiceContainer();

  const databasePath =
    process.env.NEXUSTABLE_DATABASE_PATH
      ?? resolve(
        process.cwd(),
        "database",
        "nexustable.db"
      );

  const database =
    createDatabase(
      databasePath
    );

  const assetRepository =
    new SQLiteAssetRepository(
      database.getConnection()
    );

  const assetStorageDirectory =
    process.env.NEXUSTABLE_ASSET_STORAGE
      ?? resolve(
        process.cwd(),
        "storage",
        "assets"
      );

  const assetBlobStore =
    new FileSystemAssetBlobStore(
      assetStorageDirectory
    );

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