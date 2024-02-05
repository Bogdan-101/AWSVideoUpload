import axios, { Axios } from "axios";
import { toasting } from "../utils/toast";

export interface Video {
  id: string;
  name: string;
  description: string;
  duration: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  uploaderId: string;
}

export interface VideoFormValues {
  title: string;
  description: string;
  video: Blob;
  duration: number;
}

class VideosService {
  private readonly axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: `https://bytcsdy3m8.execute-api.us-east-2.amazonaws.com/prod`,
    });
  }

  async getVideos(): Promise<{ result: Video[] }> {
    const { data } = await this.axios.get<{ result: Video[] }>("/getVideos", {
      headers: {
        auth: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return data;
  }

  async uploadVideo({ title, description, video, duration }: VideoFormValues) {
    try {
      const uploadURL = await this.getPreSignedURL(
        title,
        description,
        duration
      );
      
      const response = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: video,
      });

      if (response.ok) {
        toasting.success("Video is uploaded 🚀 Don't forget to re-fetch the videos!");
      } else {
        console.error("Upload failed", response);
        toasting.error("Could not upload a video, try again later.");
      }
      return response;
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  }

  async getPreSignedURL(title: string, description: string, duration: number) {
    const { data } = await this.axios.get<{ uploadURL: string }>(`/uploadURL?title=${title}&description=${description}&duration=${duration}`, {
      headers: {
        auth: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return data.uploadURL;
  }

  async deleteVideo(id: string): Promise<void> {
    const { data } = await this.axios.delete(`/delete?id=${id}`, {
      headers: {
        auth: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return data;
  }
}

export const videosService = new VideosService();
