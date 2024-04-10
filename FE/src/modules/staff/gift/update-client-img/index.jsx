import CustomPageHeader from "@components/CustomPageHeader";
import FormUpdateClientImage from "@modules/staff/components/FormUpdateClientImage";
import React from "react";
import { Form, Space } from "antd";
import useUpdateGiftClients from "@modules/comsumer/hooks/mutate/useUpdateGiftClients";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "react-query";
import { useAppSelector } from "@hooks/reduxHook";

const UpdateClientImage = () => {
  const { giftId, storeId } = useParams();
  const { mutate: updateGiftClient, isLoading } = useUpdateGiftClients();
  const qc = useQueryClient();
  const nav = useNavigate();

  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const onFinish = (values) => {
    updateGiftClient(
      { _id: giftId, formData: { ...values, status: "DONE", checkinId } },
      {
        onSuccess: () => {
          qc.invalidateQueries(["gift-clients"]);
          nav(`/staff/stores/${storeId}`);
        },
      }
    );
  };
  const [form] = Form.useForm();
  return (
    <div>
      <CustomPageHeader title="Cập nhật hình ảnh nhận quà" />

      <div className="flex flex-col w-[100%] items-center gap-5 m-3">
        <FormUpdateClientImage
          isLoading={isLoading}
          form={form}
          onFinish={onFinish}
        />
      </div>
    </div>
  );
};

export default UpdateClientImage;
