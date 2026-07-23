import {
  DatabaseSync
} from "node:sqlite";

export class Database {
  private readonly connection:
    DatabaseSync;

  constructor(
    databasePath: string
  ) {
    this.connection =
      new DatabaseSync(
        databasePath
      );

    this.configure();
  }

  getConnection():
    DatabaseSync {
    return this.connection;
  }

  close():
    void {
    this.connection.close();
  }

  private configure():
    void {
    this.connection.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA busy_timeout = 5000;
    `);
  }
}