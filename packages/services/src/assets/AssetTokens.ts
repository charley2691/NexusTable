import {
  createServiceToken
} from "../container/index.js";

import type {
  AssetRepository
} from "./AssetRepository.js";

import type {
  AssetService
} from "./AssetService.js";

export const AssetRepositoryToken =
  createServiceToken<AssetRepository>(
    "AssetRepository"
  );

export const AssetServiceToken =
  createServiceToken<AssetService>(
    "AssetService"
  );