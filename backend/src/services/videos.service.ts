import * as schema from "../schema";
import { databaseService, DatabaseService, IDatabaseService } from "./database.service";
import { s3Client, s3Service } from "./s3.service";

export class VideosService {
  private databaseService: IDatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  async uploadVideo(video: schema.NewVideo) {
    try {
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
    const videoData = await this.getVideo({ id });
    if (!videoData) {
      throw new Error('No video was found.');
    }
    await s3Service.deleteVideo({ key: videoData.key });
    await this.databaseService.deleteVideo({ id, userId });
  }
}

export const videosService = new VideosService(databaseService);
