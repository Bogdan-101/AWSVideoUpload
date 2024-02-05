import { Card, Modal, Spin } from "antd";
import { DeleteFilled, LoadingOutlined } from "@ant-design/icons";
import { Video, videosService } from "../services/videoService";
import { useState } from "react";

export const VideoCard = ({ video, onDelete }: { video: Video, onDelete: (id: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure delete this video?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete();
      },
    });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await videosService.deleteVideo(video.id);
      onDelete(video.id);
    } catch (error) {
      console.error("Failed to delete video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <Card
      hoverable
      style={{ width: 240, opacity: isLoading ? 0.5 : 1  }}
      cover={
        <video
          style={{ objectFit: "cover" }}
          height="150"
          controls
          src={video.url}
        >
          Your browser does not support the video tag.
        </video>
      }
      actions={[
        isLoading ? (
          <Spin indicator={antIcon} />
        ) : (
          <DeleteFilled key="delete" onClick={showDeleteConfirm} />
        ),
      ]}
    >
      <Card.Meta title={video.name} description={video.description} />
      <Card.Meta title={"Hosted on"} description={video.url} />
    </Card>
  );
};

export default VideoCard;
