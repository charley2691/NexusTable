import {
  createServiceToken
} from "../container/index.js";

import type {
  AssetBlobStore
} from "./AssetBlobStore.js";

import type {
  AssetRepository
} from "./AssetRepository.js";

import type {
  AssetHasher
} from "./AssetHasher.js";

import type {
  AssetService
} from "./AssetService.js";

import type {
  AssetUploadValidator
} from "./AssetUploadValidator.js";

export const AssetRepositoryToken =
  createServiceToken<AssetRepository>(
    "AssetRepository"
  );

export const AssetBlobStoreToken =
  createServiceToken<AssetBlobStore>(
    "AssetBlobStore"
  );

export const AssetHasherToken =
  createServiceToken<AssetHasher>(
    "AssetHasher"
  );

export const AssetUploadValidatorToken =
  createServiceToken<AssetUploadValidator>(
    "AssetUploadValidator"
  );

export const AssetServiceToken =
  createServiceToken<AssetService>(
    "AssetService"
  );