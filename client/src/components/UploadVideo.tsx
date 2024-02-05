// import React, { useState } from "react";
// import { Modal, Form, Input, Button, Progress, Upload, message, Cascader, Checkbox, DatePicker, InputNumber, Radio, Select, Switch, TreeSelect } from "antd";
// import { UploadOutlined, CloseCircleOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
// import { useDropzone } from "react-dropzone";
// import { videosService, VideoFormValues } from "../services/videoService";
// import form from "antd/es/form";
// import { title } from "process";
// import { useForm } from "react-hook-form";
// import { Bounce, toast } from "react-toastify";
// import TextArea from "antd/es/input/TextArea";
// import { useUpload } from "../hooks/useUpload";

// const normFile = (e: any) => {
//   if (Array.isArray(e)) {
//     return e;
//   }
//   return e?.fileList;
// };

// const UploadModal: React.FC = () => {
//   const { preSignedUrl, isLoading, error } = useUpload('title', 'description');

//   const handleFinish = (values) => {

//   }

//   return (
//       <Form
//         labelCol={{ span: 4 }}
//         wrapperCol={{ span: 14 }}
//         layout="vertical"
//       style={{ maxWidth: 600 }}
//       onFinish={handleFinish}
//       >
//         <Form.Item name="description" label="Description">
//           <TextArea rows={4} />
//         </Form.Item>
//         <Form.Item
//           label="Upload"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//         >
//           <Upload multiple={false} accept="video/mp4" listType="picture-card">
//             <button style={{ border: 0, background: "none" }} type="button">
//               <PlusOutlined />
//               <div style={{ marginTop: 8 }}>Upload</div>
//             </button>
//           </Upload>
//         </Form.Item>
//     </Form>

//   );
// };

// import React from "react";
// import "react-dropzone-uploader/dist/styles.css";
// import Dropzone, { IFileWithMeta } from "react-dropzone-uploader";
// import { videosService } from "../services/videoService";

// export const UploadVideoModal = () => {
//   const handleSubmit = async (files: IFileWithMeta[]) => {
//     const f = files[0];

//     const url = await videosService.getPreSignedURL('title', 'description');

//     // PUT request: upload file to S3
//     const result = await fetch(url, {
//       method: "PUT",
//       body: f["file"],
//     });
//     console.log("TEST: result", result);
//   };

//   return (
//     <Dropzone
//       onChangeStatus={({meta}, status) => { console.log(status, meta); }}
//       onSubmit={handleSubmit}
//       maxFiles={1}
//       multiple={false}
//       canCancel={false}
//       inputContent="Drop A File"
//       styles={{
//         dropzone: { width: 400, height: 200 },
//         dropzoneActive: { borderColor: "green" },
//       }}
//     />
//   );
// };

import React, { FormEvent, useState } from "react";
import { videosService } from "../services/videoService";
import { toasting } from "../utils/toast";
import { Button, Form, Input } from "antd";

export const UploadVideoModal = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [okText, setOkText] = useState('Ok');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };

  const handleVideoChange = (event: any) => {
    setVideo(event.target.files[0]);
    setTitle(event.target.files[0].name);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!video) {
      toasting.error("Please select a video.");
      return;
    }

    setIsSubmitting(true);
    setOkText("Uploading...");

    try {
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";

      videoEl.onloadedmetadata = async function () {
        window.URL.revokeObjectURL(videoEl.src);
        const duration = videoEl.duration;
        await videosService.uploadVideo(
          { title, description, video, duration }
        );
        setOkText("Uploaded!");
      };
      videoEl.src = URL.createObjectURL(video);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Form layout="vertical" onSubmitCapture={handleSubmit} preserve={false}>
        <Form.Item label="Description:">
          <Input
            disabled={isSubmitting}
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </Form.Item>
        <Form.Item label="Video file:">
          <input
            disabled={isSubmitting}
            type="file"
            id="video"
            name="video"
            accept="video/mp4"
            onChange={handleVideoChange}
          />
        </Form.Item>
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {okText}
        </Button>
      </Form>
  );
};

export default UploadVideoModal;
