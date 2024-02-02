import { Client } from "pg";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../schema";

export class DatabaseService {
  private drizzle!: NodePgDatabase<typeof schema>;
  private client: NodePgClient;

  constructor() {
    this.client = new Client({
      host: process.env["DB_HOST"],
      user: process.env["DB_USER"],
      password: process.env["DB_PASSWORD"],
      port: +(process.env["DB_PORT"] as string),
      database: process.env["DB_DATABASE"],
    });
  }
  getDrizzle() {
    return this.drizzle;
  }

  async connect() {
    await this.client.connect();
    this.drizzle = drizzle(this.client, { schema });
  }
}

export const databaseService = new DatabaseService();
