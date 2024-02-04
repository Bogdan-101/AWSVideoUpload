import { Client } from "pg";
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../schema";
import { eq } from "drizzle-orm";
import { DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput, HeadObjectCommand, HeadObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

require("dotenv").config();

export class S3Service {
  public s3client: S3Client;
  public s3BucketName: string;

  constructor() {
    this.s3BucketName = process.env.S3_BUCKET_NAME as string;
    this.s3client = new S3Client({ region: process.env.APP_AWS_REGION });
  }

  async getPreSignedURL(title: string, description: string, duration: string, uploaderId: string) {
    try {
      const putObjectParams: PutObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: `videos/${Date.now()}-${Math.random()}.mp4`,
        ContentType: "video/mp4",
        Metadata: {
          title,
          description,
          duration,
          uploaderId
        }
      };
      const command = new PutObjectCommand(putObjectParams);
      const url = await getSignedUrl(this.s3client, command, { expiresIn: 3600 });
      return url;
    } catch (err) {
      console.error("Error generating pre-signed URL", err);
      return null;
    }
  }

  async getObjectMetaData(key: string) {
    const params: HeadObjectCommandInput = {Bucket: this.s3BucketName, Key: key};
    const command = new HeadObjectCommand(params);
    const metaData = await this.s3client.send(command)
    return metaData.Metadata;
  }

  async deleteVideo({ key }: { key: string }) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.s3BucketName,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await this.s3client.send(command);
  }
}

export const s3Service = new S3Service();
export const s3Client = s3Service.s3client;
