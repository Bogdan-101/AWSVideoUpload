import axios, { Axios } from "axios";
import { Dispatch, SetStateAction } from "react";

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

  // TODO: check setProgess type here
  async uploadVideo({ title, description, video, duration }: VideoFormValues, setProgress: { (value: SetStateAction<number>): void; (arg0: number): void; }) {
    // TODO: add progress here
    try {
      const uploadURL = await this.getPreSignedURL(
        title,
        description,
        duration
      );

      const formData = new FormData();
      formData.append("file", video);
      
      const response = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: video,
      });

      if (response.ok) {
        setProgress(100);
        console.log("Upload successful");
      } else {
        console.error("Upload failed");
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
