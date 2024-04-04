import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { useParams } from "react-router";
import { Button, Card, Collapse, Form, Input, Spin } from "antd";
import useCreateReport from "../hooks/mutate/useCreateReport";
import useGetReport from "../hooks/query/useGetReport";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import { useEffect } from "react";
import { useAppSelector } from "@hooks/reduxHook";
import FormGift from "../components/FormGift";
const GiftHomePage = () => {
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);

  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "gift",
    { checkinId }
  );
  const [form] = Form.useForm();
  const { mutate: createReport, isLoading } = useCreateReport(storeId, "gift");
  const handleCreateReport = (values) => {
    createReport({ ...values, checkinId });
  };

  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);

  return (
    <div>
      <CustomPageHeader title="Quà tặng" />
      <Spin spinning={loadingCurrent}>
        <FormGift
          onFinish={handleCreateReport}
          form={form}
          isLoading={isLoading}
        />
      </Spin>
    </div>
  );
};

export default GiftHomePage;
