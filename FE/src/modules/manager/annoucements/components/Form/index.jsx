import { Button, DatePicker, Form, Input, Select } from "antd";
import React, { useState } from "react";

const AnnoucementFormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText = "Tạo",
}) => {
  const [form] = Form.useForm();

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
        <Input placeholder="Tên" />
      </Form.Item>
      <Form.Item label="Miêu tả" name="desc">
        <Input.TextArea placeholder="Nhập miêu tả" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: "Vui lòng chọn",
          },
        ]}
        label="Từ ngày/Đến ngày"
        name="rangeDate"
      >
        <DatePicker.RangePicker />
      </Form.Item>

      {/* <Form.Item label="Cửa hàng" name="storeid">
        <Input placeholder="Nhập cửa hàng" />
      </Form.Item> */}

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

export default AnnoucementFormCreate;
