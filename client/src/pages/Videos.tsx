import { Col, Row, Typography } from "antd";
import { useVideos } from "../hooks/useVideos";
import { VideoCard } from "../components/VideoCard";

export const Videos = () => {
  const { videos, isLoading, error, deleteById } = useVideos();

  if (error) return <Typography color="red">{error}</Typography>;
  if (isLoading)
    return (
      <div>loading</div>
    );
  if (!isLoading && !videos.length) {
    return (
      <Typography>no videos for this user</Typography>
    );
  }

  return (
    <Row gutter={[16, 16]} justify="start">
      {videos.map((video, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <VideoCard video={video} onDelete={deleteById} />
        </Col>
      ))}
    </Row>
  );
};
