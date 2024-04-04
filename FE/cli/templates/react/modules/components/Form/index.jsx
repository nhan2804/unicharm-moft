
import { Button, Form, Input ,Select} from "antd";
import React, { useState } from "react";

const __name__(sentenceCase)FormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText="Tạo"

}) => {
  const [form] = Form.useForm();
 
  const _onFinish =(values)=>{
    onFinish(values)
  }
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
      <Form.Item label="Tên" rules={[
          {
            required: true,
            message: "Vui lòng nhập tên",
          },
        ]} name={"name"}>
      <Input/>
    </Form.Item> 
    __column-form__
    
    <div className="flex justify-end">
      <Form.Item>
        <Button
        
          type="primary"
          htmlType="submit"
          loading={loading}
        >
       {okText}
        </Button>
      </Form.Item>
    </div>
    </Form>
  );
};

export default __name__(sentenceCase)FormCreate;
