import { Button, Card, Form, Image, Input, Modal, message } from "antd";
import React, { useCallback, useRef } from "react";
import { useEffect } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import useCheckCode from "../hooks/query/useCheckCode";
import SingleImageUpload from "@components/SingleImageUpload";
import useCreateBill from "@modules/bill/hooks/mutate/useCreateBill";
import useDebounce from "@hooks/useDebounce";
import { useNavigate } from "react-router";
import note1 from "@assets/note1.jpg";
import note2 from "@assets/note2.jpg";
import useQueryString2 from "@hooks/useQueryString2";
import useShowPlace from "@modules/projects/hooks/query/useShowPlace";
import { useAppSelector } from "@hooks/reduxHook";
import { mappingHotline } from "../layout/ConsumerLayout";
import CustomModal from "@components/CustomModal";
const CreateBillCustomer = () => {
  const [form] = Form.useForm();
  const qstring = useQueryString2();
  const initCode = qstring.qsParsed?.code;

  // const initCode = qstring.qsParsed?.initCode;
  const user = useAppSelector((s) => s?.auth?.user);
  const { data: lastPlace } = useShowPlace(
    "111",
    user?.lastPlaceId || undefined
  );
  useEffect(() => {
    if (initCode) {
      form.setFieldValue("code", initCode);
    }
  }, [form, initCode]);

  const watchCode = Form.useWatch("code", form);
  const debouncedValue = useDebounce(watchCode, 1000);
  const {
    mutate: checkCode,
    error,
    data: code,
    isLoading: loadingCheck,
  } = useCheckCode();
  const { mutate: createBill, isLoading } = useCreateBill();
  const namePlace = mappingHotline?.[lastPlace?.region];
  const checkCodeFn = useCallback(
    (value) => {
      checkCode(value, {
        onError: () => {
          message.error("Mã dự thưởng không hợp lệ.");
        },
      });
    },
    [checkCode]
  );

  const nav = useNavigate();
  useEffect(() => {
    if (debouncedValue) {
      checkCodeFn(debouncedValue);
    }
  }, [checkCodeFn, debouncedValue]);
  const now = new Date().getHours();
  const showNoti = now > 21 || now < 9;
  const onFinish = (value) => {
    createBill(
      {
        ...value,
        codeId: code?._id,
      },
      {
        onSuccess: () => {
          Modal.success({
            title: "Tải thành công",
            centered: true,
            content: (
              <div>
                <p className="text-xl">
                  Hóa đơn được tải thành công
                  {!showNoti && ", vui lòng chờ xác nhận từ hệ thống"}
                </p>
                <p className="text-red-500">
                  {showNoti && (
                    <div>
                      Đã hết giờ duyệt hóa đơn trong ngày <br />
                      vui lòng quay lại vào ngày hôm sau khung giờ 9g00-21g00 và
                      kiểm tra thông báo để nhận kết quả
                    </div>
                  )}
                </p>
              </div>
            ),
            okText: "Về trang chủ",
            cancelText: "Ở lại",
            onOk: () => {
              nav(`/consumer/bill`);
            },

            onCancel: (close) => {
              // close?.();
              form.resetFields();
            },
            closable: true,
            maskClosable: true,
            closeIcon: <div>X</div>,
          });
        },
      }
    );
    console.log({ value });
  };

  const ref = useRef();
  const refNoti = useRef();
  const errMess = error?.response?.data?.message?.replace(
    "0901379396",
    namePlace
  );
  useEffect(() => {
    if (namePlace) {
      refNoti.current.open?.();
    }
  }, [namePlace]);

  return (
    <div>
      <CustomModal
        ref={refNoti}
        footer={false}
        onOk={"OK"}
        noButton
        cancelText="Đóng"
        title={"Hướng dẫn tham gia "}
      >
        {({ close }) => {
          return (
            <div>
              Để tham gia quay số may mắn cùng{" "}
              <b className="text-primary text-2xl">Heineken Việt Nam</b>, yêu
              cầu:
              <ul>
                <li>
                  <b className="text-xl">Hoá đơn</b> mua hàng trong ngày có các
                  sản phẩm Heineken Việt Nam (Heineken, Tiger, Edelweiss,
                  Strongbow, Larue, Bia Việt)
                </li>
                <li>
                  Nhập mã dự thưởng trong tin nhắn từ đầu số{" "}
                  <b className="text-xl">Gsolution</b>
                </li>
                <li>
                  Chụp hình hoá đơn và{" "}
                  <b className="text-primary text-xl">“Gửi”</b>
                </li>
              </ul>
              <b>*Lưu ý:</b>
              <ul>
                <li>Hoá đơn có giá trị sử dụng trong ngày</li>
                <li>
                  Mã dự thưởng có hạn sử dụng <b className="text-xl">30 ngày</b>
                  . Có thể tích luỹ nhiều mã
                </li>

                <li>
                  Mọi thắc mắc liên hệ hotline:{" "}
                  <b className="text-primary text-2xl">{namePlace}</b> để được
                  hỗ trợ.
                </li>
              </ul>
              <div className="flex justify-end">
                <Button type="primary" onClick={close}>
                  Đóng
                </Button>
              </div>
            </div>
          );
        }}
      </CustomModal>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <p className="font-bold">
            1.Nhập MÃ DỰ THƯỞNG nhận từ nội dung tin nhắn của đầu số Gsolution
          </p>
          <Form.Item
            name={"code"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã dự thưởng",
              },
            ]}
            label="Mã dự thưởng"
          >
            <Input.Search
              placeholder="Nhập mã dự thưởng"
              loading={loadingCheck}
            />
          </Form.Item>

          <div className="rounded bg-yellow-300 p-2 text-primary font-semibold">
            Nhập mã dự thưởng sau đó chụp hoá đơn để tham gia quay số
          </div>
          {errMess && <p className="text-red-500">{errMess}</p>}
          <Form.Item
            // normalize={(e) => e?.trim()?.normalize()}
            label="Mã giới thiệu"
            name="ref"
            rules={[
              {
                // message: "Vui lòng nhập đúng số điện thoại",
                validator: (_, value) => {
                  const _v = value?.trim()?.toLowerCase();
                  if (!_v) {
                    return Promise.resolve();
                  }
                  if (_v.length !== 5) {
                    return Promise.reject("Vui lòng nhập đúng mã 5 kí tự");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập mã giới thiệu" />
          </Form.Item>
          {!!code && !!watchCode && (
            <>
              <p className="font-bold">
                2.Vui lòng chụp hình hóa đơn theo hướng dẫn bên dưới. <br />
              </p>
              {/* <p className="font-bold">
                {initCode && (
                  <p className=" text-yellow-500">
                    ***Vui lòng chụp lại hóa đơn đúng theo hướng dẫn ở trên***
                  </p>
                )}
              </p> */}
              <SingleImageUpload
                onSuccess={() => {
                  ref?.current?.scrollIntoView({ behavior: "smooth" });
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng upload ảnh",
                  },
                ]}
                label="Ảnh hóa đơn"
                name="bill"
              />
              <h3 className="text-green-600">
                <CheckCircleOutlined /> Hình chụp đúng
              </h3>
              <div className="flex space-x-4 mb-2">
                <div>
                  <Image src={note1} />
                </div>
                <div>
                  <Image src={note2} />
                </div>
              </div>
              <div className="flex justify-center">
                <Form.Item label="">
                  <Button
                    ref={ref}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    Gửi
                  </Button>
                </Form.Item>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default CreateBillCustomer;
