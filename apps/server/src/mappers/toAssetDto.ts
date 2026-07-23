import type {
  Asset,
  AssetDto
} from "@nexustable/shared";

export function toAssetDto(
  asset: Asset
): AssetDto {
  return {
    id: asset.id,
    name: asset.name,
    kind: asset.kind,
    mimeType: asset.mimeType,
    extension: asset.extension,
    sizeBytes: asset.sizeBytes,
    createdAt: asset.createdAt,
    createdBy: asset.createdBy,
    tags: [...asset.tags],
    width: asset.width,
    height: asset.height,
    contentUrl:
      `/api/assets/${encodeURIComponent(asset.id)}/content`
  };
}