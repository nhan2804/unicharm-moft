import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Collapse, Form, Input, Select } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React from "react";
export const optionsKindOOS = [
  { value: "LINE_U_KE", label: "Line, ụ, kệ" },
  { value: "KHO", label: "Kho" },
  { value: "LINE_U_KE_KHO", label: "Line, ụ, kệ & kho" },
];
const FormOos = ({ isLoading, onFinish, form }) => {
  const { data: products, isLoading: loadingProduct } = useGetProduct({
    isOos: true,
  });
  return (
    <div>
      <Form
        // labelCol={{ flex: "120px" }}
        // wrapperCol={{
        //   flex: 1,
        // }}
        labelAlign="left"
        labelWrap={true}
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng chọn",
            },
          ]}
          name="kind"
          label="Kiểm đếm"
          className="my-1"
        >
          <Select
            style={{ width: "100%" }}
            // defaultValue={options[0]}
            options={optionsKindOOS}
          ></Select>
        </Form.Item>
        {/* <Button className="w-[100%]" loading={isLoading} type="primary" htmlType="submit">
            CẬP NHẬT
          </Button> */}
        <Collapse defaultActiveKey={"1"} accordion>
          <CollapsePanel header="Tồn kho đầu ca" key="1">
            {products?.data?.map((e) => {
              return (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng!",
                    },
                  ]}
                  name={["startShiftInventoryOOS", e?._id]}
                  label={e?.name}
                >
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
          </CollapsePanel>
          {/* <CollapsePanel header="Tồn kho cuối ca" key="2">
            {products?.data?.map((e) => {
              return (
                <Form.Item
                  name={["endShiftInventoryOOS", e?._id]}
                  label={e?.name}
                >
                  <Input type="number" placeholder="Nhập số lượng"></Input>
                </Form.Item>
              );
            })}
          </CollapsePanel> */}
        </Collapse>
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

export default FormOos;
