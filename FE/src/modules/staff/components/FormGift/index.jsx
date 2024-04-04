import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Collapse, Form, Input } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React from "react";

const FormGift = ({ onFinish, form, isLoading }) => {
  const { data: products, isLoading: loadingProduct } = useGetProduct({
    isGift: true,
  });
  return (
    <div>
      <Form
        scrollToFirstError
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
        <div className="mt-2">
          <SingleImageUpload
            capture="user"
            rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
            label="Ảnh "
            name="image1"
          />
        </div>
        <div className="mt-2">
          <SingleImageUpload
            capture="user"
            // rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
            label="Ảnh 2"
            name="image2"
          />
        </div>
        <Collapse accordion>
          <CollapsePanel header="Tồn kho đầu ca quà tặng" key="1">
            {products?.data?.map((e) => {
              return (
                <Form.Item
                  name={["startShiftInventory", e?._id]}
                  label={e?.name}
                >
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
            <div className="flex justify-center mt-2">
              <Button loading={isLoading} type="primary" htmlType="submit">
                Hoàn tất
              </Button>
            </div>
          </CollapsePanel>
          <CollapsePanel header="Thêm hàng giữa ca quà tặng" key="2">
            {products?.data?.map((e) => {
              return (
                <Form.Item
                  name={["midShiftAddProduct", e?._id]}
                  label={e?.name}
                >
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
            <div className="flex justify-center mt-2">
              <Button loading={isLoading} type="primary" htmlType="submit">
                Hoàn tất
              </Button>
            </div>
          </CollapsePanel>

          <CollapsePanel header="Sử dụng" key="4">
            {products?.data?.map((e) => {
              return (
                <Form.Item name={["usingGift", e?._id]} label={e?.name}>
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
            <div className="flex justify-center mt-2">
              <Button loading={isLoading} type="primary" htmlType="submit">
                Hoàn tất
              </Button>
            </div>
          </CollapsePanel>

          <CollapsePanel header="Tồn kho cuối ca quà tặng" key="3">
            {products?.data?.map((e) => {
              return (
                <Form.Item name={["endShiftInventory", e?._id]} label={e?.name}>
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
            <div className="flex justify-center mt-2">
              <Button loading={isLoading} type="primary" htmlType="submit">
                Hoàn tất
              </Button>
            </div>
          </CollapsePanel>
        </Collapse>

        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Hoàn tất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormGift;
