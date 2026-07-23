export interface AssetValidationRules {
  readonly maximumSizeBytes: number;
  readonly allowedMimeTypes: readonly string[];
  readonly allowedExtensions: readonly string[];
}

export const defaultAssetValidationRules:
  AssetValidationRules = {
    maximumSizeBytes: 25 * 1024 * 1024,

    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp"
    ],

    allowedExtensions: [
      "png",
      "jpg",
      "jpeg",
      "webp"
    ]
  };