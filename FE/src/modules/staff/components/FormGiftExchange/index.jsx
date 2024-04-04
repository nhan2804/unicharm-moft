import SingleImageUpload from "@components/SingleImageUpload";
import { array2Object } from "@helper/array2Obj";
import useGetFormschema from "@modules/manager/formschemas/hooks/query/useGetFormschema";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Card, Collapse, Form, Input, Typography } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React, { useMemo } from "react";

const FormGiftExchange = ({ onFinish, form, isLoading }) => {
  const { data: products, isLoadingPrd } = useGetProduct();
  const { data: schemes, isLoadingSch } = useGetFormschema();

  const keyProducts = useMemo(() => {
    let data = array2Object(products?.data, "_id");
    return data;
  }, [products]);
  return (
    <div>
      <Form
        labelCol={{ flex: "200px" }}
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        // layout="inline"
        onFinish={onFinish}
        form={form}
      >
        <Card title="Thông tin khách hàng">
          <Form.Item
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
            name="custName"
            label="Tên khách hàng"
            className="my-1"
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Nhập số điện thoại của bạn!" },
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
            name="custNumber"
            label="Số điện thoại khách hàng"
            className="my-1"
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Vui lòng nhập số hóa đơn!" }]}
            name="billId"
            label="Số hóa đơn"
            className="my-1"
          >
            <Input type="text"></Input>
          </Form.Item>
        </Card>
        {schemes?.map((e) => {
          return (
            <Card className="w-full" title={e?.name}>
              {e?.product.map((productId) => {
                return (
                  <Form.Item
                    name={["dataSchemes", e?._id, "product", productId]}
                    key={productId}
                    label={keyProducts?.[productId]?.name}
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                );
              })}
              <Typography.Text className="font-bold text-lg text-primary">
                Nhập số lượng quà tặng
              </Typography.Text>
              {e?.gift.map((productId) => {
                return (
                  <Form.Item
                    name={["dataSchemes", e?._id, "gift", productId]}
                    key={productId}
                    label={keyProducts?.[productId]?.name}
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                );
              })}
            </Card>
          );
        })}
        <Card className="w-full" title="Khu vực ảnh">
          <SingleImageUpload
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên hình ảnh hóa đơn",
              },
            ]}
            name={`giftImage`}
            label={"Hình ảnh hóa đơn"}
          />
        </Card>
        <div className="flex justify-center mt-2 w-full">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Hoàn tất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormGiftExchange;
