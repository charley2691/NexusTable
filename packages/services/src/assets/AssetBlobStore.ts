export interface AssetBlobStore {
  save(
    assetId: string,
    data: Uint8Array
  ): Promise<void>;

  get(
    assetId: string
  ): Promise<Uint8Array | undefined>;

  has(
    assetId: string
  ): Promise<boolean>;

  delete(
    assetId: string
  ): Promise<boolean>;
}