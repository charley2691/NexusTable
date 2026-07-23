import type {
  Asset
} from "./Asset.js";

export interface AssetRepository {
  save(asset: Asset): Promise<void>;

  findById(
    assetId: string
  ): Promise<Asset | undefined>;

  findAll(): Promise<Asset[]>;

  delete(
    assetId: string
  ): Promise<boolean>;
}