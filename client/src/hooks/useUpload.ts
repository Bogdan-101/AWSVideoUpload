import { useEffect, useState } from "react";
import { videosService } from "../services/videoService";

export const useUpload = (title: string, description: string, duration: number) => {
  const [preSignedUrl, setPreSignedUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    videosService
      .getPreSignedURL(title, description, duration)
      .then((url: string) => {
        setPreSignedUrl(url);
      })
      .catch((e) => {
        console.log(e);
        setError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [title, description, duration]);

  return { preSignedUrl, isLoading, error };
};
