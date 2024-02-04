import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Row, Col, Card, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { authService, LoginFormValues } from "../services/authService";

const { Title, Text } = Typography;

export const LoginForm = ({ mode }: { mode: "login" | "signup" }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      await authService[isLogin ? "login" : "signUp"](values);
      navigate("/videos");
    } catch (e: any) {
      setIsLoading(false);
      console.log("TEST: error on submit", e);
      const errorMessage = e?.response?.data?.message ?? e.message;
      form.setFields([
        {
          name: "password",
          errors: [errorMessage, JSON.stringify(e)],
        },
      ]);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col>
        <Card
          title={
            <Title level={2} style={{ textAlign: "center" }}>
              {isLogin ? "Login" : "Sign Up"}
            </Title>
          }
          bordered={false}
          style={{ width: 400 }}
        >
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Username is required" },
                { min: 6, message: "Minimum length should be 8" },
                { max: 32, message: "Must be under 32 symbols" },
              ]}
            >
              <Input disabled={isLoading} placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Minimum length should be 6" },
                { max: 64, message: "Must be under 64 symbols" },
              ]}
            >
              <Input.Password
                disabled={isLoading}
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {isLogin? "Login": "Sign Up"}
              </Button>
            </Form.Item>

            <Form.Item>
              <Text style={{ display: "block", textAlign: "center" }}>
                {isLogin ? "Need an account? " : "Already a user? "}
                <Link to={isLogin ? "/signup" : "/login"}>
                  {isLogin ? "Sign up" : "Login"}
                </Link>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
