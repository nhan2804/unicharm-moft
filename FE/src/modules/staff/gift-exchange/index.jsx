import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import { useParams } from "react-router";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Space,
  Spin,
  Typography,
} from "antd";
import { useAppSelector } from "@hooks/reduxHook";
import useCreateGiftExchange from "../hooks/mutate/useCreateGiftExchange";
import FormGiftExchange from "../components/FormGiftExchange";
const GiftExchangeHome = () => {
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const [form] = Form.useForm();
  const { mutate: createGiftExchange, isLoading } =
    useCreateGiftExchange(storeId);
  const handleCreate = (values) => {
    createGiftExchange(
      { ...values, checkinId },
      {
        onSuccess: () => {
          form.resetFields();
        },
      }
    );
  };
  return (
    <div className="mb-5">
      <CustomPageHeader title="Đổi quà" />
      <Spin spinning={false}>
        <FormGiftExchange isLoading={isLoading} form={form} onFinish={handleCreate}/>
      </Spin>
    </div>
  );
};

export default GiftExchangeHome;
