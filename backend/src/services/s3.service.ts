import { Client } from "pg";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../schema";
import { eq } from "drizzle-orm";
import { S3, S3Client } from "@aws-sdk/client-s3";

require("dotenv").config();

export class S3Service {
  public s3client: S3Client;

  constructor() {
    this.s3client = new S3Client({ region: process.env.AWS_REGION });
  }
}

export const s3Service = new S3Service();
export const s3Client = s3Service.s3client;
