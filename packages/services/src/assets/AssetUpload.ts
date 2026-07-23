import type {
  AssetKind
} from "@nexustable/shared";

export interface AssetUpload {
  name: string;
  kind: AssetKind;
  mimeType: string;
  sizeBytes: number;
  data: Uint8Array;

  createdBy?: string;
  tags?: readonly string[];

  width?: number;
  height?: number;
}