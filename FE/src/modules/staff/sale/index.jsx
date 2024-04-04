import CustomPageHeader from "@components/CustomPageHeader";
import { React, useEffect } from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { useParams } from "react-router";
import { Button, Card, Form, Input, Spin } from "antd";
import useCreateReport from "../hooks/mutate/useCreateReport";
import useGetReport from "../hooks/query/useGetReport";
import { useAppSelector } from "@hooks/reduxHook";
import FormSale from "../components/FormSale";
const SaleHomePage = () => {
  const { storeId } = useParams();
  // const { data: products, isLoading: loadingProduct } = useGetProduct({
  //   isSale: true,
  // });
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "sale",
    { checkinId }
  );
  const [form] = Form.useForm();
  const { mutate: createReport, isLoading } = useCreateReport(storeId, "sale");
  const handleCreateReport = (values) => {
    createReport({ ...values, checkinId });
  };
  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);
  return (
    <div>
      <CustomPageHeader title="Số bán" />
      <Spin spinning={loadingCurrent}>
        <div className="">
          <Card>
            <FormSale
              form={form}
              onFinish={handleCreateReport}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default SaleHomePage;
