import type {
  AssetBlobStore
} from "./AssetBlobStore.js";

export class MemoryAssetBlobStore
  implements AssetBlobStore {
  private readonly blobs =
    new Map<string, Uint8Array>();

  async save(
    assetId: string,
    data: Uint8Array
  ): Promise<void> {
    this.blobs.set(
      assetId,
      new Uint8Array(data)
    );
  }

  async get(
    assetId: string
  ): Promise<Uint8Array | undefined> {
    const data =
      this.blobs.get(assetId);

    return data === undefined
      ? undefined
      : new Uint8Array(data);
  }

  async has(
    assetId: string
  ): Promise<boolean> {
    return this.blobs.has(assetId);
  }

  async delete(
    assetId: string
  ): Promise<boolean> {
    return this.blobs.delete(assetId);
  }
}