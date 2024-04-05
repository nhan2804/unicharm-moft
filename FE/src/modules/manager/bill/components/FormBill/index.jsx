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

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
const FormAcceptBill = ({ onFinish, selected, type }) => {
  const [form] = Form.useForm();
  const onDone = (v) => {
    onFinish({ ...v, status: selected?.type });
  };
  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={onDone}
      >
        <>
          {selected?.type === "DENY" ? (
            <>
              <Form.Item
                label="Lý do"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lý do từ chối",
                  },
                ]}
                name={"reasonBill"}
              >
                <Input.TextArea></Input.TextArea>
              </Form.Item>
            </>
          ) : (
            <>
              <p className="text-2xl text-yellow-500 !mt-0">
                Vui lòng kiểm tra bill đúng của store{" "}
                <span className="text-green-500">{selected?.place?.name}</span>{" "}
                khu vực{" "}
                <span className="text-green-500">
                  {selected?.place?.region}
                </span>{" "}
                tỉnh{" "}
                <span className="text-green-500">
                  {selected?.place?.province}
                </span>
              </p>
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
                name={"shift"}
              >
                <Select>
                  <Select.Option value="1">Ca sáng</Select.Option>
                  <Select.Option value="2">Ca chiều</Select.Option>
                </Select>
              </Form.Item>

              <div>
                <Form.List
                  label="Danh sách sản phẩm"
                  name={["data"]}
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
                                      []
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
        </>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            {" "}
            Duyệt
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormAcceptBill;
