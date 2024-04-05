import CustomPageHeader from "@components/CustomPageHeader";
import useCheckCode from "@modules/comsumer/hooks/mutate/useCheckCode";
import FormOTP from "@modules/staff/components/FormOtp";
import { Form, Space } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const GiftOtpPage = () => {
  const { mutate: checkCode, isLoading: isCheckingCode } = useCheckCode();
  const nav = useNavigate();
  const onFinish = (values) => {
    checkCode(values, {
      onSuccess: (giftClients) => {
        const gift = giftClients?.data?.[0];
        if (gift) {
          nav(`/staff/stores/${gift?.storeId}/show-gift/${gift?._id}`);
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
        <FormOTP form={form} onFinish={onFinish} />
      </div>
    </div>
  );
};

export default GiftOtpPage;
