import SingleImageUpload from "@components/SingleImageUpload";
import { Button, DatePicker, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { typeUser } from "./MappingTypeUser";

const UserFormCreate = ({
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
      <Form.Item label="Họ và tên" name={"fullName"}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Tên đăng nhập"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập đăng nhập",
          },
        ]}
        name={"username"}
      >
        <Input disabled={!!initialValues?.username} />
      </Form.Item>

      <Form.Item
        label="Mật khẩu "
        rules={
          !initialValues?.passwordRaw
            ? [
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]
            : []
        }
        name={"password"}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item label="Loại" name={"type"}>
        <Select>
          {typeUser.map((e) => {
            return <Select.Option value={e?.value}>{e?.label}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <SingleImageUpload label="Ảnh N.Viên" name="avatar" />
      <div className="grid grid-cols-1">
        <Form.Item label="Ngày sinh" name={"dob"}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Ngày training" name={"dateTraining"}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Ngày pass học việc" name={"datePassWork"}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu làm việc" name={"dateToWork"}>
          <DatePicker />
        </Form.Item>
      </div>

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

export default UserFormCreate;
