import SingleImageUpload from "@components/SingleImageUpload";
import { array2Object } from "@helper/array2Obj";
import useGetGroupimage from "@modules/manager/groupimages/hooks/query/useGetGroupimage";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import { Button, Card, Collapse, Form, Input } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React from "react";
export const imagesSup = [
  {
    label: "Ảnh 1",
    value: "1",
  },
  {
    label: "Ảnh 2",
    value: "2",
  },
  {
    label: "Ảnh 3",
    value: "3",
  },
];
const FormSupImage = ({ onFinish, form, isLoading }) => {
  return (
    <div>
      <Form
        labelCol={{ flex: "120px" }}
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        onFinish={onFinish}
        form={form}
      >
        <div>
          <Card>
            {imagesSup.map((e) => {
              return (
                <SingleImageUpload
                  key={e.value}
                  capture="user"
                  name={["dataImage", e.value]}
                  label={e?.label}
                ></SingleImageUpload>
              );
            })}
          </Card>
        </div>
        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Hoàn tất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormSupImage;
