import SingleImageUpload from "@components/SingleImageUpload";
import { useAppSelector } from "@hooks/reduxHook";
import useRole from "@hooks/useRole";
import useGetDepartment from "@modules/manager/departments/hooks/query/useGetDepartment";
import { Button, Card, Collapse, Form, Input, Select, Typography } from "antd";
import React, { useMemo } from "react";

const FormIdentifyUser = ({ onFinish, form, isLoading }) => {
  const { data: departments } = useGetDepartment();
  const role = useAppSelector((s) => s?.auth?.user?.type);
  return (
    <div>
      <Form
        // labelCol={{ flex: "200px" }}
        // wrapperCol={{
        //   flex: 1,
        // }}
        labelAlign="left"
        labelWrap={true}
        // layout="inline"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          rules={[
            { required: true, message: "Vui lòng nhập họ tên người đánh giá!" },
          ]}
          name="nameMarker"
          label="Tên người đánh giá"
          className="my-1"
        >
          <Input type="text"></Input>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại người đánh giá!",
            },
            {
              // message: "Vui lòng nhập đúng số điện thoại",
              validator: (_, value) => {
                const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

                const rs = value?.match(regexPhoneNumber) ? true : false;
                if (rs || !value) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Vui lòng nhập đúng số điện thoại");
                }
              },
            },
          ]}
          name="phoneMarker"
          label="Số điện thoại người đánh giá"
          className="my-1"
        >
          <Input type="text"></Input>
        </Form.Item>

        <Form.Item
          rules={[
            { required: true, message: "Vui lòng chọn đối tượng đánh giá!" },
          ]}
          name="departmentId"
          label="Đối tượng đánh giá"
          className="my-1"
        >
          <Select
            options={departments
              ?.sort((a, b) => b.name.localeCompare(a.name))
              ?.map((e) => ({
                label: e?.name,
                value: e?._id,
              }))}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Vui lòng chọn!" }]}
          name="type"
          label="Phương thức"
          className="my-1"
        >
          <Select
            options={[
              {
                label: "Đánh giá",
                value: "RATING",
              },
              {
                label: "Policy",
                value: "POLICY",
              },
            ]
              .filter((e) => {
                return role === "RATING"
                  ? e.value === "RATING"
                  : e.value === "POLICY";
              })
              ?.map((e) => ({
                label: e?.label,
                value: e?.value,
              }))}
          />
        </Form.Item>
        <div className="flex justify-center mt-2 w-full">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Đồng ý
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormIdentifyUser;
