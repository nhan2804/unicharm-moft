import React from "react";
import { PageHeader } from "@ant-design/pro-components";
import { useNavigate } from "react-router";
const CustomPageHeader = ({ title = "Tiêu đề", extra }) => {
  const nav = useNavigate();
  return (
    <PageHeader
      title={title}
      onBack={() => nav(-1)}
      extra={extra || undefined}
    />
  );
};

export default CustomPageHeader;
