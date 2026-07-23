import type {
  DatabaseSync
} from "node:sqlite";

interface DatabaseMigration {
  readonly version: number;
  readonly name: string;
  readonly sql: string;
}

const migrations:
  readonly DatabaseMigration[] = [
    {
      version: 1,
      name: "create-assets-table",
      sql: `
        CREATE TABLE assets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          kind TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          extension TEXT,
          size_bytes INTEGER NOT NULL,
          sha256 TEXT NOT NULL UNIQUE,
          created_at TEXT NOT NULL,
          created_by TEXT,
          tags_json TEXT NOT NULL DEFAULT '[]',
          width INTEGER,
          height INTEGER
        );

        CREATE INDEX idx_assets_created_at
          ON assets(created_at);

        CREATE INDEX idx_assets_kind
          ON assets(kind);

        CREATE INDEX idx_assets_sha256
          ON assets(sha256);
      `
    }
  ];

export function runMigrations(
  connection: DatabaseSync
): void {
  createMigrationTable(
    connection
  );

  const appliedVersions =
    getAppliedMigrationVersions(
      connection
    );

  for (
    const migration of migrations
  ) {
    if (
      appliedVersions.has(
        migration.version
      )
    ) {
      continue;
    }

    applyMigration(
      connection,
      migration
    );
  }
}

function createMigrationTable(
  connection: DatabaseSync
): void {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}

function getAppliedMigrationVersions(
  connection: DatabaseSync
): ReadonlySet<number> {
  const statement =
    connection.prepare(`
      SELECT version
      FROM schema_migrations
      ORDER BY version ASC
    `);

  const rows =
    statement.all() as Array<{
      version: number;
    }>;

  return new Set(
    rows.map(
      (row) =>
        row.version
    )
  );
}

function applyMigration(
  connection: DatabaseSync,
  migration: DatabaseMigration
): void {
  connection.exec(
    "BEGIN IMMEDIATE"
  );

  try {
    connection.exec(
      migration.sql
    );

    const recordMigration =
      connection.prepare(`
        INSERT INTO schema_migrations (
          version,
          name,
          applied_at
        )
        VALUES (
          ?,
          ?,
          ?
        )
      `);

    recordMigration.run(
      migration.version,
      migration.name,
      new Date().toISOString()
    );

    connection.exec(
      "COMMIT"
    );
  } catch (error: unknown) {
    connection.exec(
      "ROLLBACK"
    );

    throw new Error(
      `Failed to apply database migration ${migration.version}: ${migration.name}`,
      {
        cause: error
      }
    );
  }
}