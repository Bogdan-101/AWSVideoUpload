import { useEffect, useState } from "react";
import { Video, videosService } from "../services/VideosService.ts";

export const useVideos = () => {
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    videosService
      .getVideos()
      .then(({ videos }) => {
        setUserVideos(videos);
      })
      .catch((e) => {
        console.log(e);
        setError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { videos: userVideos, isLoading, error };
};
