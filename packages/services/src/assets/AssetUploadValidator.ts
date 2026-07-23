import type {
  AssetUpload
} from "./AssetUpload.js";

import type {
  AssetValidationRules
} from "./AssetValidationRules.js";

import {
  AssetValidationError
} from "./AssetValidationError.js";

export class AssetUploadValidator {
  constructor(
    private readonly rules:
      AssetValidationRules
  ) {}

  validate(
    upload: AssetUpload
  ): void {
    const name =
      upload.name.trim();

    if (name.length === 0) {
      throw new AssetValidationError(
        "Asset name cannot be empty."
      );
    }

    if (upload.sizeBytes <= 0) {
      throw new AssetValidationError(
        "Asset must contain data."
      );
    }

    if (
      upload.sizeBytes !==
      upload.data.byteLength
    ) {
      throw new AssetValidationError(
        "Asset size does not match its data."
      );
    }

    if (
      upload.sizeBytes >
      this.rules.maximumSizeBytes
    ) {
      throw new AssetValidationError(
        "Asset exceeds the maximum allowed size."
      );
    }

    const mimeType =
      upload.mimeType
        .trim()
        .toLowerCase();

    if (
      !this.rules.allowedMimeTypes.includes(
        mimeType
      )
    ) {
      throw new AssetValidationError(
        `Unsupported asset type: ${upload.mimeType}`
      );
    }

    const extension =
      this.getExtension(name);

    if (extension === undefined) {
      throw new AssetValidationError(
        "Asset filename must include an extension."
      );
    }

    if (
      !this.rules.allowedExtensions.includes(
        extension
      )
    ) {
      throw new AssetValidationError(
        `Unsupported file extension: .${extension}`
      );
    }
  }

  getExtension(
    filename: string
  ): string | undefined {
    const finalDot =
      filename.lastIndexOf(".");

    if (
      finalDot <= 0 ||
      finalDot === filename.length - 1
    ) {
      return undefined;
    }

    return filename
      .slice(finalDot + 1)
      .trim()
      .toLowerCase();
  }
}