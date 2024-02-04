import { useEffect, useState } from "react";
import { Video, videosService } from "../services/videoService";

export const useVideos = () => {
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    videosService
      .getVideos()
      .then(({ result: videos }) => {
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

  const deleteById = (id: string) => {
    setUserVideos(userVideos.filter((video) => video.id !== id));
  };

  return { videos: userVideos, isLoading, error, deleteById };
};
