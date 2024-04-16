import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Result } from "antd";
import useLogin from "@modules/auth/hooks/useLogin";
import { useNavigate, useParams } from "react-router";
import useQueryString2 from "@hooks/useQueryString2";
import useLoginAndGenerateCode from "../hooks/mutate/useLoginAndGenerateCode";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";
import { login as loginAction } from "@modules/auth/slices";
import { useForm, useWatch } from "antd/es/form/Form";
import SingleImageUpload from "@components/SingleImageUpload";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
const LoginComsumer = () => {
  const {
    data: dataGiftClient,
    mutate: login,
    isLoading,
  } = useLoginAndGenerateCode({});
  const querystring = useQueryString2();
  const qsParsed = querystring?.qsParsed;
  // alert("Không có ref và store trên qs");

  const staffId = qsParsed?.ref;
  const storeId = qsParsed?.store;
  const phone = qsParsed?.phone || qsParsed?.p;
  const dispatch = useAppDispatch();
  const { data: samplingProducts, isLoading: isLoadingPrd } = useGetProduct({
    isSampling: true,
  });
  const [finished, setFinished] = useState(false);
  const user = useAppSelector((s) => s?.auth?.user);

  const navigate = useNavigate();
  useEffect(() => {
    if (phone) {
      login(
        { phone },
        {
          onSuccess: (data) => {
            // dispatch(loginAction(data?.login));
            const str = data?.isShowCode ? `?code=${data?.code?.code}` : "";
            console.log({ str });
            // navigate(`/consumer/create-bill${str}`, {
            //   replace: true,
            // });
          },
        }
      );
      return;
    }
    if (!storeId) {
      window.location.href = "https://www.google.com";
    }
  }, [staffId, storeId, phone, login, dispatch, navigate]);

  const onFinish = (values) => {
    if (values["products"]) {
      let products = {};
      values?.["products"]?.forEach((id) => {
        products[id] = 1; // Setting the value to 1 for each selected option
      });
      values["products"] = products;
    }
    login(
      {
        ...values,
        staffId,
        storeId,
        domain: window.location.host,
        phone: values?.phone?.trim()?.normalize(),
      },
      {
        onSuccess: (data) => {
          // dispatch(loginAction(data?.login));

          if (data?.giftClient?.type === "SELLING") {
            navigate(`/consumer/roll/${data?.giftClient?._id}`);
            return;
          } else {
            // alert("Mã OTP của bạn là : " + data?.giftClient?.code);
          }
          if (data?.giftClient) {
            setFinished(true);

            form.resetFields();
          }
        },
      }
    );
  };
  const [form] = Form.useForm();
  const watchType = useWatch("type", form);
  if (finished)
    return (
      <Result
        status={"success"}
        title="Mã xác nhận đã được gửi đến số điện thoại, vui lòng kiểm tra và đưa nó cho nhân viên!"
        extra={
          <Button
            onClick={() => {
              setFinished(false);
              window.close();
            }}
            type="primary"
            key="console"
          >
            Đồng ý
          </Button>
        }
      />
    );
  if (!!dataGiftClient) {
    return <Result status={"success"} title={"Bạn đã nhận được phần quà!"} />;
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <h2>Nhập thông tin của bạn</h2>
        <Form
          form={form}
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
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
          <Form.Item
            rules={[
              { required: true, message: "Vui lòng chọn loại quà tặng!" },
            ]}
            name="type"
            label="Loại quà tặng"
          >
            <Select placeholder="Chọn loại">
              <Select.Option value="SAMPLING">SAMPLING</Select.Option>
              <Select.Option value="SELLING">BÁN HÀNG</Select.Option>
            </Select>
          </Form.Item>
          {watchType === "SAMPLING" && (
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
          )}
          {watchType === "SELLING" && (
            <SingleImageUpload
              rules={[{ required: true, message: "Vui lòng chụp ảnh bill!" }]}
              label="Ảnh bill"
              name="imgBill"
            ></SingleImageUpload>
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
      </div>
    </div>
  );
};
export default LoginComsumer;
