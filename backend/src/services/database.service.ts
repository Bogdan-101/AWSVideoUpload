import { Client } from "pg";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../schema";
import { and, eq } from "drizzle-orm";
import { generatePasswordHash, verifyPassword } from "../utils/user";
import * as jwt from 'jsonwebtoken';
import { CustomError } from "../utils/customError";

require("dotenv").config();

export interface IDatabaseService {
  connect: () => Promise<void>;
  getVideos: (userId: string) => Promise<schema.Video[]>;
  getVideo: ({ id }: { id: string }) => Promise<schema.Video | undefined>;
  uploadVideo: (params: schema.NewVideo) => Promise<schema.Video>;
  deleteVideo: ({ id, userId }: { id: string, userId: string }) => Promise<void>;
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
      return;
    }
    await this.client.connect();
    this.connected = true;
    this.drizzle = drizzle(this.client, { schema });
  }

  async getVideos(userId: string): Promise<schema.Video[]> {
    return await this.drizzle.select().from(schema.videos).where(eq(schema.videos.uploaderId, userId));
  }

  async getVideo({ id }: { id: string }): Promise<schema.Video | undefined> {
    return await this.drizzle.query.videos.findFirst({
      where: eq(schema.videos.id, id),
    });
  }

  async uploadVideo(params: schema.NewVideo) {
    return (
      await this.drizzle.insert(schema.videos).values(params).returning()
    )[0];
  }

  async deleteVideo({ id, userId }: { id: string, userId: string }) {
    await this.drizzle.delete(schema.videos).where(and(eq(schema.videos.id, id), eq(schema.videos.uploaderId, userId)));
  }

  async getUser({ id }: { id: string }) {
    return this.drizzle.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }

  async registerUser(user: { username: string; password: string }) {
    // TODO: add user already exists check here/username is taken
    const passwordHash = await generatePasswordHash(user.password);
    return (await this.drizzle
      .insert(schema.users)
      .values({ username: user.username, passwordHash }).returning())[0];
  }

  async authenticate(user: { username: string; password: string }): Promise<string> {
    // TODO: move to the user service
    const existUser = await this.drizzle.query.users.findFirst({ where: eq(schema.users.username, user.username) });
    if (!existUser) {
      throw new CustomError(400, 'User was not found');
    }
    const isAuth = await verifyPassword(user.password, existUser.passwordHash);
    if (!isAuth) {
      throw new CustomError(400, "Username or password do not match");
    }

    const token = jwt.sign(
      { id: existUser.id, name: existUser.username },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: "30d",
      }
    );
    return token;
  }
}

export const databaseService = new DatabaseService();
