import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { useParams } from "react-router";
import { Button, Collapse, Form, Input, Spin } from "antd";
import useCreateReport from "../hooks/mutate/useCreateReport";
import useGetReport from "../hooks/query/useGetReport";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import { useEffect } from "react";
import { useAppSelector } from "@hooks/reduxHook";
import FormSampling from "../components/FormSampling";
const SamplingHomePage = () => {
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: products, isLoading: loadingProduct } = useGetProduct({
    isGift: true,
  });
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "sampling",
    { checkinId }
  );
  const [form] = Form.useForm();
  const { mutate: createReport, isLoading } = useCreateReport(
    storeId,
    "sampling"
  );
  const handleCreateReport = (values) => {
    createReport({ ...values, checkinId });
  };

  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);

  return (
    <div>
      <CustomPageHeader title="Quà tặng" />
      <Spin spinning={loadingProduct || loadingCurrent}>
        <FormSampling
          onFinish={handleCreateReport}
          form={form}
          isLoading={isLoading}
        />
      </Spin>
    </div>
  );
};

export default SamplingHomePage;
