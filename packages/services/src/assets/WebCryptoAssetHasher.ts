import type {
  AssetHasher
} from "./AssetHasher.js";

export class WebCryptoAssetHasher
  implements AssetHasher {
  async hash(
    data: Uint8Array
  ): Promise<string> {
    const safeCopy =
      new Uint8Array(data);

    const digest =
      await globalThis.crypto.subtle.digest(
        "SHA-256",
        safeCopy
      );

    return Array.from(
      new Uint8Array(digest)
    )
      .map(byte =>
        byte
          .toString(16)
          .padStart(2, "0")
      )
      .join("");
  }
}