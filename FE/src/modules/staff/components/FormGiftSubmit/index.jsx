import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from "antd";
import React from "react";
import {
  SearchOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useGetShift from "@modules/staff/hooks/query/useGetShift";

const FormGiftSubmit = ({ type, isLoading, onFinish }) => {
  const { data: samplingProducts, isLoading: isLoadingPrd } = useGetProduct({
    isSampling: true,
  });

  const { data: shifts } = useGetShift();

  const { data: products } = useGetProduct({
    isSale: true,
  });
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Họ và tên"
        name={"fullName"}
        rules={[
          { required: true, message: "Vui lòng nhập họ và tên của bạn!" },
        ]}
      >
        <Input placeholder="Nhập họ và tên"></Input>
      </Form.Item>
      <Form.Item
        normalize={(e) => e?.trim()?.normalize()}
        label="Số điện thoại"
        name="phone"
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
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>
      {type?.toUpperCase() === "SAMPLING" && (
        <>
          <Form.Item
            label="Quà"
            name="products"
            // getValueFromEvent={(selectedIds) => {
            //   const updatedOptions = {};
            //   selectedIds.forEach((id) => {
            //     updatedOptions[id] = 1; // Setting the value to 1 for each selected option
            //   });
            //   return updatedOptions;
            // }}
            // getValueProps={(value) => {
            //   if (value)
            //     // Here, you can customize how the value is displayed in the Select component if needed
            //     return Object.keys(value); // For example, returning an array of selected IDs
            // }}
            rules={[{ required: true, message: "Vui lòng chọn quà tặng!" }]}
            initialValue={samplingProducts?.data?.map((e) => e?._id)}
          >
            <Select
              options={samplingProducts?.data?.map((e) => ({
                label: e?.name,
                value: e?._id,
              }))}
              mode="multiple"
              disabled
            ></Select>
          </Form.Item>
          <SingleImageUpload
            rules={[{ required: true, message: "Vui lòng chụp ảnh nhận quà!" }]}
            name="imgClient"
            label="Ảnh nhận quà"
            capture={"user"}
          />
        </>
      )}
      {type?.toUpperCase() === "SELLING" && (
        <>
          <SingleImageUpload
            rules={[{ required: true, message: "Vui lòng chụp ảnh bill!" }]}
            label="Ảnh bill"
            name="imgBill"
          ></SingleImageUpload>
          <Form.Item
            normalize={(v) => v?.trim?.()}
            label="Mã bill"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã bill",
              },
            ]}
            name={"codeBill"}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Ngày bill"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngày bill",
              },
            ]}
            name={"dateBill"}
          >
            <DatePicker format={"DD-MM-YYYY"} />
          </Form.Item>
          <Form.Item
            label="Ca làm việc"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ca làm việc",
              },
            ]}
            name={"shiftId"}
          >
            <Select>
              {shifts?.map((e) => {
                return (
                  <Select.Option key={e?._id} value={e?._id}>
                    {e?.name}
                  </Select.Option>
                );
              })}
              {/* <Select.Option value="1">Ca sáng</Select.Option>
                  <Select.Option value="2">Ca chiều</Select.Option> */}
            </Select>
          </Form.Item>

          <div>
            <Form.List
              label="Danh sách sản phẩm"
              name={["productsBill"]}
              //   rules={[
              //     {
              //       validator: async (_, option) => {
              //         if (!option || option?.length === 0) {
              //           return Promise.reject(
              //             new Error("Phải có ít nhất một sản phẩm")
              //           );
              //         }
              //         return option;
              //       },
              //     },
              //   ]}
            >
              {(fields, { add, remove }, { errors }) => {
                return (
                  <div>
                    <Table
                      pagination={false}
                      dataSource={[...fields]}
                      columns={[
                        {
                          dataIndex: "product",
                          title: "Loại SP",
                          key: "product",

                          render: (_, field) => {
                            return (
                              <Form.Item
                                // normalize={(e) => e?.trim()}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chọn một loại SP",
                                  },
                                ]}
                                // {...field}
                                name={[field?.name, "product"]}
                                key={[field.key, "product"]}
                              >
                                <Select
                                  showSearch
                                  filterOption={(input, option) => {
                                    return option?.children
                                      ?.toLowerCase()
                                      ?.includes(input?.toLowerCase());
                                  }}
                                  style={{ width: 250 }}
                                  placeholder="Sản phẩm"
                                >
                                  {products?.data?.map((e) => {
                                    return (
                                      <Select.Option
                                        key={e?._id}
                                        value={e?._id}
                                      >
                                        {e?.name}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            );
                          },
                        },
                        {
                          dataIndex: "quantity",
                          title: "S.lượng",
                          key: "quantity",
                          render: (_, field) => {
                            return (
                              <Form.Item
                                // normalize={(e) => e?.trim()}
                                rules={[
                                  {
                                    required: true,
                                    message: "Nhập s.lượng",
                                  },
                                ]}
                                // {...field}
                                name={[field?.name, "quantity"]}
                                key={[field.key, "quantity"]}
                              >
                                <InputNumber placeholder="Nhập quantity" />
                              </Form.Item>
                            );
                          },
                        },
                        {
                          dataIndex: "action",
                          title: "H.động",
                          key: "action",
                          render: (_, field) => {
                            return (
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                htmlType="button"
                                onClick={() => {
                                  remove(field?.name);
                                }}
                              ></Button>
                            );
                          },
                        },
                      ]?.filter((e) => !!e)}
                      rowKey={(row) => row?.key}
                    ></Table>
                    {errors?.length > 0 && (
                      <p className="text-red-500">{errors?.join(", ")}</p>
                    )}
                    <Button
                      type="primary"
                      htmlType="button"
                      className="mb-2"
                      onClick={() => add({ value: fields?.length + 1 })}
                      icon={<PlusCircleOutlined />}
                    >
                      Thêm
                    </Button>
                  </div>
                );
              }}
            </Form.List>
          </div>
        </>
      )}

      <div className="flex justify-center">
        {" "}
        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Tiếp tục
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default FormGiftSubmit;
