import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import InputNumber from "antd/es/input-number";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
const StoreFormUpdateGift = ({
  loading,
  onFinish,
  initialValues,
  okText = "Update",
  users,
}) => {
  const [form] = Form.useForm();

  const _onFinish = (values) => {
    onFinish(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Form onFinishFailed:", errorInfo);
  };
  const { data: gifts } = useGetProduct({ isGiftExternal: true });
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
      {gifts?.data?.map((e) => {
        return (
          <div key={e?._id} className="flex space-x-1">
            <Form.Item label={e?.name} name={["gifts", e?._id]}>
              <InputNumber placeholder="Số lượng" min={0} />
            </Form.Item>
          </div>
        );
      })}
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

export default StoreFormUpdateGift;
