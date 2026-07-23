import {
  createUuid
} from "@nexustable/shared";

import type {
  Asset
} from "@nexustable/shared";

import type {
  AssetUpload
} from "./AssetUpload.js";

import type {
  AssetRepository
} from "./AssetRepository.js";

import type {
  AssetHasher
} from "./AssetHasher.js";

import {
  AssetUploadValidator
} from "./AssetUploadValidator.js";

export class AssetService {
  constructor(
    private readonly repository:
      AssetRepository,

    private readonly validator:
      AssetUploadValidator,

    private readonly hasher:
      AssetHasher
  ) {}

  async upload(
    upload: AssetUpload
  ): Promise<Asset> {
    this.validator.validate(upload);

    const sha256 =
      await this.hasher.hash(
        upload.data
      );

    const existingAsset =
      await this.repository.findByHash(
        sha256
      );

    if (existingAsset !== undefined) {
      return existingAsset;
    }

    const extension =
      this.validator.getExtension(
        upload.name
      );

    if (extension === undefined) {
      throw new Error(
        "Validated asset has no extension."
      );
    }

    const asset: Asset = {
      id: createUuid(),
      name: upload.name.trim(),
      kind: upload.kind,

      mimeType:
        upload.mimeType
          .trim()
          .toLowerCase(),

      extension,
      sizeBytes: upload.sizeBytes,
      sha256,

      createdAt:
        new Date().toISOString(),

      createdBy:
        upload.createdBy,

      tags:
        this.normalizeTags(
          upload.tags ?? []
        ),

      width:
        upload.width,

      height:
        upload.height
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

  private normalizeTags(
    tags: readonly string[]
  ): string[] {
    return Array.from(
      new Set(
        tags
          .map(tag =>
            tag.trim().toLowerCase()
          )
          .filter(tag =>
            tag.length > 0
          )
      )
    );
  }
}