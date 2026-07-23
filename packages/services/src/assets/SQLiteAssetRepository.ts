import type {
  Asset,
  AssetKind
} from "@nexustable/shared";

import type {
  DatabaseSync
} from "node:sqlite";

import type {
  AssetRepository
} from "./AssetRepository.js";

interface AssetDatabaseRow {
  id: string;
  name: string;
  kind: string;
  mime_type: string;
  extension: string | null;
  size_bytes: number;
  sha256: string;
  created_at: string;
  created_by: string | null;
  tags_json: string;
  width: number | null;
  height: number | null;
}

export class SQLiteAssetRepository
  implements AssetRepository {
  constructor(
    private readonly connection:
      DatabaseSync
  ) {}

  async save(
    asset: Asset
  ): Promise<void> {
    const statement =
      this.connection.prepare(`
        INSERT INTO assets (
          id,
          name,
          kind,
          mime_type,
          extension,
          size_bytes,
          sha256,
          created_at,
          created_by,
          tags_json,
          width,
          height
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
          name = excluded.name,
          kind = excluded.kind,
          mime_type = excluded.mime_type,
          extension = excluded.extension,
          size_bytes = excluded.size_bytes,
          sha256 = excluded.sha256,
          created_at = excluded.created_at,
          created_by = excluded.created_by,
          tags_json = excluded.tags_json,
          width = excluded.width,
          height = excluded.height
      `);

    statement.run(
      asset.id,
      asset.name,
      asset.kind,
      asset.mimeType,
      asset.extension,
      asset.sizeBytes,
      asset.sha256,
      asset.createdAt,
      asset.createdBy ?? null,
      JSON.stringify(
        asset.tags
      ),
      asset.width ?? null,
      asset.height ?? null
    );
  }

  async findById(
    assetId: string
  ): Promise<Asset | undefined> {
    const statement =
      this.connection.prepare(`
        SELECT
          id,
          name,
          kind,
          mime_type,
          extension,
          size_bytes,
          sha256,
          created_at,
          created_by,
          tags_json,
          width,
          height
        FROM assets
        WHERE id = ?
        LIMIT 1
      `);

    const row =
      statement.get(
        assetId
      ) as unknown as
        AssetDatabaseRow | undefined;

    if (!row) {
      return undefined;
    }

    return mapRowToAsset(row);
  }

  async findByHash(
    sha256: string
  ): Promise<Asset | undefined> {
    const statement =
      this.connection.prepare(`
        SELECT
          id,
          name,
          kind,
          mime_type,
          extension,
          size_bytes,
          sha256,
          created_at,
          created_by,
          tags_json,
          width,
          height
        FROM assets
        WHERE sha256 = ?
        LIMIT 1
      `);

    const row =
      statement.get(
        sha256
      ) as unknown as
        AssetDatabaseRow | undefined;

    if (!row) {
      return undefined;
    }

    return mapRowToAsset(row);
  }

  async findAll():
    Promise<Asset[]> {
    const statement =
      this.connection.prepare(`
        SELECT
          id,
          name,
          kind,
          mime_type,
          extension,
          size_bytes,
          sha256,
          created_at,
          created_by,
          tags_json,
          width,
          height
        FROM assets
        ORDER BY created_at DESC
      `);

    const rows =
      statement.all() as unknown as
        AssetDatabaseRow[];

    return rows.map(
      (row) =>
        mapRowToAsset(row)
    );
  }

  async delete(
    assetId: string
  ): Promise<boolean> {
    const statement =
      this.connection.prepare(`
        DELETE FROM assets
        WHERE id = ?
      `);

    const result =
      statement.run(
        assetId
      );

    return result.changes > 0;
  }
}

function mapRowToAsset(
  row: AssetDatabaseRow
): Asset {
  return {
    id: row.id,
    name: row.name,

    kind:
      parseAssetKind(
        row.kind
      ),

    mimeType:
      row.mime_type,

    extension:
      row.extension ?? "",

    sizeBytes:
      row.size_bytes,

    sha256:
      row.sha256,

    createdAt:
      row.created_at,

    createdBy:
      row.created_by
        ?? undefined,

    tags:
      parseTags(
        row.tags_json
      ),

    width:
      row.width
        ?? undefined,

    height:
      row.height
        ?? undefined
  };
}

function parseAssetKind(
  value: string
): AssetKind {
  if (
    value === "map" ||
    value === "token" ||
    value === "portrait" ||
    value === "handout" ||
    value === "other"
  ) {
    return value;
  }

  throw new Error(
    `Invalid asset kind stored in the database: ${value}`
  );
}

function parseTags(
  value: string
): string[] {
  try {
    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        tag
      ): tag is string =>
        typeof tag === "string"
    );
  } catch {
    return [];
  }
}