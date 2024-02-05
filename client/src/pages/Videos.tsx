import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import UploadVideoModal from "../components/UploadVideo";
import { VideoGallery } from "../components/VideoGallery";

export const Videos = () => {
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Upload" key="1">
          <UploadVideoModal />
        </TabPane>
        <TabPane tab="Your Videos" key="2">
          <VideoGallery />
        </TabPane>
      </Tabs>
    </>
  );
};
