export interface AssetHasher {
  hash(
    data: Uint8Array
  ): Promise<string>;
}