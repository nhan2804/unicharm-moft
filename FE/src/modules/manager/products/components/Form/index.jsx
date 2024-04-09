import SingleImageUpload from "@components/SingleImageUpload";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
} from "antd";
import React, { useState } from "react";

const ProductFormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText = "Tạo",
  showType = true,
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
      labelCol={{ span: 8 }}
      // wrapperCol={{ span: 16 }}
      initialValues={initialValues}
      autoComplete="off"
      onFinish={_onFinish}
      onFinishFailed={onFinishFailed}
    >
      {/* <Form.Item name="type">
        <Select allowClear placeholder="loại">
          {[].map((e) => {
            return <Select.Option value={e?.value}>{e?.label}</Select.Option>;
          })}
        </Select>
      </Form.Item> */}

      <Form.Item
        label="Tên"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên SP",
          },
        ]}
        name={"name"}
      >
        <Input placeholder="Nhập Tên SP" />
      </Form.Item>
      <Form.Item
        label="Mã"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mã SP",
          },
        ]}
        name={"code"}
      >
        <Input placeholder="Nhập Mã SP" />
      </Form.Item>
      <SingleImageUpload label="Ảnh sản phẩm" name="image" />

      {showType && (
        <div className="grid grid-cols-3">
          <Form.Item label="Số bán" valuePropName="checked" name={"isSale"}>
            <Checkbox />
          </Form.Item>
          <Form.Item label="OOS" valuePropName="checked" name={"isOos"}>
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Đổi quà"
            valuePropName="checked"
            name={"isGiftExchange"}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item label="Quà tặng" valuePropName="checked" name={"isGift"}>
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Quà ngoài"
            valuePropName="checked"
            name={"isGiftExternal"}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Sampling"
            valuePropName="checked"
            name={"isSampling"}
          >
            <Checkbox />
          </Form.Item>
        </div>
      )}
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

export default ProductFormCreate;
