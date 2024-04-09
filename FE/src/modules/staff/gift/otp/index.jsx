import CustomPageHeader from "@components/CustomPageHeader";
import useQueryString from "@hooks/useQueryString";
import useCheckCode from "@modules/comsumer/hooks/mutate/useCheckCode";
import FormOTP from "@modules/staff/components/FormOtp";
import { Form, Space } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const GiftOtpPage = () => {
  const { mutate: checkCode, isLoading: isCheckingCode } = useCheckCode();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const onFinish = (values) => {
    const type = searchParams.get("type");
    checkCode(values, {
      onSuccess: (giftClients) => {
        const gift = giftClients?.data?.[0];
        if (gift) {
          if (type?.toLocaleLowerCase() !== gift?.type?.toLocaleLowerCase()) {
            toast.error(`Mã xác nhận này không thuộc chương trình ${type}!`);
            return;
          }
          if (gift?.status === "DONE") {
            toast.error(
              "Mã xác nhận này đã nhận quà, vui lòng không nhận lại!"
            );
            return;
          }
          if (gift?.type === "SAMPLING") {
            nav(`/staff/stores/${gift?.storeId}/show-gift/${gift?._id}`);
          } else if (gift?.type === "SELLING") {
            if (gift?.status === "ACCEPTED") {
              toast.error(
                "Khách hàng vẫn chưa quay thưởng, vui lòng quay thưởng!"
              );
              return;
            }
            nav(`/staff/stores/${gift?.storeId}/update-image/${gift?._id}`);
          }
        } else {
          toast.error("OTP không hợp lệ, vui lòng kiểm tra lại!");
        }
      },
    });
  };
  const [form] = Form.useForm();
  return (
    <div>
      <CustomPageHeader title="Nhập mã xác nhận của khách hàng" />
      <div className="mx-5">
        <FormOTP isLoading={isCheckingCode} form={form} onFinish={onFinish} />
      </div>
    </div>
  );
};

export default GiftOtpPage;
