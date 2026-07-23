import {
  createDatabase
} from "./createDatabase.js";

const database =
  createDatabase();

const connection =
  database.getConnection();

const tables =
  connection
    .prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name
    `)
    .all();

console.log(
  "Database tables:",
  tables
);

database.close();