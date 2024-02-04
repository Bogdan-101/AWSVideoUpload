import { Card } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { Video, videosService } from "../services/videoService";

export const VideoCard = ({ video, onDelete }: {video: Video, onDelete: (id: string) => void}) => {

  const handleDelete = async() => {
    await videosService.deleteVideo(video.id);
    onDelete(video.id);
  }

  return (
    <Card
      hoverable
      style={{ width: 240 }}
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
      actions={[<DeleteFilled key="delete" onClick={handleDelete} />]}
    >
      <Card.Meta title={video.name} description={video.description} />
      <Card.Meta title={"Hosted on"} description={video.url} />
    </Card>
  );
};

export default VideoCard;
