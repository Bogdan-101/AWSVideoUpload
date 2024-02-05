import React from "react";
import { Layout, Divider } from "antd";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const { Header: AntHeader, Footer: AntFooter, Content } = Layout;

export const BaseLayout = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) => (
  <Layout style={{ minHeight: "100vh", ...rest }}>
    <AntHeader style={{ padding: 0 }}>
      <Header />
    </AntHeader>
    <Divider />
    <Content style={{ padding: "0 50px", flex: "1 1 auto" }}>
      {children}
    </Content>
    <Divider />
    <AntFooter style={{ padding: 0 }}>
      <Footer />
    </AntFooter>
  </Layout>
);
