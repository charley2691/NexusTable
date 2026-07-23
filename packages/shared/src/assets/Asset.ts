export type AssetKind =
  | "map"
  | "token"
  | "portrait"
  | "handout"
  | "other";

export type AssetScope =
  | "private"
  | "campaign"
  | "public";

export type AssetStatus =
  | "pending"
  | "ready"
  | "failed";

export interface Asset {
  readonly id: string;
  readonly name: string;
  readonly kind: AssetKind;

  readonly mimeType: string;
  readonly extension: string;
  readonly sizeBytes: number;
  readonly sha256: string;

  readonly createdAt: string;
  readonly createdBy?: string;

  readonly tags: readonly string[];

  readonly width?: number;
  readonly height?: number;
}