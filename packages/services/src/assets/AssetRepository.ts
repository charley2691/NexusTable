import type {
  Asset
} from "@nexustable/shared";

export interface AssetRepository {
  save(
    asset: Asset
  ): Promise<void>;

  findById(
    assetId: string
  ): Promise<Asset | undefined>;

  findByHash(
    sha256: string
  ): Promise<Asset | undefined>;

  findAll(): Promise<Asset[]>;

  delete(
    assetId: string
  ): Promise<boolean>;
}