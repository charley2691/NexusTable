export type AssetKind =
  | "map"
  | "token"
  | "portrait"
  | "handout"
  | "other";

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface CreateAssetInput {
  name: string;
  kind: AssetKind;
  mimeType: string;
  sizeBytes: number;
}