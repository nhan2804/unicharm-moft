import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Form, Input } from "antd";
import React from "react";

const FormSale = ({ onFinish, form, isLoading }) => {
  const { data: products, isLoading: loadingProduct } = useGetProduct({
    isSale: true,
  });
  return (
    <div>
      <Form
        labelCol={{ flex: "120px" }}
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        // layout="inline"
        onFinish={onFinish}
        form={form}
      >
        {products?.data?.map((e) => {
          return (
            <Form.Item name={["data", e?._id]} label={e?.name}>
              <Input type="number" placeholder="Nhập số lượng"></Input>
            </Form.Item>
          );
        })}
        <div className="mt-2">
          <SingleImageUpload
            capture="user"
            rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
            label="Ảnh "
            name="image1"
          />
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

export default FormSale;
