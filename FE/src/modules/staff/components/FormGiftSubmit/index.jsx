import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Table,
} from "antd";
import React, { useRef } from "react";
import {
  SearchOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import useGetQuestionSurvey from "@modules/manager/questions/hooks/query/useGetQuestionSurvey";
import FormItem2 from "@modules/staff/question/FormItem2";
import CustomModal from "@components/CustomModal";

const FormGiftSubmit = ({ type, isLoading, onFinish, form }) => {
  const { data: samplingProducts, isLoading: isLoadingPrd } = useGetProduct({
    isSampling: true,
  });

  const { data: shifts } = useGetShift();
  const { data: questions } = useGetQuestionSurvey();

  const { data: products } = useGetProduct({
    isSale: true,
  });

  const ref = useRef();
  const refModal = useRef();
  if (isLoadingPrd) {
    return <Spin></Spin>;
  }
  const onPhoneFocus = () => {
    if (!ref?.current) {
      refModal?.current?.open();
      // ref.current = true;
    }
  };
  const onSUbmit = (v) => {
    onFinish(v, () => {
      ref.current = false;
    });
  };
  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onSUbmit}>
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
          <Input
            onFocus={() => {
              onPhoneFocus();
            }}
            placeholder="Nhập số điện thoại"
          />
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
              rules={[
                { required: true, message: "Vui lòng chụp ảnh nhận quà!" },
              ]}
              name="imgClient"
              label="Ảnh nhận quà"
              // capture={"user"}
            />
            <h2>Khảo sát</h2>
            <div className="group-vertical">
              {questions?.map((e) => {
                const option = e?.option?.filter((e) => {
                  // if (!e?.exceptDepartmentIds) return true;
                  return true;
                });
                return (
                  <Card bordered={false}>
                    <FormItem2
                      key={e?._id}
                      isRating={true}
                      nestedName={["dataSurvey"]}
                      question={{ ...e, option }}
                      classNameLabel={"text-sm"}
                    />
                  </Card>
                );
              })}
            </div>
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

            <div>
              <Form.List
                label="Danh sách sản phẩm"
                name={["productsBill"]}
                rules={[
                  {
                    validator: async (_, option) => {
                      if (!option || option?.length === 0) {
                        return Promise.reject(
                          new Error("Phải có ít nhất một sản phẩm")
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
                            dataIndex: "product",
                            title: "Loại SP",
                            key: "product",
                            render: (_, field) => {
                              return (
                                <div>
                                  <Form.Item
                                    label="Sản phẩm"
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
                                  <Form.Item
                                    label="Số lượng"
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
                                </div>
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
                      {fields?.length === 0 && (
                        <Button
                          type="primary"
                          htmlType="button"
                          className="mb-2"
                          onClick={() => add({ value: fields?.length + 1 })}
                          icon={<PlusCircleOutlined />}
                        >
                          Thêm
                        </Button>
                      )}
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
      <CustomModal
        noButton={true}
        closable={false}
        centered={true}
        title={"Điều khoản"}
        isRealModal
        ref={refModal}
        onOk={() => {
          ref.current = true;
          refModal?.current?.close();
        }}
      >
        {() => {
          return (
            <div className="text-primary font-semibold text-lg">
              <div>
                Chúng tôi cam kết rằng thông tin cá nhân của bạn sẽ được bảo mật
                và chỉ sử dụng cho mục đích hỗ trợ và cung cấp dịch vụ tốt nhất
                cho bạn.
              </div>
              <div>
                Chúng tôi sẽ không sử dụng, chia sẻ hay bán dữ liệu cá nhân của
                bạn cho bất kỳ bên thứ ba nào cho các hoạt động kinh doanh khác
                mà không có sự đồng ý của bạn.
              </div>
            </div>
          );
        }}
      </CustomModal>
    </div>
  );
};

export default FormGiftSubmit;
