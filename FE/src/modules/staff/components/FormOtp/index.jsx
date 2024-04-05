import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Collapse, Form, Input } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React from "react";

const FormOTP = ({ onFinish, form, isLoading }) => {
  return (
    <div>
      <Form
        scrollToFirstError
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        // layout="inline"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="OTP" name="otp">
          <Input placeholder="Vui lòng nhập mã xác nhận"></Input>
        </Form.Item>

        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Tiếp theo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormOTP;
