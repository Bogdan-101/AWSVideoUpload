import { Client } from "pg";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../schema";
import { eq } from "drizzle-orm";

require("dotenv").config();

export interface IDatabaseService {
  connect: () => Promise<void>;
  getVideos: () => Promise<schema.Video[]>;
  getVideo: ({ id }: { id: string }) => Promise<schema.Video | undefined>;
  uploadVideo: (params: schema.NewVideo) => Promise<schema.Video>;
  deleteVideo: ({ id }: { id: string }) => Promise<void>;
}

export class DatabaseService implements IDatabaseService {
  private drizzle!: NodePgDatabase<typeof schema>;
  private client: NodePgClient;
  private connected: boolean;

  constructor() {
    this.connected = false;
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
    if (this.connected) {
      return
    }
    await this.client.connect();
    this.connected = true;
    this.drizzle = drizzle(this.client, { schema });
  }

  async disconnect() {
    this.client.end();
  }

  async getVideos(): Promise<schema.Video[]> {
    return await this.drizzle.select().from(schema.videos);
  }

  async getVideo({ id }: { id: string }): Promise<schema.Video | undefined> {
    return await this.drizzle.query.videos
      .findFirst({ where: eq(schema.videos.id, id) });
  }

  async uploadVideo(params: schema.NewVideo) {
    return (await this.drizzle.insert(schema.videos).values(params).returning())[0];
  }

  async deleteVideo({ id }: { id: string }) {
    await this.drizzle.delete(schema.videos).where(eq(schema.videos.id, id));
  }

  async getUser({ id }: { id: string }) {
    return this.drizzle.query.users.findFirst({ where: eq(schema.users.id, id) });
  }
}

export const databaseService = new DatabaseService();
