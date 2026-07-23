import type {
  Asset
} from "../../assets/Asset.js";

export interface AssetDto {
  id: string;
  name: string;
  kind: Asset["kind"];
  mimeType: string;
  extension: string;
  sizeBytes: number;
  createdAt: string;
  createdBy?: string;
  tags: string[];
  width?: number;
  height?: number;
  contentUrl: string;
}