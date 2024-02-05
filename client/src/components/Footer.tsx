import React from "react";
import { Row, Col, Typography } from "antd";
import { ExportOutlined } from "@ant-design/icons";

export const Footer = () => (
  <Row justify="center" style={{ marginTop: "20px", marginBottom: "20px", gap: "20px" }}>
    <Col>
      <Typography>Done by Bogdan Karmyzow.</Typography>
    </Col>
    <Col>
      <Typography.Link
        href="https://github.com/Bogdan-101/AWSVideoUpload"
        target="_blank"
        rel="noopener noreferrer"
      >
        Task code{" "}
        <ExportOutlined style={{ position: "relative", top: "2px" }} />
      </Typography.Link>
    </Col>
  </Row>
);
