import { Button, Layout, Space } from "antd";
import {
  ArrowRightOutlined,
  HomeFilled,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

// import { UploadModal } from "./UploadModal";

const { Header: AntHeader } = Layout;

export const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

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
          <Button icon={<HomeFilled />}>Home</Button>
        </Link>
        {user && (
          <>
            <Button onClick={logOut} icon={<ArrowRightOutlined />}>
              Logout
            </Button>
          </>
        )}
      </Space>
    </AntHeader>
  );
};
