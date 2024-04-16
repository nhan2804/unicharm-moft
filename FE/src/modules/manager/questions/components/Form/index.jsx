import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Table,
} from "antd";
import React, { useState } from "react";

import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { array2Object } from "@helper/array2Obj";
import useGetDepartment from "@modules/manager/departments/hooks/query/useGetDepartment";
import { statusQuestion } from "../../pages";
import useGetGroupimage from "@modules/manager/groupimages/hooks/query/useGetGroupimage";
export const typesDirection = [
  { label: "Chiều dọc", value: "VERTICAL" },
  {
    label: "Chiều ngang",
    value: "HORIZONTAL",
  },
  // {
  //   label: "Mặc định",
  //   value: "",
  // },
];
export const mappingTypeDirection = array2Object(typesDirection, "value");
export const listTypeOption = [
  {
    label: "Chọn một",
    value: "SINGLE",
  },
  {
    label: "Chọn nhiều",
    value: "MULTI",
  },
  {
    label: "Text/Input",
    value: "INPUT",
  },
  // {
  //   label: "Ảnh",
  //   value: "UPLOAD",
  // },
];
export const listTypeValue = {
  MULTI: [
    {
      label: "Dropdown",
      value: "MULTI_DROPDOWN",
      formItem: "LIST",
    },
    {
      label: "Checkbox",
      value: "MULTI_CHECKBOX",
      formItem: "CHECKBOX",
    },
  ],
  SINGLE: [
    {
      label: "Dropdown",
      value: "SINGLE_DROPDOWN",
      formItem: "LIST",
    },
    {
      label: "Radio",
      value: "SINGLE_RADIO",
      formItem: "RADIO",
    },
  ],
  INPUT: [
    {
      label: "Ngắn",
      value: "SHORT_INPUT",
      formItem: "TEXT",
    },
    {
      label: "Dài",
      value: "LONG_RADIO",
      formItem: "LONG_TEXT",
    },
  ],
};

export const categoryQues = {
  PRODUCT_KNOWLEDGE: "Kiến thức sản phẩm",
  WORK_QUESTION: "Câu hỏi công việc",
};
const QuestionFormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText = "Tạo",
  form,
  typeQuestion,
}) => {
  const _onFinish = (values) => {
    onFinish(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Form onFinishFailed:", errorInfo);
  };
  const { data: groups } = useGetGroupimage({ type: "RATING" });
  const { data: departments } = useGetDepartment();
  const watchType = Form.useWatch("type", form);
  const watchKind = Form.useWatch("kind", form);
  const noOption = watchType === "INPUT";
  const typeValue = listTypeValue?.[watchType];
  return (
    <Form
      layout="vertical"
      disabled={loading}
      form={form}
      labelCol={{ span: 6 }}
      // wrapperCol={{ span: 16 }}
      initialValues={initialValues}
      autoComplete="off"
      onFinish={_onFinish}
      onFinishFailed={onFinishFailed}
    >
      {typeQuestion === "POLICY" ? (
        <div>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên",
              },
            ]}
            label="Câu hỏi"
            name={"name"}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name={"description"}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Điểm" name={"point"}>
            <InputNumber min={-99999} max={99999} />
          </Form.Item>
        </div>
      ) : (
        <>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên",
              },
            ]}
            label="Câu hỏi"
            name={"name"}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name={"description"}>
            <Input.TextArea />
          </Form.Item>
          {typeQuestion === "WORK" && (
            <Form.Item label="Loại câu hỏi" name={"category"}>
              <Select>
                {Object.entries(categoryQues).map(([k, v]) => {
                  return <Select.Option value={k}>{v}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          )}
          {typeQuestion === "RATING" && (
            <Form.Item label="Group" name={"groupId"}>
              <Select>
                {groups?.map((e) => {
                  return (
                    <Select.Option value={e?._id}>{e?.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}

          {/* {typeQuestion === "WORK" && ( */}
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại kiểu câu hỏi",
              },
            ]}
            label="Kiểu"
            name={"type"}
          >
            <Radio.Group>
              {listTypeOption?.map((e, i) => {
                return (
                  <Radio key={i} value={e?.value}>
                    {e?.label || e?.name}
                  </Radio>
                );
              })}
            </Radio.Group>
            {/* <Select>
                            {listTypeOption.map((e, i) => (
                              <Select.Option value={e?.value} key={i}>
                                {e?.label}
                              </Select.Option>
                            ))}
                          </Select> */}
          </Form.Item>
          {/* )} */}
          {watchType && watchType !== "UPLOAD" && (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kiểu câu hỏi",
                },
              ]}
              label="Kiểu câu hỏi"
              name={"kind"}
            >
              <Radio.Group>
                {typeValue?.map((e, i) => {
                  return (
                    <Radio key={i} value={e?.value}>
                      {e?.label || e?.name}
                    </Radio>
                  );
                })}
              </Radio.Group>
              {/* <Select>
                              {typeValue.map((e, i) => (
                                <Select.Option value={e?.value} key={i}>
                                  {e?.label}
                                </Select.Option>
                              ))}
                            </Select> */}
            </Form.Item>
          )}

          {watchKind && !noOption && (
            <div>
              <Form.List
                label="Danh sách option"
                name={["option"]}
                rules={[
                  {
                    validator: async (_, option) => {
                      if (!option || option?.length === 0) {
                        return Promise.reject(
                          new Error("Phải có ít nhất một option")
                        );
                      }
                      return option;
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => {
                  return (
                    <div>
                      <Table
                        pagination={false}
                        dataSource={[...fields]}
                        columns={[
                          {
                            dataIndex: "label",
                            title: "Tên",
                            key: "label",
                            render: (_, field) => {
                              return (
                                <Form.Item
                                  // normalize={(e) => e?.trim()}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập",
                                    },
                                  ]}
                                  // {...field}
                                  name={[field?.name, "label"]}
                                  key={[field.key, "label"]}
                                >
                                  <Input
                                    placeholder={`Nhập label ${field?.name}`}
                                  />
                                </Form.Item>
                              );
                            },
                          },
                          {
                            dataIndex: "value",
                            title: "Giá trị",
                            key: "value",
                            render: (_, field) => {
                              return (
                                <Form.Item
                                  // normalize={(e) => e?.trim()}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập",
                                    },
                                  ]}
                                  // {...field}
                                  name={[field?.name, "value"]}
                                  key={[field.key, "value"]}
                                >
                                  <InputNumber placeholder="Nhập value" />
                                </Form.Item>
                              );
                            },
                          },
                          typeQuestion === "RATING" && {
                            dataIndex: "point",
                            title: "Point",
                            key: "point",
                            render: (_, field) => {
                              return (
                                <Form.Item
                                  // normalize={(e) => e?.trim()}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập point",
                                    },
                                  ]}
                                  // {...field}
                                  name={[field?.name, "point"]}
                                  key={[field.key, "point"]}
                                >
                                  <InputNumber placeholder="Nhập point" />
                                </Form.Item>
                              );
                            },
                          },
                          typeQuestion === "RATING" && {
                            dataIndex: "exceptDepartmentIds",
                            title: "Loại trừ",
                            key: "exceptDepartmentIds",
                            render: (_, field) => {
                              return (
                                <Form.Item
                                  // normalize={(e) => e?.trim()}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message: "Nhập point",
                                  //   },
                                  // ]}
                                  // {...field}
                                  name={[field?.name, "exceptDepartmentIds"]}
                                  key={[field.key, "exceptDepartmentIds"]}
                                >
                                  <Select
                                    style={{ width: 200 }}
                                    mode="multiple"
                                  >
                                    {departments?.map((e) => {
                                      return (
                                        <Select.Option key={e?._id}>
                                          {e?.name}
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              );
                            },
                          },
                          typeQuestion === "WORK" && {
                            dataIndex: "isAnswer",
                            title: "Là đ.án đúng",
                            key: "isAnswer",
                            render: (_, field) => {
                              return (
                                <Form.Item
                                  valuePropName="checked"
                                  name={[field?.name, "isAnswer"]}
                                  key={[field.key, "isAnswer"]}
                                >
                                  <Checkbox></Checkbox>
                                </Form.Item>
                              );
                            },
                          },
                          {
                            dataIndex: "action",
                            title: "Hành động",
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
          )}

          <Form.Item valuePropName="checked" name={"required"} label="Bắt buộc">
            <Checkbox />
          </Form.Item>
        </>
      )}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Vui lòng chọn trạng thái",
          },
        ]}
        label="Trạng thái"
        name="status"
      >
        <Select style={{ width: 200 }} allowClear placeholder="Status">
          {statusQuestion.map((e) => {
            return (
              <Select.Option key={e?.label} value={e?.value}>
                {e?.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <div className="flex justify-end">
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {okText}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default QuestionFormCreate;
