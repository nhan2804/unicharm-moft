import { Button, Collapse, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import SingleImageUpload from "@components/SingleImageUpload";
export const dataYesNo = [
  { label: "Có", value: "YES" },
  {
    label: "Không",
    value: "NO",
  },
];
const FormEndShiftReport = ({ onFinish, form, isLoading }) => {
  const { data: products } = useGetProduct({ isSale: true });
  const { data: samplings } = useGetProduct({ isSampling: true });
  const { data: gifts } = useGetProduct({ isGiftExternal: true });
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
        <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}>
          <Collapse.Panel header="Số bán" key="1">
            {products?.data?.map((e) => {
              return (
                <Form.Item name={["endShiftSales", e?._id]} label={e?.name}>
                  <Input
                    defaultValue={0}
                    readOnly
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Sampling" key="2">
            {samplings?.data?.map((e) => {
              return (
                <Form.Item name={["endShiftSamplings", e?._id]} label={e?.name}>
                  <Input
                    defaultValue={0}
                    readOnly
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Quà tặng quay số" key="3">
            {gifts?.data?.map((e) => {
              return (
                <Form.Item
                  name={["endShiftGiftExternals", e?._id]}
                  label={e?.name}
                >
                  <Input
                    defaultValue={0}
                    readOnly
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Số bán thực tế" key="5">
            {products?.data?.map((e) => {
              return (
                <Form.Item
                  rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  name={["endShiftSalesActual", e?._id]}
                  label={e?.name}
                >
                  <Input
                    // defaultValue={0}
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Sampling thực tế" key="6">
            {samplings?.data?.map((e) => {
              return (
                <Form.Item
                  rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  name={["endShiftSamplingsActual", e?._id]}
                  label={e?.name}
                >
                  <Input
                    // defaultValue={0}
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Quà tặng quay số thực tế" key="7">
            {gifts?.data?.map((e) => {
              return (
                <Form.Item
                  rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  name={["endShiftGiftExternalsActual", e?._id]}
                  label={e?.name}
                >
                  <Input
                    // defaultValue={0}
                    type="number"
                    placeholder="Nhập số lượng"
                  ></Input>
                </Form.Item>
              );
            })}
          </Collapse.Panel>
          <Collapse.Panel header="Khác" key="4">
            <Form.Item label="Thuận lợi, khó khăn" name={"note"}>
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Tổng số khách đến Outlet"
              name={["extra", "totalClientOutlet"]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Tổng Số khách tiếp cận"
              name={["extra", "totalClientReach"]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item label="Đối thủ có CTKM" name={["extra", "hasPromotion"]}>
              <Select>
                {dataYesNo.map((e) => (
                  <Select.Option value={e?.value} key={e.label}>
                    {e.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <SingleImageUpload
              label="Hình BBNT"
              rules={[{ required: true, message: "Vui lòng chọn hình!" }]}
              name="imgbbnt"
            />
          </Collapse.Panel>
        </Collapse>
        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormEndShiftReport;
