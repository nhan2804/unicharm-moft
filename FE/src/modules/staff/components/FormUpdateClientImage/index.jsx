import SingleImageUpload from "@components/SingleImageUpload";
import { Button, Collapse, Form, Input } from "antd";
import React from "react";

const FormUpdateClientImage = ({ onFinish, form, isLoading }) => {
  return (
    <div>
      <Form
        scrollToFirstError
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        <SingleImageUpload
          rules={[{ required: true, message: "Vui lòng chụp ảnh nhận quà!" }]}
          name="imgClient"
          label="Ảnh nhận quà"
          capture={"user"}
        />

        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Tiếp theo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormUpdateClientImage;
