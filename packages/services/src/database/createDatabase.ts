import {
  mkdirSync
} from "node:fs";

import {
  dirname,
  resolve
} from "node:path";

import {
  Database
} from "./Database.js";

import {
  runMigrations
} from "./runMigrations.js";

export function createDatabase(
  databasePath:
    string = getDefaultDatabasePath()
): Database {
  const resolvedPath =
    resolve(databasePath);

  mkdirSync(
    dirname(resolvedPath),
    {
      recursive: true
    }
  );

  const database =
    new Database(
      resolvedPath
    );

  try {
    runMigrations(
      database.getConnection()
    );

    return database;
  } catch (error: unknown) {
    database.close();

    throw error;
  }
}

function getDefaultDatabasePath():
  string {
  return (
    process.env.NEXUSTABLE_DATABASE_PATH
      ?? resolve(
        process.cwd(),
        "database",
        "nexustable.db"
      )
  );
}
