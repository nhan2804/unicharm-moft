import CustomPageHeader from "@components/CustomPageHeader";
import { useAppSelector } from "@hooks/reduxHook";
import useCreateGiftClients from "@modules/comsumer/hooks/mutate/useCreateGiftClients";
import FormGiftSubmit from "@modules/staff/components/FormGiftSubmit";
import { Form } from "antd";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const GiftSubmitPage = () => {
  const { type } = useParams();
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { mutate: createGiftClient, isLoading } = useCreateGiftClients();
  const handleCreateGiftClient = (values, cb) => {
    const products = values?.products?.reduce((all, c) => {
      all[c] = 1;
      return all;
    }, {});
    createGiftClient(
      {
        formData: {
          ...values,
          storeId,
          checkinId,
          type: type.toUpperCase(),
          products,
        },
      },
      {
        onSuccess: (d) => {
          if (type.toUpperCase() === "SAMPLING") {
            // nav(-1);
            form.resetFields();
            cb?.();
            return;
          }
          if (type.toUpperCase() === "SELLING") {
            nav(`roll/${d?._id}`);
            return;
          }
        },
      }
    );
  };
  return (
    <div>
      <CustomPageHeader title={`Quà tặng ${type}`} />
      <div className="mx-5">
        <FormGiftSubmit
          form={form}
          isLoading={isLoading}
          onFinish={handleCreateGiftClient}
          type={type}
        />
      </div>
    </div>
  );
};

export default GiftSubmitPage;
