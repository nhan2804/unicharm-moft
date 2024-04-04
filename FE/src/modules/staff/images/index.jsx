import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { useParams } from "react-router";
import { Button, Card, Collapse, Form, Input, Spin } from "antd";
import useCreateReport from "../hooks/mutate/useCreateReport";
import useGetReport from "../hooks/query/useGetReport";
import { useAppSelector } from "@hooks/reduxHook";
import { useEffect } from "react";
import FormImage from "../components/FormImage";
const ImageStaffHomePage = () => {
  const { storeId } = useParams();
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "image",
    {
      checkinId: currentCheckIn,
    }
  );
  const [form] = Form.useForm();
  const { mutate: createReport, isLoading } = useCreateReport(storeId, "image");
  const handleCreateReport = (values) => {
    createReport({
      ...values,
      dataImage: { ...currentReport?.dataImage, ...values?.dataImage },
      checkinId: currentCheckIn,
    });
  };

  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);

  return (
    <div>
      <CustomPageHeader title="Hình ảnh" />
      <Spin spinning={loadingCurrent}>
        <div className="">
          <FormImage
            onFinish={handleCreateReport}
            isLoading={isLoading}
            form={form}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ImageStaffHomePage;
