import {
  createUuid
} from "@nexustable/shared";

import type {
  Asset,
  CreateAssetInput
} from "./Asset.js";

import type {
  AssetRepository
} from "./AssetRepository.js";

export class AssetService {
  constructor(
    private readonly repository:
      AssetRepository
  ) {}

  async create(
    input: CreateAssetInput
  ): Promise<Asset> {
    const name =
      input.name.trim();

    if (name.length === 0) {
      throw new Error(
        "Asset name cannot be empty."
      );
    }

    if (input.sizeBytes < 0) {
      throw new Error(
        "Asset size cannot be negative."
      );
    }

    const asset: Asset = {
      id: createUuid(),
      name,
      kind: input.kind,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      createdAt: new Date().toISOString()
    };

    await this.repository.save(asset);

    return asset;
  }

  async getById(
    assetId: string
  ): Promise<Asset | undefined> {
    return this.repository.findById(
      assetId
    );
  }

  async getAll(): Promise<Asset[]> {
    return this.repository.findAll();
  }

  async delete(
    assetId: string
  ): Promise<boolean> {
    return this.repository.delete(
      assetId
    );
  }
}