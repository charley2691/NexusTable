import type {
  Asset
} from "@nexustable/shared";

import type {
  AssetRepository
} from "./AssetRepository.js";

export class MemoryAssetRepository
  implements AssetRepository {
  private readonly assets =
    new Map<string, Asset>();

  async save(
    asset: Asset
  ): Promise<void> {
    this.assets.set(
      asset.id,
      structuredClone(asset)
    );
  }

  async findById(
    assetId: string
  ): Promise<Asset | undefined> {
    const asset =
      this.assets.get(assetId);

    return asset
      ? structuredClone(asset)
      : undefined;
  }

  async findByHash(
    sha256: string
  ): Promise<Asset | undefined> {
    for (
      const asset of
      this.assets.values()
    ) {
      if (asset.sha256 === sha256) {
        return structuredClone(asset);
      }
    }

    return undefined;
  }

  async findAll(): Promise<Asset[]> {
    return Array.from(
      this.assets.values(),
      asset => structuredClone(asset)
    );
  }

  async delete(
    assetId: string
  ): Promise<boolean> {
    return this.assets.delete(
      assetId
    );
  }
}