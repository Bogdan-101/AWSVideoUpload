import * as schema from "../schema";
import { databaseService, DatabaseService, IDatabaseService } from "./database.service";
import { s3Client } from "./s3.service";

export class VideosService {
  private databaseService: IDatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  async uploadVideo(video: schema.NewVideo, 
    userId: string) {
    try {
      // const filePath = video.tempFilePath;
      // const fileParts = path.parse(video.name);
      // const fileName = fileParts.name + '-' + crypto.randomBytes(8).toString('hex') + fileParts.ext;

      // const user
      // const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true } });
      // const totalParts = Math.ceil(video.size / CHUNK_SIZE);
      // const uploadParams = { Bucket: this.bucket, Key: `${user.name}/${fileName}`, ContentType: video.mimetype };
      // let PartNumber = 1;
      // const uploadedPartsResults: CompletedPart[] = [];

      // let { UploadId } = await s3Client.send(new CreateMultipartUploadCommand(uploadParams));

      // console.log(
      //   `Initiated multipart upload, uploadId: ${UploadId}, totalParts: ${totalParts}, fileSize: ${video.size}`,
      // );

      // await new Promise<void>(async (resolve) => {
      //   const fileHandle = await fsp.open(filePath, 'r');
      //   while (true) {
      //     const { buffer, bytesRead } = await this.readNextPart(fileHandle);

      //     // EOF
      //     if (bytesRead === 0) {
      //       await fileHandle.close();
      //       return resolve();
      //     }

      //     const data = bytesRead < CHUNK_SIZE ? buffer.subarray(0, bytesRead) : buffer;
      //     const response = await this.uploadPart({ data, key: uploadParams.Key, PartNumber, UploadId: UploadId! });

      //     console.log(`Uploaded part ${PartNumber} of ${totalParts}`);
      //     uploadedPartsResults.push({ PartNumber, ETag: response.ETag });
      //     PartNumber++;
      //   }
      // });

      // console.log(`Finished uploading all parts for multipart uploadId: ${UploadId}`);

      // await this.s3Client.send(
      //   new CompleteMultipartUploadCommand({
      //     Bucket: this.bucket,
      //     Key: uploadParams.Key,
      //     MultipartUpload: { Parts: uploadedPartsResults },
      //     UploadId: UploadId,
      //   }),
      // );

      // console.log(`Successfully completed multipart uploadId: ${UploadId}`);

      // const duration = await getVideoDurationInSeconds(video.tempFilePath);

      // await prisma.video.create({
      //   data: { title, description, fileName, duration, authorId: userId },
      // });
      return await this.databaseService.uploadVideo(video);
    } catch (e) {
      console.error(e);
    }
  }

  async getVideos(userId: string) {
    return await this.databaseService.getVideos(userId);
  }

  async getVideo({ id }: { id: string }) {
    return await this.databaseService.getVideo({ id });
  }

  async deleteVideo({ id, userId }: { id: string, userId: string }) {
    await this.databaseService.deleteVideo({ id, userId });
  }
}

export const videosService = new VideosService(databaseService);
