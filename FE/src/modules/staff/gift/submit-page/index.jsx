import CustomPageHeader from "@components/CustomPageHeader";
import { useAppSelector } from "@hooks/reduxHook";
import useCreateGiftClients from "@modules/comsumer/hooks/mutate/useCreateGiftClients";
import FormGiftSubmit from "@modules/staff/components/FormGiftSubmit";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const GiftSubmitPage = () => {
  const { type } = useParams();
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const nav = useNavigate();
  const { mutate: createGiftClient } = useCreateGiftClients();
  const handleCreateGiftClient = (values) => {
    // createGiftClient(
    //   {
    //     formData: { ...values, storeId, checkinId, type: type.toUpperCase() },
    //   },
    //   {
    //     onSuccess: () => {
    //       if (type.toUpperCase() === "SAMPLING") nav(-1);
    //     },
    //   }
    // );
  };
  return (
    <div>
      <CustomPageHeader title={`Quà tặng ${type}`} />
      <div className="mx-5">
        <FormGiftSubmit onFinish={handleCreateGiftClient} type={type} />
      </div>
    </div>
  );
};

export default GiftSubmitPage;
