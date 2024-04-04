import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useState } from "react";

const listNotiCate = [
  "Vào kho lấy hàng, Châm hàng",
  "Hỗ trợ ngành hàng",
  "Đi vệ sinh",
  "Đi ăn",
  "Khác (Nếu có)",
];
const NotificationFormCreate = ({
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
        label="Tên "
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên",
          },
        ]}
        name={"name"}
      >
        <Select>
          {listNotiCate?.map((e) => {
            return (
              <Select.Option key={e} value={e}>
                {e}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Ghi chú" name={"note"}>
        <Input />
      </Form.Item>
      {/* <Form.Item
        rules={[
          {
            required: true,
            message: "Vui lòng chọn",
          },
        ]}
        label="Từ giờ/Đến giờ"
        name="rangeTime"
      >
        <TimePicker.RangePicker showTime />
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

export default NotificationFormCreate;
