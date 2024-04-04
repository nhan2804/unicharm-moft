import useGetGroupimage from "@modules/manager/groupimages/hooks/query/useGetGroupimage";
import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";

const ImageFormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText = "Tạo",
}) => {
  const [form] = Form.useForm();
  const { data: groups } = useGetGroupimage();
  const _onFinish = (values) => {
    onFinish(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Form onFinishFailed:", errorInfo);
  };
  return (
    <Form
      layout="vertical"
      disabled={loading}
      form={form}
      labelCol={{ span: 6 }}
      // wrapperCol={{ span: 16 }}
      initialValues={initialValues}
      autoComplete="off"
      onFinish={_onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Tên"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên",
          },
        ]}
        name={"name"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: "Vui lòng chọn group hình ảnh",
          },
        ]}
        label="Thuộc group"
        name={"groupId"}
      >
        <Select>
          {groups?.map((e) => {
            return <Select.Option value={e?._id}>{e?.name}</Select.Option>;
          })}
        </Select>
      </Form.Item>

      <div className="flex justify-end">
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {okText}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ImageFormCreate;
