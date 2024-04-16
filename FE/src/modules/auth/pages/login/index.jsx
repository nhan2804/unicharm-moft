import React from "react";
import { Button, Form, Input } from "antd";
import useLogin from "@modules/auth/hooks/useLogin";
import { useParams } from "react-router";
const Login = () => {
  const { mutate: login, isLoading } = useLogin();
  const { projectId } = useParams();
  console.log({ projectId });
  const onFinish = (values) => {
    const username = projectId
      ? values?.username + projectId
      : values?.username;
    login({ ...values, username }, {});
  };
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <h2>Đăng nhập</h2>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-center">
            <Form.Item>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Đăng nhập.
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
