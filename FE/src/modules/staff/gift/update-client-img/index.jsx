import CustomPageHeader from "@components/CustomPageHeader";
import FormUpdateClientImage from "@modules/staff/components/FormUpdateClientImage";
import React from "react";
import { Form, Space } from "antd";
import useUpdateGiftClients from "@modules/comsumer/hooks/mutate/useUpdateGiftClients";
import { useParams } from "react-router";
import { useQueryClient } from "react-query";

const UpdateClientImage = () => {
  const { giftId } = useParams();
  const { mutate: updateGiftClient } = useUpdateGiftClients();
  const qc = useQueryClient();
  const onFinish = (values) => {
    updateGiftClient(
      { _id: giftId, formData: { ...values, status: "DONE" } },
      {
        onSuccess: () => {
          qc.invalidateQueries(["gift-clients"]);
        },
      }
    );
  };
  const [form] = Form.useForm();
  return (
    <div>
      <CustomPageHeader title="Cập nhật hình ảnh nhận quà" />

      <div className="flex flex-col w-[100%] items-center gap-5 m-3">
        <FormUpdateClientImage form={form} onFinish={onFinish} />
      </div>
    </div>
  );
};

export default UpdateClientImage;
