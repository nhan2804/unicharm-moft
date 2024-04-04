import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";

const StoreFormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText = "Tạo",
  users,
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
      disabled={loading}
      form={form}
      layout="vertical"
      // labelCol={{ span: 3 }}
      // wrapperCol={{ span: 16 }}
      labelWrap={true}
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
      <Form.Item label="Miêu tả" name={"desc"}>
        <Input.TextArea placeholder="Miêu tả" />
      </Form.Item>
      <Form.Item label="Khu vực" name="region">
        <Input placeholder="Khu vực" />
      </Form.Item>
      <Form.Item label="Mã" name="code">
        <Input placeholder="Mã" />
      </Form.Item>
      <Form.Item label="Account" name="type">
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Số nhà" name="house_num">
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Đường" name="street">
        <Input placeholder="" />
      </Form.Item>
      {/* <Form.Item label="Đường" name="address">
        <Input placeholder="" />
      </Form.Item> */}
      <Form.Item label="Phường/Xã" name="ward">
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Quận/Huyện" name="district">
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Tỉnh" name="province">
        <Input placeholder="Tỉnh" />
      </Form.Item>
      <Form.Item label="Sale rep" name="saleRep">
        <Input placeholder="Sale rep" />
      </Form.Item>
      <Form.Item label="Sale sup" name="saleSup">
        <Input placeholder="Sale sup" />
      </Form.Item>
      <Form.Item label="KAM" name="kam">
        <Input placeholder="kam" />
      </Form.Item>
      <Form.Item label="Nhân viên" name="userIds">
        <Select
          filterOption={(input, option) => {
            return (option?.children || "").includes(input);
          }}
          showSearch
          allowClear
          mode="multiple"
          placeholder="Nhân viên"
        >
          {users?.map((e) => {
            return (
              <Select.Option value={e?._id}>
                {e?.username + " " + e?.fullName}
              </Select.Option>
            );
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

export default StoreFormCreate;
