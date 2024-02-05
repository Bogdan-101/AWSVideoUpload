import { Link, Navigate } from "react-router-dom";
import { Layout, Row, Col, Button, Typography } from "antd";
import { useUser } from "../hooks/useUser";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export const Home = () => {
  const user = useUser();

  if (user) return <Navigate to="/videos" />;
  return (
    <Content style={{ padding: "0 10px" }}>
      <Row align="middle" justify="center">
        <Col span={12}>
          <Title
            style={{ color: "#021", fontWeight: "bold", fontSize: "48px" }}
          >
            Welcome to the video uploading site!
          </Title>
          <Paragraph style={{ color: "#aaa", fontSize: "20px" }}>
            Log in to continue!
          </Paragraph>

          <Link to="/login">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              size="large"
              style={{ marginRight: "15px" }}
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button icon={<UserAddOutlined />} size="large">
              Sign Up
            </Button>
          </Link>
        </Col>
      </Row>
    </Content>
  );
};
