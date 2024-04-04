import { Button, Form, Input, InputNumber, Select, Switch, Table } from "antd";
import React, { useState } from "react";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
const FormschemaFormCreate = ({
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
  const { data: products } = useGetProduct({
    isGiftExchange: true,
  });
  const { data: gifts } = useGetProduct({
    isGiftExternal: true,
  });
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
        label="Sản phẩm"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn",
          },
        ]}
        name={"product"}
      >
        <Select mode="multiple">
          {products?.data?.map((e) => {
            return (
              <Select.Option key={e?._id} value={e?._id}>
                {e?.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        label="Quà tặng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn",
          },
        ]}
        name={"gift"}
      >
        <Select mode="multiple">
          {gifts?.data?.map((e) => {
            return (
              <Select.Option key={e?._id} value={e?._id}>
                {e?.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Hoạt động" valuePropName="checked" name={"isActive"}>
        <Switch checkedChildren="Bật" unCheckedChildren="Tắt"></Switch>
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

export default FormschemaFormCreate;
