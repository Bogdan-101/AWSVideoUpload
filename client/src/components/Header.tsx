import React from "react";
import { Button, Layout, Space, Modal, FlexProps } from "antd";
import {
  ArrowRightOutlined,
  HomeFilled,
  LoginOutlined,
  PlusCircleFilled,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { UploadVideoModal } from "./UploadVideoModal";

// import { UploadModal } from "./UploadModal";

const { Header: AntHeader } = Layout;

export const Header = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 50px",
      }}
    >
      <div>logo</div>

      <Space size="middle">
        <Link to="/">
          <Button icon={<HomeFilled />}>
          Home
        </Button>
        </Link>
        {user ? (
          <>
            <Button onClick={showModal} icon={<PlusCircleFilled />}>
              Upload
            </Button>
            <Button onClick={logOut} icon={<ArrowRightOutlined />}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <Button icon={<UserAddOutlined />}>Create Account</Button>
            </Link>
            <Link to="/login">
              <Button icon={<LoginOutlined />}>Login</Button>
            </Link>
          </>
        )}
      </Space>
      <UploadVideoModal isModalVisible={isModalVisible} close={handleCancel}/>
    </AntHeader>
  );
};
